export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomNotAnInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return (lower + Math.random() * (upper - lower + 1));
};

export const getRandomElements = (array) => {
  const index = getRandomInteger(0, array.length - 1);
  return array[index];
};

export const getArrayRandomElements = (firstNumber, secondNumber, func) => (
  Array.from(
    { length: getRandomInteger(firstNumber, secondNumber) },
    func
  ));
