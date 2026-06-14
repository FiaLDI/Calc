"use client";

import { useState } from "react";

import {
  PRODUCT_CATEGORIES,
  PRODUCT_UNITS,
  type ProductCategory,
  type ProductUnit,
  useProductsStore,
} from "@/entities/products";

type ProductFormState = {
  amountUnit: ProductUnit;
  amountValue: string;
  calories: string;
  carbs: string;
  category: ProductCategory;
  fat: string;
  imageUrl: string;
  name: string;
  protein: string;
};

type AddProductFormProps = {
  framed?: boolean;
  onCancel?: () => void;
  onSuccess?: () => void;
};

const initialFormState: ProductFormState = {
  amountUnit: "г",
  amountValue: "100",
  calories: "",
  carbs: "",
  category: "Другое",
  fat: "",
  imageUrl: "",
  name: "",
  protein: "",
};

export const AddProductForm = ({
  framed = true,
  onCancel,
  onSuccess,
}: AddProductFormProps) => {
  const productsStore = useProductsStore();
  const [formState, setFormState] = useState<ProductFormState>(initialFormState);

  const form = (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();

        if (!formState.name.trim()) {
          return;
        }

        productsStore.addProduct({
          name: formState.name,
          category: formState.category,
          amountValue: Number(formState.amountValue),
          amountUnit: formState.amountUnit,
          calories: Number(formState.calories),
          protein: Number(formState.protein),
          carbs: Number(formState.carbs),
          fat: Number(formState.fat),
          imageAlt: formState.name,
          imageUrl: formState.imageUrl,
        });

        setFormState(initialFormState);
        onSuccess?.();
      }}
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-600">
          Название продукта
        </label>
        <input
          type="text"
          value={formState.name}
          onChange={(event) =>
            setFormState((currentState) => ({
              ...currentState,
              name: event.target.value,
            }))
          }
          placeholder="Например: Овсянка"
          className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-600">
          Категория
        </label>
        <select
          value={formState.category}
          onChange={(event) =>
            setFormState((currentState) => ({
              ...currentState,
              category: event.target.value as ProductCategory,
            }))
          }
          className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
        >
          {PRODUCT_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-[1fr_112px] gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-600">
            Порция
          </label>
          <input
            type="number"
            min={1}
            value={formState.amountValue}
            onChange={(event) =>
              setFormState((currentState) => ({
                ...currentState,
                amountValue: event.target.value,
              }))
            }
            placeholder="100"
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-600">
            Ед.
          </label>
          <select
            value={formState.amountUnit}
            onChange={(event) =>
              setFormState((currentState) => ({
                ...currentState,
                amountUnit: event.target.value as ProductUnit,
              }))
            }
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
          >
            {PRODUCT_UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-600">
          Картинка
        </label>
        <input
          type="text"
          inputMode="url"
          value={formState.imageUrl}
          onChange={(event) =>
            setFormState((currentState) => ({
              ...currentState,
              imageUrl: event.target.value,
            }))
          }
          placeholder="/products/banana.png"
          className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-600">
          Калории на порцию
        </label>
        <input
          type="number"
          min={0}
          value={formState.calories}
          onChange={(event) =>
            setFormState((currentState) => ({
              ...currentState,
              calories: event.target.value,
            }))
          }
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
            min={0}
            step="0.1"
            value={formState.protein}
            onChange={(event) =>
              setFormState((currentState) => ({
                ...currentState,
                protein: event.target.value,
              }))
            }
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
            min={0}
            step="0.1"
            value={formState.carbs}
            onChange={(event) =>
              setFormState((currentState) => ({
                ...currentState,
                carbs: event.target.value,
              }))
            }
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
            min={0}
            step="0.1"
            value={formState.fat}
            onChange={(event) =>
              setFormState((currentState) => ({
                ...currentState,
                fat: event.target.value,
              }))
            }
            placeholder="5"
            className="w-full rounded-2xl border border-zinc-200 bg-rose-50 px-3 py-3 text-sm outline-none transition focus:border-rose-400 focus:bg-white"
          />
        </div>
      </div>

      <div className="mt-2 flex gap-2">
        <button
          type="submit"
          disabled={!formState.name.trim()}
          className="flex-1 rounded-2xl bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          Добавить продукт
        </button>

        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-200"
          >
            Отмена
          </button>
        ) : null}
      </div>
    </form>
  );

  if (!framed) {
    return form;
  }

  return (
    <div className="w-full rounded-4xl bg-white p-6 shadow-xl">
      <div className="mb-5">
        <p className="text-sm text-zinc-400">Новый продукт</p>
        <h2 className="text-2xl font-bold">Добавить в базу</h2>
      </div>

      {form}
    </div>
  );
};
