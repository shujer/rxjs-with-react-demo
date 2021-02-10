import React from "react";
import { useObservable } from "rxjs-hooks";
import { useInject, useInjector, InjectorContext } from "../utils/useInject";
import ShareService from "./share.service";

const DataA = () => {
  const shareService = useInject(ShareService);
  const toggleStatus = useObservable(() => shareService.toggle$, false);
  return (
    <div>
      <div>current: {`${toggleStatus}`}</div>
      <div>
        <button onClick={() => shareService.toggle()}>toggle</button>
      </div>
    </div>
  );
};

const DataB = () => {
  const shareService = useInject(ShareService);
  const toggleStatus = useObservable(() => shareService.toggle$, false);
  return (
    <div>
      <div>current: {`${toggleStatus}`}</div>
      <div>
        <button onClick={() => shareService.toggle()}>toggle</button>
      </div>
    </div>
  );
};

const SourceApp = () => {
  const injector = useInjector([ShareService]);
  return (
    <InjectorContext.Provider value={injector}>
      <div>
        <DataA></DataA>
        <DataB></DataB>
      </div>
    </InjectorContext.Provider>
  );
};

export default SourceApp;
