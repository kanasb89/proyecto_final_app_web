# PROYECTO FINAL

**Autor:** Bernardo Canas
**Universidad:** Da Vinci de Guatemala
**Curso:** Aplicaciones WEB
---
## ¿Qué hace este proyecto?

Sistema que muestra cambios en una base de datos **en tiempo real** sin recargar la página.
Cuando se modifica un registro en PostgreSQL, la tabla en el navegador se actualiza automáticamente en segundos.

## Stack Tecnológico

PostgreSQL → Node.js → Socket.io → Angular 17
```

| Capa | Tecnología |
|------|------------|
| Base de datos | PostgreSQL 16 (Docker) |
| Backend | Node.js + Express + Socket.io |
| Frontend | Angular 17 + Angular Material |


## Instalación y Arranque

### 1. Base de datos
```bash
docker-compose up -d
```
Luego ejecutar `init.sql` en DBeaver.

### 2. Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
ng serve --open
```
> Los tres deben estar corriendo simultáneamente en terminales separadas.
---

## Cómo probarlo

Ejecutar este SQL en DBeaver y ver cómo la tabla en el navegador se actualiza sola:

```sql
UPDATE my_friends SET name = 'Nuevo Nombre' WHERE id = 1;
```
## Puertos

| Servicio | Puerto |
|----------|--------|
| PostgreSQL | 5433 |
| Backend API | 3000 |
| Frontend | 4200 |