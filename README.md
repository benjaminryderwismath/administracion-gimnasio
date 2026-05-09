
# Gym Management API

REST API para la administración de un gimnasio. Permite gestionar alumnos, profesores, inscripciones y pagos, con autenticación JWT y notificaciones automáticas por email y WhatsApp.

**Base URL:** `https://administracion-gimnasio-7f7r.onrender.com`

---

## Tecnologías

- **Node.js** + **Express 5**
- **PostgreSQL** con `pg` (Pool)
- **JWT** — access token (15min) + refresh token (7d) con rotación
- **Zod** — validación de schemas
- **bcryptjs** — hashing de passwords
- **node-cron** — job diario de recordatorios
- **Nodemailer** + **Twilio** — notificaciones por email y WhatsApp
- **Jest** + **Supertest** — tests unitarios e integración

---

## Estructura del proyecto

```
src/
├── config/         # Conexión a PostgreSQL
├── controllers/    # Lógica de request/response
├── middlewares/    # Auth, validación de schemas e IDs
├── routes/         # Definición de endpoints
├── services/       # Lógica de negocio y queries
├── validators/     # Schemas Zod
├── jobs/           # Cron job de recordatorios
└── utils/          # AppError, JWT helpers, bcrypt helpers
tests/              # Tests con Jest + Supertest
```

---

## Instalación local

```bash
git clone https://github.com/tu-usuario/gimnasio.git
cd gimnasio
npm install
```

Copiá el archivo de variables de entorno:

```bash
cp .env.example .env
```

Completá los valores en `.env` y levantá el servidor:

```bash
npm run dev
```

---

## Variables de entorno

```env
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
NODE_ENV=development

# Notificaciones
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE=
EMAIL_USER=
EMAIL_PASS=
```

---

## Autenticación

Todos los endpoints excepto `/auth/register`, `/auth/login` y `/auth/refresh` requieren un **Bearer token** en el header:

```
Authorization: Bearer <accessToken>
```

El access token expira en 15 minutos. Usá `/auth/refresh` para obtener uno nuevo sin volver a loguearte.

---

## Endpoints

### Auth

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Registrar usuario | No |
| POST | `/auth/login` | Iniciar sesión | No |
| POST | `/auth/refresh` | Renovar access token | No |
| POST | `/auth/logout` | Cerrar sesión | No |

> `/auth/login` y `/auth/register` tienen rate limiting: máximo 10 intentos cada 15 minutos por IP.

**POST /auth/register**
```json
{
  "nombre": "Benji",
  "email": "benji@gym.com",
  "password": "tu_password"
}
```

**POST /auth/login**
```json
{
  "email": "benji@gym.com",
  "password": "tu_password"
}
```
Respuesta:
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

**POST /auth/refresh**
```json
{
  "refreshToken": "eyJ..."
}
```

**POST /auth/logout**
```json
{
  "refreshToken": "eyJ..."
}
```

---

### Alumnos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/alumnos` | Listar todos los alumnos |
| GET | `/alumnos/:id` | Obtener un alumno |
| POST | `/alumnos` | Crear alumno |
| PUT | `/alumnos/:id` | Actualizar alumno |
| DELETE | `/alumnos/:id` | Eliminar alumno |

**POST /alumnos**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "telefono": "+5493512345678"
}
```

---

### Profesores

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/profesores` | Listar todos los profesores |
| GET | `/profesores/:id` | Obtener un profesor |
| POST | `/profesores` | Crear profesor |
| PUT | `/profesores/:id` | Actualizar profesor |
| DELETE | `/profesores/:id` | Eliminar profesor |

**POST /profesores**
```json
{
  "nombre": "Carlos López",
  "comision": 20
}
```
> `comision` es el porcentaje (0-100) que el profesor recibe por cada pago de sus alumnos.

---

### Inscripciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/inscripciones` | Listar todas las inscripciones |
| GET | `/inscripciones/:id` | Obtener una inscripción |
| POST | `/inscripciones` | Crear inscripción |
| PUT | `/inscripciones/:id` | Actualizar inscripción |
| DELETE | `/inscripciones/:id` | Eliminar inscripción |

**POST /inscripciones**
```json
{
  "alumno_id": 1,
  "profesor_id": 2,
  "tipo": "mensual"
}
```
> `tipo` acepta: `mensual`, `trimestral`, `semestral`, `anual`. `profesor_id` es opcional.

---

### Pagos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/pagos` | Listar todos los pagos |
| GET | `/pagos/resumen` | Resumen de ingresos totales |
| POST | `/pagos` | Registrar un pago |

**POST /pagos**
```json
{
  "inscripcion_id": 1,
  "monto": 15000,
  "metodo_pago": "efectivo"
}
```
> `metodo_pago` acepta: `efectivo`, `transferencia`, `tarjeta`. Al registrar un pago, el vencimiento de la inscripción se actualiza automáticamente.

---

### Reportes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/reportes/profesores` | Ganancias por profesor |
| GET | `/reportes/profesores/:id` | Ganancias de un profesor específico |
| GET | `/reportes/mensual` | Métricas mensuales |
| GET | `/reportes/mensual?year=2025&month=11` | Métricas de un mes específico |

---

## Tests

```bash
npm test
```

Los tests usan mocks de la DB — no requieren PostgreSQL corriendo.

```
Test Suites: 3 passed
Tests:       32 passed
```

---

## Funcionalidades destacadas

- **Refresh token rotation** — cada vez que se renueva el access token, el refresh token también se reemplaza por uno nuevo.
- **Recordatorios automáticos** — un cron job corre todos los días a las 9am y envía notificaciones por email y WhatsApp a los alumnos cuyo plan vence en 5 días.
- **Cálculo automático de comisiones** — al registrar un pago, se calcula automáticamente la comisión del profesor y la ganancia del gimnasio según el porcentaje configurado.
- **Rate limiting** — `/login` y `/register` limitan a 10 intentos por IP cada 15 minutos.
