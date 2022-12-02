export type Unit = "px" | "mm" | "in" ;

type PixelTable = {
    px: number,
    mm: number,
    in: number,
}

const convertToUnit = (inputValue: number, inputUnit: Unit, targetUnit: Unit, pxTable: PixelTable) => {
  if (inputUnit === targetUnit) return inputValue;

  let px: number;

  (inputUnit === 'px') ? 
    px = inputValue : 
    px = inputValue / pxTable[inputUnit]
  ;

  if (targetUnit === 'px') return px;
  return px * pxTable[targetUnit]
}


const setConverterPPI = (PPI: number) => {
    const inch = 1 / PPI;
    const mm = inch * 25.4;
  
    const pxTable: PixelTable = {
      px: 1,
      in: inch,
      mm: mm,
    }
  
    return (...args: [input: number, inputUnit: Unit, targetUnit: Unit]) => {
        const [input, inputUnit, targetUnit] = [...args];
        return convertToUnit(input, inputUnit, targetUnit, pxTable)
    }
  }


export default setConverterPPI;
