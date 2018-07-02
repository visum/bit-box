export default (message, condition) => {
  const result = condition === true;
  const resultString = result ? "passed" : "failed";
  return {
    message: message + ": " + resultString,
    pass: result
  }
};
