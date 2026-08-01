# Calc — history-current

Актуальный снимок репозитория.
Дата: **2026-08-01**.

---

## 1. Состояние сейчас

| Параметр | Значение |
|---|---|
| Ветка | `develop` ↔ `origin/develop` |
| Working tree | **clean** |
| Remote | `git@github.com:FiaLDI/Calc.git` |
| Продукты | `custom` (Mongo) + live-каталог Open Food Facts |
| Локальный режим | фича для всех: «Продолжить без аккаунта» на экране входа |
| UI shell | Header + иконковая AppNav + DateBar (календарь в модалке) |
| Activity-экраны | `/` · `/add` · `/entries` · `/products` · `/week` |
| Тесты | Vitest · frontend **31** · backend **10** |
| CI | `.github/workflows/ci.yml` (Node 22) |

### Продукт

**Calc** — дневник питания: калории, КБЖУ, цели по весу/режиму, мультипользователи, XML export/import. Offline/local режим без логина. Поиск и импорт продуктов из Open Food Facts.

### Стек

| Часть | Технологии |
|---|---|
| frontend | Next 16 · React 19 · MobX · Tailwind 4 · Recharts · FSD |
| backend | Express · Mongoose · JWT cookie · bcrypt · OFF catalog provider |
| cdn | Express · raw image upload |
| infra | Docker Compose + nginx; частично `vercel.json` (FE+BE) |

### Запуск

```bash
cp .env.example .env   # заменить JWT_TOKEN
docker compose up --build -d
# → http://localhost
```

После UI/backend-изменений: `docker compose up --build -d frontend` (и/или `backend`).

Локальный режим без бэкенда: на экране входа → **«Продолжить без аккаунта»**.

### Тесты / проверки

```bash
cd frontend && npm test && npm run typecheck && npm run lint
cd backend  && npm test && npm run typecheck
```

---

## 2. Что сделали (закоммичено на develop)

| Коммит | Суть |
|---|---|
| `cd7b625` | тесты + CI + удаление сид-каталога |
| `cf8a625` | локальный режим как пользовательская фича |
| `33cce1d` | слой каталогов + Open Food Facts (search/import) |
| `5323d35` | activity-экраны + иконковая навигация |
| `d95a2d6` | DateBar: компактная дата + календарь в модалке |

Краткий changelog сессии:

1. Анализ репозитория + canvas-обзор.
2. Удалён сид-каталог (9 продуктов) — см. §3.
3. Тесты + CI — см. §4–5.
4. Локальный режим — см. §8.
5. Open Food Facts — см. §9.
6. Activity-экраны + shell — см. §10.
7. DateBar вместо постоянного календаря — см. §10.

---

## 3. Сид-каталог — удалено

Продукты пользователя только `sourceKey: custom` (Mongo). Внешние — через catalog providers (сейчас OFF).

| Удалено | Путь / что |
|---|---|
| JSON | `warehouse-products.json`, `catalog-products.json`, `recipe-products.json` |
| Репозитории | `warehouse-` / `catalog-` / `recipe-products.repository.ts` |
| Сидер | `products.seed.ts` + вызов из `server.ts` |
| Мета источников | warehouse / catalog / recipes из `products.sources.ts` |
| Интерфейс | `ProductSourceRepository` |
| Картинки | `frontend/public/products/*.png` |
| Тест сида | `seed-repositories.test.ts` |

**Важно:** если Mongo уже поднимали со старым сидом, readonly-записи могут остаться (`docker compose down -v` или удалить `isReadonly: true`).

---

## 4. Тесты (актуально)

### Frontend — 31 (9 файлов)

| Файл | Покрытие |
|---|---|
| `entities/entries/lib/calculate-entry-nutrition.test.ts` | servings, КБЖУ × servings |
| `entities/settings/lib/calculate-nutrition-targets.test.ts` | Сушка / Поддержание / Набор |
| `entities/entries/model/selectors.test.ts` | totals, progress, weekly |
| `entities/products/lib/sanitize.test.ts` | defaults, visibility |
| `entities/entries/lib/sanitize.test.ts` | валидация записи |
| `entities/settings/model/store.test.ts` | hydrate / persist / recalc |
| `widgets/calorie-summary/.../calorie-summary-widget.test.tsx` | UI summary |
| `shared/config/local-mode.test.ts` | preference `calc:local-mode` |
| `entities/auth/model/store.test.ts` | local user / logout no-op |

Конфиг: `frontend/vitest.config.mts`, `frontend/vitest.setup.ts`.

### Backend — 10 (3 файла)

| Файл | Покрытие |
|---|---|
| `data-transfer/application/data-transfer.xml.test.ts` | XXE reject, parse, export roundtrip |
| `products/.../open-food-facts/off.mapper.test.ts` | маппинг OFF → Product |
| `products/.../catalogs/catalog-search.test.ts` | merge search + import |

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

## 6. Риски

- CDN `POST /images` без auth.
- Vercel не покрывает CDN / Mongo (полный стек = Docker).
- `normalizeServings(0)` → `1`; macro progress при target `0` → `100%` (задокументировано тестами).
- Старые сид-документы в Mongo могут остаться после удаления кода.
- Local mode: data URLs картинок в localStorage могут раздувать квоту; нет XML sync; OFF search недоступен (нужен аккаунт).
- Docker часто отдаёт stale-образы — нужен `--build` после изменений FE/BE.

---

## 7. Следующие шаги

1. Auth / signed upload на CDN.
2. Расширить store/UI тесты (entries, auth-form, diary-adder, DateBar).
3. Выбрать канонический деплой: Docker vs Vercel.
4. Опционально: локальный XML export/import без backend.
5. Опционально: скрывать DateBar на `/week`, если день там не нужен.

---

## 8. Локальный режим (фича для всех)

`features/continue-locally` — кнопка на экране входа, без env-флагов.

| Часть | Поведение |
|---|---|
| UI | «Продолжить без аккаунта»; бейдж «Локально»; «К входу» выходит |
| Auth | `enterLocalSession()` → user `id: local`; preference `localStorage` (`calc:local-mode`) |
| Reload | `checkSession` восстанавливает локальную сессию |
| Entries / Products | CRUD в localStorage при `userId === local` |
| CDN | картинки как data URL |
| XML | data-transfer скрыт в профиле |
| Каталоги | remote search/import недоступны — нужен обычный логин |

Хелпер: `shared/config/local-mode.ts`.

---

## 9. Каталоги продуктов (Open Food Facts)

Порт `ProductCatalogProvider` + `CatalogRegistry`. Mongo = custom. OFF = live search/import.

Ключевые пути:

- `backend/.../catalogs/catalog.registry.ts`
- `backend/.../catalogs/open-food-facts/{off.client,off.mapper,off.provider}.ts`
- merge/import в `ProductsService`

| API | Поведение |
|---|---|
| `GET /products?search=&sources=` | merge custom + каталоги при search |
| `GET /products/:id` | `off:{barcode}` через OFF, иначе Mongo |
| `POST /products/import` | `{ sourceKey, externalId }` → custom private |
| `GET /product-sources` | custom + off (+ др. из registry) |

Env (backend / compose): `OPEN_FOOD_FACTS_BASE_URL`, `OPEN_FOOD_FACTS_USER_AGENT`, `OPEN_FOOD_FACTS_TIMEOUT_MS`.

FE: debounce-поиск в product-library / find-product; «В мои продукты» на readonly-карточках.

---

## 10. UI: activities, shell, дата

### Маршруты (`app/(app)/`)

| Route | Screen | Виджет |
|---|---|---|
| `/` | `screens/summary` | CalorieSummary |
| `/add` | `screens/add` | DiaryAdder |
| `/entries` | `screens/entries` | DiaryEntries |
| `/products` | `screens/products` | ProductLibrary |
| `/week` | `screens/week` | WeeklyKbju |

Принцип: **1 экран = 1 виджет**. Монолит `screens/home` удалён.

### Shell

`widgets/app-shell` → Header + **AppNav** + **DateBar** + `main`.

**AppNav** (`widgets/app-nav`): 5 пунктов, иконка + подпись, `grid-cols-5`, active highlight.

**DateBar** (`widgets/date-bar`):

- полоса `‹` · кликабельная дата · `›`
- клик по дате → Modal с `DayCalendarWidget`
- выбор дня закрывает модалку
- `DayCalendarWidget` поддерживает `framed` / `onDaySelected`
