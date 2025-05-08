import React, { useEffect, useState, JSX } from "react";
import { extractSolidFillColor } from "../utils/extract_utils";
import { emuToPx } from "../utils/helper_utils";

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
  x: number;
  y: number;
  flipH: boolean;
  flipV: boolean;
  lineWidth: number;
  color: string;
  viewWidth: number;
  viewHeight: number;
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

  console.log("PresetGeometry node:", node.name, node.asset, node.type);

  useEffect(() => {
    if (!("properties" in node)) return;
    if (!("blipFill" in node.properties)) return;
    if (!("link" in node.properties.blipFill)) return;
    setImageUrl(mediaPath + node.properties.blipFill.link.slice(3));
  }, []);

  useEffect(() => {
    let {border, borderRadius} = style;
    if (prstGeom && style) {
      border = style.border;
      console.log(
        "Style",
        node.name,
        node.asset,
        style.left,
        style.top,
        style.width,
        style.height,
        node.properties.xfrm.flipH
      );
      const scalingFactor = maxDim.width / 1280;
      const prst = prstGeom.prst;

      if (prst) {
        if (prst === "roundRect") {
          const cornerAdj = prstGeom.avLst?.gd?.fmla.split(" ")[1];
          if (cornerAdj) {
            borderRadius = `${(parseInt(cornerAdj) / 1000) * scalingFactor}px`;
          }
        } else if (prst === "ellipse") {
          console.log("Got ellipse", node.asset);
          borderRadius = "50%";
        } else if (prst === "line") {
          border = "";
          const flipH = node.properties.xfrm.flipH ? node.properties.xfrm.flipH == "1" ? true : false : false;
          const flipV = node.properties.xfrm.flipV ? node.properties.xfrm.flipV == "1" ? true : false : false;
          const color = extractSolidFillColor(node.properties.ln.solidFill);
          const lineWidth = emuToPx(node.properties.ln.w, maxDim.width, 0);
          const x = parseFloat(style.width.replace("px", ""));
          const y = parseFloat(style.height.replace("px", ""));
          const viewWidth = 4*x || 100;
          const viewHeight = 4*y || 100;
          setLineStyle({ x, y, flipH, flipV, lineWidth, color, viewWidth, viewHeight });
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
    // } else {
    //   setStyleCss({
    //     ...style,
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     borderRadius: "",
    //     border
    //   });
    // }
  }, [prstGeom, style]);

  const renderArrow = ({
      x,
      y,
      flipH,
      flipV,
      lineWidth,
      color,
      viewWidth,
      viewHeight
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
        {node.properties.ln?.headEnd? node.properties.ln?.tailEnd? 
        <line
          x1={`${flipV ? 0 : x}px`}
          y1={`${flipH ? 0 : y}px`}
          x2={`${flipV ? x : 0}px`}
          y2={`${flipH ? y : 0}px`}
          stroke={color}
          stroke-width={`${lineWidth}px`}
          marker-end="url(#arrowhead)"
          marker-start="url(#arrowtail)"
          /> : 
        <line
          x1={`${flipV ? x : 0}px`}
          y1={`${flipH ? y : 0}px`}
          x2={`${flipV ? 0 : x}px`}
          y2={`${flipH ? 0 : y}px`}
          stroke={color}
          stroke-width={`${lineWidth}px`}
          marker-end="url(#arrowhead)"
        /> : node.properties.ln?.tailEnd? 
        <line
          x1={`${flipV ? x : 0}px`}
          y1={`${flipH ? y : 0}px`}
          x2={`${flipV ? 0 : x}px`}
          y2={`${flipH ? 0 : y}px`}
          stroke={color}
          stroke-width={`${lineWidth}px`}
          marker-start="url(#arrowtail)"
          /> : 
        <line
          x1={`${flipV ? x : 0}px`}
          y1={`${flipH ? y : 0}px`}
          x2={`${flipV ? 0 : x}px`}
          y2={`${flipH ? 0 : y}px`}
          stroke={color}
          stroke-width={`${lineWidth}px`}
        /> }
      </svg>
    );
  };

  return (
    <div
      key={node.asset}
      className={`${node.type} prstGeom ${node.name ? node.name : ""}`}
      id={node.asset}
      style={styleCss}
    > 
      {lineStyle && renderArrow(lineStyle)}
      {imageUrl && (
        <img src={imageUrl} style={{ ...style, left: "0px", top: "0px" }} />
      )}
      {renderChildren(node, zIndex, childFrame)}
    </div>
  );
};

export default PresetGeometry;
