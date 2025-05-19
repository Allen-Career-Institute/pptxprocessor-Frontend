import {
  TimingNodeInterface,
  OnCompleteCallback,
  keyFrameType,
} from "./animation_utils";
import { CommonTimeNode } from "./CommonTimeNode";

import { Parser } from "expr-eval";
const parser = new Parser();

const processFormula = (formula: string, variables: any): number => {
  const expression = parser.parse(formula.replace(/#/g, ""));
  return expression.evaluate(variables);
};

export class AnimTimeNode extends CommonTimeNode {
  tavLst: any;

  constructor() {
    super();
  }

  applyKeyframes = (
    domEl: HTMLElement,
    keyFrames: keyFrameType[],
    attribute: string,
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
          keyFrames[index + 1]?.tm,
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
        this.onComplete && this.onComplete(this);
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

  init = (
    config: any,
    parentNode: TimingNodeInterface | null,
    commonTimeNodeObj: { [key: string]: TimingNodeInterface },
  ) => {
    console.log("Initializing", this.id);

    //   Process the start conditions
    this.processStartCondition(config, parentNode, commonTimeNodeObj);

    this.restart = config.restart;
    this.id = config.id;
    if (this.id) commonTimeNodeObj[this.id] = this;

    this.tavLst = config.tavLst;
  };

  onChildBegin = (node: TimingNodeInterface) => {
    this.countBegin++;
    console.log("Child begin", this.id, this.countBegin);
    const properties = node.getProperties();

    if (properties.target && properties.attributes) {
      const domEl = document.getElementById(properties.target);
      console.log(
        "Searching for dom",
        properties.target,
        domEl,
        domEl?.getBoundingClientRect(),
      );
      if (!domEl) {
        console.error("Element not found", properties.target);
        return;
      }

      const variables = {
        ppt_h: document.documentElement.clientHeight,
        ppt_w: document.documentElement.clientWidth,
        ppt_x: domEl.style.x ? parseFloat(domEl.style.x) : 0,
        ppt_y: domEl.style.y ? parseFloat(domEl.style.y) : 0,
      };

      properties.attributes.map((attribute) => {
        let keyFrames: keyFrameType[] = this.tavLst?.tav?.map((tav: any) => {
          const toVal = tav.val?.strVal
            ? processFormula(tav.val?.strVal?.val, variables)
            : tav.val?.fltVal
              ? parseFloat(tav.val?.fltVal.val)
              : tav.val?.intVal
                ? parseInt(tav.val?.intVal.val)
                : 0;
          return {
            toVal: toVal,
            tm: parseInt(tav.tm) || 0,
          };
        });
        const duration = properties.duration || 0;
        const timeScaling = duration / keyFrames[keyFrames.length - 1].tm;
        keyFrames = keyFrames.map((keyFrame) => ({
          toVal: keyFrame.toVal,
          tm: keyFrame.tm * timeScaling,
        }));
        console.log("Keyframes", attribute, keyFrames, variables);
        this.applyKeyframes(domEl, keyFrames, attribute);
      });
    }
  };
}
