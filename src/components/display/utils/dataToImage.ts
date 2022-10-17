const dataToImage = (data: string): Promise<HTMLImageElement> => {
    const image = new Image();
    return new Promise((resolve, reject) => {
        image.onload = () => {
            resolve(image);
        }
        image.onerror = () => {
            reject(new Error("Problem loading image data."));
        }
        image.src = data;
    }) 
}

export default dataToImage