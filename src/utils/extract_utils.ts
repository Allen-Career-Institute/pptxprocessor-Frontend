import {
    emuToPx,
    adjustLuminance,
    checkAndReturnColorCode,
    emuRotationToDegrees,
} from './helper_utils';
import { NodeAttribs } from './constants';
export function extractPx(
    value: number,
    defaultValue: number,
    maxDim: any,
    offset: number = 0,
): number {
    return value ? emuToPx(value, maxDim.width, offset) : defaultValue;
}

export function calculateChildFrame(
    node: any,
    maxDim: { width: number; height: number },
): any {
    const chOff = node?.xfrm?.chOff || { x: 0, y: 0 };
    const chExt = node?.xfrm?.chExt || { cx: 1, cy: 1 };
    const rot = node?.xfrm?.rot
        ? emuRotationToDegrees(parseInt(node?.xfrm?.rot))
        : 0;
    const flipH = node?.xfrm?.flipH ? -1 : 1;
    return {
        off: {
            x: extractPx(chOff.x, 0, maxDim),
            y: extractPx(chOff.y, 0, maxDim),
        },
        ext: {
            x: extractPx(chExt.x, 0, maxDim),
            y: extractPx(chExt.y, 0, maxDim),
        },
        // rot,
        // flipH
    };
}

export const extractOpacity = (node: any): number => {
    const alpha =
        node?.srgbClr?.alpha || node?.prstClr?.alpha || node?.schemeClr?.alpha;

    if (alpha) {
        const alphaVal = alpha?.val || '100000'; // Transparency

        const opacity = parseInt(alphaVal) / 100000; // Convert to CSS opacity (0-1)
        return opacity;
    } else {
        return 1;
    }
};

const ColorMap = {
    tx1: '#000000', // Default primary text color (black)
    tx2: '#666666', // Default secondary text color (gray)
    bg1: '#FFFFFF', // Default primary background color (white)
    bg2: '#F0F0F0', // Default secondary background color (light gray)
    accent1: '#FF0000', // Example accent color
    accent2: '#ED7D31',
    white: '#FFFFFF',
    black: '#000000',
    red: '#FF0000',
    green: '#008000',
    blue: '#0000FF',
    yellow: '#FFFF00',
    gray: '#808080',
    cyan: '#00FFFF',
    magenta: '#FF00FF',
};

export function extractColor(colorNode: any): any {
    let adjustedColor = '#000000';
    if (colorNode) {
        let clrVal = 'tx1';
        clrVal = colorNode ? colorNode.val : clrVal;
        let color = checkAndReturnColorCode(clrVal);
        color = color
            ? color
            : clrVal in ColorMap
              ? ColorMap[clrVal as keyof typeof ColorMap] // Map clrVal to its corresponding color
              : '#000000'; // Fallback to clrVal as is

        // Adjust foreground color brightness
        adjustedColor = adjustLuminance(color, colorNode);
    }
    return adjustedColor;
}

export function extractSolidFillColor(solidFill: any): any {
    if (solidFill?.prstClr) {
        return extractColor(solidFill.prstClr);
    } else if (solidFill?.schemeClr) {
        return extractColor(solidFill.schemeClr);
    } else if (solidFill?.srgbClr) {
        return extractColor(solidFill.srgbClr);
    }
    return extractColor(null);
}
export function extractDash(prstDash: any): any {
    if (prstDash?.val === 'dash')
        return {
            strokeDasharray: '5,5',
        };

    return null;
}

export function extractRgba(color: string): string {
    return `rgba(${parseInt(color.slice(1, 3), 16)},
    ${parseInt(color.slice(3, 5), 16)}, 
    ${parseInt(color.slice(5, 7), 16)}`;
}

export function extractFontFamily(fontFamilyNode: any): string {
    if (fontFamilyNode) {
        // Extract font family (major/minor)
        let fontFamily = fontFamilyNode.idx || 'minor'; // Default to "minor" if not specified
        fontFamily = fontFamily === 'minor' ? 'BodyFont' : 'HeadingFont'; // Map to CSS font families
        return fontFamily;
    }
    return 'Arial'; // Default font
}
