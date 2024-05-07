/* Horizontal Scrolling
---------------------------------------------------------------------------- */

const addHorizontalScroll = () => {

  const scrollContainer = document.querySelector("[data-js-horizontal-scroll-container]");
  if (!scrollContainer) return;

  scrollContainer.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    scrollContainer.scrollLeft += evt.deltaY;
  });
};


/* Exports
############################################################################ */

export { addHorizontalScroll };