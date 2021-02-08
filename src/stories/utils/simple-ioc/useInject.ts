import { useContext, useRef, createContext } from "react";
import { InjectClass } from "./types";

export const InstanceContext = createContext<{
  getInstance: (injectClass: InjectClass) => any;
}>({ getInstance: () => null });

export const useInject = <T extends InjectClass>(
  injectClass: T
): InstanceType<T> => {
  const instance = useRef<InstanceType<T>>();
  const Injector = useContext(InstanceContext);
  return (
    instance.current || (instance.current = Injector.getInstance(injectClass))
  );
};