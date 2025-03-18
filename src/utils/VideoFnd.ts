
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
    VideoRef: string | null;
    coordinates: { x: string; y: string; width: string; height: string;rot:string;flipH: boolean } | null;

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
    let VideoRef: string | null = null;
    let coordinates: { x: string; y: string; width: string; height: string;rot:string;flipH: boolean } | null = null;
    
    if (node.Type === "Media" && node.Name === "Media") {
        VideoRef = node.Value; 
        console.log("Found Video", VideoRef);
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
                flipH: coordData.flipH
            };
        } catch (error) {
            console.error("Error parsing coordinates:", error);
        }
    }

    for (const child of node.children) {
        const childData = extractImageData(child);
        if (childData) {
            if (childData.VideoRef) VideoRef = childData.VideoRef;

             
            if (childData.coordinates) coordinates = childData.coordinates;
        }
    }

    return VideoRef || coordinates ? { VideoRef, coordinates } : null;
}

function findAllVideos(data: JsonNode): ExtractedImage[] {
    let images: ExtractedImage[] = [];
    if (data.Type === "Picture=./p:pic") {
        const imageData = extractImageData(data);
        if (imageData && imageData.VideoRef) images.push(imageData);
    }
    for (const child of data.children) {
        images = images.concat(findAllVideos(child));
    }
    return images;
}



export default findAllVideos;