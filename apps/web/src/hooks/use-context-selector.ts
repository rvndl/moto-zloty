import {
  Context,
  useContextSelector as useContextSelectorBase,
} from "@fluentui/react-context-selector";
import { useRef } from "react";

export const useContextSelector = <TContextValue, TResult>(
  Context: Context<TContextValue>,
  selector: (state: NonNullable<TContextValue>) => TResult,
  equals?: (a: TResult, b: TResult) => boolean,
) => {
  const prevResult = useRef<TResult>();

  return useContextSelectorBase(Context, (state) => {
    if (state === null || state === undefined) {
      throw new Error(`Context "${Context.displayName}" is not provided.`);
    }

    const result = selector(state);

    if (
      equals &&
      prevResult.current !== undefined &&
      equals(prevResult.current, result)
    ) {
      return prevResult.current;
    }

    prevResult.current = result;

    return result;
  });
};

export const createUseContextSelector = <TContextValue>(
  Context: Context<TContextValue>,
) => {
  return <TResult>(
    selector: (state: NonNullable<TContextValue>) => TResult,
    equals?: (a: TResult, b: TResult) => boolean,
  ) => useContextSelector(Context, selector, equals);
};
