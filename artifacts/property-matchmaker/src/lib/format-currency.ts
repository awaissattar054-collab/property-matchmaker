export const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `${(amount / 10000000).toFixed(2)} Crore`;
  }
  if (amount >= 100000) {
    return `${(amount / 100000).toFixed(2)} Lac`;
  }
  return amount.toLocaleString("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
