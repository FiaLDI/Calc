
export const AddProductFormFeatures = () => {
  return (
    <div className="max-w-sm rounded-4xl bg-white p-6 shadow-xl">
      <div className="mb-5">
        <p className="text-sm text-zinc-400">Новый продукт</p>
        <h2 className="text-2xl font-bold">Добавить еду</h2>
      </div>

      <form className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-600">
            Название продукта
          </label>
          <input
            type="text"
            placeholder="Например: Овсянка"
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-600">
            Количество
          </label>
          <input
            type="text"
            placeholder="Например: 100 г"
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-600">
            Калории
          </label>
          <input
            type="number"
            placeholder="250"
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-500">
              Белки
            </label>
            <input
              type="number"
              placeholder="10"
              className="w-full rounded-2xl border border-zinc-200 bg-emerald-50 px-3 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-500">
              Углеводы
            </label>
            <input
              type="number"
              placeholder="30"
              className="w-full rounded-2xl border border-zinc-200 bg-orange-50 px-3 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-500">
              Жиры
            </label>
            <input
              type="number"
              placeholder="5"
              className="w-full rounded-2xl border border-zinc-200 bg-rose-50 px-3 py-3 text-sm outline-none transition focus:border-rose-400 focus:bg-white"
            />
          </div>
        </div>

        <button
          type="button"
          className="mt-2 w-full rounded-2xl bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          Добавить продукт
        </button>
      </form>
    </div>
  );
};