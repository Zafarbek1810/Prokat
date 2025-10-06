import { useMemo } from "react";

const useNumberFormatter = (number) => {
    const formattedNumber = useMemo(() => {
      // Null va undefined ni tekshirish
      if (number === null || number === undefined) return "";
  
      // Agar number raqam bo'lmasa, bo'sh string qaytarish
      if (isNaN(number)) return "";
  
      // Numberni stringga aylantirib, formatlash
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }, [number]);
  
    return formattedNumber;
  };

  export default useNumberFormatter;