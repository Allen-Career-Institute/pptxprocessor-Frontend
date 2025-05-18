import { propertiesType, TimingNodeInterface } from "./animation_utils";
import { CommonTimeNode } from "./CommonTimeNode";

export class CbhvrTimeNode extends CommonTimeNode {
  private target: string | null = null;
  private attributes: string[] = [];
  private additive: string | null = null;

  constructor() {
    super();
  }

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

    this.target = config?.tgtEl?.spTgt?.spid;
    this.attributes = Array.isArray(config?.attrNameLst)
      ? config?.attrNameLst?.map((val: any) => val.attrName?.text)
      : [config?.attrNameLst?.attrName?.text as string];
    this.additive = config?.additive || null;
  };

  setChildren(children: TimingNodeInterface[]) {
    this.children = children;
    this.children.map((child) => {
      child.setCallbacks(this.onChildBegin, this.onChildComplete);
    });

    if (children.length > 0) {
      const child = children[0];
      const properties = child.getProperties();
      this.duration = properties.duration ? parseInt(properties.duration.toString()) : null;
      this.fill = properties.fill;
    }
  }

  getProperties = (): propertiesType => {
    return {
      id: this.id,
      target: this.target,
      attributes: this.attributes,
      additive: this.additive,
      fill: this.fill,
      restart: this.restart,
      duration: this.duration,
    };
  };
}
