const roundNum = (num: number, decimal: number, returnString?: boolean) => {
    const roundedNum = num.toFixed(decimal);
    return (returnString) ? roundedNum : parseFloat(roundedNum);
}

export default roundNum;