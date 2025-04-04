
interface JsonNode {
    Asset: string;
    Parent: string;
    Name: string;
    Type: string;
    Value: string;
    RId: string;
    children: JsonNode[];
}

interface ExtractedImage {
    AssetType:string|null;
    //Value:string|null;
    AssetId:string|null;
    imageRef: string | null;
    coordinates: { x: string; y: string; width: string; height: string;rot:string;flipH: boolean } | null;
    cropping:{b:string;l:string;r:string;t:string}|null;
}

function extractImageData(node: JsonNode): ExtractedImage | null {
    let AssetType:string|null=null;
    let AssetId:string|null=null;
    let imageRef: string | null = null;
    let coordinates: { x: string; y: string; width: string; height: string;rot:string;flipH: boolean } | null = null;
    let cropping:{b:string;l:string;r:string;t:string}|null=null;
    if(node.Type==="ShapeProperties=./p:spPr"){
        imageRef=node.Type
        AssetId=node.Asset
        for(let i=0;i<node.children.length;i++){
            if(node.children[i].Type==="Coordinates"){
                try {
                    const coordData = JSON.parse(node.children[i].Value.replace(/'/g, '"')); // Fix JSON format
                    coordinates = {
                        x: coordData.offset.x,
                        y: coordData.offset.y,
                        width: coordData.extent.cx,
                        height: coordData.extent.cy,
                        rot: coordData.rotation,
                        flipH: coordData.flipH
                    };
                } catch (error) {
                    console.error("Error parsing coordinates:", error);
                }
        }
        if(node.children[i].Type==="PresetGeometry=./a:prstGeom"){
            try{
                const json =JSON.parse(node.children[i].Value.replace(/'/g, '"'));
                AssetType=json.prst;
            }
            catch(err){
                console.error("error passing asset type",err)
            }
        }
    }
}

    for (const child of node.children) {
        const childData = extractImageData(child);
        if (childData) {
            if(childData.AssetType)AssetType=childData.AssetType;
            if(childData.AssetId)AssetId=childData.AssetId;
            if (childData.imageRef) imageRef = childData.imageRef;
            if (childData.coordinates) coordinates = childData.coordinates;
            if(childData.cropping)cropping=childData.cropping;
        }
    }

    return AssetType||AssetId||imageRef || coordinates ||cropping ? {AssetType,AssetId, imageRef, coordinates,cropping } : null;
}
function extractshape(node: JsonNode):ExtractedImage | null {

    let AssetType:string|null=null;
    let AssetId:string|null=null;
    let imageRef: string | null = null;
    let coordinates: { x: string; y: string; width: string; height: string;rot:string;flipH: boolean } | null = null;
    let cropping:{b:string;l:string;r:string;t:string}|null=null;
    for(let i=0;i<node.children.length;i++){

    }

    return AssetType||AssetId||imageRef || coordinates ||cropping ? {AssetType,AssetId, imageRef, coordinates,cropping } : null;

}
function findAllShapes(data: JsonNode): ExtractedImage[] {
    let images: ExtractedImage[] = [];
    const imageData = extractImageData(data);
                if (imageData) {
            //         if(coordinates_grp!==null){
            //             const obj =JSON.parse(coordinates_grp.replace(/'/g, '"'));
            //  imageData.coordinates={x:obj.offset.x, y:obj.offset.y
            //              ,width:imageData.coordinates.width,height:imageData.coordinates?.height}
            //         //    imageData.coordinates.x=obj.offset.x+(imageData.coordinates.x-obj.childOffset.x);
            //         //    imageData.coordinates.y=obj.offset.y+(imageData.coordinates.y-obj.childOffset.y);
                        
            //         //   console.log(imageData.coordinates)
            //         }
                    //console.log(imageData.coordinates)
                    images.push(imageData);
                }
   // let coordinates_grp:string|null=null;
   
    // if(data.Type==="Group=./p:grpSp"){
    //     for(let i=0;i<data.children.length;i++){
    //         if(data.children[i].Type==="GroupShapeProperties=./p:grpSpPr"){
    //          const arr=data.children[i].children;
    //             for(let j=0;j<arr.length;j++){
    //              if(arr[j].Type==="Coordinates"){
    //                 coordinates_grp=arr[j].Value;
    //                 break;
    //              }
    //         }           
    // }
            
    //         if(data.children[i].Type==="Shape=./p:sp"){
            
    //             const imageData = extractImageData(data.children[i]);
    //             if (imageData) {
    //         //         if(coordinates_grp!==null){
    //         //             const obj =JSON.parse(coordinates_grp.replace(/'/g, '"'));
    //         //  imageData.coordinates={x:obj.offset.x, y:obj.offset.y
    //         //              ,width:imageData.coordinates.width,height:imageData.coordinates?.height}
    //         //         //    imageData.coordinates.x=obj.offset.x+(imageData.coordinates.x-obj.childOffset.x);
    //         //         //    imageData.coordinates.y=obj.offset.y+(imageData.coordinates.y-obj.childOffset.y);
                        
    //         //         //   console.log(imageData.coordinates)
    //         //         }
    //                 console.log(imageData.coordinates)
    //                 images.push(imageData);
    //             }
                
                    
    //         }
    //     }
    // }
   
    for (const child of data.children) {
    
        if(child.Type==="Shape=./p:sp")console.log(child.children[0])

            images = images.concat(findAllShapes(child));
    }
    return images;
}



export default findAllShapes;