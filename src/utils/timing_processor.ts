import { TimingNodeInterface, getList } from "./animation_utils";
import { CommonTimeNode } from "./CommonTimeNode";
import { SeqTimeNode } from "./SeqTimeNode";
import { SetTimeNode } from "./SetTimeNode";
import { AnimTimeNode } from "./AnimTimeNode";
import { CbhvrTimeNode } from "./CbhvrTimeNode";

// Factory class to generate the right timing node
const generateTimeNode = (attrib: string): TimingNodeInterface => {
  if (attrib == "cTn") {
    return new CommonTimeNode();
  } else if (attrib == "par") {
    return new CommonTimeNode();
  } else if (attrib == "seq") {
    return new SeqTimeNode();
  } else if (attrib == "set") {
    return new SetTimeNode();
  } else if (attrib == "anim") {
    return new AnimTimeNode();
  } else if (attrib == "cBhvr") {
    return new CbhvrTimeNode();
  } else {
    throw new Error(`Unknown attribute: ${attrib}`);
  }
};

const processChild = (
  config: any,
  attrib: string,
  parentNode: TimingNodeInterface | null,
  commonTimeNodeObj: { [key: string]: TimingNodeInterface },
) => {
  const child = generateTimeNode(attrib);
  child.init(config, parentNode, commonTimeNodeObj);
  const childsChildren = processChildren(
    config,
    child,
    attrib,
    commonTimeNodeObj,
  );
  if (childsChildren.length > 0) {
    child.setChildren(childsChildren);
  }
  return child;
};

const processChildren = (
  config: any,
  parentNode: TimingNodeInterface | null,
  parentAttrib: string | null,
  commonTimeNodeObj: { [key: string]: TimingNodeInterface },
): TimingNodeInterface[] => {
  const children: TimingNodeInterface[] = [];
  const attribs = ["cTn", "par", "seq", "set", "anim", "cBhvr"];

  // Loop through each of the attributes and create children nodes

  if (Array.isArray(config)) {
    config.map((element: any) => {
      if (!parentAttrib)
        throw new Error(
          "Parent attribute cannot be null, when config is an array",
        );
      const child = processChild(
        element,
        parentAttrib,
        parentNode,
        commonTimeNodeObj,
      );
      children.push(child);
    });
  } else {
    attribs.map((attrib: string) => {
      if (!config[attrib]) return;
      const child = processChild(
        config[attrib],
        attrib,
        parentNode,
        commonTimeNodeObj,
      );
      children.push(child);
    });
  }

  return children;
};

export const processTiming = (config: any) => {
  const commonTimeNodeObj: { [key: string]: TimingNodeInterface } = {};
  const children = processChildren(config, null, null, commonTimeNodeObj);
  children.map((child) => child.begin());
};
