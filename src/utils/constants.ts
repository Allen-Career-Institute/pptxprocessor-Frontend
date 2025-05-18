export const NodeAttribs = {
  TYPE: "_type",
  CHILDREN: "_children",
  PROPERTIES: "_properties",
  ASSET: "_asset",
};

export const SlideTypes = {
  SLIDE: "cSld",
  SHAPE_TREE: "spTree",
  GROUP_SHAPE: "grpSp",
  CONNECTION_SHAPE: "cxnSp",
  PICTURE: "pic",
  TEXT_BODY: "txBody",
  TEXT_PARAGRAPH: "p",
  TEXT_RUN: "r",
  CUSTOM_GEOMETRY: "custGeom",
  PRESET_GEOMETRY: "prstGeom",
  ALTERNATE_CONTENT: "AlternateContent",
  FALLBACK: "Fallback",
  SHAPE: "sp",
};

export const AnimationAttribs = {
  PARALLEL: "par",
  SEQUENTIAL: "seq",
  COMMON_TIME_NODE: "cTn",
  CONDITION: "cond",
  START_CONDITION_LIST: "stCondLst",
  PREV_CONDITION_LIST: "prevCondLst",
  NEXT_CONDITION_LIST: "nextCondLst",
  DELAY: "delay",
}

export const StyleConstants = {
  INHERIT: "inherit",
  AUTO: "auto",
  NONE: "none",
  ABSOLUTE: "absolute" as const,
};
