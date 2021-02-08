import { useRef } from "react";

export interface InstanceClass {
  new (): any;
}

export const useInstance = <T extends InstanceClass>(
  injectClass: T
): InstanceType<T> => {
  const instance = useRef<InstanceType<T>>();
  return instance.current || (instance.current = new injectClass());
};
