const splitArray = (splitIndex: number, array: any[]): [any[], any[]] => {
    if (splitIndex === -1) return [array, []]

    const firstHalf = array.slice(0, splitIndex)
    const secondHalf = array.slice(splitIndex)
    
    return [firstHalf, secondHalf]
}

export default splitArray;