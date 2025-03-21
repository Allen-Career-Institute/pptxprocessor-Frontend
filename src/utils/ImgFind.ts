
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
    AssetId:string|null;
    imageRef: string | null;
    coordinates: { x: string; y: string; width: string; height: string;rot:string;flipH: boolean } | null;
    cropping:{b:string;l:string;r:string;t:string}|null;
}

// function imageFindRecursive(obj: any, images: string[]) {//setImages: (images: string[]) => void, images: string[]) {
//     console.log("Finding Images", obj);
//     if (!obj) return;

    
//     if (obj.Name == "BlipImage") {
//         if (obj.Value) {
//             //setImages((prevImages) => [...prevImages, obj.Value]); // Append correctly
//             images.push(obj.Value);
//             console.log("Found Image", obj.Value)
//         } else {
//             console.error("Image found without a value");
//         }
//     }

    
//     if (obj.children) {
//         const children = Array.isArray(obj.children)
//             ? obj.children
//             : Object.values(obj.children);
            
//         children.forEach((child) => imageFindRecursive(child, images));
//     }
// }

// function imageFind(obj: any, images: string[]) {
//     for (let key in obj) {
//         imageFindRecursive(obj[key], images);
//     }
// }
//export default imageFind;

function extractImageData(node: JsonNode): ExtractedImage | null {
    let AssetType:string|null=null;
    let AssetId:string|null=null;
    let imageRef: string | null = null;
    let coordinates: { x: string; y: string; width: string; height: string;rot:string;flipH: boolean } | null = null;
    let cropping:{b:string;l:string;r:string;t:string}|null=null;
    if (node.Type === "Image" && node.Name === "BlipImage=./a:blip") {
        imageRef = node.Value; // Extract the image reference
        AssetId=node.Asset;
        AssetType=node.Type
        console.log("Found Image", imageRef);
    }
    if (node.Type === "Coordinates") {
        try {
            const coordData = JSON.parse(node.Value.replace(/'/g, '"')); // Fix JSON format
            coordinates = {
                x: coordData.offset.x,
                y: coordData.offset.y,
                width: coordData.extent.cx,
                height: coordData.extent.cy,
                rot: coordData.rotation,
                flipH: coordData.flipH||0
            };
        } catch (error) {
            console.error("Error parsing coordinates:", error);
        }
    }
    if(node.Type==="Croppping" && node.Value!=="None"){
        try {
            const cropdata = JSON.parse(node.Value.replace(/'/g, '"')); // Fix JSON format
            cropping = {
                b: cropdata.b,
                l: cropdata.l,
                r: cropdata.r,
                t: cropdata.t,

                            };
        } catch (error) {
            console.error("Error parsing cropping details", error);
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

function findAllImages(data: JsonNode): ExtractedImage[] {
    let images: ExtractedImage[] = [];
    if (data.Type === "Picture=./p:pic") {
        const imageData = extractImageData(data);
        if (imageData) images.push(imageData);
    }
    for (const child of data.children) {
        images = images.concat(findAllImages(child));
    }
    return images;
}



export default findAllImages;