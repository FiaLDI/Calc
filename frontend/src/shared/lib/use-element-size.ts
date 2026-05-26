"use client";

import { useLayoutEffect, useRef, useState } from "react";

type ElementSize = {
  height: number;
  width: number;
};

const EMPTY_SIZE: ElementSize = {
  height: 0,
  width: 0,
};

export const useElementSize = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<ElementSize>(EMPTY_SIZE);

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const updateSize = () => {
      const nextSize = {
        height: element.clientHeight,
        width: element.clientWidth,
      };

      setSize((previousSize) => {
        if (
          previousSize.height === nextSize.height &&
          previousSize.width === nextSize.width
        ) {
          return previousSize;
        }

        return nextSize;
      });
    };

    updateSize();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateSize);

      return () => {
        window.removeEventListener("resize", updateSize);
      };
    }

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    hasSize: size.height > 0 && size.width > 0,
    height: size.height,
    ref,
    width: size.width,
  };
};
