const EMUConst = 9525;
const StandardWidth = 1280;

export function emuToPx(
    emu: number,
    maxWidth: number,
    offset: number = 0,
): number {
    return parseFloat(
        ((maxWidth * emu) / (EMUConst * StandardWidth) - offset).toFixed(2),
    );
}

export function emuToFontSize(emu: number, maxWidth: number): number {
    return emuToPx(emu, maxWidth) * 125;
}

export function emuRotationToDegrees(rotationEMU: number): number {
    return rotationEMU / 60000;
}

// Check if clrVal is a valid hex color code
export function checkAndReturnColorCode(color: string): string | null {
    return /^[0-9A-Fa-f]{6}$/.test(color)
        ? `#${color}`
        : /^#[0-9A-Fa-f]{6}$/.test(color)
          ? color
          : null;
}

export function adjustLuminance(color: string, colorNode: any): string {
    const lumMod = colorNode.lumMod?.val || 100000; // Default to 100% luminance
    const lumOff = colorNode.lumOff?.val || 0; // Default to 0% offset

    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    console.log(r, g, b, 30);
    const adjust = (channel: number) =>
        Math.min(
            255,
            Math.max(0, (channel * lumMod) / 100000 + (lumOff * 255) / 100000),
        );

    const adjustedR = adjust(r);
    const adjustedG = adjust(g);
    const adjustedB = adjust(b);
    console.log(adjustedR, adjustedB, adjustedG, 40);
    // Convert back to hex

    return `#${(
        (1 << 24) +
        (Math.round(adjustedR) << 16) +
        (Math.round(adjustedG) << 8) +
        Math.round(adjustedB)
    )
        .toString(16)
        .slice(1)
        .toUpperCase()}`;
}
