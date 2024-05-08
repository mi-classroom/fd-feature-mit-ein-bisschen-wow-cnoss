/* Keyboard Events
---------------------------------------------------------------------------- */

const addKeyboardEvents = () => {
  
  const contentWrap = document.querySelector("[data-js-content]");
  const navObjects = document.querySelectorAll("[data-js-content] > *");
  const navObjectsArray = Array.from(navObjects);
  let currentNavObject = 0;

  const jump = (direction) => {

    const currentElementInView = document.querySelector(".is-in-view");
    currentNavObject = navObjectsArray.indexOf(currentElementInView);
    
    if (direction === "up") {
      currentNavObject = currentNavObject === 0 ? 0 : currentNavObject - 1;
    } else if (direction === "down") {
      currentNavObject = currentNavObject === navObjectsArray.length ? currentNavObject : currentNavObject + 1;
    }

    navObjectsArray[currentNavObject].scrollIntoView({ behavior: "smooth" });
    history.pushState("", "", `#${navObjectsArray[currentNavObject].id}`);
  };

  document.onkeydown = function (event) {

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        jump("up");
        break;

      case "ArrowDown":
        event.preventDefault();
        jump("down");
        break;

      case "o":
        event.preventDefault();
        contentWrap.classList.toggle("is-overview");
        break;
    }
  };
};


/* Exports
############################################################################ */

export { addKeyboardEvents };