export const generateApplicationId = () => {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `APP-${random}`;
};

export const generateLibraryCardNumber = () => {
  const random = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');
  return `LIB-${random}`;
};
