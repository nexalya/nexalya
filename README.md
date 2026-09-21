# Nexalya — MVP interno de Innovapro

Calendario y publicación multi-cliente. Primer módulo del roadmap:
centraliza el contenido que ya produce el equipo de Innovapro (diseño,
vídeo) y lo programa/publica por cliente y por red desde un panel único.

## Qué incluye este MVP

- Gestión de clientes (altas, sector, cuenta de Instagram/Facebook).
- Calendario de contenido por cliente: título, caption, plataforma,
  tipo (imagen/vídeo), fecha y hora de publicación.
- Dashboard con lo próximo a publicar en todos los clientes a la vez,
  y contadores de programados / publicados / fallidos.
- Publicación simulada ("Publicar ahora") que deja el flujo completo
  probado de principio a fin, sin depender todavía de credenciales
  reales de Meta.
- Un adaptador de publicación (`lib/publisher.ts`) ya escrito contra la
  Instagram Graph API real, listo para activar en cuanto tengáis el
  access token (ver más abajo).

## Cómo arrancarlo

Requisitos: Node.js 22 o superior (usa el módulo `node:sqlite` incluido
en Node, así que no hace falta instalar ni configurar ninguna base de
datos aparte).

```bash
npm install
npm run db:seed   # carga 2 clientes de ejemplo con contenido programado
npm run dev        # http://localhost:3000
```

La primera vez, crea la cuenta de acceso (no la borra `db:seed`, solo hace
falta una vez):

```bash
npx tsx scripts/create-admin.ts "Tu nombre" tu-email@innovapro.es
```

Imprime una contraseña temporal — guárdala, no se puede volver a ver (solo
cambiarla luego desde "Usuarios" dentro de la app). El resto del equipo se
añade desde ahí, sin volver a tocar la terminal.

Para una build de producción:

```bash
npm run build
npm run start
```

La base de datos vive en `data/growth-os.db` (SQLite, un solo archivo).
Se crea sola la primera vez que arranca la aplicación.

## Cómo conectar Instagram/Facebook de verdad

Ahora mismo, al pulsar "Publicar ahora" se simula la publicación
(`MockPublisher` en `lib/publisher.ts`) para poder probar todo el flujo
sin cuentas reales. Para publicar de verdad:

1. Cread una app en [Meta for Developers](https://developers.facebook.com/)
   y añadid el producto "Instagram Graph API".
2. Vinculad la cuenta de Instagram Business/Creator de cada cliente a
   una Página de Facebook, y esa Página a vuestro Business Manager
   (Meta Business Suite → Configuración del negocio).
3. Generad un access token de larga duración con permisos
   `instagram_content_publish`, `pages_show_list` y
   `pages_read_engagement` (desde Business Suite → Usuarios del sistema,
   o con el flujo OAuth "Meta Business Login").
4. Guardad ese token y el ID de la cuenta de Instagram en la ficha del
   cliente (`accessToken`, `igHandle` — hoy se edita directamente en la
   base de datos o vía `PATCH /api/clients/[id]`; añadir un formulario
   en la UI es la siguiente tarea pendiente).
5. En `lib/publisher.ts`, cambiad `getPublisher()` para que devuelva
   `new InstagramGraphPublisher()` en vez de `new MockPublisher()`.

La clase `InstagramGraphPublisher` ya implementa el flujo de dos pasos
de la Graph API (crear el contenedor de media + publicarlo), así que no
hace falta escribirlo de cero.

## Qué falta para el resto del roadmap

Este MVP cubre solo el primer módulo del documento de estrategia
("Calendario y publicación multi-cliente"). Los siguientes, en orden:

1. Monitorización de reputación (reseñas de Google, menciones).
2. Interacción automatizada permitida (respuesta a comentarios/DMs
   iniciados por el usuario, captación de leads).
3. CRM y seguimiento comercial (WhatsApp Business, pipeline de leads).
4. Analítica y benchmarking de competencia.
5. Modo multi-cliente/white-label para ofrecerlo como suscripción
   directa a las marcas.

## Notas técnicas

- **Framework**: Next.js 14 (App Router) + TypeScript + Tailwind CSS.
- **Base de datos**: `node:sqlite` (nativo de Node 22+, sin binarios ni
  dependencias externas). Toda la capa de acceso a datos vive en
  `lib/db.ts` — si migráis a Postgres para producción con varios
  servidores, solo hay que reescribir ese archivo manteniendo las
  mismas funciones exportadas.
- **Subida de contenido**: en este MVP, el archivo se convierte a
  base64 y se guarda en la propia base de datos. Para producción,
  conviene subirlo a un bucket (S3, R2, etc.) y guardar solo la URL.
- **Autenticación**: cada persona tiene su propia cuenta (email +
  contraseña). Las sesiones se guardan en la base de datos (no son JWT),
  en una cookie httpOnly de 30 días — ver `lib/auth.ts`. Todas las páginas
  y rutas de la API exigen sesión iniciada.
- **Clientes propios y compartidos**: cada cliente tiene un dueño (quien
  lo crea) y solo lo ve él hasta que lo comparte explícitamente con algún
  compañero desde su ficha. Innovapro y Capelino, al ser anteriores a las
  cuentas, son visibles para todo el equipo. Ver `userCanAccessClient()`
  en `lib/db.ts`.

## Plan de contenido con IA

Al crear un cliente (o editarlo luego desde "Editar brief de marca y
frecuencia"), hay un brief estructurado (público objetivo, competencia,
tono de voz, qué evitar, identidad visual, universo de marca) en vez de un
único cuadro de texto libre — eso es lo que realmente moldea lo que genera
la IA. Si el cliente ya tiene Instagram o web, el botón "Analizar con IA"
busca esa presencia y propone un borrador de esos campos para revisar y
ajustar, en vez de arrancar en blanco. El análisis no se limita a rellenar
campos sueltos:

- **Competencia con diferenciación real**: busca 2-4 competidores directos
  de verdad, mira qué están haciendo en redes, y propone en qué terreno
  debería diferenciarse esta marca de ellos — no solo una lista de nombres.
- **Normativa para sectores regulados**: si el sector tiene restricciones
  legales de publicidad (alcohol, estética/salud, juego, finanzas...),
  busca la normativa real aplicable y la cita en "Qué evitar", en vez de
  dejar ese campo a que alguien la escriba a mano de memoria.
- **Universo de marca**: propone entre 3 y 5 series de contenido
  recurrentes con nombre propio y una proporción de mezcla (p.ej. 60/20/10/10).
  Se pueden editar a mano igual que el resto del brief, y el generador de
  plan las respeta entre lotes en vez de improvisar líneas editoriales
  nuevas cada vez que se genera un plan — se ven también como etiquetas en
  la pestaña "Plan de contenido IA" del cliente.

Cada cliente tiene además una pestaña "Plan de contenido IA" que:

- Investiga tendencias actuales del sector del cliente (búsqueda web en vivo).
- Genera un calendario editorial (fecha, formato, línea editorial, tema/hook,
  objetivo, KPI) para los próximos 15 o 30 días (configurable por cliente).
- Genera un banco de ideas de reserva para sustituir o escalar piezas.
- Avisa con un banner cuando toca actualizar el plan (según la frecuencia
  elegida) — la actualización se dispara con el botón "Actualizar plan";
  todavía no hay un job automático en segundo plano (eso requiere tener la
  app desplegada 24/7 en un servidor, no en un portátil — ver la sección de
  roadmap más abajo).

### Conectar la clave de API de Claude

1. Entra en https://console.anthropic.com/, crea una cuenta si no tienes, y
   añade unos euros de saldo en Billing.
2. Ve a "API Keys" y crea una clave nueva.
3. Abre el archivo `.env.local` en la carpeta del proyecto y pega la clave:
   `ANTHROPIC_API_KEY=sk-ant-...`
4. Reinicia el servidor (`Ctrl+C` en la Terminal donde corre, y `npm run
   start` otra vez) para que recoja la clave nueva.

Sin clave configurada, el botón "Generar/actualizar plan" mostrará un aviso
explicando qué falta, en vez de fallar en silencio.

### Métricas y seguidores

La pestaña "Métricas" de cada cliente permite registrar a mano el número de
seguidores (para ver la evolución) y los resultados de cada publicación ya
publicada (alcance, likes, comentarios, guardados, compartidos, visitas al
perfil, seguidores ganados) — igual que vuestra plantilla de control de
resultados, hasta que conectemos la lectura automática desde la API de Meta.
