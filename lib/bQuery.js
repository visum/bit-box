export default (context) => {
  return (query) => {
    return context.querySelectorAll(query);
  };
};