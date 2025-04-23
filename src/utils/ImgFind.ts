// interface JsonNode {
//     Asset: string;
//     Parent: string;
//     Name: string;
//     Type: string;
//     Value: string;
//     RId: string;
//     children: JsonNode[];
// }

import { styleText } from "util";

// interface ExtractedImage {
//     AssetType:string|null;
//     AssetId:string|null;
//     imageRef: string | null;
//     coordinates: { x: string; y: string; width: string; height: string;rot:string;flipH: boolean } | null;
//     cropping:{b:string;l:string;r:string;t:string}|null;
// }

// // function imageFindRecursive(obj: any, images: string[]) {//setImages: (images: string[]) => void, images: string[]) {
// //     console.log("Finding Images", obj);
// //     if (!obj) return;

// //     if (obj.Name == "BlipImage") {
// //         if (obj.Value) {
// //             //setImages((prevImages) => [...prevImages, obj.Value]); // Append correctly
// //             images.push(obj.Value);
// //             console.log("Found Image", obj.Value)
// //         } else {
// //             console.error("Image found without a value");
// //         }
// //     }

// //     if (obj.children) {
// //         const children = Array.isArray(obj.children)
// //             ? obj.children
// //             : Object.values(obj.children);

// //         children.forEach((child) => imageFindRecursive(child, images));
// //     }
// // }

// // function imageFind(obj: any, images: string[]) {
// //     for (let key in obj) {
// //         imageFindRecursive(obj[key], images);
// //     }
// // }
// //export default imageFind;

// function extractImageData(node: JsonNode): ExtractedImage | null {
//     let AssetType:string|null=null;
//     let AssetId:string|null=null;
//     let imageRef: string | null = null;
//     let coordinates: { x: string; y: string; width: string; height: string;rot:string;flipH: boolean } | null = null;
//     let cropping:{b:string;l:string;r:string;t:string}|null=null;
//     if (node.Type === "Image" && node.Name === "BlipImage=./a:blip") {
//         imageRef = node.Value; // Extract the image reference
//         AssetId=node.Asset;
//         AssetType=node.Type
//         console.log("Found Image", imageRef);
//     }
//     if (node.Type === "Coordinates") {
//         try {
//             const coordData = JSON.parse(node.Value.replace(/'/g, '"')); // Fix JSON format
//             coordinates = {
//                 x: coordData.offset.x,
//                 y: coordData.offset.y,
//                 width: coordData.extent.cx,
//                 height: coordData.extent.cy,
//                 rot: coordData.rotation,
//                 flipH: coordData.flipH||0
//             };
//         } catch (error) {
//             console.error("Error parsing coordinates:", error);
//         }
//     }
//     if(node.Type==="Croppping" && node.Value!=="None"){
//         try {
//             const cropdata = JSON.parse(node.Value.replace(/'/g, '"')); // Fix JSON format
//             cropping = {
//                 b: cropdata.b,
//                 l: cropdata.l,
//                 r: cropdata.r,
//                 t: cropdata.t,

//                             };
//         } catch (error) {
//             console.error("Error parsing cropping details", error);
//         }
//     }

//     for (const child of node.children) {
//         const childData = extractImageData(child);
//         if (childData) {
//             if(childData.AssetType)AssetType=childData.AssetType;
//             if(childData.AssetId)AssetId=childData.AssetId;
//             if (childData.imageRef) imageRef = childData.imageRef;
//             if (childData.coordinates) coordinates = childData.coordinates;
//             if(childData.cropping)cropping=childData.cropping;
//         }
//     }

//     return AssetType||AssetId||imageRef || coordinates ||cropping ? {AssetType,AssetId, imageRef, coordinates,cropping } : null;
// }

// function findAllImages(data: JsonNode): ExtractedImage[] {
//     let images: ExtractedImage[] = [];
//     if (data.Type === "Picture=./p:pic") {
//         const imageData = extractImageData(data);
//         if (imageData) images.push(imageData);
//     }
//     for (const child of data.children) {
//         images = images.concat(findAllImages(child));
//     }
//     return images;
// }

// export default findAllImages;

function findAllImages(
  data: any,
  images: { style: { [key: string]: any }; parent: any }[],
  shapes: { style: { [key: string]: any }; parent: any }[],
  text: { style: { [key: string]: any }; parent: any }[]
) {
  for (const child of data.children) {
    if (data.Type === "Group=./p:grpSp") {
      // shapes.push({style:{[PresetGeometry=./a:prstGeom]:"{'prst': 'rect'}"}})
      if (child.Type === "AlternateContent=./mc:AlternateContent") {
        let arr = [];
        child.children.length > 0 ? (arr = child.children) : [];
        
        let grpSpPr_coords = data.Style?.["Coordinates"][0];
        
        if (grpSpPr_coords !==undefined) {
          arr[1].children[0].Style.grpSpPr_coords = grpSpPr_coords;
        }
        images.push({ style: arr[1].children[0].Style, parent: arr[1].Name });
        shapes.push({ style: arr[1].children[0].Style, parent: arr[1].Name });
        shapes.push({
          style: {
            Coordinates: grpSpPr_coords,
            "PresetGeometry=./a:prstGeom": "{'prst': 'rect'}",
          },
          parent: "Grp_element",
        });
      }

      if (child.Type === "Picture=./p:pic" || child.Type === "Shape=./p:sp") {
        const arr = data.children;
        let grpSpPr_coords = data.Style?.["Coordinates"][0];
        if (grpSpPr_coords !== undefined) {
          child.Style.grpSpPr_coords = grpSpPr_coords;
        }

        if (child.Type === "Shape=./p:sp") {
          if (child.Style["TextContent=./a:t"]) {
            text.push({ style: child.Style, parent: child.Asset });
          }
        }

        if (child.Type === "Picture=./p:pic")
          images.push({ style: child.Style, parent: data.Type }); // images.push(child.Style,child.Parent)
        if (child.Type === "Shape=./p:sp") {
          shapes.push({ style: child.Style, parent: child.Name });
          shapes.push({
            style: {
              Coordinates: grpSpPr_coords,
              "PresetGeometry=./a:prstGeom": "{'prst': 'rect'}",
            },
            parent: "Grp_element",
          });
        }
      }
    }
    if (data.Type === "ShapeTree=./p:spTree") {
      if (child.Type === "AlternateContent=./mc:AlternateContent") {
        // console.log("174",child.children,child.Asset)
        let arr = [];
        child.children.length > 0 ? (arr = child.children) : [];
        // console.log("177",arr[1].children[0].Style);
        images.push({ style: arr[1].children[0].Style, parent: arr[1].Name });
        shapes.push({ style: arr[1].children[0].Style, parent: arr[1].Name });
      }

      if (child.Type === "Picture=./p:pic" || child.Type === "Shape=./p:sp") {
        if (child.Type === "Shape=./p:sp") {
          if (child.Style["TextContent=./a:t"]) {
            text.push({ style: child.Style, parent: child.Asset });
          }
        }
        if (child.Type === "Picture=./p:pic")
          images.push({ style: child.Style, parent: data.Type }); // images.push(child.Style,child.Parent)
        if (child.Type === "Shape=./p:sp")
          shapes.push({ style: child.Style, parent: child.Name });
      }
    }
  }
}

function pics(data: any) {
  let images: { style: { [key: string]: any }; parent: any }[] = [];
  let shapes: { style: { [key: string]: any }; parent: any }[] = [];
  let text: { style: { [key: string]: any }; parent: any }[] = [];
  findAllImages(data, images, shapes, text);
  //console.log("Shapes 229",shapes,shapes[0].style["PresetGeometry=./a:prstGeom"])
  console.log("232", shapes);
  console.log("242", images);
  return { images, shapes, text };
}

export default pics;
