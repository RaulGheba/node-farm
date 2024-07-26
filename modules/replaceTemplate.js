module.exports = replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName); // WE USE THE g FLAG ON IT TO MAKE THIS GLOBAL, AS WELL AS MAKING A REGULAR EXPRESSION (//). THIS ENSURES ALL
  // PLACEHOLDERS ARE REPLACED
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};
