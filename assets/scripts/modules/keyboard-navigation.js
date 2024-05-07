/* Keyboard Events
---------------------------------------------------------------------------- */

const addKeyboardEvents = () => {

  const navObjects = document.querySelectorAll("[data-js-content] > *");
  const contentWrap = document.querySelector("[data-js-content]");
  const navObjectsArray = Array.from(navObjects);
  let currentNavObject = 0;

  const jump = (direction) => {
    if (direction === "up") {
      currentNavObject = currentNavObject === 0 ? 0 : currentNavObject - 1;
    } else if (direction === "down") {
      currentNavObject = currentNavObject === navObjectsArray.length ? currentNavObject : currentNavObject + 1;
    }

    navObjectsArray[currentNavObject].scrollIntoView({ behavior: "smooth" });
    history.pushState("", "", `#${navObjectsArray[currentNavObject].id}`);
  };


  document.onkeydown = function (e) {

    switch (e.keyCode) {
      case 38:
        jump("up");
        break;

      case 40:
        jump("down");
        break;

      case 79:
        contentWrap.classList.toggle("is-overview");
        break;
    }
  };
};


/* Exports
############################################################################ */

export { addKeyboardEvents };