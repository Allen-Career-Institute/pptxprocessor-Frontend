import {
  TimingNodeInterface,
  getList,
} from "./animation_utils";
import { CommonTimeNode } from "./CommonTimeNode";

export class SeqTimeNode extends CommonTimeNode {
  constructor() {
    super();
  }

  private processPrevCondition = (
    config: any,
    parentNode: TimingNodeInterface | null,
    commonTimeNodeObj: { [key: string]: TimingNodeInterface }
  ) => {
    if (!config.prevCondLst) return;
    const condLst = getList(config.prevCondLst.cond);

    condLst.map((cond: any) => {});
  };

  private processNextCondition = (
    config: any,
    parentNode: TimingNodeInterface | null,
    commonTimeNodeObj: { [key: string]: TimingNodeInterface }
  ) => {
    if (!config.prevCondLst) return;
    const condLst = getList(config.prevCondLst.cond);

    condLst.map((cond: any) => {});
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
    this.processPrevCondition(config, this, commonTimeNodeObj);
    this.processNextCondition(config, this, commonTimeNodeObj);
  };

  triggerBeginLst = () => {
    console.log("Trigger begin list", this.id);

    // Trigger the begin of the first child node
    this.onBeginLst.length > 0 && this.onBeginLst[0]();
  };

  onChildBegin = (node: TimingNodeInterface) => {
    this.countBegin++;
    console.log("Child begin", this.id, this.countBegin);
  };

  onChildComplete = (node: TimingNodeInterface) => {
    this.countEnd++;
    console.log("Child complete", this.id, this.countEnd);
    if (this.onBeginLst.length > this.countEnd) {
      // Trigger the next child node
      this.onBeginLst[this.countEnd]();
    }
    if (this.countEnd == this.children.length) {
      this.hasCompleted = true;
      this.onComplete && this.onComplete(this);
    }
  };
}
