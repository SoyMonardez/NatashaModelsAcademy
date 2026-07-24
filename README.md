# Natasha Models Academy

Plataforma web para presentar cursos, modelos, noticias e inscripciones de una academia de modelaje. Incluye un sitio público y un panel de administración para gestionar contenidos.

**Estado:** aplicación funcional con despliegue mediante Docker y PostgreSQL.

## Funcionalidades verificadas

- Gestión de cursos, modelos, noticias y carruseles.
- Formularios de inscripción y contacto.
- Carrito y solicitudes relacionadas con cursos.
- Autenticación del panel administrativo con JWT.
- Recuperación de contraseña por correo.
- Carga de imágenes con validación desde el backend.

## Stack

- **Frontend:** sitio web/PWA distribuido como archivos estáticos.
- **Backend:** Node.js, Express y TypeScript.
- **Base de datos:** PostgreSQL con Prisma.
- **Infraestructura:** Docker Compose y Caddy.
- **Integraciones:** correo transaccional y autenticación de Google.

## Desarrollo del backend

```bash
cd backend
npm install
npm run dev
```

La configuración se crea a partir de `backend/.env.example`. Los valores incluidos son ficticios y deben reemplazarse localmente.

## Validaciones

```bash
cd backend
npm run build
npm test
```

## Despliegue

Las instrucciones operativas se encuentran en [README-DEPLOYMENT.md](README-DEPLOYMENT.md). Los archivos `.env`, dumps, logs, uploads y copias de producción no deben incluirse en el repositorio.

## Seguridad

- Secretos y credenciales mediante variables de entorno.
- Contraseñas almacenadas con hash.
- Autenticación JWT para rutas administrativas.
- Rate limiting y cabeceras HTTP mediante Helmet.
- Separación entre la conexión normal de la aplicación y tareas administrativas.

## Limitaciones

- La disponibilidad del envío de correo depende del proveedor configurado.
- El despliegue necesita una base PostgreSQL y variables propias del entorno.
- Los datos y recursos de producción no forman parte del repositorio.

## Autor

Alejo Monárdez  
[Portfolio](https://alejomonardez.com) · [GitHub](https://github.com/SoyMonardez)
