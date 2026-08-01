# Calc — history-current

Актуальный снимок репозитория после сессии.
Дата: **2026-08-01**.

---

## 1. Состояние сейчас

| Параметр | Значение |
|---|---|
| Ветка | `main` ↔ `origin/main` |
| Working tree | **dirty** — тесты, CI, удаление сида, локальный режим, этот файл (не закоммичено) |
| Remote | `git@github.com:FiaLDI/Calc.git` |
| Продукты | только `custom` (пользовательские); сид-каталога нет |
| Локальный режим | фича для всех: кнопка «Продолжить без аккаунта» на экране входа |
| Тесты | Vitest · frontend **31** · backend **3** |
| CI | `.github/workflows/ci.yml` (Node 22) |

### Продукт

**Calc** — дневник питания: калории, КБЖУ, цели по весу/режиму, мультипользователи, XML export/import. Есть offline/local режим без логина.

### Стек

| Часть | Технологии |
|---|---|
| frontend | Next 16 · React 19 · MobX · Tailwind 4 · Recharts · FSD |
| backend | Express · Mongoose · JWT cookie · bcrypt |
| cdn | Express · raw image upload |
| infra | Docker Compose + nginx; частично `vercel.json` (FE+BE) |

### Запуск

```bash
cp .env.example .env   # заменить JWT_TOKEN
docker compose up --build -d
# → http://localhost
```

Локальный режим без бэкенда: на экране входа → **«Продолжить без аккаунта»**.

### Тесты / проверки

```bash
cd frontend && npm test && npm run typecheck && npm run lint
cd backend  && npm test && npm run typecheck
```

---

## 2. Что сделали в сессии

1. **Анализ** репозитория (стек, архитектура, риски) + canvas-обзор.
2. **Нашли сид-каталог** (9 продуктов в warehouse/catalog/recipes).
3. **Предложили** матрицу тестов (business / store / UI).
4. **Внедрили тесты + CI** — см. §4–5.
5. **Удалили сид-каталог** — см. §3.
6. **Локальный режим как фича для всех** — `features/continue-locally`, без env-флага; см. §9.
7. **Зафиксировали** состояние в этом файле.

---

## 3. Сид-каталог — удалено

Продукты теперь только пользовательские (`sourceKey: custom`) через API / UI / XML import.

| Удалено | Путь / что |
|---|---|
| JSON | `warehouse-products.json`, `catalog-products.json`, `recipe-products.json` |
| Репозитории | `warehouse-` / `catalog-` / `recipe-products.repository.ts` |
| Сидер | `products.seed.ts` + вызов из `server.ts` |
| Мета источников | warehouse / catalog / recipes из `products.sources.ts` (остался `custom`) |
| Интерфейс | `ProductSourceRepository` |
| Картинки | `frontend/public/products/*.png` (вся папка) |
| Тест сида | `seed-repositories.test.ts` |

**Важно:** если Mongo уже поднимали со старым сидом, readonly-записи в БД останутся, пока не почистят вручную (`docker compose down -v` снесёт volume, или удалить документы с `isReadonly: true`).

---

## 4. Тесты (актуально)

### Frontend — 31

| Файл | Покрытие |
|---|---|
| `entities/entries/lib/calculate-entry-nutrition.test.ts` | servings, КБЖУ × servings |
| `entities/settings/lib/calculate-nutrition-targets.test.ts` | Сушка / Поддержание / Набор |
| `entities/entries/model/selectors.test.ts` | totals, progress, weekly |
| `entities/products/lib/sanitize.test.ts` | defaults, visibility |
| `entities/entries/lib/sanitize.test.ts` | валидация записи |
| `entities/settings/model/store.test.ts` | hydrate / persist / recalc |
| `widgets/calorie-summary/.../calorie-summary-widget.test.tsx` | UI summary (моки stores) |
| `shared/config/local-mode.test.ts` | `isLocalMode` env flag |
| `entities/auth/model/store.test.ts` | local user / logout no-op |

Конфиг: `frontend/vitest.config.mts`, `frontend/vitest.setup.ts`.

### Backend — 3

| Файл | Покрытие |
|---|---|
| `data-transfer/application/data-transfer.xml.test.ts` | XXE reject, parse, export roundtrip |

Конфиг: `backend/vitest.config.ts` · `*.test.ts` исключены из `tsc` build.

### Скрипты

- frontend: `test`, `test:watch`, `typecheck`, `lint`
- backend: `test`, `test:watch`, `typecheck`

---

## 5. CI

`.github/workflows/ci.yml`

- Триггеры: `push` → `main` / `develop`, все `pull_request`
- **Frontend:** `npm ci` → lint → typecheck → test
- **Backend:** `npm ci` → typecheck → test

---

## 6. Незакоммиченные изменения (состав)

- `+` тесты FE/BE, vitest-конфиги, deps в package.json / lock
- `+` `.github/workflows/ci.yml`
- `+` `history-current.md`
- `+` локальный режим как фича (`continue-locally`), preference в localStorage
- `~` README (тесты + режим без аккаунта), backend README
- `−` сид JSON/репозитории/seed/картинки
- `~` `server.ts`, `products.sources.ts`, `products.types.ts`, `backend/tsconfig.json`

---

## 7. Риски

- CDN `POST /images` без auth.
- Vercel не покрывает CDN / Mongo (полный стек = Docker).
- Поведение: `normalizeServings(0)` → `1`; macro progress при target `0` → `100%` (задокументировано тестами).
- Старые сид-документы в Mongo могут остаться после удаления кода.
- Local mode: data URLs картинок в localStorage могут раздувать квоту; нет XML sync.

---

## 8. Следующие шаги

1. Закоммитить текущий diff (тесты + CI + удаление сида + local mode).
2. Auth / signed upload на CDN.
3. Расширить store/UI тесты (entries, auth-form, diary-adder).
4. Выбрать канонический деплой: Docker vs Vercel.
5. Опционально: локальный XML export/import без backend.

---

## 9. Локальный режим (фича для всех)

Отдельная фича `features/continue-locally` — кнопка на экране входа, без env-флагов.

| Часть | Поведение |
|---|---|
| UI | «Продолжить без аккаунта» + пояснение; бейдж «Локально»; «К входу» выходит |
| Auth | `enterLocalSession()` → synthetic user `id: local`; preference в `localStorage` (`calc:local-mode`) |
| Reload | `checkSession` восстанавливает локальную сессию из preference |
| Entries / Products | CRUD в localStorage при `userId === local` |
| CDN | картинки как data URL |
| XML | data-transfer скрыт в профиле |

Хелпер: `shared/config/local-mode.ts` (`isLocalMode` / `enableLocalMode` / `disableLocalMode`).
