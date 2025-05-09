import React, { JSX } from "react";

interface EmptyContainerProps {
  node: any;
  zIndex: number;
  childFrame: { off: { x: number; y: number }; ext: { x: number; y: number } };
  renderChildren: (node: any, zIndex: number, childFrame: any) => JSX.Element;
}

const EmptyContainer: React.FC<EmptyContainerProps> = ({
  node,
  zIndex,
  childFrame,
  renderChildren,
}) => {
  return <>{renderChildren(node, zIndex, childFrame)}</>;
};

export default EmptyContainer;
