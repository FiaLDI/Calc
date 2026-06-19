"use client";

import { useState } from "react";

import {
  PRODUCT_CATEGORIES,
  PRODUCT_UNITS,
  type ProductCategory,
  type ProductUnit,
  type ProductVisibility,
  useProductsStore,
} from "@/entities/products";
import { uploadImageToCdn } from "@/shared/api/cdn";

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
  visibility: ProductVisibility;
};

type AddProductFormProps = {
  framed?: boolean;
  onCancel?: () => void;
  onSuccess?: () => void;
};

const initialFormState: ProductFormState = {
  amountUnit: PRODUCT_UNITS[0],
  amountValue: "100",
  calories: "",
  carbs: "",
  category: PRODUCT_CATEGORIES[PRODUCT_CATEGORIES.length - 1],
  fat: "",
  imageUrl: "",
  name: "",
  protein: "",
  visibility: "private",
};

export const AddProductForm = ({
  framed = true,
  onCancel,
  onSuccess,
}: AddProductFormProps) => {
  const productsStore = useProductsStore();
  const [formState, setFormState] = useState<ProductFormState>(initialFormState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const form = (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();

        if (!formState.name.trim() || isSubmitting) {
          return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        void (async () => {
          try {
            const uploadedImage = imageFile
              ? await uploadImageToCdn(imageFile)
              : null;
            const imageUrl = uploadedImage?.url || formState.imageUrl;

            await productsStore.addProduct({
              amountUnit: formState.amountUnit,
              amountValue: Number(formState.amountValue),
              calories: Number(formState.calories),
              carbs: Number(formState.carbs),
              category: formState.category,
              fat: Number(formState.fat),
              imageAlt: formState.name,
              imageUrl,
              name: formState.name,
              protein: Number(formState.protein),
              visibility: formState.visibility,
            });

            setFormState(initialFormState);
            setImageFile(null);
            onSuccess?.();
          } catch (error) {
            setSubmitError(
              error instanceof Error ? error.message : "Failed to add product."
            );
          } finally {
            setIsSubmitting(false);
          }
        })();
      }}
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-600">
          Product name
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
          placeholder="Oatmeal"
          className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-600">
          Category
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

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-zinc-600">
          Кто увидит продукт
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {([
            ["private", "Только я"],
            ["public", "Все пользователи"],
          ] as const).map(([visibility, label]) => (
            <label
              className={`cursor-pointer rounded-2xl border px-4 py-3 text-sm transition ${
                formState.visibility === visibility
                  ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                  : "border-zinc-200 bg-zinc-50 text-zinc-600"
              }`}
              key={visibility}
            >
              <input
                checked={formState.visibility === visibility}
                className="sr-only"
                name="visibility"
                onChange={() =>
                  setFormState((currentState) => ({
                    ...currentState,
                    visibility,
                  }))
                }
                type="radio"
                value={visibility}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_112px]">
        <div className="min-w-0">
          <label className="mb-1 block text-sm font-medium text-zinc-600">
            Portion
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

        <div className="min-w-0">
          <label className="mb-1 block text-sm font-medium text-zinc-600">
            Unit
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
          Image
        </label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={(event) => {
            setImageFile(event.target.files?.[0] || null);
          }}
          className="mb-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition file:mr-3 file:rounded-full file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white focus:border-emerald-400 focus:bg-white"
        />
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
          placeholder="Or paste image URL"
          className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
        />
        {imageFile ? (
          <p className="mt-1 text-xs text-zinc-400">{imageFile.name}</p>
        ) : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-600">
          Calories per portion
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

      <div className="grid min-w-0 gap-3 sm:grid-cols-3">
        <div className="min-w-0">
          <label className="mb-1 block text-xs font-medium text-zinc-500">
            Protein
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

        <div className="min-w-0">
          <label className="mb-1 block text-xs font-medium text-zinc-500">
            Carbs
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

        <div className="min-w-0">
          <label className="mb-1 block text-xs font-medium text-zinc-500">
            Fat
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

      {submitError ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {submitError}
        </p>
      ) : null}

      <div className="mt-2 flex gap-2">
        <button
          type="submit"
          disabled={!formState.name.trim() || isSubmitting}
          className="flex-1 rounded-2xl bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          {isSubmitting ? "Saving..." : "Add product"}
        </button>

        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-200"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );

  if (!framed) {
    return form;
  }

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-4xl bg-white p-4 shadow-xl sm:p-6">
      <div className="mb-5">
        <p className="text-sm text-zinc-400">New product</p>
        <h2 className="text-2xl font-bold">Add to database</h2>
      </div>

      {form}
    </div>
  );
};
