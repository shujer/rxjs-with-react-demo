import {
  useContext,
  useRef,
  createContext,
  useEffect,
  useCallback,
} from "react";
import { useInstance } from "./useInstance";

export type InjectClass = new (...args: any) => any;

export const InjectorContext = createContext<{
  getInstance: (injectClass: InjectClass) => any;
}>({ getInstance: () => null });

export const useInject = <T extends InjectClass>(
  injectClass: T
): InstanceType<T> => {
  const instance = useRef<InstanceType<T>>();
  const Injector = useContext(InjectorContext);
  return (
    instance.current || (instance.current = Injector.getInstance(injectClass))
  );
};

export const useInjector = <T extends InjectClass = any>(classes: Array<T>) => {
  const instanceMap = useInstance(Map) as Map<string, InstanceType<T>>;
  useEffect(() => {
    classes.forEach((eachClass) => {
      if (!instanceMap.has(eachClass.name)) {
        instanceMap.set(eachClass.name, new eachClass());
      }
    });
  }, [classes, instanceMap]);

  const getInstance = useCallback(
    (injectClass: T): InstanceType<T> => {
      if (!instanceMap.has(injectClass.name)) {
        instanceMap.set(injectClass.name, new injectClass());
      }
      return instanceMap.get(injectClass.name)!;
    },
    [instanceMap]
  );
  return { getInstance };
};
