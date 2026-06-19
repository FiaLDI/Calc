"use client";

import { useRef, useState, type ChangeEvent } from "react";

import { DataTransferApi } from "../model/api";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const DataTransferActions = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState("");

  const exportData = async () => {
    setIsBusy(true);
    setError("");

    try {
      const xml = await DataTransferApi.exportData();
      const url = URL.createObjectURL(
        new Blob([xml], { type: "application/xml;charset=utf-8" })
      );
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `calc-data-${new Date().toISOString().slice(0, 10)}.xml`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Не удалось экспортировать данные."
      );
    } finally {
      setIsBusy(false);
    }
  };

  const importData = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("XML-файл должен быть меньше 5 МБ.");
      return;
    }

    const shouldImport = window.confirm(
      "Импорт заменит ваши записи дневника и созданные продукты. Продолжить?"
    );

    if (!shouldImport) {
      return;
    }

    setIsBusy(true);
    setError("");

    try {
      const result = await DataTransferApi.importData(await file.text());
      window.alert(
        `Импорт завершён: продуктов — ${result.products}, записей — ${result.entries}.`
      );
      window.location.reload();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Не удалось импортировать данные."
      );
      setIsBusy(false);
    }
  };

  return (
    <div className="flex min-w-0 flex-col items-end gap-1">
      <div className="flex flex-wrap justify-end gap-2">
        <button
          className="rounded-xl border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50"
          disabled={isBusy}
          onClick={() => void exportData()}
          type="button"
        >
          Экспорт XML
        </button>
        <button
          className="rounded-xl border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50"
          disabled={isBusy}
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          Импорт XML
        </button>
        <input
          accept="application/xml,text/xml,.xml"
          className="sr-only"
          onChange={(event) => void importData(event)}
          ref={inputRef}
          type="file"
        />
      </div>
      {error ? (
        <p className="max-w-64 text-right text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
};
