import { createClient as createLibsqlClient, type Client as LibsqlClient } from "@libsql/client";
import { randomUUID } from "node:crypto";

// Versión "archivo B" de lib/db.ts: misma capa de acceso a datos, misma
// forma de cada función exportada, pero hablando con Turso (libSQL remoto)
// en vez de con node:sqlite en un archivo local. Se mantiene en paralelo a
// lib/db.ts sin tocarlo — nada de la app importa este archivo todavía. El
// día que esté probado contra la base de datos real de Turso, se cambian
// los imports de "@/lib/db" a "@/lib/db-turso" (y se añade `await` donde
// falte, ya que aquí todo es async) en los ~28 archivos que lo usan.
//
// Variables de entorno necesarias (ver README / .env.local):
//   TURSO_DATABASE_URL   — ej. libsql://nexalya-tuusuario.turso.io
//   TURSO_AUTH_TOKEN     — token de la base de datos (Turso dashboard → Create Token)

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

let client: LibsqlClient | null = null;

function getDb(): LibsqlClient {
  if (!url) {
    throw new Error(
      "Falta TURSO_DATABASE_URL. Añádela a .env.local (desarrollo) o a las variables de entorno de Netlify (producción)."
    );
  }
  if (!client) {
    client = createLibsqlClient({ url, authToken });
  }
  return client;
}

type SqlArg = string | number | null;

async function run(sql: string, args: SqlArg[] = []) {
  return getDb().execute({ sql, args });
}

async function all<T>(sql: string, args: SqlArg[] = []): Promise<T[]> {
  const rs = await getDb().execute({ sql, args });
  return rs.rows as unknown as T[];
}

async function get<T>(sql: string, args: SqlArg[] = []): Promise<T | undefined> {
  const rs = await getDb().execute({ sql, args });
  return (rs.rows[0] as unknown as T) ?? undefined;
}

// ---------- Esquema (se inicializa una sola vez por instancia caliente) ----------

let initPromise: Promise<void> | null = null;

function ensureInit(): Promise<void> {
  if (!initPromise) initPromise = initSchema();
  return initPromise;
}

async function ensureColumn(table: string, columnDef: string) {
  const columnName = columnDef.trim().split(/\s+/)[0];
  const info = await all<{ name: string }>(`PRAGMA table_info(${table})`);
  const exists = info.some((c) => c.name === columnName);
  if (!exists) {
    try {
      await run(`ALTER TABLE ${table} ADD COLUMN ${columnDef};`);
    } catch (err) {
      // Igual que en lib/db.ts: dos invocaciones "frías" a la vez pueden
      // intentar añadir la misma columna nueva; la segunda falla con
      // "duplicate column" y no es un error real, la columna ya está.
      if (!/duplicate column name/i.test((err as Error).message)) throw err;
    }
  }
}

async function initSchema() {
  const c = getDb();

  await c.executeMultiple(`
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      sector TEXT,
      igHandle TEXT,
      fbPageId TEXT,
      accessToken TEXT,
      notes TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS content_items (
      id TEXT PRIMARY KEY,
      clientId TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      caption TEXT NOT NULL,
      mediaUrl TEXT NOT NULL,
      mediaType TEXT NOT NULL DEFAULT 'IMAGE',
      platform TEXT NOT NULL DEFAULT 'INSTAGRAM',
      scheduledAt TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'DRAFT',
      publishedAt TEXT,
      errorMessage TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS plan_batches (
      id TEXT PRIMARY KEY,
      clientId TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      periodDays INTEGER NOT NULL,
      trendsSummary TEXT,
      model TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS plan_items (
      id TEXT PRIMARY KEY,
      clientId TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      planBatchId TEXT REFERENCES plan_batches(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      day TEXT,
      format TEXT,
      family TEXT,
      topic TEXT,
      objective TEXT,
      kpi TEXT,
      keyword TEXT,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'IDEA',
      contentItemId TEXT REFERENCES content_items(id) ON DELETE SET NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS idea_bank (
      id TEXT PRIMARY KEY,
      clientId TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      planBatchId TEXT REFERENCES plan_batches(id) ON DELETE SET NULL,
      priority TEXT DEFAULT 'MEDIA',
      family TEXT,
      idea TEXT NOT NULL,
      hook TEXT,
      execution TEXT,
      resources TEXT,
      duration TEXT,
      objective TEXT,
      whenToUse TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS follower_snapshots (
      id TEXT PRIMARY KEY,
      clientId TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      followers INTEGER NOT NULL,
      notes TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      createdAt TEXT NOT NULL,
      expiresAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS client_shares (
      id TEXT PRIMARY KEY,
      clientId TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      createdAt TEXT NOT NULL,
      UNIQUE(clientId, userId)
    );
  `);

  // ---- migraciones ligeras: mismas columnas que en lib/db.ts ----
  await ensureColumn("clients", "planPeriodDays INTEGER DEFAULT 30");
  await ensureColumn("clients", "brandBrief TEXT");
  await ensureColumn("clients", "lastPlanGeneratedAt TEXT");

  await ensureColumn("content_items", "reach INTEGER");
  await ensureColumn("content_items", "likes INTEGER");
  await ensureColumn("content_items", "comments INTEGER");
  await ensureColumn("content_items", "saves INTEGER");
  await ensureColumn("content_items", "shares INTEGER");
  await ensureColumn("content_items", "profileVisits INTEGER");
  await ensureColumn("content_items", "followersGained INTEGER");
  await ensureColumn("content_items", "metricsUpdatedAt TEXT");
  await ensureColumn("content_items", "remoteId TEXT");
  await ensureColumn("content_items", "productionNotes TEXT");
  await ensureColumn("clients", "ownerId TEXT");
  await ensureColumn("clients", "website TEXT");
  await ensureColumn("clients", "targetAudience TEXT");
  await ensureColumn("clients", "competitors TEXT");
  await ensureColumn("clients", "avoidTopics TEXT");
  await ensureColumn("clients", "toneOfVoice TEXT");
  await ensureColumn("clients", "visualIdentity TEXT");
  await ensureColumn("clients", "contentPillars TEXT");
  await ensureColumn("clients", "igUserId TEXT");
}

// ---------- Tipos (idénticos a lib/db.ts) ----------

export interface Client {
  id: string;
  name: string;
  sector: string | null;
  igHandle: string | null;
  fbPageId: string | null;
  accessToken: string | null;
  notes: string | null;
  planPeriodDays: number;
  brandBrief: string | null;
  lastPlanGeneratedAt: string | null;
  ownerId: string | null;
  website: string | null;
  targetAudience: string | null;
  competitors: string | null;
  avoidTopics: string | null;
  toneOfVoice: string | null;
  visualIdentity: string | null;
  contentPillars: string | null;
  igUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContentItem {
  id: string;
  clientId: string;
  title: string;
  caption: string;
  mediaUrl: string;
  mediaType: string;
  platform: string;
  scheduledAt: string;
  status: string;
  publishedAt: string | null;
  errorMessage: string | null;
  reach: number | null;
  likes: number | null;
  comments: number | null;
  saves: number | null;
  shares: number | null;
  profileVisits: number | null;
  followersGained: number | null;
  metricsUpdatedAt: string | null;
  remoteId: string | null;
  productionNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContentItemWithClient extends ContentItem {
  client: Client;
}

export interface PlanBatch {
  id: string;
  clientId: string;
  periodDays: number;
  trendsSummary: string | null;
  model: string | null;
  createdAt: string;
}

export interface PlanItem {
  id: string;
  clientId: string;
  planBatchId: string | null;
  date: string;
  day: string | null;
  format: string | null;
  family: string | null;
  topic: string | null;
  objective: string | null;
  kpi: string | null;
  keyword: string | null;
  notes: string | null;
  status: string;
  contentItemId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IdeaBankItem {
  id: string;
  clientId: string;
  planBatchId: string | null;
  priority: string;
  family: string | null;
  idea: string;
  hook: string | null;
  execution: string | null;
  resources: string | null;
  duration: string | null;
  objective: string | null;
  whenToUse: string | null;
  createdAt: string;
}

export interface FollowerSnapshot {
  id: string;
  clientId: string;
  date: string;
  followers: number;
  notes: string | null;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export type PublicUser = Omit<User, "passwordHash">;

export interface Session {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

function now() {
  return new Date().toISOString();
}

// ---------- Clients ----------

const ACCESSIBLE_CLIENTS_SQL = `(c.ownerId IS NULL OR c.ownerId = ? OR c.id IN (SELECT clientId FROM client_shares WHERE userId = ?))`;

export async function listClients(userId: string): Promise<(Client & { contentCount: number })[]> {
  await ensureInit();
  return all<Client & { contentCount: number }>(
    `SELECT c.*, (SELECT COUNT(*) FROM content_items ci WHERE ci.clientId = c.id) as contentCount
     FROM clients c WHERE ${ACCESSIBLE_CLIENTS_SQL} ORDER BY c.createdAt DESC`,
    [userId, userId]
  );
}

export async function getClient(id: string): Promise<Client | undefined> {
  await ensureInit();
  return get<Client>(`SELECT * FROM clients WHERE id = ?`, [id]);
}

export async function userCanAccessClient(clientId: string, userId: string): Promise<boolean> {
  await ensureInit();
  const client = await getClient(clientId);
  if (!client) return false;
  if (client.ownerId === null || client.ownerId === userId) return true;
  const row = await get(`SELECT 1 FROM client_shares WHERE clientId = ? AND userId = ?`, [clientId, userId]);
  return !!row;
}

export async function createClient(data: {
  name: string;
  sector?: string | null;
  igHandle?: string | null;
  fbPageId?: string | null;
  notes?: string | null;
  brandBrief?: string | null;
  planPeriodDays?: number;
  ownerId?: string | null;
  website?: string | null;
  targetAudience?: string | null;
  competitors?: string | null;
  avoidTopics?: string | null;
  toneOfVoice?: string | null;
  visualIdentity?: string | null;
  contentPillars?: string | null;
  igUserId?: string | null;
}): Promise<Client> {
  await ensureInit();
  const id = randomUUID();
  const ts = now();
  await run(
    `INSERT INTO clients (id, name, sector, igHandle, fbPageId, accessToken, notes, planPeriodDays, brandBrief, lastPlanGeneratedAt, ownerId, website, targetAudience, competitors, avoidTopics, toneOfVoice, visualIdentity, contentPillars, igUserId, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, NULL, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.name,
      data.sector ?? null,
      data.igHandle ?? null,
      data.fbPageId ?? null,
      data.notes ?? null,
      data.planPeriodDays ?? 30,
      data.brandBrief ?? null,
      data.ownerId ?? null,
      data.website ?? null,
      data.targetAudience ?? null,
      data.competitors ?? null,
      data.avoidTopics ?? null,
      data.toneOfVoice ?? null,
      data.visualIdentity ?? null,
      data.contentPillars ?? null,
      data.igUserId ?? null,
      ts,
      ts,
    ]
  );
  return (await getClient(id))!;
}

export async function updateClient(
  id: string,
  data: Partial<Omit<Client, "id" | "createdAt" | "updatedAt">>
): Promise<Client> {
  await ensureInit();
  const current = await getClient(id);
  if (!current) throw new Error("Cliente no encontrado.");
  const merged = { ...current, ...data, updatedAt: now() };
  await run(
    `UPDATE clients SET name = ?, sector = ?, igHandle = ?, fbPageId = ?, accessToken = ?, notes = ?,
      planPeriodDays = ?, brandBrief = ?, lastPlanGeneratedAt = ?, ownerId = ?, website = ?,
      targetAudience = ?, competitors = ?, avoidTopics = ?, toneOfVoice = ?, visualIdentity = ?,
      contentPillars = ?, igUserId = ?, updatedAt = ?
     WHERE id = ?`,
    [
      merged.name,
      merged.sector,
      merged.igHandle,
      merged.fbPageId,
      merged.accessToken,
      merged.notes,
      merged.planPeriodDays,
      merged.brandBrief,
      merged.lastPlanGeneratedAt,
      merged.ownerId,
      merged.website,
      merged.targetAudience,
      merged.competitors,
      merged.avoidTopics,
      merged.toneOfVoice,
      merged.visualIdentity,
      merged.contentPillars,
      merged.igUserId,
      merged.updatedAt,
      id,
    ]
  );
  return (await getClient(id))!;
}

export async function deleteClient(id: string) {
  await ensureInit();
  await run(`DELETE FROM clients WHERE id = ?`, [id]);
}

// ---------- Compartir clientes entre cuentas ----------

export async function shareClientWithUser(clientId: string, userId: string) {
  await ensureInit();
  await run(`INSERT OR IGNORE INTO client_shares (id, clientId, userId, createdAt) VALUES (?, ?, ?, ?)`, [
    randomUUID(),
    clientId,
    userId,
    now(),
  ]);
}

export async function unshareClientFromUser(clientId: string, userId: string) {
  await ensureInit();
  await run(`DELETE FROM client_shares WHERE clientId = ? AND userId = ?`, [clientId, userId]);
}

export async function listClientShares(clientId: string): Promise<PublicUser[]> {
  await ensureInit();
  const rows = await all<User>(
    `SELECT u.* FROM client_shares cs JOIN users u ON u.id = cs.userId
     WHERE cs.clientId = ? ORDER BY u.name ASC`,
    [clientId]
  );
  return rows.map(({ passwordHash: _passwordHash, ...rest }) => rest);
}

// ---------- Content items ----------

export async function listContentItems(filter?: {
  clientId?: string;
  fromDaysAgo?: number;
  userId?: string;
}): Promise<ContentItemWithClient[]> {
  await ensureInit();
  let query = `SELECT ci.*, c.id as c_id, c.name as c_name, c.sector as c_sector, c.igHandle as c_igHandle,
                      c.fbPageId as c_fbPageId, c.accessToken as c_accessToken, c.notes as c_notes,
                      c.planPeriodDays as c_planPeriodDays, c.brandBrief as c_brandBrief,
                      c.lastPlanGeneratedAt as c_lastPlanGeneratedAt, c.ownerId as c_ownerId,
                      c.website as c_website, c.targetAudience as c_targetAudience,
                      c.competitors as c_competitors, c.avoidTopics as c_avoidTopics,
                      c.toneOfVoice as c_toneOfVoice, c.visualIdentity as c_visualIdentity,
                      c.contentPillars as c_contentPillars, c.igUserId as c_igUserId,
                      c.createdAt as c_createdAt, c.updatedAt as c_updatedAt
               FROM content_items ci JOIN clients c ON c.id = ci.clientId WHERE 1=1`;
  const params: SqlArg[] = [];

  if (filter?.clientId) {
    query += ` AND ci.clientId = ?`;
    params.push(filter.clientId);
  }
  if (filter?.fromDaysAgo !== undefined) {
    const from = new Date();
    from.setDate(from.getDate() - filter.fromDaysAgo);
    query += ` AND ci.scheduledAt >= ?`;
    params.push(from.toISOString());
  }
  if (filter?.userId) {
    query += ` AND ${ACCESSIBLE_CLIENTS_SQL}`;
    params.push(filter.userId, filter.userId);
  }
  query += ` ORDER BY ci.scheduledAt ASC`;

  const rows = await all<Record<string, unknown>>(query, params);
  return rows.map((r) => ({
    id: r.id as string,
    clientId: r.clientId as string,
    title: r.title as string,
    caption: r.caption as string,
    mediaUrl: r.mediaUrl as string,
    mediaType: r.mediaType as string,
    platform: r.platform as string,
    scheduledAt: r.scheduledAt as string,
    status: r.status as string,
    publishedAt: r.publishedAt as string | null,
    errorMessage: r.errorMessage as string | null,
    reach: r.reach as number | null,
    likes: r.likes as number | null,
    comments: r.comments as number | null,
    saves: r.saves as number | null,
    shares: r.shares as number | null,
    profileVisits: r.profileVisits as number | null,
    followersGained: r.followersGained as number | null,
    metricsUpdatedAt: r.metricsUpdatedAt as string | null,
    remoteId: r.remoteId as string | null,
    productionNotes: r.productionNotes as string | null,
    createdAt: r.createdAt as string,
    updatedAt: r.updatedAt as string,
    client: {
      id: r.c_id as string,
      name: r.c_name as string,
      sector: r.c_sector as string | null,
      igHandle: r.c_igHandle as string | null,
      fbPageId: r.c_fbPageId as string | null,
      accessToken: r.c_accessToken as string | null,
      notes: r.c_notes as string | null,
      planPeriodDays: r.c_planPeriodDays as number,
      brandBrief: r.c_brandBrief as string | null,
      lastPlanGeneratedAt: r.c_lastPlanGeneratedAt as string | null,
      ownerId: r.c_ownerId as string | null,
      website: r.c_website as string | null,
      targetAudience: r.c_targetAudience as string | null,
      competitors: r.c_competitors as string | null,
      avoidTopics: r.c_avoidTopics as string | null,
      toneOfVoice: r.c_toneOfVoice as string | null,
      visualIdentity: r.c_visualIdentity as string | null,
      contentPillars: r.c_contentPillars as string | null,
      igUserId: r.c_igUserId as string | null,
      createdAt: r.c_createdAt as string,
      updatedAt: r.c_updatedAt as string,
    },
  }));
}

export async function getContentItem(id: string): Promise<ContentItemWithClient | undefined> {
  await ensureInit();
  const items = await listContentItems();
  return items.find((i) => i.id === id);
}

export async function createContentItem(data: {
  clientId: string;
  title: string;
  caption: string;
  mediaUrl: string;
  mediaType?: string;
  platform?: string;
  scheduledAt: string;
  status?: string;
  productionNotes?: string | null;
}): Promise<ContentItem> {
  await ensureInit();
  const id = randomUUID();
  const ts = now();
  await run(
    `INSERT INTO content_items
      (id, clientId, title, caption, mediaUrl, mediaType, platform, scheduledAt, status, publishedAt, errorMessage, productionNotes, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?, ?)`,
    [
      id,
      data.clientId,
      data.title,
      data.caption,
      data.mediaUrl,
      data.mediaType ?? "IMAGE",
      data.platform ?? "INSTAGRAM",
      new Date(data.scheduledAt).toISOString(),
      data.status ?? "SCHEDULED",
      data.productionNotes ?? null,
      ts,
      ts,
    ]
  );
  return (await get<ContentItem>(`SELECT * FROM content_items WHERE id = ?`, [id]))!;
}

export async function updateContentItem(id: string, data: Partial<ContentItem>): Promise<ContentItem> {
  await ensureInit();
  const current = await get<ContentItem>(`SELECT * FROM content_items WHERE id = ?`, [id]);
  if (!current) throw new Error("Contenido no encontrado.");
  const merged = { ...current, ...data, updatedAt: now() };
  await run(
    `UPDATE content_items SET title = ?, caption = ?, mediaUrl = ?, mediaType = ?, platform = ?,
      scheduledAt = ?, status = ?, publishedAt = ?, errorMessage = ?,
      reach = ?, likes = ?, comments = ?, saves = ?, shares = ?, profileVisits = ?, followersGained = ?, metricsUpdatedAt = ?,
      remoteId = ?, productionNotes = ?, updatedAt = ?
     WHERE id = ?`,
    [
      merged.title,
      merged.caption,
      merged.mediaUrl,
      merged.mediaType,
      merged.platform,
      merged.scheduledAt,
      merged.status,
      merged.publishedAt,
      merged.errorMessage,
      merged.reach,
      merged.likes,
      merged.comments,
      merged.saves,
      merged.shares,
      merged.profileVisits,
      merged.followersGained,
      merged.metricsUpdatedAt,
      merged.remoteId,
      merged.productionNotes,
      merged.updatedAt,
      id,
    ]
  );
  return (await get<ContentItem>(`SELECT * FROM content_items WHERE id = ?`, [id]))!;
}

export async function deleteContentItem(id: string) {
  await ensureInit();
  await run(`DELETE FROM content_items WHERE id = ?`, [id]);
}

export async function countClients(userId: string): Promise<number> {
  await ensureInit();
  const row = await get<{ n: number }>(`SELECT COUNT(*) as n FROM clients c WHERE ${ACCESSIBLE_CLIENTS_SQL}`, [
    userId,
    userId,
  ]);
  return row?.n ?? 0;
}

export async function countContentByStatus(userId: string): Promise<Record<string, number>> {
  await ensureInit();
  const rows = await all<{ status: string; n: number }>(
    `SELECT ci.status as status, COUNT(*) as n FROM content_items ci
     JOIN clients c ON c.id = ci.clientId
     WHERE ${ACCESSIBLE_CLIENTS_SQL}
     GROUP BY ci.status`,
    [userId, userId]
  );
  const result: Record<string, number> = {};
  for (const r of rows) result[r.status] = r.n;
  return result;
}

// ---------- Plan de contenido IA ----------

export async function createPlanBatch(data: {
  clientId: string;
  periodDays: number;
  trendsSummary?: string | null;
  model?: string | null;
}): Promise<PlanBatch> {
  await ensureInit();
  const id = randomUUID();
  const ts = now();
  await run(`INSERT INTO plan_batches (id, clientId, periodDays, trendsSummary, model, createdAt) VALUES (?, ?, ?, ?, ?, ?)`, [
    id,
    data.clientId,
    data.periodDays,
    data.trendsSummary ?? null,
    data.model ?? null,
    ts,
  ]);
  return (await get<PlanBatch>(`SELECT * FROM plan_batches WHERE id = ?`, [id]))!;
}

export async function getLatestPlanBatch(clientId: string): Promise<PlanBatch | undefined> {
  await ensureInit();
  return get<PlanBatch>(`SELECT * FROM plan_batches WHERE clientId = ? ORDER BY createdAt DESC LIMIT 1`, [clientId]);
}

export async function createPlanItem(data: {
  clientId: string;
  planBatchId: string;
  date: string;
  day?: string | null;
  format?: string | null;
  family?: string | null;
  topic?: string | null;
  objective?: string | null;
  kpi?: string | null;
  keyword?: string | null;
  notes?: string | null;
  status?: string;
}): Promise<PlanItem> {
  await ensureInit();
  const id = randomUUID();
  const ts = now();
  await run(
    `INSERT INTO plan_items (id, clientId, planBatchId, date, day, format, family, topic, objective, kpi, keyword, notes, status, contentItemId, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)`,
    [
      id,
      data.clientId,
      data.planBatchId,
      data.date,
      data.day ?? null,
      data.format ?? null,
      data.family ?? null,
      data.topic ?? null,
      data.objective ?? null,
      data.kpi ?? null,
      data.keyword ?? null,
      data.notes ?? null,
      data.status ?? "IDEA",
      ts,
      ts,
    ]
  );
  return (await get<PlanItem>(`SELECT * FROM plan_items WHERE id = ?`, [id]))!;
}

export async function listPlanItems(clientId: string): Promise<PlanItem[]> {
  await ensureInit();
  return all<PlanItem>(`SELECT * FROM plan_items WHERE clientId = ? ORDER BY date ASC`, [clientId]);
}

export async function updatePlanItem(id: string, data: Partial<PlanItem>): Promise<PlanItem> {
  await ensureInit();
  const current = await get<PlanItem>(`SELECT * FROM plan_items WHERE id = ?`, [id]);
  if (!current) throw new Error("Elemento de plan no encontrado.");
  const merged = { ...current, ...data, updatedAt: now() };
  await run(
    `UPDATE plan_items SET date = ?, day = ?, format = ?, family = ?, topic = ?, objective = ?, kpi = ?, keyword = ?,
      notes = ?, status = ?, contentItemId = ?, updatedAt = ? WHERE id = ?`,
    [
      merged.date,
      merged.day,
      merged.format,
      merged.family,
      merged.topic,
      merged.objective,
      merged.kpi,
      merged.keyword,
      merged.notes,
      merged.status,
      merged.contentItemId,
      merged.updatedAt,
      id,
    ]
  );
  return (await get<PlanItem>(`SELECT * FROM plan_items WHERE id = ?`, [id]))!;
}

export async function deleteIdeaPlanItemsForClient(clientId: string) {
  await ensureInit();
  await run(`DELETE FROM plan_items WHERE clientId = ? AND status = 'IDEA'`, [clientId]);
}

// ---------- Banco de ideas ----------

export async function createIdeaBankItem(data: {
  clientId: string;
  planBatchId?: string | null;
  priority?: string;
  family?: string | null;
  idea: string;
  hook?: string | null;
  execution?: string | null;
  resources?: string | null;
  duration?: string | null;
  objective?: string | null;
  whenToUse?: string | null;
}): Promise<IdeaBankItem> {
  await ensureInit();
  const id = randomUUID();
  const ts = now();
  await run(
    `INSERT INTO idea_bank (id, clientId, planBatchId, priority, family, idea, hook, execution, resources, duration, objective, whenToUse, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.clientId,
      data.planBatchId ?? null,
      data.priority ?? "MEDIA",
      data.family ?? null,
      data.idea,
      data.hook ?? null,
      data.execution ?? null,
      data.resources ?? null,
      data.duration ?? null,
      data.objective ?? null,
      data.whenToUse ?? null,
      ts,
    ]
  );
  return (await get<IdeaBankItem>(`SELECT * FROM idea_bank WHERE id = ?`, [id]))!;
}

export async function listIdeaBank(clientId: string): Promise<IdeaBankItem[]> {
  await ensureInit();
  return all<IdeaBankItem>(`SELECT * FROM idea_bank WHERE clientId = ? ORDER BY createdAt DESC`, [clientId]);
}

export async function deleteIdeaBankItem(id: string) {
  await ensureInit();
  await run(`DELETE FROM idea_bank WHERE id = ?`, [id]);
}

// ---------- Seguidores ----------

export async function createFollowerSnapshot(data: {
  clientId: string;
  date: string;
  followers: number;
  notes?: string | null;
}): Promise<FollowerSnapshot> {
  await ensureInit();
  const id = randomUUID();
  const ts = now();
  await run(`INSERT INTO follower_snapshots (id, clientId, date, followers, notes, createdAt) VALUES (?, ?, ?, ?, ?, ?)`, [
    id,
    data.clientId,
    data.date,
    data.followers,
    data.notes ?? null,
    ts,
  ]);
  return (await get<FollowerSnapshot>(`SELECT * FROM follower_snapshots WHERE id = ?`, [id]))!;
}

export async function listFollowerSnapshots(clientId: string): Promise<FollowerSnapshot[]> {
  await ensureInit();
  return all<FollowerSnapshot>(`SELECT * FROM follower_snapshots WHERE clientId = ? ORDER BY date ASC`, [clientId]);
}

// ---------- Usuarios y sesiones ----------

function toPublicUser(u: User): PublicUser {
  const { passwordHash: _passwordHash, ...rest } = u;
  return rest;
}

export async function createUser(data: { name: string; email: string; passwordHash: string }): Promise<PublicUser> {
  await ensureInit();
  const id = randomUUID();
  const ts = now();
  await run(`INSERT INTO users (id, name, email, passwordHash, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`, [
    id,
    data.name,
    data.email.trim().toLowerCase(),
    data.passwordHash,
    ts,
    ts,
  ]);
  return toPublicUser((await get<User>(`SELECT * FROM users WHERE id = ?`, [id]))!);
}

export async function getUserByEmailWithHash(email: string): Promise<User | undefined> {
  await ensureInit();
  return get<User>(`SELECT * FROM users WHERE email = ?`, [email.trim().toLowerCase()]);
}

export async function getUserById(id: string): Promise<PublicUser | undefined> {
  await ensureInit();
  const u = await get<User>(`SELECT * FROM users WHERE id = ?`, [id]);
  return u ? toPublicUser(u) : undefined;
}

export async function listUsers(): Promise<PublicUser[]> {
  await ensureInit();
  const rows = await all<User>(`SELECT * FROM users ORDER BY createdAt ASC`);
  return rows.map(toPublicUser);
}

export async function countUsers(): Promise<number> {
  await ensureInit();
  const row = await get<{ n: number }>(`SELECT COUNT(*) as n FROM users`);
  return row?.n ?? 0;
}

export async function updateUserPassword(id: string, passwordHash: string) {
  await ensureInit();
  await run(`UPDATE users SET passwordHash = ?, updatedAt = ? WHERE id = ?`, [passwordHash, now(), id]);
}

export async function deleteUser(id: string) {
  await ensureInit();
  await run(`DELETE FROM users WHERE id = ?`, [id]);
}

export async function createSession(userId: string, expiresAt: string): Promise<Session> {
  await ensureInit();
  const id = randomUUID();
  const ts = now();
  await run(`INSERT INTO sessions (id, userId, createdAt, expiresAt) VALUES (?, ?, ?, ?)`, [id, userId, ts, expiresAt]);
  return (await get<Session>(`SELECT * FROM sessions WHERE id = ?`, [id]))!;
}

export async function getSessionUser(sessionId: string): Promise<PublicUser | undefined> {
  await ensureInit();
  const row = await get<User>(
    `SELECT u.* FROM sessions s JOIN users u ON u.id = s.userId
     WHERE s.id = ? AND s.expiresAt > ?`,
    [sessionId, now()]
  );
  return row ? toPublicUser(row) : undefined;
}

export async function deleteSession(sessionId: string) {
  await ensureInit();
  await run(`DELETE FROM sessions WHERE id = ?`, [sessionId]);
}

export async function resetAll() {
  await ensureInit();
  await getDb().executeMultiple(
    `DELETE FROM idea_bank; DELETE FROM plan_items; DELETE FROM plan_batches; DELETE FROM follower_snapshots; DELETE FROM content_items; DELETE FROM clients;`
  );
}
