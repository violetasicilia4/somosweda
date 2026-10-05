# Frontend de Weda — documentación

Esta es una guía de todo lo que existe hoy en el frontend de Weda: con qué está hecho,
cómo está organizado, cómo navega la app y dónde viven los datos. Está escrita para
alguien sin experiencia previa en este código.

## 1. Stack (las herramientas usadas)

| Pieza | Qué es | Versión |
|---|---|---|
| **React** | Framework para armar la interfaz con componentes reutilizables | 19 |
| **Vite** | Empaqueta el código y levanta el servidor de desarrollo | 8 |
| **TypeScript** | JavaScript con tipos — ayuda a detectar errores antes de ejecutar el código | 5+ |
| **Tailwind CSS** | Estilos escritos como clases (`className="text-xl font-bold"`) en vez de archivos CSS separados | 4 |
| **lucide-react** | Librería de íconos | — |
| **motion** | Librería de animaciones (ex Framer Motion) | — |

No hay router (como React Router): la navegación se maneja a mano con un estado
(`currentView`), explicado en la sección 4.

## 2. Cómo correr el proyecto

```bash
npm install
npm run dev      # levanta el servidor local (puerto 3000)
npm run build    # genera la versión de producción (carpeta dist/)
npm run lint      # solo chequea tipos de TypeScript, no hay linter de estilo configurado
```

No hay tests automatizados.

## 3. Estructura de carpetas

```
src/
  App.tsx                 → punto de entrada: decide qué pantalla mostrar
  main.tsx                → arranca React y lo monta en el HTML
  types.ts                → todos los "moldes" de datos de la app (ver sección 6)
  index.css               → configuración de Tailwind + paleta de colores + tipografía

  components/              → pantallas principales
    LandingView.tsx          → página de inicio pública
    LandingSections.tsx      → secciones de la landing (precios, etc.)
    AuthViews.tsx             → login, registro, "olvidé mi contraseña", verificar PIN
    FindCoupleView.tsx       → buscador público de bodas por nombre
    ChoosePlanView.tsx       → elegir plan (Lista de Regalos / Evento / Evento Plus)
    CreateWeddingModal.tsx   → formulario inicial para crear una boda
    DashboardView.tsx        → panel de la pareja ya logueada (contenedor general)
    MicrositeModal.tsx       → el micrositio público que ven los invitados
    ExampleView.tsx          → versión "demo" del micrositio con datos de ejemplo
    GiftPaymentModal.tsx     → modal para que un invitado "pague" un regalo
    ExampleHero.tsx / ExampleGifts.tsx / ExampleRsvp.tsx → piezas del micrositio demo
    HeroVideo.tsx, Wordmark.tsx, ErrorBoundary.tsx, RsvpFormCard.tsx → piezas chicas reutilizables

    dashboard/                → pantallas DENTRO del panel de la pareja
      DashboardSidebar.tsx      → menú lateral
      HomeChecklistView.tsx     → pantalla de inicio con checklist de tareas
      GiftRegistryView.tsx      → gestión de la lista de regalos
      ReceivedGiftsView.tsx     → regalos ya recibidos / agradecimientos
      RsvpView.tsx              → respuestas de invitados
      MicrositeBuilderView.tsx → editor del micrositio (tema, módulos, galería)
      CobrosView.tsx            → dónde la pareja carga su alias/CBU/Mercado Pago
      AccountView.tsx           → datos de la cuenta y plan actual
      PlanView.tsx              → cambiar/explorar planes
      HelpView.tsx              → ayuda
      LockedFeatureNotice.tsx  → cartel de "esto es de un plan más alto"

  data/
    initialData.ts           → datos de ejemplo con los que arranca la app (boda, invitados, regalos)
    exampleShowcase.ts       → datos fijos del micrositio de demostración

  utils/
    plan.ts                  → reglas de los 3 planes (qué desbloquea cada uno)
    microsite.ts              → helpers del micrositio (ej: armar el hashtag default)
    format.ts                 → formateo de texto/números/fechas
    weddingStore.ts           → guarda/lee los datos de la boda en localStorage
    rsvpStore.ts               → guarda/lee las respuestas de RSVP en localStorage
```

## 4. Cómo navega la app (no hay URLs por pantalla)

Todo pasa por un único estado en `App.tsx`:

```ts
const [currentView, setCurrentView] = useState<AppView>('landing');
```

`AppView` es una lista cerrada de valores posibles: `'landing' | 'login' | 'register' |
'forgot-password' | 'verify-pin' | 'reset-password' | 'find-couple' | 'choose-plan' |
'create-wedding' | 'dashboard'`. Cambiar de pantalla es simplemente cambiar ese valor —
**no cambia la URL del navegador**, así que hoy no se puede compartir un link directo a,
por ejemplo, "login" o "dashboard".

Hay dos excepciones que sí se activan por parámetros en la URL, porque necesitan abrirse
en una pestaña nueva e independiente (para simular lo que ve un invitado externo):

- `?example=1` → muestra `ExampleView` (el micrositio de demostración)
- `?guest=1` o `#guest` → muestra `MicrositeModal` en modo standalone

## 5. Dónde viven los datos hoy (importante)

**No hay backend ni base de datos.** Mientras usás la app, los datos viven en memoria
(estado de React) y se reflejan también en `localStorage` del navegador —el "papelito"
pegado en tu propia compu— para que la pestaña del micrositio de ejemplo pueda leer lo
mismo que configuraste en el dashboard.

Esto significa:
- Si abrís la app en otro dispositivo, no vas a ver los mismos datos.
- Si borrás el caché del navegador, se pierde todo.
- El login (`AuthViews.tsx`) no valida nada real: cualquier contraseña entra.

Esta es la parte que hay que reemplazar por un backend real más adelante — pero el
código de pantallas (los componentes) no debería necesitar reescribirse, solo
"enchufarse" a llamadas a una API en lugar de a `weddingStore.ts` / `rsvpStore.ts`.

## 6. Modelo de datos (`types.ts`)

Son los "moldes" que definen la forma de cada dato en la app. Los principales:

- **`WeddingData`** → toda la info de una boda: nombres de la pareja, fecha, plan
  contratado, estado (`BORRADOR` / `PUBLICADO`), tema visual elegido, datos de cobro
  (alias bancario / Mercado Pago), y qué módulos del micrositio están activados
  (`MicrositeFeatures`: cuenta regresiva, historia, cronograma, galería, etc.).
- **`RsvpEntry`** → una respuesta de un invitado al formulario público (nombre,
  si asiste o no, restricciones alimentarias, mensaje).
- **`ManualGuest`** → un invitado cargado a mano por la pareja para organización interna
  (nunca se cruza automáticamente con `RsvpEntry`).
- **`GiftItem`** → un regalo de la lista (título, precio objetivo, cuánto se juntó).
- **`ReceivedGift`** → un regalo ya recibido/pagado (quién lo dio, monto, método,
  si está confirmado).
- **`WeddingEvent`** → un evento del cronograma (civil, iglesia, fiesta), con fecha,
  lugar e ícono.

## 7. Los 3 planes (`utils/plan.ts`)

Un solo array (`PLAN_DETAILS`) es la fuente única de verdad, usada tanto en la landing
como en el onboarding y en el dashboard:

1. **Lista de Regalos** — AR$ 99.000
2. **Evento** — AR$ 129.000 (incluye todo lo anterior + RSVP + micrositio base)
3. **Evento Plus** — AR$ 159.000 (incluye todo lo anterior + micrositio premium, galería,
   guía de invitados, música)

Son pagos únicos, no suscripciones. `highestPlan` guarda el plan más alto que la pareja
probó alguna vez, para que si bajan de plan no pierdan lo ya configurado — solo se
bloquea el acceso, no se borra nada.

## 8. Sistema visual (`index.css`)

Tailwind v4 permite definir la paleta de colores y tipografía en un bloque `@theme`
dentro del CSS (en vez de un archivo `tailwind.config.js` separado). Ahí está definida:

- Una sola familia tipográfica en toda la app: **Schibsted Grotesk**.
- Una paleta cálida (cremas, marrones tinta) que pisa los grises/verdes default de
  Tailwind, para que toda la app — landing, dashboard, micrositio — comparta la misma
  identidad visual.
- Esquinas y bordes definidos (2px, sin sombras pesadas) como regla de diseño general.

## 9. Dependencias que están pero no se usan

- **`@google/genai`** (SDK de Gemini): está en `package.json` porque el proyecto nació
  en Google AI Studio, pero no aparece usado en ningún archivo de `src/`. Es código
  muerto — se puede quitar sin romper nada, o usarlo a futuro si se agrega alguna
  función con IA.
- **`express` / `dotenv`**: tampoco hay ningún servidor corriendo con esto en el repo.
  También boilerplate de la plantilla original.

## 10. Veredicto corto

El frontend está bien armado y es coherente (un solo sistema de diseño, componentes
ordenados por sección, modelo de datos claro). **No hace falta rehacerlo.** Lo único
pendiente es conectar estas mismas pantallas a un backend real cuando se construya,
en lugar de a `localStorage`.
