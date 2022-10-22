const getArrayFromLocalStorage = (key: string): any[] => {
    const arr = localStorage.getItem(key);
    if (!arr) return []
    return JSON.parse(arr)
}

export default getArrayFromLocalStorage