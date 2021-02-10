import { useRef } from "react";

export const useInstance = <T extends new (...args: any) => any>(
  injectClass: T
): InstanceType<T> => {
  const instance = useRef<InstanceType<any>>();
  return instance.current || (instance.current = new injectClass());
};
