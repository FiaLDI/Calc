export const AddMealFormWidget = () => {
  return (
    <div className="max-w-sm rounded-[2rem] bg-white p-6 shadow-xl">
      <div className="mb-5">
        <p className="text-sm text-zinc-400">Дневник питания</p>
        <h2 className="text-2xl font-bold">Добавить еду</h2>
      </div>

      <form className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-600">
            Что съел?
          </label>

          <input
            type="text"
            placeholder="Например: Овсянка, банан, курица"
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-600">
              Количество
            </label>

            <input
              type="number"
              placeholder="100"
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-600">
              Ед. изм.
            </label>

            <select className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white">
              <option>г</option>
              <option>мл</option>
              <option>шт</option>
              <option>порция</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-600">
            Приём пищи
          </label>

          <select className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white">
            <option>Завтрак</option>
            <option>Обед</option>
            <option>Ужин</option>
            <option>Перекус</option>
          </select>
        </div>

        <div className="rounded-3xl bg-emerald-50 p-4">
          <p className="mb-3 text-sm font-semibold text-emerald-800">
            Предпросмотр
          </p>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-zinc-900">Овсянка</h3>
              <p className="text-sm text-zinc-500">100 г · Завтрак</p>
            </div>

            <div className="text-right">
              <p className="font-bold text-zinc-900">370</p>
              <p className="text-xs text-zinc-500">ккал</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700">
              Б 12г
            </span>

            <span className="rounded-full bg-orange-100 px-2.5 py-1 font-medium text-orange-700">
              У 60г
            </span>

            <span className="rounded-full bg-rose-100 px-2.5 py-1 font-medium text-rose-700">
              Ж 7г
            </span>
          </div>
        </div>

        <button
          type="button"
          className="w-full rounded-2xl bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          Добавить в дневник
        </button>
      </form>
    </div>
  );
};
