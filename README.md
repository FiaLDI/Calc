# Calc

## Запуск всего приложения через Docker

1. Скопируйте `.env.example` в `.env` и замените `JWT_TOKEN` для production.
2. Запустите стек:

```bash
docker compose up --build -d
```

Приложение откроется на `http://localhost` (или порту из `APP_PORT`).

Полезные команды:

```bash
docker compose ps
docker compose logs -f
docker compose down
```

Данные MongoDB и загруженные изображения сохраняются в Docker volumes
`mongo_data` и `cdn_uploads`.

## Локальная разработка

Запустите `npm run dev` отдельно в `backend`, `cdn` и `frontend`.
