export const AddedProductsWidget = () => {
  const products = [
    {
      name: "Овсянка",
      amount: "100 г",
      calories: 370,
      protein: 12,
      carbs: 60,
      fat: 7,
    },
    {
      name: "Банан",
      amount: "1 шт",
      calories: 105,
      protein: 1,
      carbs: 27,
      fat: 0,
    },
    {
      name: "Куриная грудка",
      amount: "150 г",
      calories: 248,
      protein: 46,
      carbs: 0,
      fat: 5,
    },
  ];

  return (
    <div className="max-w-sm rounded-[2rem] bg-white p-6 shadow-xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400">Добавлено</p>
          <h2 className="text-2xl font-bold">Мои продукты</h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-bold text-emerald-600">
          {products.length}
        </div>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.name}
            className="rounded-3xl border border-zinc-100 bg-zinc-50 p-4 transition hover:bg-white hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-zinc-400">{product.amount}</p>
              </div>

              <div className="text-right">
                <p className="font-bold">{product.calories}</p>
                <p className="text-xs text-zinc-400">ккал</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
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
    </div>
  );
};