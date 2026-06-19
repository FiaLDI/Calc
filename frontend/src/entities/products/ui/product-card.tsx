import Image from "next/image";

import type { Product } from "../model/types";

type ProductCardProps = {
  isSelected?: boolean;
  onRemove?: (productId: string) => void;
  onSelect?: (productId: string) => void;
  product: Product;
};

export const ProductCard = ({
  isSelected = false,
  onRemove,
  onSelect,
  product,
}: ProductCardProps) => {
  const content = (
    <>
      {product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt={product.imageAlt}
          width={80}
          height={80}
          className="h-16 w-16 shrink-0 rounded-2xl object-cover sm:h-20 sm:w-20"
        />
      ) : (
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-xl font-bold text-emerald-700 sm:h-20 sm:w-20">
          {product.name.slice(0, 1).toUpperCase()}
        </span>
      )}

      <span className="min-w-0 flex-1">
        <span className="mb-1 flex flex-wrap items-center gap-2">
          <span className="break-words font-semibold text-zinc-900">{product.name}</span>
          {isSelected ? (
            <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-semibold text-white">
              Выбран
            </span>
          ) : null}
          {product.sourceKey === "custom" ? (
            <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
              {product.visibility === "public" ? "Для всех" : "Личный"}
            </span>
          ) : null}
        </span>

        <span className="block break-words text-xs text-zinc-500">
          {product.category} · {product.sourceLabel}
        </span>
        <span className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
          <span className="rounded-full bg-white px-2 py-1 font-medium text-zinc-700">
            {product.calories} ккал
          </span>
          <span className="rounded-full bg-emerald-100 px-2 py-1 font-medium text-emerald-700">
            Б {product.protein}г
          </span>
          <span className="rounded-full bg-orange-100 px-2 py-1 font-medium text-orange-700">
            У {product.carbs}г
          </span>
          <span className="rounded-full bg-rose-100 px-2 py-1 font-medium text-rose-700">
            Ж {product.fat}г
          </span>
        </span>
      </span>
    </>
  );

  return (
    <div
      className={`min-w-0 max-w-full overflow-hidden rounded-3xl border p-3 transition ${
        isSelected
          ? "border-emerald-300 bg-emerald-50 shadow-md"
          : "border-zinc-100 bg-zinc-50 hover:border-emerald-200 hover:bg-white hover:shadow-md"
      }`}
    >
      {onSelect ? (
        <button
          type="button"
          onClick={() => onSelect(product.id)}
          className="flex min-h-[72px] min-w-0 w-full items-start gap-3 text-left sm:min-h-[88px]"
        >
          {content}
        </button>
      ) : (
        <div className="flex min-h-[72px] min-w-0 w-full items-start gap-3 text-left sm:min-h-[88px]">
          {content}
        </div>
      )}

      {!product.isReadonly && onRemove ? (
        <button
          type="button"
          onClick={() => onRemove(product.id)}
          className="mt-3 rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-900 hover:text-white"
        >
          Удалить
        </button>
      ) : null}
    </div>
  );
};
