import {
  BeginFxn,
  propertiesType,
  TimingNodeInterface,
  OnBeginCallback,
  OnCompleteCallback,
  getList
} from "./animation_utils";

export class CommonTimeNode implements TimingNodeInterface {
  id: string | null = null;
  fill: string | null = null;
  restart: string | null = null;
  duration: number | null = null;
  children: Array<TimingNodeInterface> = [];
  onBeginLst: Array<BeginFxn> = [];
  onEndLst: Array<BeginFxn> = [];

  onBegin: OnBeginCallback | null = null;
  onComplete: OnCompleteCallback | null = null;
  hasBegun: boolean = false;
  hasCompleted: boolean = false;

  countBegin: number = 0;
  countEnd: number = 0;

  constructor() {}

  processStartCondition = (
    config: any,
    parentNode: TimingNodeInterface | null,
    commonTimeNodeObj: { [key: string]: TimingNodeInterface }
  ) => {
    if (!config.stCondLst) {
      // Subscribe to parent node's begin event
      if (parentNode) {
        parentNode.addToBegin(() => this.begin());
      }
    } else {
      const condLst = getList(config.stCondLst.cond);

      condLst.map((cond: any) => {
        // cond.tn indicates that we need to subscribe to the begin event of another timing node
        if (cond.tn) {
          const tnId = cond.tn.val;
          const conditionalDelay = cond.delay ? parseInt(cond.delay) : 0;
          const evt = cond.evt;
          if (!commonTimeNodeObj[tnId]) {
            throw new Error(`Timing node ${tnId} not found`);
          }
          const delayExecute = () => setTimeout(this.begin, conditionalDelay);
          if (evt == "onBegin") {
            commonTimeNodeObj[tnId].addToBegin(delayExecute);
          } else if (evt == "onEnd") {
            commonTimeNodeObj[tnId].addToEnd(delayExecute);
          }
        } else if (cond.tgtEl) {
          const targetId = cond.tgtEl.spTgt.spid;
          const domEl = document.getElementById(targetId);
          if (cond.evt === "onClick") {
            if (domEl) {
              domEl.onclick = () => setTimeout(this.begin, parseInt(cond.delay) || 0);
            }
          } else {
            throw new Error(`Invalid event type ${cond.evt}`);
          }
        } else if (
          Object.keys(cond).length === 1 &&
          cond.delay
        ) {
          if (parentNode && cond.delay != "indefinite") {
            parentNode.addToBegin(() =>
              setTimeout(this.begin, parseInt(cond.delay))
            );
          }
        } else {
          // This indicates that there is some start condition we have not handled yet.
          // Please add necessary handling here.
          throw new Error(`Invalid start condition ${JSON.stringify(cond)}`);
        }
      });
    }
  };

  init = (
    config: any,
    parentNode: TimingNodeInterface | null,
    commonTimeNodeObj: { [key: string]: TimingNodeInterface }
  ) => {
    console.log("Initializing", this.id);

    //   Process the start conditions
    this.processStartCondition(config, parentNode, commonTimeNodeObj);

    this.duration = parseInt(config.dur) || null;
    this.fill = config.fill;
    this.restart = config.restart;
    this.id = config.id;
    if (this.id) commonTimeNodeObj[this.id] = this;
  };

  setCallbacks(onBegin: OnBeginCallback, onComplete: OnCompleteCallback) {
    this.onBegin = onBegin;
    this.onComplete = onComplete;
  }

  setChildren(children: TimingNodeInterface[]) {
    this.children = children;
    this.children.map((child) => {
      child.setCallbacks(this.onChildBegin, this.onChildComplete);
    });
  }

  begin = () => {
    console.log("Begin", this.id, this.hasBegun);
    if (this.hasBegun) return;
    this.hasBegun = true;
    this.onBegin && this.onBegin(this);
    // If there are no children, then call the callback onComplete function
    if (this.children.length === 0) this.onComplete && this.onComplete(this);

    // Lastly trigger the subscribers to begin of this node. This will also trigger the begin of the children nodes since they should have subscribed to this node.
    this.triggerBeginLst();
  };

  triggerBeginLst = () => {
    console.log("Trigger begin list", this.id);
    this.onBeginLst.map((item) => item());
  };

  addToBegin = (onBegin: BeginFxn) => {
    if (this.hasBegun)
      throw new Error("Cannot add to begin after begin has been called");
    this.onBeginLst.push(onBegin);
  };

  addToEnd = (onBegin: BeginFxn) => {
    if (this.hasCompleted)
      throw new Error("Cannot add to end after complete has been called");
    this.onEndLst.push(onBegin);
  };

  onChildBegin = (node: TimingNodeInterface) => {
    this.countBegin++;
    console.log("Child begin", this.id, this.countBegin);
  };

  onChildComplete = (node: TimingNodeInterface) => {
    this.countEnd++;
    console.log("Child complete", this.id, this.countEnd);
    if (this.countEnd == this.children.length) {
      this.hasCompleted = true;
      this.onComplete && this.onComplete(this);
    }
  };

  getProperties = (): propertiesType => {
    return {
      id: this.id,
      fill: this.fill,
      restart: this.restart,
      duration: this.duration,
      target: null,
      attributes: null,
      additive: null,
    };
  };
}
