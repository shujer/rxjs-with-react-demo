import { useContext, useRef, createContext } from "react";

export interface InjectClass {
  new (): any;
}

export const InstanceContext = createContext<{
  getInstance: (injectClass: InjectClass) => any;
}>({ getInstance: () => null });

export const useInstance = <T extends InjectClass>(
  injectClass: T
): InstanceType<T> => {
  const instance = useRef<InstanceType<T>>();
  const Injector = useContext(InstanceContext);
  return (
    instance.current || (instance.current = Injector.getInstance(injectClass))
  );
};

export const installInstance = (classes: Array<InjectClass>) => {
  const instanceMap = new Map();
  // initial register
  classes.forEach((eachClass) => {
    if (instanceMap.has(eachClass.name)) {
      console.error(`[props classes] class ${eachClass.name} already install`);
    } else {
      instanceMap.set(eachClass.name, new eachClass());
    }
  });
  const getInstance = (
    injectClass: InjectClass
  ): InstanceType<InjectClass> | null => {
    if (!instanceMap.has(injectClass.name)) {
      instanceMap.set(injectClass.name, new injectClass());
    }
    return instanceMap.get(injectClass.name);
  };

  return { getInstance };
};
