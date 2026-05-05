

# API de Gestión de Gimnasio

API REST para la administración completa de un gimnasio real, con automatización de pagos, renovaciones y notificaciones.

🔗 **Deploy:** https://administracion-gimnasio-7f7r.onrender.com

---

## 🚀 Características principales

- **Gestión completa de alumnos, profesores e inscripciones**
- **Sistema de pagos inteligente:**
  - Cálculo automático de comisiones por profesor
  - Renovación automática de suscripciones
  - Separación de ganancias (gimnasio vs profesor)
- **Sistema de notificaciones automáticas:**
  - Recordatorios 5 días antes del vencimiento
  - Envío por WhatsApp (Twilio) y Email (Nodemailer)
  - Job automático diario con node-cron
- **Reportes y métricas:**
  - Facturación total del gimnasio
  - Facturación por profesor
  - Métricas mensuales
- **Autenticación completa con JWT** (access + refresh tokens)
- **Validación de datos con Zod**
- **Manejo centralizado de errores**

---

## 🛠 Stack Tecnológico

- Node.js + Express
- PostgreSQL
- JWT (access + refresh tokens)
- Zod (validación)
- Node-cron (tareas programadas)
- Nodemailer (emails)
- Twilio (SMS/WhatsApp)

---

## 📋 Endpoints

### Auth
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/register` | Registro de usuario |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Renovar token |
| POST | `/auth/logout` | Logout |

### Profesores
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/profesores` | Listar profesores |
| POST | `/profesores` | Crear profesor |
| GET | `/profesores/:id` | Ver profesor |
| PUT | `/profesores/:id` | Actualizar profesor |
| DELETE | `/profesores/:id` | Eliminar profesor |

### Alumnos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/alumnos` | Listar alumnos |
| POST | `/alumnos` | Crear alumno |
| GET | `/alumnos/:id` | Ver alumno |
| PUT | `/alumnos/:id` | Actualizar alumno |
| DELETE | `/alumnos/:id` | Eliminar alumno |

### Inscripciones
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/inscripciones` | Listar inscripciones |
| POST | `/inscripciones` | Crear inscripción |
| GET | `/inscripciones/:id` | Ver inscripción |
| PUT | `/inscripciones/:id` | Actualizar inscripción |
| DELETE | `/inscripciones/:id` | Cancelar inscripción |

**Tipos de plan:** `mensual`, `trimestral`, `semestral`, `anual`

### Pagos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/pagos` | Listar pagos |
| POST | `/pagos` | Registrar pago (renueva inscripción) |
| GET | `/pagos/resumen` | Resumen de facturación |

**Ejemplo de pago:**
```json
{
  "inscripcion_id": 1,
  "monto": 15000,
  "metodo_pago": "efectivo"
}
```

### Reportes
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/reportes/profesores` | Facturación por profesor |
| GET | `/reportes/mensual` | Métricas mensuales |
| GET | `/reportes/profesores/:id` | Ganancias de un profesor |

---

## 🧪 Flujo de ejemplo

1. Login
2. Crear alumno
3. Crear inscripción
4. Registrar pago → se renueva automáticamente

POST /pagos

{
  "inscripcion_id": 1,
  "monto": 15000,
  "metodo_pago": "efectivo"
}

> ⚠️ Nota: El servidor puede tardar unos segundos en responder si está en reposo (Render free tier).

---

## 🏗 Arquitectura

src/
├── config/         → Configuración de DB
├── controllers/    → Lógica de request/response
├── jobs/           → Tareas programadas (cron)
├── middlewares/    → Auth y validación
├── routes/         → Definición de endpoints
├── services/       → Lógica de negocio
├── utils/          → Helpers
└── validators/     → Schemas de Zod

---

## 🔧 Instalación Local

```bash
git clone https://github.com/benjaminryderwismath/administracion-gimnasio.git
cd administracion-gimnasio
npm install
```

**Crear archivo `.env`:**

DATABASE_URL=postgresql://localhost/gimnasio
JWT_SECRET=tu_secret
JWT_REFRESH_SECRET=tu_refresh_secret
NODE_ENV=development
PORT=3000
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password
TWILIO_ACCOUNT_SID=tu_sid
TWILIO_AUTH_TOKEN=tu_token
TWILIO_PHONE=+1234567890

**Ejecutar:**
```bash
npm run dev
```

---

## 🤖 Sistema de Notificaciones

Job automático que corre diariamente:
1. Busca inscripciones que vencen en 5 días
2. Envía recordatorio por WhatsApp y Email al alumno
3. Notifica al administrador con lista completa

---

## 💡 Lógica de Negocio Destacada

- **Renovación automática:** Al registrar un pago, la inscripción se renueva automáticamente con nueva fecha de inicio y vencimiento
- **Cálculo de comisiones:** El sistema calcula automáticamente la comisión del profesor (%) y la ganancia del gimnasio
- **Estados dinámicos:** Las inscripciones actualizan su estado automáticamente (activo/vencido/cancelado)
- **Validación estricta:** Todos los endpoints tienen validación de datos con Zod
- **Delete lógico:** Las inscripciones se cancelan en lugar de eliminarse

---

## 👨‍💻 Autor

**Benjamin Ryder Wismath**  
Backend Developer  
[GitHub](https://github.com/benjaminryderwismath) | [LinkedIn](https://www.linkedin.com/in/benjamin-ryder-wismath-95b631291)















