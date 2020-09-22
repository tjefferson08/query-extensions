const renderIntoDocument = (html) => {
  const container = document.createElement("div");
  container.id = "render-container";
  container.innerHTML = html;
  document.body.appendChild(container);
  return { container, unmount: () => document.body.removeChild(container) };
};

module.exports = {
  renderIntoDocument,
};
