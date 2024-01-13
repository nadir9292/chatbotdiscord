const limiterString = (str) => {
  const BASE_TYPE_MAX_LENGTH = 2000;
  return str.substring(0, BASE_TYPE_MAX_LENGTH);
};

export default limiterString;
