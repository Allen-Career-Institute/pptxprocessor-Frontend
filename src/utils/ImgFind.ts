

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
