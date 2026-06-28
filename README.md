# Consultorio Psicológico — Aplicaciones Web 2

Sitio web de un consultorio psicológico con panel de administración. Desarrollado con Node.js + Express + PostgreSQL como proyecto integrador de la materia Aplicaciones Web 2.

---

## Requisitos previos

- Node.js (v18+) con pnpm o npm
- PostgreSQL corriendo en `localhost:5432`
- (Opcional) Docker para levantar la base de datos

---

## Instalación y arranque

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>

# 2. Instalar dependencias
cd script
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores reales

# 4. Crear la base de datos (con Docker)
cd ../__docker-pg
docker build -t consultorio-pg .
docker run -d -p 5432:5432 --name consultorio-db consultorio-pg

# O bien ejecutar el SQL directamente en PostgreSQL:
# psql -U postgres -f __docker-pg/consultorio.sql

# 5. Iniciar el servidor
cd ../script
npm run dev       # modo watch (desarrollo)
npm start         # producción
```

Acceder en: `http://localhost:3000`  
Panel admin: `http://localhost:3000/admin`

---

## Variables de entorno (`.env`)

Copiar `.env.example` y completar con valores propios. **Nunca commitear `.env`** (ya está en `.gitignore`).

| Variable | Descripción |
|---|---|
| `FIRMA_COOKIE` | Clave para firmar cookies (httpOnly + signed) |
| `CLAVE_JWT` | Clave secreta para firmar tokens JWT |
| `DB_HOST` | Host de PostgreSQL |
| `DB_PORT` | Puerto de PostgreSQL (default 5432) |
| `DB_USER` | Usuario de PostgreSQL |
| `DB_PASSWORD` | Contraseña de PostgreSQL |
| `DB_NAME` | Nombre de la base de datos |
| `PUERTO` | Puerto del servidor Express (default 3000) |

---

## Estructura del proyecto

```
Proyecto consultorio/
├── __docker-pg/
│   ├── consultorio.sql        # Schema + datos iniciales
│   └── Dockerfile
└── script/
    ├── .env                   # Variables de entorno (no commitear)
    ├── .env.example           # Template de variables
    ├── servidor.mjs           # Punto de entrada Express
    ├── package.json
    ├── api/
    │   └── v1/                # API pública (solo lectura)
    │       ├── controlador.api.mjs
    │       ├── modelo.api.mjs
    │       └── rutas.api.mjs
    ├── api-crud/
    │   ├── configuraciones/
    │   │   └── baseDeDatos.mjs
    │   ├── middleware/
    │   │   └── autenticacion.mjs   # Middleware JWT
    │   └── modulos/
    │       ├── servicios/          # CRUD de servicios
    │       │   ├── controlador.servicio.mjs
    │       │   ├── modelo.servicio.mjs
    │       │   └── rutas.servicio.mjs
    │       └── usuarios/           # Auth
    │           ├── controlador.usuario.mjs
    │           ├── modelo.usuario.mjs
    │           └── rutas.usuario.mjs
    ├── public/
    │   └── imagenes/          # Imágenes subidas
    └── vistas/
        ├── web/               # Sitio público
        └── crud/              # Panel de administración
```

---

## TP1 — Sitio web estático

Maquetado del sitio público del consultorio con HTML5 y CSS3 puro.

**Páginas:**
- `index.html` — Inicio con presentación de la profesional
- `servicios.html` — Listado de servicios (cargado dinámicamente vía API)
- `tabla.html` — Horarios de atención en dos sedes
- `formulario.html` / `confirmacion.html` — Formulario de contacto

**Características:**
- Diseño responsive con Flexbox
- Paleta de colores cálidos (marrones y beige)
- Navegación entre páginas sin frameworks

---

## TP2 — API REST pública

API de solo lectura que expone los servicios del consultorio al sitio web.

**Endpoints (base: `/api/v1/servicios`):**

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Lista todos los servicios |
| GET | `/:id` | Obtiene un servicio por ID |

**Características:**
- Respuestas en JSON
- Sin autenticación (lectura pública)
- Misma base de datos que el panel admin

---

## TP3 — Panel de administración CRUD

Panel privado para gestionar los servicios del consultorio.

**Endpoints (base: `/api-crud/servicios`):**

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/` | Lista todos los servicios | No |
| GET | `/:id` | Obtiene un servicio | No |
| POST | `/` | Crea un servicio (con imagen) | **Sí** |
| PUT | `/:id` | Modifica un servicio | **Sí** |
| DELETE | `/:id` | Elimina un servicio | **Sí** |

**Características:**
- Subida de imágenes con Multer (almacenadas en `/public/imagenes/`)
- Panel web en `/admin` con formularios y tabla de servicios
- Queries parametrizadas para prevención de SQL Injection
- Try/catch en todos los modelos y controladores

---

## TP4 — Autenticación y seguridad

Sistema de login/registro con JWT, cookies seguras y hashing de contraseñas.

### 4.1 — Tabla `usuarios`

```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(100) UNIQUE NOT NULL,
    clave VARCHAR(255) NOT NULL   -- hash bcrypt, nunca texto plano
);
```

### 4.2 — Hashing de contraseñas (bcryptjs)

- Al **registrar**: `bcrypt.hash(clave, 10)` → se almacena el hash
- Al **loguear**: `bcrypt.compare(clave, hash)` → nunca se desencripta

### 4.3 — Autenticación JWT + cookies

**Endpoints de auth (base: `/api-crud/auth`):**

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/registro` | Registra usuario, devuelve cookie con JWT |
| POST | `/login` | Verifica credenciales, devuelve cookie con JWT |
| POST | `/logout` | Limpia la cookie |
| GET | `/verificar` | Verifica si hay sesión activa (requiere token) |

**Seguridad de las cookies:**
- `httpOnly: true` → inaccesible desde JavaScript del navegador (mitiga XSS)
- `signed: true` → firmada con `FIRMA_COOKIE` (detecta manipulación)
- El JWT se firma con `CLAVE_JWT` y expira en 8 horas

**Protección de rutas:**  
El middleware `verificarToken` (`api-crud/middleware/autenticacion.mjs`) protege automáticamente `POST`, `PUT` y `DELETE` en `/api-crud/servicios`. Las lecturas `GET` siguen siendo públicas.

**Flujo en el panel admin:**  
El `index.html` de `/admin` muestra la sección de login/registro por defecto. Al verificar sesión con `/api-crud/auth/verificar`, si hay token válido muestra el panel. Todo el manejo de estado (login, logout, errores) ocurre via `fetch` + DOM, sin `window.location` ni `res.redirect`.

### 4.4 — CORS

**No se implementó CORS** porque el frontend y la API comparten el mismo origen (`localhost:PUERTO`). No hay peticiones cross-origin. Agregar el middleware `cors` sería innecesario y ampliaría la superficie de ataque sin beneficio. El comentario está documentado en `servidor.mjs`.

### 4.5 — Variables de entorno (dotenv)

Todas las credenciales sensibles (claves JWT, firma de cookies, conexión a BD) se cargan desde `.env` mediante `dotenv/config`. El archivo `.env` está en `.gitignore` y nunca se commitea; se provee `.env.example` como referencia.

### 4.6 — Cómo probar

**1. Registrar un usuario:**
- Ir a `http://localhost:3000/admin`
- Hacer clic en "Registrarse", completar usuario y contraseña, enviar
- El panel se muestra automáticamente (cookie establecida)

**2. Iniciar sesión:**
- Hacer clic en "Iniciar sesión", completar credenciales
- Si son correctas: se muestra el panel; si no: mensaje de error inline

**3. Probar ruta protegida:**
- Sin sesión, intentar `POST /api-crud/servicios` → respuesta `401 No autorizado`
- Con sesión: ir a "Servicios" → "+ Agregar servicio" → crear normalmente

**4. Cerrar sesión:**
- Botón "Cerrar sesión" en cualquier página del admin
- La cookie se limpia en el servidor; la UI vuelve al formulario de login

---

## Base de datos

```sql
-- Servicios ofrecidos
CREATE TABLE servicios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    imagen VARCHAR(200) NOT NULL
);

-- Administradores del sistema
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(100) UNIQUE NOT NULL,
    clave VARCHAR(255) NOT NULL
);
```

