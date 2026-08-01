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

### Режим без аккаунта

На экране входа кнопка **«Продолжить без аккаунта»** (`features/continue-locally`) —
доступна всем пользователям. Данные хранятся в `localStorage` этого браузера;
выбор переживает перезагрузку. «К входу» / выход из локального режима
возвращает на форму логина.

## Тесты

```bash
cd frontend && npm test && npm run typecheck && npm run lint
cd backend  && npm test && npm run typecheck
```

CI (GitHub Actions): lint/typecheck/test для `frontend` и `backend` на push/PR.
