
interface JsonNode {
    Asset: string;
    Parent: string;
    Name: string;
    Type: string;
    Value: string;
    RId: string;
    children: JsonNode[];
}

interface Extractedasset {
    assetId:string|null;
    assetType:string|null;
    assetPath:string|null;
    //coordinates: { x: string; y: string; width: string; height: string;rot:string;flipH: boolean } | null;

}



function extractImageData(node: JsonNode): Extractedasset | null {
    let assetId:string|null=null;
    let assetType: string|null=null; 
    let assetPath:string|null=null;
   // let coordinates:string|null=null;
    if(node.Type==="ImageFill=./p:blipFill"){
        console.log(node.children[0])
        for(let i=0;i<node.children.length;i++){
            if(node.children[i].Type==="Image" && node.children[i].Name==="BlipImage=./a:blip"){
                assetId=node.children[i].Asset;
                assetType=node.children[i].Type;
                assetPath=node.children[i].Value;
            }
        }
    }
    else if(node.Type==="Media"){
        assetId=node.Asset
        assetType=node.Type
        assetPath=node.Value
        
    }

    // if ((node.Type === "Image" && node.Name === "BlipImage=./a:blip")) {
    //     assetId = node.Asset; // Extract the image reference
    //     assetType = node.Type ; // Assign asset type correctly
    //     console.log("Found Asset", assetId, "Type:", assetType);
    

    // if (node.Type === "Coordinates") {
    //     try {
    //         const coordData = JSON.parse(node.Value.replace(/'/g, '"')); // Fix JSON format
    //         coordinates = {
    //             x: coordData.offset.x,
    //             y: coordData.offset.y,
    //             width: coordData.extent.cx,
    //             height: coordData.extent.cy,
    //             rot: coordData.rotation,
    //             flipH: coordData.flipH
    //         };
    //     } catch (error) {
    //         console.error("Error parsing coordinates:", error);
    //     }
    // }

    // if (node.Type === "Croppping" && node.Value !== "None") {
    //     try {
    //         const cropdata = JSON.parse(node.Value.replace(/'/g, '"')); // Fix JSON format
    //         cropping = {
    //             b: cropdata.b,
    //             l: cropdata.l,
    //             r: cropdata.r,
    //             t: cropdata.t
    //         };
    //     } catch (error) {
    //         console.error("Error parsing cropping details", error);
    //     }
    // }

    for (const child of node.children) {
        const childData = extractImageData(child);
        if (childData) {
            if (childData.assetId) assetId = childData.assetId;
            if(childData.assetPath)assetPath=childData.assetPath;
            if (childData.assetType) assetType = childData.assetType; // Ensure assetType is inherited if found
        }
    }

    
    return assetId ||  assetType ||assetPath
        ? { assetId, assetType,assetPath }
        : null;
}

function findAllAssets(data: JsonNode): Extractedasset[] {
    let assets: Extractedasset[] = [];
    if (data.Type === "Picture=./p:pic") {
        const assetData = extractImageData(data);
        if (assetData) assets.push(assetData);
    }
    for (const child of data.children) {
        assets = assets.concat(findAllAssets(child));
    }
    return assets;
}



export default findAllAssets;

