const readFile = (file: File): Promise<string> => {
    const reader = new FileReader();
    return new Promise((resolve,reject) => {
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result)
        }
        reader.onerror = () => {
            reader.abort();
            reject(new Error("Problem parsing input file."))
        }
        reader.readAsDataURL(file);
    });
}

export default readFile
