import React, { useEffect, useState, JSX } from "react";
import { extractDash, extractSolidFillColor } from "../utils/extract_utils";
import { emuToPx, emuRotationToDegrees } from "../utils/helper_utils";
import { NodeAttribs, StyleConstants } from "../utils/constants";

interface PresetGeometryProps {
  node: any;
  zIndex: number;
  mediaPath: string;
  prstGeom: any;
  style: any;
  maxDim: { width: number; height: number };
  childFrame: {
    off: { x: number; y: number };
    ext: { x: number; y: number };
  };
  renderChildren: (node: any, zIndex: number, childFrame: any) => JSX.Element;
}

interface LineStyle {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  flipH: boolean;
  flipV: boolean;
  lineWidth: number;
  color: string;
  viewWidth: number;
  viewHeight: number;
  head: boolean;
  tail: boolean;
  dash: object;
}

interface ArcStyle {
  cx: number;
  cy: number;
  r: number;
  startAngle: number;
  endAngle: number;
  lineWidth: number;
  color: string;
  viewWidth: number;
  viewHeight: number;
}

interface EndStyle {
  x: number;
  y: number;
  flipH: boolean;
  flipV: boolean;
  lineWidth: number;
  color: string;
  head: string;
  tail: string;
}

const PresetGeometry: React.FC<PresetGeometryProps> = ({
  node,
  zIndex,
  mediaPath,
  prstGeom,
  style,
  maxDim,
  childFrame,
  renderChildren,
}) => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [styleCss, setStyleCss] = useState<any>({});
  const [lineStyle, setLineStyle] = useState<LineStyle>();
  const [arcStyle, setArcStyle] = useState<ArcStyle>();

  console.log("PresetGeometry node:", node.name, node._asset, node._type);

  useEffect(() => {
    if (!(NodeAttribs.PROPERTIES in node)) return;
    if (!("blipFill" in node[NodeAttribs.PROPERTIES])) return;
    if (!("link" in node[NodeAttribs.PROPERTIES].blipFill)) return;
    setImageUrl(
      mediaPath + node[NodeAttribs.PROPERTIES].blipFill.link.slice(3),
    );
  }, []);

  useEffect(() => {
    let { border, borderRadius } = style;
    if (prstGeom && style) {
      border = style.border;

      const scalingFactor = maxDim.width / 1280;
      const prst = prstGeom.prst;

      if (prst) {
        if (prst === "roundRect") {
          const cornerAdj = prstGeom.avLst?.gd?.fmla.split(" ")[1];
          if (cornerAdj) {
            borderRadius = `${(parseInt(cornerAdj) / 1000) * scalingFactor}px`;
          }
        } else if (prst === "ellipse") {
          borderRadius = "50%";
        } else if (prst === "arc") {
          border = "";
          const color = extractSolidFillColor(node._properties.ln.solidFill);
          const lineWidth = emuToPx(node._properties.ln.w, maxDim.width, 0);
          const x = parseFloat(style.width.replace("px", ""));
          const y = parseFloat(style.height.replace("px", ""));
          const viewWidth = 4 * x || 100;
          const viewHeight = 4 * y || 100;

          // Get arc parameters from the geometry
          const adj1 = prstGeom.avLst?.gd
            ?.find((g: any) => g.name === "adj1")
            ?.fmla.split(" ")[1];
          const adj2 = prstGeom.avLst?.gd
            ?.find((g: any) => g.name === "adj2")
            ?.fmla.split(" ")[1];

          // Convert EMU angles to degrees
          const startAngle = adj1 ? parseInt(adj1) / 60000 : 0;
          const endAngle = adj2 ? parseInt(adj2) / 60000 : 360;

          setArcStyle({
            cx: x / 2,
            cy: y / 2,
            r: Math.min(x, y) / 2,
            startAngle,
            endAngle,
            lineWidth,
            color,
            viewWidth,
            viewHeight,
          });
        } else if (prst === "line") {
          border = "";
          const flipH = node[NodeAttribs.PROPERTIES].xfrm.flipH
            ? node[NodeAttribs.PROPERTIES].xfrm.flipH == "1"
              ? true
              : false
            : true;
          const flipV = node[NodeAttribs.PROPERTIES].xfrm.flipV
            ? node[NodeAttribs.PROPERTIES].xfrm.flipV == "1"
              ? true
              : false
            : false;
          const color = extractSolidFillColor(
            node[NodeAttribs.PROPERTIES].ln.solidFill,
          );
          const dash = extractDash(node[NodeAttribs.PROPERTIES].ln?.prstDash);
          const bg_color = extractSolidFillColor(
            node[NodeAttribs.PROPERTIES].solidFill,
          );
          const lineWidth = emuToPx(
            node[NodeAttribs.PROPERTIES].ln.w,
            maxDim.width,
            0,
          );
          const x = parseFloat(style.width.replace("px", ""));
          const y = parseFloat(style.height.replace("px", ""));
          const viewWidth = 4 * x || 100;
          const viewHeight = 4 * y || 100;
          let head = false;
          let tail = false;
          let paths = node[NodeAttribs.PROPERTIES]?.ln;
          if (paths) {
            if (paths.headEnd && paths.headEnd.type !== "none") head = true;
            if (paths.tailEnd && paths.tailEnd.type !== "none") tail = true;
          }
          // node[NodeAttribs.PROPERTIES]?.ln?.headEnd?.type!=="none"
          //   ? true
          //   : false;

          // node[NodeAttribs.PROPERTIES]?.ln?.tailEnd?.type !=="none"
          //   ? true
          //   : false;

          const x1 = flipH ? x : 0;
          const y1 = flipV ? 0 : y;
          const x2 = flipH ? 0 : x;
          const y2 = flipV ? y : 0;
          setLineStyle({
            x1,
            y1,
            x2,
            y2,
            flipH,
            flipV,
            lineWidth,
            color,
            viewWidth,
            viewHeight,
            head,
            tail,
            dash,
          });
        }
        // else if (prst === "arc") {
        //   border = "";
        //   const color = extractSolidFillColor(node._properties.ln.solidFill);
        //   const lineWidth = emuToPx(node._properties.ln.w, maxDim.width, 0);
        //   const x = parseFloat(style.width.replace("px", ""));
        //   const y = parseFloat(style.height.replace("px", ""));
        //   const viewWidth = 4 * x || 100;
        //   const viewHeight = 4 * y || 100;

        //   // Get arc parameters from the geometry
        //   const adj1 = prstGeom.avLst?.gd
        //     ?.find((g: any) => g.name === "adj1")
        //     ?.fmla.split(" ")[1];
        //   const adj2 = prstGeom.avLst?.gd
        //     ?.find((g: any) => g.name === "adj2")
        //     ?.fmla.split(" ")[1];

        //   // Convert EMU angles to degrees
        //   const startAngle = adj1 ? parseInt(adj1) / 60000 : 0;
        //   const endAngle = adj2 ? parseInt(adj2) / 60000 : 360;

        //   setArcStyle({
        //     cx: x / 2,
        //     cy: y / 2,
        //     r: Math.min(x, y) / 2,
        //     startAngle,
        //     endAngle,
        //     lineWidth,
        //     color,
        //     viewWidth,
        //     viewHeight,
        //   });
        // }
      }
    }
    // if (borderRadius) {
    setStyleCss({
      ...style,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius,
      border,
      overflow: "visible",
    });
  }, [prstGeom, style]);

  const renderArrow = ({
    x1,
    y1,
    x2,
    y2,
    flipH,
    flipV,
    lineWidth,
    color,
    viewWidth,
    viewHeight,
    head,
    tail,
    dash,
  }: LineStyle): JSX.Element => {
    return (
      <svg
        width="2000"
        height="2000"
        viewBox={`-1000 -1000 2000 2000`}
        style={{
          position: "absolute",
          left: "-1000px",
          top: "-1000px",
        }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="context-stroke" />
          </marker>
          <marker
            id="arrowtail"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="10 0, 0 3.5, 10 7" fill="context-stroke" />
          </marker>
        </defs>
        {head && tail ? (
          <line
            x1={`${x1}px`}
            y1={`${y1}px`}
            x2={`${x2}px`}
            y2={`${y2}px`}
            stroke={color}
            strokeWidth={`${lineWidth}px`}
            markerStart="url(#arrowtail)"
            markerEnd="url(#arrowhead)"
            {...dash}
          />
        ) : head ? (
          <line
            x1={`${x1}px`}
            y1={`${y1}px`}
            x2={`${x2}px`}
            y2={`${y2}px`}
            stroke={color}
            strokeWidth={`${lineWidth}px`}
            markerEnd="url(#arrowhead)"
            {...dash}
          />
        ) : tail ? (
          <line
            x1={`${x1}px`}
            y1={`${y1}px`}
            x2={`${x2}px`}
            y2={`${y2}px`}
            stroke={color}
            strokeWidth={`${lineWidth}px`}
            markerStart="url(#arrowtail)"
            {...dash}
          />
        ) : (
          <line
            x1={`${x1}px`}
            y1={`${y1}px`}
            x2={`${x2}px`}
            y2={`${y2}px`}
            stroke={color}
            strokeWidth={`${lineWidth}px`}
            {...dash}
          />
        )}
      </svg>
    );
  };

  const renderArc = ({
    cx,
    cy,
    r,
    startAngle,
    endAngle,
    lineWidth,
    color,
    viewWidth,
    viewHeight,
  }: ArcStyle): JSX.Element => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Calculate start and end points
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);

    // Create arc path
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    const pathData = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`;

    return (
      <svg
        width={viewWidth}
        height={viewHeight}
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        style={{ position: "absolute", left: "0px", top: "0px" }}
      >
        <path d={pathData} fill="none" stroke={color} strokeWidth={lineWidth} />
      </svg>
    );
  };

  return (
    <div
      key={node[NodeAttribs.ASSET]}
      className={`${node[NodeAttribs.TYPE]} prstGeom ${
        node.name ? node.name : ""
      }`}
      id={node.id ? node.id : node[NodeAttribs.ASSET]}
      style={styleCss}
    >
      {lineStyle && renderArrow(lineStyle)}
      {arcStyle && renderArc(arcStyle)}
      {imageUrl && (
        <img src={imageUrl} style={{ ...style, left: "0px", top: "0px" }} />
      )}
      <>{renderChildren(node, zIndex, childFrame)}</>
    </div>
  );
};

export default PresetGeometry;
