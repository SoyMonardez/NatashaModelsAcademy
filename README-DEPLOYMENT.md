# Despliegue Docker + PostgreSQL

Producción usa Caddy (sitio estático y HTTPS automático), la API Node y PostgreSQL. MySQL no forma parte del despliegue final.

## Preparar el VPS

1. Instalar Docker Engine y Docker Compose.
2. Crear el archivo privado: cp .env.production.example .env.production
3. Completar .env.production con claves nuevas. Si la contraseña contiene caracteres reservados, codificarla para DATABASE_URL.
4. Apuntar los DNS A de natashamodel.agency, www.natashamodel.agency y api.natashamodel.agency al VPS.
5. Abrir únicamente 80 y 443.
6. Iniciar: docker compose --env-file .env.production up -d --build

Caddy pide y renueva certificados TLS cuando los DNS ya resuelven al VPS. Consultar con docker compose ps y docker compose logs -f api caddy.

## Importación única del respaldo MySQL

En una máquina controlada: docker compose -f docker-compose.migration.yml up --build --abort-on-container-exit --exit-code-from migrator

Inicia MySQL temporalmente, aplica el esquema PostgreSQL y transfiere filas con parámetros. No modifica el SQL original, verifica cada tabla y no imprime datos de usuarios o formularios.

Al finalizar: docker compose -f docker-compose.migration.yml down -v

No subas u684485898_NatashaModels.sql, .env.production ni respaldos de PostgreSQL a un repositorio público.