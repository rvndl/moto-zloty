import { ComponentType, useEffect, useState } from "react";

function withDynamicHook<TProps, TModExport = unknown, TMod = unknown>(
  hookName: string,
  importFunc: () => Promise<TMod>,
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
