# 📘 Proyecto: Aplicación de Gestión de Citas (Cliente & Negocio)

## ⚙️ Configuración del Backend

1. Ir a la carpeta del backend:

   ```bash
   cd backend
   ```

2. Crear y configurar el archivo `.env`:

   ```env
   DATABASE_URL=postgresql://<usuario>:<password>@localhost:<port>/<basededatos>
   SECRET_KEY=clave_secreta_para_secureStorage
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ALLOWED_ORIGINS=http://localhost:4200
   ```

3. Instalar dependencias:

   ```bash
   pip install -r requirements.txt
   ```

4. Ejecutar migraciones de base de datos con Alembic:

   ```bash
   alembic upgrade head
   ```

5. Levantar el servidor backend:

   ```bash
   uvicorn app.main:app --reload
   ```

   El backend estará disponible en:  
   👉 `http://localhost:8000`

---

## 🎨 Configuración del Frontend

1. Ir a la carpeta del frontend:

   ```bash
   cd frontend
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Configurar proxy (`proxy.conf.json`):

   ```json
   {
     "/api": {
       "target": "http://localhost:8000",
       "secure": false,
       "changeOrigin": true,
       "pathRewrite": { "^/api": "" }
     }
   }
   ```

4. Iniciar el servidor de desarrollo con proxy:

   ```bash
   ng serve --proxy-config proxy.conf.json
   ```

   El frontend estará disponible en:  
   👉 `http://localhost:4200`

---

## 🔑 Autenticación y Roles

- **Usuarios públicos**: acceso a rutas de registro e inicio de sesión (`/auth`, `/public`).
- **Usuarios cliente**: acceso a `/client` protegido con `AuthGuard` + `RoleGuard('client')`.
- **Usuarios negocio**: acceso a `/business` protegido con `AuthGuard` + `RoleGuard('business')`.

Los tokens se guardan encriptados en `SecureStorage`.

---

## 📂 Estructura del Proyecto

```
backend/    → API con FastAPI/NestJS + Alembic
frontend/   → Angular con lazy-loading, guards y diseño moderno
```

---

## 🚀 Comandos útiles

### Backend

```bash
# Crear nueva migración
alembic revision --autogenerate -m "mensaje_migracion"

# Aplicar migraciones
alembic upgrade head

# Revertir última migración
alembic downgrade -1
```

### Frontend

```bash
# Iniciar servidor local con proxy
ng serve --proxy-config proxy.conf.json

# Compilar para producción
ng build --configuration production
```

---

## 🛠 Buenas prácticas aplicadas

- Uso de `SecureStorage` con **AES** para tokens.
- Guards para proteger rutas según autenticación y rol.
- Lazy loading en Angular para optimizar carga.
- Migraciones con Alembic para mantener la base de datos versionada.
- Código organizado y modular.

---

## 📌 Próximos pasos

- Agregar vistas específicas para cada rol (cliente y negocio).
- Implementar notificaciones en frontend.
- Desplegar en entorno cloud (ej. Heroku, Render o Vercel + Railway).
