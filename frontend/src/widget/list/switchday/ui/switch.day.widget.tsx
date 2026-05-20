export const CalendarPickerWidget = () => {
  return (
    <div className="w-full h-full rounded-4xl bg-white p-5 shadow-xl relative">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Выберите день</h2>
      </div>

      
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-xl shadow-sm absolute right-3 top-3">
          📅
        </div>

      <div className="flex w-full h-fit flex-wrap gap-3 justify-center">
        <button
        type="button"
        className="flex flex-col w-fit h-fit items-center justify-between rounded-3xl bg-zinc-100 p-2 transition hover:bg-zinc-200"
      >
        <div>
          <p className="text-left text-sm font-bold text-zinc-900">
            19 мая
          </p>
        </div>

        </button>

        <button
          type="button"
          className="flex flex-col w-fit h-fit items-center justify-between rounded-3xl bg-zinc-100 p-2 transition hover:bg-zinc-200"
        >
          
          <div>
            <p className="text-left text-sm  font-bold text-zinc-900">
              20 мая
            </p>
          </div>

        </button>

        <button
          type="button"
          className="flex flex-col w-fit h-fit items-center justify-between rounded-3xl bg-zinc-100 p-2 transition hover:bg-zinc-200"
        >
          
          <div>
            <p className="text-left text-sm font-bold text-zinc-900">
              21 мая
            </p>
          </div>
        </button>
      </div>
      
    </div>
  );
};
