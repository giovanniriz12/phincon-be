const fibonacciSequence = (num) => {
  let startNumber = 0;
  let nextNumber = 1;
  let sum;
  let i = 0;

  for (i = 0; i < num; i++) {
    sum = startNumber + nextNumber;
    startNumber = nextNumber;
    nextNumber = sum;
  }

  return nextNumber;
};

module.exports = {
    fibonacciSequence,
};
