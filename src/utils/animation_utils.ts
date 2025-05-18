

export type OnCompleteCallback = (node: TimingNodeInterface) => void;
export type OnBeginCallback = (node: TimingNodeInterface) => void;
export type EmptyFxn = () => void;
export type BeginFxn = () => void;
export type onBeginFxn = (onBegin: BeginFxn) => void;
export type propertiesType = {
  id: string | null;
  fill: string | null;
  restart: string | null;
  duration: number | null;
  target: string | null;
  attributes: string[] | null;
  additive: string | null;
};
export type keyFrameType = { toVal: number; tm: number };


// Define a dummy class
export interface TimingNodeInterface {
  init: (config: any, parentNode: TimingNodeInterface | null, commonTimeNodeObj: { [key: string]: TimingNodeInterface }) => void;
  setCallbacks(onBegin: OnBeginCallback, onComplete: OnCompleteCallback): void;
  setChildren(children: TimingNodeInterface[]): void;
  begin: BeginFxn;
  triggerBeginLst: EmptyFxn;
  addToBegin: onBeginFxn;
  addToEnd: onBeginFxn;
  getProperties: () => propertiesType;
}


export const getList = (element: any): any[] => Array.isArray(element) ? element : [element];