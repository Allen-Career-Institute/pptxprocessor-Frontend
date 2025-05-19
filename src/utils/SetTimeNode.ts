import { TimingNodeInterface } from "./animation_utils";
import { CommonTimeNode } from "./CommonTimeNode";

export class SetTimeNode extends CommonTimeNode {
  toVal: any;

  constructor() {
    super();
  }

  init = (
    config: any,
    parentNode: TimingNodeInterface | null,
    commonTimeNodeObj: { [key: string]: TimingNodeInterface },
  ) => {
    console.log("Initializing", this.id);

    //   Process the start conditions
    this.processStartCondition(config, parentNode, commonTimeNodeObj);

    this.duration = parseInt(config.dur) || null;
    this.fill = config.fill;
    this.restart = config.restart;
    this.id = config.id;
    if (this.id) commonTimeNodeObj[this.id] = this;

    this.toVal = config.to?.strVal?.val;
  };

  setChildren(children: TimingNodeInterface[]) {
    this.children = children;
    this.children.map((child) => {
      child.setCallbacks(this.onChildBegin, this.onChildComplete);
    });
  }

  onChildBegin = (node: TimingNodeInterface) => {
    this.countBegin++;
    console.log("Child Begin", this.id, this.countBegin);
    const properties = node.getProperties();

    if (properties.target && properties.attributes) {
      const domEl = document.getElementById(properties.target);
      console.log("Searching for dom", properties.target, domEl);
      if (!domEl) {
        console.error("Element not found", properties.target);
        return;
      }
      // Set the final state of the element
      properties.attributes.map((attribute) => {
        if (attribute === "style.visibility") {
          domEl.style.visibility =
            this.toVal === "visible" ? "hidden" : "visible";
          console.log("Setting invisible", domEl.style.visibility);
        }
      });
    }
  };

  onChildComplete = (node: TimingNodeInterface) => {
    this.countEnd++;
    console.log("Child complete", this.id, this.countEnd);
    if (this.countEnd == this.children.length) {
      this.hasCompleted = true;
      this.onComplete && this.onComplete(this);
    }
    const properties = node.getProperties();

    if (properties.target && properties.attributes) {
      const domEl = document.getElementById(properties.target);
      console.log("Searching for dom", properties.target, domEl);
      if (!domEl) {
        console.error("Element not found", properties.target);
        return;
      }
      // Set the final state of the element
      properties.attributes.map((attribute) => {
        if (attribute === "style.visibility") {
          setTimeout(
            () =>
              (domEl.style.visibility =
                this.toVal === "visible" ? "visible" : "hidden"),
            this.duration || 0,
          );
          console.log("Setting invisible", domEl.style.visibility);
        }
      });
    }
  };
}
