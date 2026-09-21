import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

// Usamos el módulo node:sqlite (incluido en Node 22+) en lugar de un ORM
// con binarios nativos: cero dependencias externas para la base de datos,
// fácil de arrancar en cualquier máquina. Para producción con más de un
// servidor, migrad a Postgres (ver README) manteniendo estas mismas
// funciones como capa de acceso a datos.

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Turbopack/Next ejecutan varios workers en paralelo durante el build,
// cada uno importando este módulo (y por tanto abriendo/inicializando la
// base de datos) a la vez. SQLite solo permite un escritor a la vez, así
// que reintentamos con espera corta ante "database is locked".
function withRetry<T>(fn: () => T, attempts = 30, delayMs = 100): T {
  for (let i = 0; i < attempts; i++) {
    try {
      return fn();
    } catch (err) {
      const msg = (err as Error)?.message ?? "";
      const isBusy = /locked|busy/i.test(msg);
      if (!isBusy || i === attempts - 1) throw err;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delayMs);
    }
  }
  throw new Error("unreachable");
}

const db = withRetry(() => new DatabaseSync(path.join(dataDir, "growth-os.db")));

withRetry(() => db.exec("PRAGMA journal_mode = WAL;"));
withRetry(() => db.exec("PRAGMA busy_timeout = 5000;"));

withRetry(() =>
  db.exec(`
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

  -- Con quién más (aparte del dueño) puede trabajar un cliente. Un cliente
  -- sin dueño (ownerId NULL, los que ya existían antes de tener cuentas)
  -- es visible para todo el equipo — ver userCanAccessClient().
  CREATE TABLE IF NOT EXISTS client_shares (
    id TEXT PRIMARY KEY,
    clientId TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    createdAt TEXT NOT NULL,
    UNIQUE(clientId, userId)
  );
`)
);

// ---- migraciones ligeras: añade columnas nuevas a tablas que ya existían ----
function ensureColumn(table: string, columnDef: string) {
  const columnName = columnDef.trim().split(/\s+/)[0];
  const info = db.prepare(`PRAGMA table_info(${table})`).all() as unknown as { name: string }[];
  const exists = info.some((c) => c.name === columnName);
  if (!exists) {
    try {
      withRetry(() => db.exec(`ALTER TABLE ${table} ADD COLUMN ${columnDef};`));
    } catch (err) {
      // Next arranca varios workers a la vez y cada uno importa este módulo,
      // así que la primera vez que se añade una columna nueva puede haber
      // una carrera: dos workers ven "no existe todavía" y los dos intentan
      // el ALTER TABLE. El primero gana, el segundo falla con "duplicate
      // column name" — no es un error real, la columna ya está.
      if (!/duplicate column name/i.test((err as Error).message)) throw err;
    }
  }
}

ensureColumn("clients", "planPeriodDays INTEGER DEFAULT 30");
ensureColumn("clients", "brandBrief TEXT");
ensureColumn("clients", "lastPlanGeneratedAt TEXT");

ensureColumn("content_items", "reach INTEGER");
ensureColumn("content_items", "likes INTEGER");
ensureColumn("content_items", "comments INTEGER");
ensureColumn("content_items", "saves INTEGER");
ensureColumn("content_items", "shares INTEGER");
ensureColumn("content_items", "profileVisits INTEGER");
ensureColumn("content_items", "followersGained INTEGER");
ensureColumn("content_items", "metricsUpdatedAt TEXT");
// ID de la publicación real en Instagram (lo devuelve la API al publicar).
// Se guarda para poder pedir sus métricas por API más adelante en lugar de
// registrarlas a mano; hoy queda vacío porque el publisher activo es el
// simulado (ver lib/publisher.ts).
ensureColumn("content_items", "remoteId TEXT");
// Guion de producción de la pieza (JSON como texto): plano a plano si es
// Reel, diapositiva a diapositiva si es carrusel/post, o frame a frame si
// es una story — más quién aparece, qué material preparar y qué validar
// antes de publicar. Se rellena al importar datos reales o al generar un
// plan con la IA (ver lib/ai.ts); NULL si la pieza no tiene guion todavía.
ensureColumn("content_items", "productionNotes TEXT");
// Quién creó/es dueño del cliente. NULL en los clientes que ya existían
// antes de tener cuentas de usuario (Innovapro, Capelino): se tratan como
// del equipo entero, no de nadie en concreto (ver userCanAccessClient).
ensureColumn("clients", "ownerId TEXT");
// Web del cliente (además del @ de Instagram) — para que la IA pueda
// analizar la presencia de la marca que ya existe y proponer un brief de
// partida, en vez de arrancar de un cuadro de texto en blanco.
ensureColumn("clients", "website TEXT");
// Brief de marca "estructurado": en vez de un único cuadro de texto libre
// (brandBrief, que se queda como notas adicionales), preguntas concretas
// que sí llegan tal cual al prompt de la IA — se pueden rellenar a mano o
// con el botón "Analizar con IA" (ver lib/ai.ts: analyzeExistingBrand).
ensureColumn("clients", "targetAudience TEXT");
ensureColumn("clients", "competitors TEXT");
ensureColumn("clients", "avoidTopics TEXT");
ensureColumn("clients", "toneOfVoice TEXT");
ensureColumn("clients", "visualIdentity TEXT");
// "Universo de marca": series de contenido recurrentes con nombre propio y
// una proporción de mezcla fija (p.ej. 60/20/10/10), para que el generador
// de plan no improvise líneas editoriales distintas en cada lote. Se guarda
// como JSON (array de ContentPillar, ver lib/ai.ts) en vez de columnas
// sueltas porque el número de series es variable. Se propone con el botón
// "Analizar con IA" y se puede editar a mano igual que el resto del brief.
ensureColumn("clients", "contentPillars TEXT");
// ID numérico de la cuenta de Instagram Business/Creator (el que exige la
// Graph API en /{ig-user-id}/media, /{ig-user-id}/media_publish y para
// followers_count) — DISTINTO de igHandle, que es solo el @usuario para
// mostrar en la UI. Confundir los dos rompía las llamadas reales a la API
// (ver lib/publisher.ts). Se consigue en Meta Business Suite o con una
// llamada a /me/accounts + /{page-id}?fields=instagram_business_account.
ensureColumn("clients", "igUserId TEXT");

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
  // JSON stringificado de ContentPillar[] (ver lib/ai.ts) — null si todavía
  // no se ha definido el universo de marca para este cliente.
  contentPillars: string | null;
  // ID numérico de la cuenta de Instagram Business (no el @igHandle) — ver
  // nota en ensureColumn más arriba.
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

// El hash de la contraseña nunca sale de lib/db.ts ni lib/auth.ts: los
// endpoints y páginas siempre deben usar PublicUser (sin passwordHash).
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

// Fragmento SQL reutilizable: qué clientes puede ver `userId` (alias "c").
// Un cliente es visible si es de nadie en concreto (ownerId NULL — los que
// ya existían antes de las cuentas), si es suyo, o si se lo han compartido.
const ACCESSIBLE_CLIENTS_SQL = `(c.ownerId IS NULL OR c.ownerId = ? OR c.id IN (SELECT clientId FROM client_shares WHERE userId = ?))`;

export function listClients(userId: string): (Client & { contentCount: number })[] {
  const rows = db
    .prepare(
      `SELECT c.*, (SELECT COUNT(*) FROM content_items ci WHERE ci.clientId = c.id) as contentCount
       FROM clients c WHERE ${ACCESSIBLE_CLIENTS_SQL} ORDER BY c.createdAt DESC`
    )
    .all(userId, userId) as unknown as (Client & { contentCount: number })[];
  return rows;
}

export function getClient(id: string): Client | undefined {
  return db.prepare(`SELECT * FROM clients WHERE id = ?`).get(id) as unknown as Client | undefined;
}

// Dueño (ownerId null) o con quien se ha compartido explícitamente pueden
// entrar; los clientes "de nadie en concreto" (creados antes de que
// existieran las cuentas) son visibles para todo el equipo.
export function userCanAccessClient(clientId: string, userId: string): boolean {
  const client = getClient(clientId);
  if (!client) return false;
  if (client.ownerId === null || client.ownerId === userId) return true;
  const row = db
    .prepare(`SELECT 1 FROM client_shares WHERE clientId = ? AND userId = ?`)
    .get(clientId, userId);
  return !!row;
}

export function createClient(data: {
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
}): Client {
  const id = randomUUID();
  const ts = now();
  db.prepare(
    `INSERT INTO clients (id, name, sector, igHandle, fbPageId, accessToken, notes, planPeriodDays, brandBrief, lastPlanGeneratedAt, ownerId, website, targetAudience, competitors, avoidTopics, toneOfVoice, visualIdentity, contentPillars, igUserId, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, NULL, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
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
    ts
  );
  return getClient(id)!;
}

export function updateClient(id: string, data: Partial<Omit<Client, "id" | "createdAt" | "updatedAt">>): Client {
  const current = getClient(id);
  if (!current) throw new Error("Cliente no encontrado.");
  const merged = { ...current, ...data, updatedAt: now() };
  db.prepare(
    `UPDATE clients SET name = ?, sector = ?, igHandle = ?, fbPageId = ?, accessToken = ?, notes = ?,
      planPeriodDays = ?, brandBrief = ?, lastPlanGeneratedAt = ?, ownerId = ?, website = ?,
      targetAudience = ?, competitors = ?, avoidTopics = ?, toneOfVoice = ?, visualIdentity = ?,
      contentPillars = ?, igUserId = ?, updatedAt = ?
     WHERE id = ?`
  ).run(
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
    id
  );
  return getClient(id)!;
}

export function deleteClient(id: string) {
  db.prepare(`DELETE FROM clients WHERE id = ?`).run(id);
}

// ---------- Compartir clientes entre cuentas ----------

export function shareClientWithUser(clientId: string, userId: string) {
  db.prepare(
    `INSERT OR IGNORE INTO client_shares (id, clientId, userId, createdAt) VALUES (?, ?, ?, ?)`
  ).run(randomUUID(), clientId, userId, now());
}

export function unshareClientFromUser(clientId: string, userId: string) {
  db.prepare(`DELETE FROM client_shares WHERE clientId = ? AND userId = ?`).run(clientId, userId);
}

export function listClientShares(clientId: string): PublicUser[] {
  const rows = db
    .prepare(
      `SELECT u.* FROM client_shares cs JOIN users u ON u.id = cs.userId
       WHERE cs.clientId = ? ORDER BY u.name ASC`
    )
    .all(clientId) as unknown as User[];
  return rows.map(({ passwordHash: _passwordHash, ...rest }) => rest);
}

// ---------- Content items ----------

export function listContentItems(filter?: {
  clientId?: string;
  fromDaysAgo?: number;
  // Si se pasa, solo devuelve piezas de clientes accesibles para este
  // usuario (los suyos, los compartidos con él, y los "de todo el
  // equipo"). Se omite cuando ya se ha comprobado el acceso a un
  // clientId concreto por otro lado (p.ej. getContentItem).
  userId?: string;
}): ContentItemWithClient[] {
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
  const params: (string | number)[] = [];

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

  const rows = db.prepare(query).all(...(params as (string | number | null)[])) as unknown as Record<string, unknown>[];
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

export function getContentItem(id: string): ContentItemWithClient | undefined {
  const items = listContentItems();
  return items.find((i) => i.id === id);
}

export function createContentItem(data: {
  clientId: string;
  title: string;
  caption: string;
  mediaUrl: string;
  mediaType?: string;
  platform?: string;
  scheduledAt: string;
  status?: string;
  // Guion de producción como JSON (string) ya serializado por quien llama
  // (importación de datos reales o generación con IA); null si no hay.
  productionNotes?: string | null;
}): ContentItem {
  const id = randomUUID();
  const ts = now();
  db.prepare(
    `INSERT INTO content_items
      (id, clientId, title, caption, mediaUrl, mediaType, platform, scheduledAt, status, publishedAt, errorMessage, productionNotes, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?, ?)`
  ).run(
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
    ts
  );
  return db.prepare(`SELECT * FROM content_items WHERE id = ?`).get(id) as unknown as ContentItem;
}

export function updateContentItem(id: string, data: Partial<ContentItem>): ContentItem {
  const current = db.prepare(`SELECT * FROM content_items WHERE id = ?`).get(id) as unknown as ContentItem | undefined;
  if (!current) throw new Error("Contenido no encontrado.");
  const merged = { ...current, ...data, updatedAt: now() };
  db.prepare(
    `UPDATE content_items SET title = ?, caption = ?, mediaUrl = ?, mediaType = ?, platform = ?,
      scheduledAt = ?, status = ?, publishedAt = ?, errorMessage = ?,
      reach = ?, likes = ?, comments = ?, saves = ?, shares = ?, profileVisits = ?, followersGained = ?, metricsUpdatedAt = ?,
      remoteId = ?, productionNotes = ?, updatedAt = ?
     WHERE id = ?`
  ).run(
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
    id
  );
  return db.prepare(`SELECT * FROM content_items WHERE id = ?`).get(id) as unknown as ContentItem;
}

export function deleteContentItem(id: string) {
  db.prepare(`DELETE FROM content_items WHERE id = ?`).run(id);
}

export function countClients(userId: string): number {
  const row = db
    .prepare(`SELECT COUNT(*) as n FROM clients c WHERE ${ACCESSIBLE_CLIENTS_SQL}`)
    .get(userId, userId) as unknown as { n: number };
  return row.n;
}

export function countContentByStatus(userId: string): Record<string, number> {
  const rows = db
    .prepare(
      `SELECT ci.status as status, COUNT(*) as n FROM content_items ci
       JOIN clients c ON c.id = ci.clientId
       WHERE ${ACCESSIBLE_CLIENTS_SQL}
       GROUP BY ci.status`
    )
    .all(userId, userId) as unknown as {
    status: string;
    n: number;
  }[];
  const result: Record<string, number> = {};
  for (const r of rows) result[r.status] = r.n;
  return result;
}

// ---------- Plan de contenido IA ----------

export function createPlanBatch(data: { clientId: string; periodDays: number; trendsSummary?: string | null; model?: string | null }): PlanBatch {
  const id = randomUUID();
  const ts = now();
  db.prepare(
    `INSERT INTO plan_batches (id, clientId, periodDays, trendsSummary, model, createdAt) VALUES (?, ?, ?, ?, ?, ?)`
  ).run(id, data.clientId, data.periodDays, data.trendsSummary ?? null, data.model ?? null, ts);
  return db.prepare(`SELECT * FROM plan_batches WHERE id = ?`).get(id) as unknown as PlanBatch;
}

export function getLatestPlanBatch(clientId: string): PlanBatch | undefined {
  return db
    .prepare(`SELECT * FROM plan_batches WHERE clientId = ? ORDER BY createdAt DESC LIMIT 1`)
    .get(clientId) as unknown as PlanBatch | undefined;
}

export function createPlanItem(data: {
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
}): PlanItem {
  const id = randomUUID();
  const ts = now();
  db.prepare(
    `INSERT INTO plan_items (id, clientId, planBatchId, date, day, format, family, topic, objective, kpi, keyword, notes, status, contentItemId, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)`
  ).run(
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
    ts
  );
  return db.prepare(`SELECT * FROM plan_items WHERE id = ?`).get(id) as unknown as PlanItem;
}

export function listPlanItems(clientId: string): PlanItem[] {
  return db
    .prepare(`SELECT * FROM plan_items WHERE clientId = ? ORDER BY date ASC`)
    .all(clientId) as unknown as PlanItem[];
}

export function updatePlanItem(id: string, data: Partial<PlanItem>): PlanItem {
  const current = db.prepare(`SELECT * FROM plan_items WHERE id = ?`).get(id) as unknown as PlanItem | undefined;
  if (!current) throw new Error("Elemento de plan no encontrado.");
  const merged = { ...current, ...data, updatedAt: now() };
  db.prepare(
    `UPDATE plan_items SET date = ?, day = ?, format = ?, family = ?, topic = ?, objective = ?, kpi = ?, keyword = ?,
      notes = ?, status = ?, contentItemId = ?, updatedAt = ? WHERE id = ?`
  ).run(
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
    id
  );
  return db.prepare(`SELECT * FROM plan_items WHERE id = ?`).get(id) as unknown as PlanItem;
}

export function deleteIdeaPlanItemsForClient(clientId: string) {
  // Solo borra las que aún son una idea (no una pieza ya programada o publicada),
  // para no perder el histórico de lo que sí se llegó a ejecutar.
  db.prepare(`DELETE FROM plan_items WHERE clientId = ? AND status = 'IDEA'`).run(clientId);
}

// ---------- Banco de ideas ----------

export function createIdeaBankItem(data: {
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
}): IdeaBankItem {
  const id = randomUUID();
  const ts = now();
  db.prepare(
    `INSERT INTO idea_bank (id, clientId, planBatchId, priority, family, idea, hook, execution, resources, duration, objective, whenToUse, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
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
    ts
  );
  return db.prepare(`SELECT * FROM idea_bank WHERE id = ?`).get(id) as unknown as IdeaBankItem;
}

export function listIdeaBank(clientId: string): IdeaBankItem[] {
  return db
    .prepare(`SELECT * FROM idea_bank WHERE clientId = ? ORDER BY createdAt DESC`)
    .all(clientId) as unknown as IdeaBankItem[];
}

export function deleteIdeaBankItem(id: string) {
  db.prepare(`DELETE FROM idea_bank WHERE id = ?`).run(id);
}

// ---------- Seguidores ----------

export function createFollowerSnapshot(data: { clientId: string; date: string; followers: number; notes?: string | null }): FollowerSnapshot {
  const id = randomUUID();
  const ts = now();
  db.prepare(
    `INSERT INTO follower_snapshots (id, clientId, date, followers, notes, createdAt) VALUES (?, ?, ?, ?, ?, ?)`
  ).run(id, data.clientId, data.date, data.followers, data.notes ?? null, ts);
  return db.prepare(`SELECT * FROM follower_snapshots WHERE id = ?`).get(id) as unknown as FollowerSnapshot;
}

export function listFollowerSnapshots(clientId: string): FollowerSnapshot[] {
  return db
    .prepare(`SELECT * FROM follower_snapshots WHERE clientId = ? ORDER BY date ASC`)
    .all(clientId) as unknown as FollowerSnapshot[];
}

// ---------- Usuarios y sesiones ----------
// El hash de contraseñas (scrypt) vive en lib/auth.ts, no aquí: esta capa
// solo guarda y lee lo que le pasan.

function toPublicUser(u: User): PublicUser {
  const { passwordHash: _passwordHash, ...rest } = u;
  return rest;
}

export function createUser(data: { name: string; email: string; passwordHash: string }): PublicUser {
  const id = randomUUID();
  const ts = now();
  db.prepare(
    `INSERT INTO users (id, name, email, passwordHash, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`
  ).run(id, data.name, data.email.trim().toLowerCase(), data.passwordHash, ts, ts);
  return toPublicUser(db.prepare(`SELECT * FROM users WHERE id = ?`).get(id) as unknown as User);
}

// Devuelve el usuario completo (con passwordHash) porque solo lo usa
// lib/auth.ts para verificar la contraseña en el login.
export function getUserByEmailWithHash(email: string): User | undefined {
  return db
    .prepare(`SELECT * FROM users WHERE email = ?`)
    .get(email.trim().toLowerCase()) as unknown as User | undefined;
}

export function getUserById(id: string): PublicUser | undefined {
  const u = db.prepare(`SELECT * FROM users WHERE id = ?`).get(id) as unknown as User | undefined;
  return u ? toPublicUser(u) : undefined;
}

export function listUsers(): PublicUser[] {
  const rows = db.prepare(`SELECT * FROM users ORDER BY createdAt ASC`).all() as unknown as User[];
  return rows.map(toPublicUser);
}

export function countUsers(): number {
  const row = db.prepare(`SELECT COUNT(*) as n FROM users`).get() as unknown as { n: number };
  return row.n;
}

export function updateUserPassword(id: string, passwordHash: string) {
  db.prepare(`UPDATE users SET passwordHash = ?, updatedAt = ? WHERE id = ?`).run(passwordHash, now(), id);
}

export function deleteUser(id: string) {
  db.prepare(`DELETE FROM users WHERE id = ?`).run(id);
}

export function createSession(userId: string, expiresAt: string): Session {
  const id = randomUUID();
  const ts = now();
  db.prepare(`INSERT INTO sessions (id, userId, createdAt, expiresAt) VALUES (?, ?, ?, ?)`).run(
    id,
    userId,
    ts,
    expiresAt
  );
  return db.prepare(`SELECT * FROM sessions WHERE id = ?`).get(id) as unknown as Session;
}

// Une sesión + usuario en una sola consulta y descarta sesiones caducadas.
export function getSessionUser(sessionId: string): PublicUser | undefined {
  const row = db
    .prepare(
      `SELECT u.* FROM sessions s JOIN users u ON u.id = s.userId
       WHERE s.id = ? AND s.expiresAt > ?`
    )
    .get(sessionId, now()) as unknown as User | undefined;
  return row ? toPublicUser(row) : undefined;
}

export function deleteSession(sessionId: string) {
  db.prepare(`DELETE FROM sessions WHERE id = ?`).run(sessionId);
}

export function resetAll() {
  db.exec(`DELETE FROM idea_bank; DELETE FROM plan_items; DELETE FROM plan_batches; DELETE FROM follower_snapshots; DELETE FROM content_items; DELETE FROM clients;`);
}

export default db;
