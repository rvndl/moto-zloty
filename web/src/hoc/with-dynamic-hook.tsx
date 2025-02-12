import { ComponentType, useEffect, useState } from "react";

function withDynamicHook<TProps, TModExport = unknown>(
  hookName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  importFunc: () => Promise<any>,
  Component: ComponentType<TProps>
) {
  return (props: TProps) => {
    const [hook, setHook] = useState<TModExport>();

    useEffect(() => {
      importFunc().then((mod) => setHook(() => mod[hookName]));
    }, []);

    if (!hook) {
      return null;
    }

    const newProps = { ...props, [hookName]: hook };
    return <Component {...newProps} />;
  };
}

export { withDynamicHook };
