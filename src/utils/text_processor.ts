
export interface textstyle{
    "TextContent=./a:t"?:string,
    "Coordinates"?:string,
    "grpSpPr_coords"?:string,
} 


function emuToPx(emu: number): number {
    return emu / 9525;
}

function emuRotationToDegrees(rotationEMU: number): number {
    return rotationEMU / 60000;
}

function convertText(txtstyle:textstyle):any{
    const text=txtstyle["TextContent=./a:t"];
    const coords=txtstyle["Coordinates"] ? JSON.parse(txtstyle.Coordinates.replace(/'/g, '"')) : null;
    const grpcoords=txtstyle["grpSpPr_coords"]?JSON.parse(txtstyle.grpSpPr_coords.replace(/'/g, '"')):null;
    let left = coords.offset.x ? emuToPx(coords.offset.x) : 0;
    let top = coords.offset.y ? emuToPx(coords.offset.y) : 0;
    let width = coords.extent.cx ? emuToPx(coords.extent.cx) : 0;
    let height = coords.extent.cy ? emuToPx(coords.extent.cy) : 0;
    if(grpcoords){
        left=emuToPx(grpcoords.offset.x)+emuToPx(coords.offset.x)-emuToPx(grpcoords.childOffset.x);
        top=emuToPx(grpcoords.offset.y)+emuToPx(coords.offset.y)-emuToPx(grpcoords.childOffset.y);
    }
    return {
        styletxt:{
            
            left:left,
            top:top,
            width:width,
            height:height
        },
        text:text
    }

}
export default convertText;