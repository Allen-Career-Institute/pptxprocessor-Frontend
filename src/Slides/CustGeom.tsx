import React, { useState, useEffect, useRef, JSX, use } from 'react';
import { extractSolidFillColor, extractPx } from '../utils/extract_utils';
import { NodeAttribs } from '../utils/constants';
interface CustomGeometryProps {
    node: any;
    zIndex: number;
    mediaPath: string;
    custGeom: any;
    ln: any;
    style: any;
    maxDim: { width: number; height: number };
    childFrame: {
        off: { x: number; y: number };
        ext: { x: number; y: number };
    };
    renderChildren: (node: any, zIndex: number, childFrame: any) => JSX.Element;
}

const evaluateFormula = (
    fmla: string,
    width: number,
    height: number,
): number => {
    const [operation, operand1, operand2, operand3] = fmla.split(' ');
    const operands = [operand1, operand2, operand3].map((op) => {
        if (op === 'w') return width;
        if (op === 'h') return height;
        return parseFloat(op);
    });

    let result = operands[0];
    for (let i = 0; i < operation.length; i++) {
        const char = operation[i];
        switch (char) {
            case '*':
                result = result * operands[i + 1];
                break;
            case '/':
                if (operands[i + 1] === 0) {
                    result = 0;
                } else {
                    result = result / operands[i + 1];
                }
                break;
            case '+':
                result = result + operands[i + 1];
                break;
            case '-':
                result = result - operands[i + 1];
                break;
            default:
                break;
        }
    }
    return result;
};

const CustomGeometry: React.FC<CustomGeometryProps> = ({
    node,
    zIndex,
    mediaPath,
    custGeom,
    ln,
    style,
    maxDim,
    childFrame,
    renderChildren,
}) => {
    const [imageUrl, setImageUrl] = useState<string>();
    const { gdLst, cxnLst, rect, pathLst } = custGeom;
    const containerRef = useRef<HTMLDivElement>(null); // Reference to the container
    const [width, setWidth] = useState(0); // State for width
    const [height, setHeight] = useState(0); // State for height
    const [strokeWidth, setStrokeWidth] = useState(0); // State for stroke width

    useEffect(() => {
        const lnw = extractPx(ln.w, 1, maxDim);
        setStrokeWidth(lnw ? lnw : 1);
        if (width == 0) setWidth(lnw);
        if (height == 0) setHeight(lnw);
    }, [ln]);

    useEffect(() => {
        if (!(NodeAttribs.PROPERTIES in node)) return;
        if (!('blipFill' in node[NodeAttribs.PROPERTIES])) return;
        if (!('link' in node[NodeAttribs.PROPERTIES].blipFill)) return;
        setImageUrl(
            mediaPath + node[NodeAttribs.PROPERTIES].blipFill.link.slice(3),
        );
    }, []);

    useEffect(() => {
        const element = containerRef.current;

        if (!element) return;

        // Create a ResizeObserver to track size changes
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                width == 0 ? setWidth(strokeWidth) : setWidth(width); // Update width state
                height == 0 ? setHeight(strokeWidth) : setHeight(height); // Update height state
            }
        });

        resizeObserver.observe(element); // Start observing the container

        return () => {
            resizeObserver.disconnect(); // Cleanup observer on unmount
        };
    }, []);

    // Evaluate guides
    const guides: Record<string, string> = {};
    gdLst.gd.forEach((guide: { name: string; fmla: string }) => {
        guides[guide.name] = guide.fmla;
    });

    // Resolve positions
    const resolvePosition = (
        pos: string,
        w: number,
        h: number,
        xOrY: string = 'x',
    ): number => {
        if (pos in guides) {
            console.log('Pathdata with guide');
            if (xOrY == 'x') {
                return w == 0
                    ? 0
                    : (evaluateFormula(guides[pos], w, h) * width) / w;
            } else {
                return h == 0
                    ? 0
                    : (evaluateFormula(guides[pos], w, h) * height) / h;
            }
        }
        console.log('Pathdata without guide', pos, w, width);
        if (xOrY == 'x') {
            return w == 0 ? 0 : (parseFloat(pos) * width) / w;
        } else {
            return h == 0 ? 0 : (parseFloat(pos) * height) / h;
        }
    };

    // Compute path data
    const moveTo = pathLst.path.moveTo.pt;
    const pathW = pathLst.path.w ? parseFloat(pathLst.path.w) : width;
    const pathH = pathLst.path.h ? parseFloat(pathLst.path.h) : height;

    const lnTo = pathLst.path.lnTo;
    let pathData = [];
    if (Array.isArray(lnTo)) {
        for (let i = 0; i < lnTo.length; i++) {
            pathData.push(
                `M ${resolvePosition(moveTo.x, pathW, pathH, 'x')} ${resolvePosition(
                    moveTo.y,
                    pathW,
                    pathH,
                    'y',
                )} L ${resolvePosition(
                    lnTo[i].pt.x,
                    pathW,
                    pathH,
                    'x',
                )} ${resolvePosition(lnTo[i].pt.y, pathW, pathH, 'y')}`,
            );
        }
    } else {
        pathData.push(
            `M ${resolvePosition(moveTo.x, pathW, pathH, 'x')} ${resolvePosition(
                moveTo.y,
                pathW,
                pathH,
                'y',
            )} L ${resolvePosition(lnTo?.pt?.x, pathW, pathH, 'x')} ${resolvePosition(
                lnTo?.pt?.y,
                pathW,
                pathH,
                'y',
            )}`,
        );
        console.log(`Pathdata ${node.name}`, pathData, moveTo.x, pathW, pathH);
    }

    // Compute rect dimensions
    const rectWidth =
        rect.r && rect.r != 'r'
            ? resolvePosition(rect.r, width, height)
            : width;
    const rectHeight =
        rect.b && rect.b != 'b'
            ? resolvePosition(rect.b, width, height)
            : height;
    const rectX =
        rect.l && rect.l != 'l' ? resolvePosition(rect.l, width, height) : 0;
    const rectY =
        rect.t && rect.t != 't' ? resolvePosition(rect.t, width, height) : 0;

    const baseVal = 2;
    const arrowHeadW =
        ln.headEnd?.w == 'lg'
            ? baseVal * 3
            : ln.headEnd?.w == 'med'
              ? baseVal * 2
              : baseVal;
    const arrowHeadL =
        ln.headEnd?.len == 'lg'
            ? baseVal * 3 * 2
            : ln.headEnd?.w == 'med'
              ? baseVal * 2 * 2
              : baseVal * 2;
    const arrowTailW =
        ln.tailEnd?.w == 'lg'
            ? baseVal * 3
            : ln.tailEnd?.w == 'med'
              ? baseVal * 2
              : baseVal;
    const arrowTailL =
        ln.tailEnd?.len == 'lg'
            ? baseVal * 3 * 2
            : ln.tailEnd?.w == 'med'
              ? baseVal * 2 * 2
              : baseVal * 2;

    const lnColor = ln.solidFill
        ? extractSolidFillColor(ln.solidFill)
        : 'black';

    return (
        <div
            ref={containerRef} // Attach the ref to the container
            className={`${node[NodeAttribs.TYPE]} custGeom ${
                node.name ? node.name : ''
            }`}
            id={node.id ? node.id : node[NodeAttribs.ASSET]}
            style={{ ...style, border: '' }}
        >
            <svg
                width={rectWidth * 4}
                height={rectHeight * 4}
                viewBox={`${-rectWidth * 2} ${-rectHeight * 2} ${rectWidth * 4} ${
                    rectHeight * 4
                }`}
                style={{
                    position: 'relative',
                    left: `${-rectWidth * 2 + rectX}px`,
                    top: `${-rectHeight * 2 + rectY}px`,
                }}
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <marker
                        id="arrowhead"
                        markerWidth={arrowHeadW}
                        markerHeight={arrowHeadL}
                        refX="0"
                        refY={arrowHeadW / 2}
                        orient="auto"
                    >
                        <polygon
                            points={`0 ${
                                arrowHeadW / 2
                            }, ${arrowHeadL} 0, ${arrowHeadL} ${arrowHeadW}`}
                            fill="context-stroke"
                        />
                    </marker>
                    <marker
                        id="arrowtail"
                        markerWidth={arrowTailW}
                        markerHeight={arrowTailL}
                        refX={arrowTailL}
                        refY={arrowTailW / 2}
                        orient="auto"
                    >
                        <polygon
                            points={`${arrowTailL} ${arrowTailW / 2}, 0 0, 0 ${arrowTailW}`}
                            fill="context-stroke"
                        />
                    </marker>
                </defs>
                {/* Render the path */}
                {pathData.map(function (data, index) {
                    return (
                        <path
                            key={index}
                            d={data}
                            fill="none"
                            stroke={lnColor}
                            strokeWidth={strokeWidth}
                            {...(ln.headEnd && {
                                markerStart: `url(#arrowhead)`,
                            })}
                            {...(ln.tailEnd && {
                                markerEnd: 'url(#tailarrow)',
                            })}
                        />
                    );
                })}
                {/* <path
          d={pathData}
          fill="none"
          stroke={lnColor}
          strokeWidth="2"
          {...(ln.headEnd && { markerStart: `url(#arrowhead)` })}
          {...(ln.tailEnd && { markerEnd: "url(#tailarrow)" })}
        /> */}

                {/* Render connection points */}
                {cxnLst.cxn.map((cxn: any, index: number) => (
                    <circle
                        key={index}
                        cx={resolvePosition(cxn.pos.x, width, height)}
                        cy={resolvePosition(cxn.pos.y, width, height)}
                        r="1"
                        fill={lnColor}
                    />
                ))}
            </svg>
            {renderChildren(node, zIndex, childFrame)}
        </div>
    );
};

export default CustomGeometry;
