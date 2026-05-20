export const ProductListWidget = () => {
  const products = [
    {
      name: "Овсянка",
      amount: "80 г",
      calories: 290,
      protein: 10,
      carbs: 48,
      fat: 6,
    },
    {
      name: "Куриная грудка",
      amount: "150 г",
      calories: 248,
      protein: 46,
      carbs: 0,
      fat: 5,
    },
    {
      name: "Банан",
      amount: "120 г",
      calories: 105,
      protein: 1,
      carbs: 27,
      fat: 0,
    },
    {
      name: "Гречка",
      amount: "100 г",
      calories: 132,
      protein: 4,
      carbs: 25,
      fat: 1,
    },
  ];

  const totalCalories = products.reduce(
    (sum, product) => sum + product.calories,
    0
  );

  return (
    <div className="max-w-sm rounded-4xl bg-white p-6 shadow-xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400">Продукты</p>
          <h2 className="text-2xl font-bold">Сегодня</h2>
        </div>

        <div className="rounded-2xl bg-zinc-100 px-4 py-2 text-right">
          <p className="text-xs text-zinc-400">Всего</p>
          <p className="font-bold">{totalCalories} ккал</p>
        </div>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.name}
            className="rounded-3xl border border-zinc-100 bg-zinc-50 p-2 transition hover:bg-white hover:shadow-md"
          >
            <div className="mb-1 flex items-start justify-between gap-3">
              <div className="flex gap-3 justify-center items-center">
                <h3 className="font-semibold text-zinc-400">{product.name}</h3>
                <p className="text-[12px] text-zinc-400">{product.amount}</p>
              </div>

              <div className="flex gap-3 text-right *:text-sm">
                <p className="text-zinc-400">{product.calories} ккал</p>
              </div>
            </div>

            <div className="flex gap-2 text-xs">
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700">
                Б {product.protein}г
              </span>
              <span className="rounded-full bg-orange-100 px-2.5 py-1 font-medium text-orange-700">
                У {product.carbs}г
              </span>
              <span className="rounded-full bg-rose-100 px-2.5 py-1 font-medium text-rose-700">
                Ж {product.fat}г
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-5 w-full rounded-2xl bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800">
        Добавить продукт
      </button>
    </div>
  );
};