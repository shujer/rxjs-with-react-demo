import { InjectClass } from "./types";

export const registerProvider = (classes: Array<InjectClass>) => {
  const instanceMap = new Map();
  // initial register
  classes.forEach((eachClass) => {
    if (instanceMap.has(eachClass.name)) {
      console.error(`[props classes] `);
    } else {
      instanceMap.set(eachClass.name, new eachClass());
    }
  });
  const getInstance = (
    injectClass: InjectClass
  ): InstanceType<InjectClass> | null => {
    if (!injectClass) {
      return null;
    }
    if (!instanceMap.has(injectClass.name)) {
      instanceMap.set(injectClass.name, new injectClass());
    }
    return instanceMap.get(injectClass.name);
  };

  return { getInstance };
};
