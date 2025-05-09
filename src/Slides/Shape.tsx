import React, { JSX, useState, useEffect, use } from "react";
import CustGeom from "./CustGeom";
import PrstGeom from "./PrstGeom";
import convertPowerPointStyle from "../utils/css_convertor";
import { NodeAttribs } from "../utils/constants";

interface ShapeProps {
  node: any;
  zIndex: number;
  mediaPath: string;
  maxDim: { width: number; height: number };
  childFrame: { off: { x: number; y: number }; ext: { x: number; y: number } };
  renderChildren: (node: any, zIndex: number, childFrame: any) => JSX.Element;
}

const Shape: React.FC<ShapeProps> = ({
  node,
  zIndex,
  mediaPath,
  maxDim,
  childFrame,
  renderChildren,
}: any) => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [custGeom, setCustGeom] = useState<any>();
  const [prstGeom, setPrstGeom] = useState<any>();
  const [genericWrapper, setGenericWrapper] = useState<any>();
  const [ln, setLn] = useState<any>();

  const { style, newChildFrame } = convertPowerPointStyle(
    node,
    zIndex,
    maxDim,
    childFrame
  );

  useEffect(() => {
    if (!(NodeAttribs.PROPERTIES in node)) return;
    if (!("blipFill" in node[NodeAttribs.PROPERTIES])) return;
    if (!("link" in node[NodeAttribs.PROPERTIES].blipFill)) return;
    setImageUrl(mediaPath + node[NodeAttribs.PROPERTIES].blipFill.link.slice(3));
  }, []);

  useEffect(() => {
    if (!(NodeAttribs.PROPERTIES in node)) return;
    if (!("custGeom" in node[NodeAttribs.PROPERTIES])) return;
    setCustGeom(node[NodeAttribs.PROPERTIES].custGeom);
  }, []);

  useEffect(() => {
    if (!(NodeAttribs.PROPERTIES in node)) return;
    if (!("prstGeom" in node[NodeAttribs.PROPERTIES])) return;
    setPrstGeom(node[NodeAttribs.PROPERTIES].prstGeom);
  }, []);

  useEffect(() => {
    if (node[NodeAttribs.PROPERTIES]?.prstGeom || node[NodeAttribs.PROPERTIES]?.custGeom) {
      console.log("genericWrapper false", node[NodeAttribs.ASSET]);
      setGenericWrapper(false);
    } else {
      console.log("genericWrapper true", node[NodeAttribs.ASSET]);
      setGenericWrapper(true);
    }
  }, []);

  useEffect(() => {
    if (!(NodeAttribs.PROPERTIES in node)) return;
    if (!("ln" in node[NodeAttribs.PROPERTIES])) return;
    setLn(node[NodeAttribs.PROPERTIES].ln);
  }, []);

  const renderGenericWrapper = () => {
    return (
    <div
      key={node[NodeAttribs.ASSET]}
      className={`${node[NodeAttribs.TYPE]} Generic ${node.name ? node.name : ""}`}
      id={node[NodeAttribs.ASSET]}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {imageUrl && (
      <img src={imageUrl} style={{ ...style, left: "0px", top: "0px" }} />
      )}
      {renderChildren(node, zIndex, newChildFrame)}
    </div>
  )};

  return (
    <>
      {genericWrapper && renderGenericWrapper()}
      {custGeom && (
        <CustGeom
          key={node[NodeAttribs.ASSET]}
          node={node}
          zIndex={zIndex}
          mediaPath={mediaPath}
          custGeom={custGeom}
          ln={ln}
          style={style}
          maxDim={maxDim}
          childFrame={newChildFrame}
          renderChildren={renderChildren}
        />
      )}
      {prstGeom && (
        <PrstGeom
          key={node[NodeAttribs.ASSET]}
          node={node}
          zIndex={zIndex}
          mediaPath={mediaPath}
          prstGeom={prstGeom}
          style={style}
          maxDim={maxDim}
          childFrame={newChildFrame}
          renderChildren={renderChildren}
        />
      )}
    </>
  );
};

export default Shape;
