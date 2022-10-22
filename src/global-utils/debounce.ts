const debounce = (fn: Function, delay: number) => {
    let timerId: NodeJS.Timer | null = null;

    return (...args: any[]) => {
        if (timerId) clearTimeout(timerId);
        timerId = setTimeout(() => {
            fn(...args)
        }, delay);
    }
}


export default debounce