import React, { JSX, useState, useEffect, use } from "react";
import CustGeom from "./CustGeom";
import PrstGeom from "./PrstGeom";
import convertPowerPointStyle from "../utils/css_convertor";

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
    if (!("_properties" in node)) return;
    if (!("blipFill" in node._properties)) return;
    if (!("link" in node._properties.blipFill)) return;
    setImageUrl(mediaPath + node._properties.blipFill.link.slice(3));
  }, []);

  useEffect(() => {
    if (!("_properties" in node)) return;
    if (!("custGeom" in node._properties)) return;
    setCustGeom(node._properties.custGeom);
  }, []);

  useEffect(() => {
    if (!("_properties" in node)) return;
    if (!("prstGeom" in node._properties)) return;
    setPrstGeom(node._properties.prstGeom);
  }, []);

  useEffect(() => {
    if (node._properties?.prstGeom || node._properties?.custGeom) {
      console.log("genericWrapper false", node._asset);
      setGenericWrapper(false);
    } else {
      console.log("genericWrapper true", node._asset);
      setGenericWrapper(true);
    }
  }, []);

  useEffect(() => {
    if (!("_properties" in node)) return;
    if (!("ln" in node._properties)) return;
    setLn(node._properties.ln);
  }, []);

  const renderGenericWrapper = () => {
    return (
      <div
        key={node._asset}
        className={`${node._type} Generic ${node.name ? node.name : ""}`}
        id={node._asset}
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
    );
  };

  return (
    <>
      {genericWrapper && renderGenericWrapper()}
      {custGeom && (
        <CustGeom
          key={node._asset}
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
          key={node._asset}
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
