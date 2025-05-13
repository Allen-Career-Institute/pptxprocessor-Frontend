import React, { useEffect, useState, JSX } from "react";
import { extractSolidFillColor } from "../utils/extract_utils";
import { emuToPx, emuRotationToDegrees } from "../utils/helper_utils";
import { NodeAttribs, StyleConstants } from "../utils/constants";

interface PresetGeometryProps {
  node: any;
  zIndex: number;
  mediaPath: string;
  prstGeom: any;
  style: any;
  maxDim: { width: number; height: number };
  childFrame: { off: { x: number; y: number }; ext: { x: number; y: number } };
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
  const [arcStyle,setArcStyle]=useState({})
  useEffect(() => {
    if (!(NodeAttribs.PROPERTIES in node)) return;
    if (!("blipFill" in node[NodeAttribs.PROPERTIES])) return;
    if (!("link" in node[NodeAttribs.PROPERTIES].blipFill)) return;
    setImageUrl(
      mediaPath + node[NodeAttribs.PROPERTIES].blipFill.link.slice(3)
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
        } else if (prst === "line") {
          border = "";
          const flipH = node[NodeAttribs.PROPERTIES].xfrm.flipH
            ? node[NodeAttribs.PROPERTIES].xfrm.flipH == "1"
              ? false
              : true
            : true;
          const flipV = node[NodeAttribs.PROPERTIES].xfrm.flipV
            ? node[NodeAttribs.PROPERTIES].xfrm.flipV == "1"
              ? true
              : false
            : false;
          const color = extractSolidFillColor(
            node[NodeAttribs.PROPERTIES].ln.solidFill
          );
          const bg_color = extractSolidFillColor(
            node[NodeAttribs.PROPERTIES].solidFill
          );
          const lineWidth = emuToPx(
            node[NodeAttribs.PROPERTIES].ln.w,
            maxDim.width,
            0
          );
          const x = parseFloat(style.width.replace("px", ""));
          const y = parseFloat(style.height.replace("px", ""));
          const viewWidth = 4 * x || 100;
          const viewHeight = 4 * y || 100;
          const head =
            node[NodeAttribs.PROPERTIES]?.ln?.headEnd?.type === "arrow"
              ? true
              : false;
          const tail =
            node[NodeAttribs.PROPERTIES]?.ln?.tailEnd?.type === "arrow"
              ? true
              : false;

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
          });
        } else if (prst === "Arc") {
          const startAngle =
            (emuRotationToDegrees(prstGeom?.avLst?.gd[0]?.fmla.split(" ")[1]) *
              Math.PI) /
            180;
          const endAngle =
            (emuRotationToDegrees(prstGeom?.avLst?.gd[1]?.fmla.split(" ")[1]) *
              Math.PI) /
            180;
          const color = extractSolidFillColor(
            node[NodeAttribs.PROPERTIES].ln.solidFill
          );
          const lineWidth = emuToPx(
            node[NodeAttribs.PROPERTIES].ln.w,
            maxDim.width,
            0
          );

          const cx = childFrame.off.x + childFrame.ext.x / 2; // Center x-coordinate
          const cy = childFrame.off.y + childFrame.ext.y / 2; // Center y-coordinate
          const radiusX = childFrame.ext.x / 2; // Horizontal radius
          const radiusY = childFrame.ext.y / 2; // Vertical radius

          const x1 = cx + radiusX * Math.cos(startAngle);
          const y1 = cy + radiusY * Math.sin(startAngle);
          const x2 = cx + radiusX * Math.cos(endAngle);
          const y2 = cy + radiusY * Math.sin(endAngle);
          const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";
          setArcStyle({
            startAngle,
            endAngle,
            color,
            lineWidth
          })

        }
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
  }: LineStyle): JSX.Element => {
    return (
      <svg
        width="2000"
        height="2000"
        viewBox={`-1000 -1000 2000 2000`}
        style={{ position: "absolute", left: "-1000px", top: "-1000px" }}
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
          />
        ) : (
          <line
            x1={`${x1}px`}
            y1={`${y1}px`}
            x2={`${x2}px`}
            y2={`${y2}px`}
            stroke={color}
            strokeWidth={`${lineWidth}px`}
          />
        )}
      </svg>
    );
  };

  const renderArc = () => {
    // Calculate start and end angles in radians
    const startAngle =
      (emuRotationToDegrees(prstGeom?.avLst?.gd[0]?.fmla.split(" ")[1]) *
        Math.PI) /
      180;
    const endAngle =
      (emuRotationToDegrees(prstGeom?.avLst?.gd[1]?.fmla.split(" ")[1]) *
        Math.PI) /
      180;
  
    // Extract color and line width
    const color = extractSolidFillColor(node[NodeAttribs.PROPERTIES].ln.solidFill)||"black";
    const lineWidth = emuToPx(node[NodeAttribs.PROPERTIES].ln.w, maxDim.width, 0);
  
    // Calculate center and radius
    const cx = childFrame.off.x + childFrame.ext.x / 2; // Center x-coordinate
    const cy = childFrame.off.y + childFrame.ext.y / 2; // Center y-coordinate
    const radiusX = childFrame.ext.x / 2; // Horizontal radius
    const radiusY = childFrame.ext.y / 2; // Vertical radius
  
    // Calculate start and end points
    const x1 = cx + radiusX * Math.cos(startAngle);
    const y1 = cy + radiusY * Math.sin(startAngle);
    const x2 = cx + radiusX * Math.cos(endAngle);
    const y2 = cy + radiusY * Math.sin(endAngle);
  
    // Determine if the arc is a large arc (greater than 180 degrees)
    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";
  
    // Create the SVG path for the arc
    const d = `
      M ${x1} ${y1}
      A ${radiusX} ${radiusY} 0 ${largeArcFlag} 1 ${x2} ${y2}
    `;
  
    // Render the arc
    return (
      <svg
        width={childFrame.ext.x}
        height={childFrame.ext.y}
        style={{
          position: "absolute",
          left: `${childFrame.off.x}px`,
          top: `${childFrame.off.y}px`,
        }}
      >
        <path d={d} fill="none" stroke={color} strokeWidth={lineWidth} />
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
         {prstGeom.prst==="arc"&&renderArc()}
      {imageUrl && (
        <img src={imageUrl} style={{ ...style, left: "0px", top: "0px" }} />
      )}
      {renderChildren(node, zIndex, childFrame)}
    </div>
  );
};

export default PresetGeometry;
