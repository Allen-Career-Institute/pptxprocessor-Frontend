import { on } from "events";
import { Parser } from "expr-eval";

export type OnCompleteCallback = () => void;
export type onBeginCallback = () => void;
export type propertiesType = {
  id: string | null;
  delay: number | null;
  fill: string | null;
  restart: string | null;
  duration: number | null;
};
export type fxn = () => void;
export type onBeginFxn = (onBegin: onBeginCallback) => void;
export type cTnResp = {
  init: fxn;
  begin: fxn | null;
  addToBegin: onBeginFxn | null;
  removeFromBegin: onBeginFxn | null;
  addToEnd: onBeginFxn | null;
  removeFromEnd: onBeginFxn | null;
  getProperties: () => propertiesType;
};

export type cBhvrResp = {
  target: string | null;
  attributes: string[] | null;
  additive: string | null;
  cTn: cTnResp;
};

export type keyFrameType = { toVal: number; tm: number };

const emptyCTnResp: cTnResp = {
  init: () => {},
  begin: null,
  addToBegin: null,
  removeFromBegin: null,
  addToEnd: null,
  removeFromEnd: null,
  getProperties: () => {
    return {
      id: null,
      delay: null,
      fill: null,
      restart: null,
      duration: null,
    };
  },
};

const emptyCBhvrResp: cBhvrResp = {
  target: null,
  attributes: null,
  additive: null,
  cTn: emptyCTnResp,
};

const parallel = (
  par: any,
  parentId: string | null,
  onBegin: onBeginCallback,
  onComplete: OnCompleteCallback,
  commonTimeNodeObj: any
): cTnResp => {
  let countBegin = 0;
  let countComplete = 0;
  const children: Array<{ init: () => void }> = [];
  const parLst = Array.isArray(par) ? par : [par];

  const onChildBegin: onBeginCallback = () => {
    countBegin++;
    if (countBegin === children.length) onBegin();
  };

  const onChildComplete: OnCompleteCallback = () => {
    countComplete++;
    if (countComplete === children.length) onComplete();
  };

  parLst.map((child: any) => {
    children.push(
      commonTimeNode(
        child.cTn,
        parentId,
        onChildBegin,
        onChildComplete,
        commonTimeNodeObj
      )
    );
  });

  return {
    ...emptyCTnResp,
    init: () => {
      children.map((child) => child.init());
    },
  };
};

const sequentialUnit = (
  seq: any,
  parentId: string | null,
  onBegin: onBeginCallback,
  onComplete: OnCompleteCallback,
  commonTimeNodeObj: any
): cTnResp => {
  const cTn = commonTimeNode(
    seq.cTn,
    parentId,
    onBegin,
    onComplete,
    commonTimeNodeObj
  );
  // seq.prevCondLst;
  // seq.nextCondLst;
  // seq.concurrent;
  // seq.nextAc;
  return cTn;
};

const sequential = (
  seq: any,
  parentId: string | null,
  onBegin: onBeginCallback,
  onComplete: () => void,
  commonTimeNodeObj: any
): cTnResp => {
  let countBegin = 0;
  let countComplete = 0;
  const children: Array<cTnResp> = [];
  const seqLst = Array.isArray(seq) ? seq : [seq];

  const onChildBegin: onBeginCallback = () => {
    countBegin++;
    if (countBegin === 1) onBegin();
  };

  const onChildComplete: OnCompleteCallback = () => {
    countComplete++;
    if (countComplete === children.length) onComplete();
    else children[countComplete].init();
  };

  seqLst.map((child: any) => {
    children.push(
      sequentialUnit(
        child,
        parentId,
        onChildBegin,
        onChildComplete,
        commonTimeNodeObj
      )
    );
  });

  return {
    ...emptyCTnResp,
    init: () => {
      countComplete = 0;
      children[countComplete].init();
    },
  };
};

const cBhvr = (
  val: any,
  parentId: string | null,
  onBegin: onBeginCallback,
  onComplete: OnCompleteCallback,
  commonTimeNodeObj: any
): cBhvrResp => {
  if (!val) {
    throw new Error("Invalid value provided for cBhvr");
  }
  const target = val?.tgtEl?.spTgt?.spid;
  const attributes: string[] = Array.isArray(val?.attrNameLst)
    ? val?.attrNameLst?.map((val: any) => val.attrName?.text)
    : [val?.attrNameLst?.attrName?.text as string];
  const additive = val?.additive || null;
  let cTn: cTnResp = emptyCTnResp;

  cTn = commonTimeNode(
    val.cTn,
    parentId,
    onBegin,
    onComplete,
    commonTimeNodeObj
  );

  return {
    target,
    attributes,
    additive,
    cTn,
  };
};

const applyKeyframes = (
  domEl: HTMLElement,
  keyFrames: keyFrameType[],
  attribute: string,
  onComplete: OnCompleteCallback
) => {
  console.log("Applying keyframes", keyFrames);
  const startTime = performance.now();

  const animate = (lastValue: number) => () => {
    const currentTime = performance.now() - startTime;
    // console.log("Current time", currentTime);

    // Find the current keyframe range
    const currentFrameIndex = keyFrames.findIndex((frame, index) => {
      console.log(
        "Current frame",
        frame.tm,
        currentTime,
        keyFrames[index + 1]?.tm
      );
      return (
        currentTime >= frame.tm &&
        currentTime < (keyFrames[index + 1]?.tm || Infinity)
      );
    });

    // console.log("Current frame index", currentFrameIndex);
    if (
      currentFrameIndex === -1 ||
      currentFrameIndex === keyFrames.length - 1
    ) {
      // Animation is complete
      if (currentFrameIndex === keyFrames.length - 1) {
        // console.log("Moving Y to ", keyFrames[currentFrameIndex].toVal);
        if (attribute === "ppt_y") {
          domEl.style.transform = `translateY(${keyFrames[currentFrameIndex].toVal}px)`; // Apply final value
        } else if (attribute === "ppt_x") {
          domEl.style.transform = `translateX(${keyFrames[currentFrameIndex].toVal}px)`; // Apply final value
        }
      }
      onComplete();
      return;
    }

    // Get the current and next keyframes
    const currentFrame = keyFrames[currentFrameIndex];
    const nextFrame = keyFrames[currentFrameIndex + 1];

    // Calculate progress between the current and next keyframe
    const progress =
      (currentTime - currentFrame.tm) / (nextFrame.tm - currentFrame.tm);

    // Interpolate the value
    const interpolatedValue =
    currentFrame.toVal + progress * (nextFrame.toVal - currentFrame.toVal);
    // Apply the interpolated value to the DOM element
    // console.log("Moving Y to ", interpolatedValue);
    if (attribute === "ppt_y") {
      domEl.style.transform = `translateY(${interpolatedValue}px)`; // Example: updating the Y position
    } else if (attribute === "ppt_x") {
      domEl.style.transform = `translateX(${interpolatedValue}px)`; // Example: updating the X position
    }

    // Continue the animation
    requestAnimationFrame(animate(interpolatedValue));
  };

  // Start the animation
  requestAnimationFrame(animate(0));
};

const set = (
  val: any,
  parentId: string | null,
  onBegin: onBeginCallback,
  onComplete: OnCompleteCallback,
  commonTimeNodeObj: any
): cTnResp => {
  let cBhvrResult = emptyCBhvrResp;

  const onChildBegin: onBeginCallback = () => {
    if (cBhvrResult.target && cBhvrResult.attributes) {
      const domEl = document.getElementById(cBhvrResult.target);
      console.log("Searching for dom", cBhvrResult.target, domEl);
      if (!domEl) {
        console.error("Element not found", cBhvrResult.target);
        return;
      }
      cBhvrResult.attributes.map((attribute) => {
        if (attribute === "style.visibility") {
          const toVal = val.to?.strVal?.val;
          console.log("Setting invisible");
          domEl.style.visibility = toVal === "visible" ? "hidden" : "visible";
          setTimeout(() => {
            console.log("Setting visible");
            domEl.style.visibility = toVal;
            // Run the animation
            onComplete();
          }, cBhvrResult.cTn?.getProperties().delay || 0);
        }
      });
    }
    onBegin();
  };

  const onChildComplete: OnCompleteCallback = () => {};

  cBhvrResult = cBhvr(
    val.cBhvr,
    parentId,
    onChildBegin,
    onChildComplete,
    commonTimeNodeObj
  );
  return cBhvrResult.cTn;
};

const parser = new Parser();

const processFormula = (formula: string, variables: any): number => {
  const expression = parser.parse(formula.replace(/#/g, ""));
  return expression.evaluate(variables);
};

const anim = (
  val: any,
  parentId: string | null,
  onBegin: onBeginCallback,
  onComplete: OnCompleteCallback,
  commonTimeNodeObj: any
): cTnResp => {
  let cBhvrResult = emptyCBhvrResp;

  const onChildBegin: onBeginCallback = () => {
    if (cBhvrResult.target && cBhvrResult.attributes) {
      const domEl = document.getElementById(cBhvrResult.target);
      console.log("Searching for dom", cBhvrResult.target, domEl, domEl?.getBoundingClientRect());
      if (!domEl) {
        console.error("Element not found", cBhvrResult.target);
        return;
      }

    const variables = {
      ppt_h: document.documentElement.clientHeight,
      ppt_w: document.documentElement.clientWidth,
      ppt_x: domEl.style.x? parseFloat(domEl.style.x) : 0,
      ppt_y: domEl.style.y? parseFloat(domEl.style.y) : 0,
    };

      cBhvrResult.attributes.map((attribute) => {
        let keyFrames: keyFrameType[] = val.tavLst?.tav?.map((tav: any) => ({
          toVal: processFormula(tav.val?.strVal?.val, variables),
          tm: parseInt(tav.tm) || 0,
        }));
        const duration = cBhvrResult.cTn?.getProperties().duration || 0;
        const timeScaling = duration / keyFrames[keyFrames.length - 1].tm;
        keyFrames = keyFrames.map((keyFrame) => ({
          toVal: keyFrame.toVal,
          tm: keyFrame.tm * timeScaling,
        }));
        console.log("Keyframes", attribute, keyFrames, variables);
        applyKeyframes(domEl, keyFrames, attribute, onComplete);
      });
    }
    onBegin();
  };

  const onChildComplete: OnCompleteCallback = () => {};

  cBhvrResult = cBhvr(
    val.cBhvr,
    parentId,
    onChildBegin,
    onChildComplete,
    commonTimeNodeObj
  );
  return cBhvrResult.cTn;
};

export const commonTimeNode = (
  cTn: any,
  parentId: string | null,
  onBegin: onBeginCallback,
  onComplete: OnCompleteCallback,
  commonTimeNodeObj: any
): cTnResp => {
  console.log("Common time node", cTn);
  if (!cTn) {
    throw new Error("Invalid common time node (cTn) provided");
  }
  if (!commonTimeNodeObj) commonTimeNodeObj = {};
  let countBegin = 0;
  let countComplete = 0;
  const children: Array<cTnResp> = [];
  const onAnimateList: Array<cTnResp> = [];
  const onBeginLst: Array<onBeginCallback> = [];
  const onEndLst: Array<onBeginCallback> = [];

  const onChildBegin: onBeginCallback = () => {
    countBegin++;
  };

  //   Initialize the children recursively
  const onChildComplete: OnCompleteCallback = () => {
    countComplete++;
    //Check if countComplete is equal to the number of children plus one for the self animation
    if (countComplete == children.length + onAnimateList.length) {
      onEndLst.map((item) => item());
      onComplete();
    }
  };

  let delay: number | null = null;
  let duration: number | null = parseInt(cTn?.dur) || null;
  let fill: string | null = cTn?.fill;
  let restart: string | null = cTn?.restart;
  let id: string | null = cTn?.id;

  const returnObj: cTnResp = {
    init: () => {
      console.log("Initializing", id, delay);
      children.map((child) => child.init());
      if (delay != null && returnObj.begin) {
        console.log("Setting delay", delay);
        setTimeout(returnObj.begin, delay);
      }
    },
    begin: () => {
      console.log("Begin", id, onAnimateList.length);
      onAnimateList.length === 0 && onBegin();
      onAnimateList.length + children.length === 0 && onComplete();
      onAnimateList.map((item) => item.init());
      onBeginLst.map((item) => item());
    },
    addToBegin: (onBegin: onBeginCallback) => {
      onBeginLst.push(onBegin);
    },
    removeFromBegin: (onBegin: onBeginCallback) => {
      const index = onBeginLst.findIndex((item) => item === onBegin);
      if (index !== -1) {
        onBeginLst.splice(index, 1);
      }
    },
    addToEnd: (onBegin: onBeginCallback) => {
      onEndLst.push(onBegin);
    },
    removeFromEnd: (onBegin: onBeginCallback) => {
      const index = onEndLst.findIndex((item) => item === onBegin);
      if (index !== -1) {
        onEndLst.splice(index, 1);
      }
    },
    getProperties: () => {
      return {
        id,
        delay,
        fill,
        restart,
        duration,
      };
    },
  };

  if (id) commonTimeNodeObj[id] = returnObj;

  if (cTn?.par) {
    const parList = Array.isArray(cTn.par) ? cTn.par : [cTn.par];
    parList.map((par: any) => {
      children.push(
        parallel(
          par,
          parentId,
          onChildBegin,
          onChildComplete,
          commonTimeNodeObj
        )
      );
    });
  }
  if (cTn?.seq) {
    const seqList = Array.isArray(cTn.seq) ? cTn.seq : [cTn.seq];
    seqList.map((seq: any) => {
      children.push(
        sequential(
          seq,
          parentId,
          onChildBegin,
          onChildComplete,
          commonTimeNodeObj
        )
      );
    });
  }

  if (cTn.set) {
    const setList = Array.isArray(cTn.set) ? cTn.set : [cTn.set];
    setList.map((setItem: any) => {
      onAnimateList.push(
        set(setItem, parentId, onBegin, onChildComplete, commonTimeNodeObj)
      );
    });
  }

  if (cTn.anim) {
    const animList = Array.isArray(cTn.anim) ? cTn.anim : [cTn.anim];
    animList.map((animItem: any) => {
      onAnimateList.push(
        anim(animItem, parentId, onBegin, onChildComplete, commonTimeNodeObj)
      );
    });
  }

  //   Process the condition
  if (cTn.stCondLst) {
    const condLst = Array.isArray(cTn.stCondLst.cond)
      ? cTn.stCondLst.cond
      : [cTn.stCondLst.cond];
    condLst.map((cond: any) => {
      if (cond.tn) {
        const tnId = cond.tn.val;
        const conditionalDelay = cond.delay ? parseInt(cond.delay) : 0;
        const evt = cond.evt;
        if (evt == "onBegin") {
          commonTimeNodeObj[tnId].addToBegin(
            () =>
              returnObj.begin && setTimeout(returnObj.begin, conditionalDelay)
          );
        } else if (evt == "onEnd") {
          commonTimeNodeObj[tnId].addToEnd(
            () =>
              returnObj.begin && setTimeout(returnObj.begin, conditionalDelay)
          );
        }
      } else if (Object.keys(cond).length === 1 && cond.delay) {
        if (cond.delay != "indefinite") {
          delay = parseInt(cond.delay);
        }
      }
    });
  } else {
    if (parentId) {
      commonTimeNodeObj[parentId].addToBegin(returnObj.begin);
    } else {
      delay = 0;
    }
  }

  return returnObj;
};
