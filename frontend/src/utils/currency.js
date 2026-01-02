// Currency formatting utilities for Indian Rupees
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export const priceDisplay = (price) => {
  return `₹${Math.round(price).toLocaleString('en-IN')}`;
};

export const calculateTotalPrice = (price, numberOfPeople = 1) => {
  return price * numberOfPeople;
};
