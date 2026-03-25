


export const validateStock = (stock)=>{
    const num = Number(stock);
    return Number.isInteger(num) && num >= 0;
   
};


export const validatePrice = (price)=> {
    const num = Number(price);
    return Number.isFinite(num) && num >= 0 ;
};



