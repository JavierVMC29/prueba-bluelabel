# Prueba Técnica – Backend Nest.js + TypeORM

API RESTful desarrollada con **NestJS**, **TypeORM** y **MySQL** para la gestión de usuarios y tareas, incluyendo manejo de configuraciones dinámicas (JSON) y versionado de base de datos mediante migraciones.

## 📋 Requisitos Previos

Asegúrate de tener instalado en tu entorno:

- **Node.js** (v20.10.0 o superior)
- **Docker**
- **pnpm** (Gestor de paquetes). Si no lo tienes instalado, puedes instalarlo globalmente con:
  ```bash
  npm install -g pnpm
  ```

## 🚀 Configuración Inicial

### 1. Instalar dependencias

```bash
pnpm install --frozen-lockfile
```

### 2. Configurar Variables de Entorno

El proyecto requiere un archivo .env en la raíz. Puedes crear uno copiando el ejemplo proporcionado:

```bash
cp .env.example .env
```

## 🐳 Base de Datos (Docker)

Para levantar la base de datos MySQL localmente, utiliza el archivo docker compose de desarrollo:

```bash
docker compose -f docker-compose.dev.yaml up -d
```

Nota: Espera unos segundos a que el contenedor inicie completamente antes de correr las migraciones.

Para detener la base de datos:

```bash
docker compose -f docker-compose.dev.yaml down
```

## 🗄️ Migraciones de Base de Datos

Este proyecto utiliza migraciones de TypeORM para gestionar el esquema de la base de datos. No usamos synchronize: true, por lo que es necesario correr las migraciones manualmente al iniciar.

### 1. Aplicar migraciones (Setup Inicial)

Una vez que la base de datos esté corriendo, ejecuta:

```bash
pnpm migration:run
```

### 2. Comandos Disponibles

| Comando                   | Descripción                                            | Ejemplo de Uso                                                      |
| :------------------------ | :----------------------------------------------------- | :------------------------------------------------------------------ |
| `pnpm migration:generate` | Crea un archivo SQL comparando tus entidades vs la BD. | `pnpm migration:generate src/database/migrations/nombre-del-cambio` |
| `pnpm migration:run`      | Aplica las migraciones pendientes a la BD.             | `pnpm migration:run`                                                |
| `pnpm migration:revert`   | Deshace la última migración aplicada.                  | `pnpm migration:revert`                                             |

### Ejemplo de flujo de trabajo para cambios:

1. Modificas una entidad (ej. agregas un campo a User).
2. Generas la migración: pnpm migration:generate src/database/migrations/add-phone-to-user.
3. Aplicas el cambio: pnpm migration:run.

## ▶️ Ejecutar el Proyecto

### Modo Desarrollo (Watch)

```bash
pnpm start:dev
```

La API estará disponible en: http://localhost:3000

### Modo Producción

```bash
pnpm build
pnpm start:prod
```

## 🧪 Testing

### Unit Tests

Ejecuta los tests unitarios (mocks):

```bash
pnpm test
```

### E2E tests

Para los tests End-to-End es necesario levantar primero el contenedor de la base de datos de prueba:

```bash
docker compose -f docker-compose.test.yaml up -d
```

```bash
pnpm test:e2e
```

(Opcional) Apagar el contenedor al finalizar:

```bash
docker compose -f docker-compose.test.yaml down
```

### Test coverage

```bash
pnpm test:cov
```
