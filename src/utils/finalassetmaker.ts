function asseter(assetlist: any[], imagelist: any[], videolist: any[]): any[] {
    let finalasset: any[] = []; 

    console.log("Asset List:", assetlist);
    console.log("Image List:", imagelist);
    console.log("Video List:", videolist);

    for (let i = 0; i < assetlist.length; i++) {
        console.log(`Processing Asset:`, assetlist[i]); // Log current asset

        if (assetlist[i].assetType === "Image") {
            for (let j = 0; j < imagelist.length; j++) {
                console.log(`Comparing Image:`, imagelist[j]);
                if (String(assetlist[i].assetId) === String(imagelist[j].AssetId)) { // Ensure same type
                    console.log("Match Found! Adding Image:", imagelist[j]);
                    finalasset.push(imagelist[j]);
                    break; // Stop searching after first match
                }
            }
        } else {
            for (let j = 0; j < videolist.length; j++) {
                console.log(`Comparing Video:`, videolist[j]);
                if (String(assetlist[i].assetId) === String(videolist[j].AssetId)) {
                    console.log("Match Found! Adding Video:", videolist[j]);
                    finalasset.push(videolist[j]);
                    break;
                }
            }
        }
    }
    
    console.log("Final Ordered Assets:", finalasset);
    return finalasset;
}

export default asseter;