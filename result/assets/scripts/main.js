/* Config
############################################################################ */

const config = {
  "content": {
    "base": "/assets/data/mi-base.json"
  },
  "colors": {
    "mi-blau": ".mi-blau",
    "mi-grau": ".mi-grau",
    "mi-gruen": ".mi-gruen",
    "mi-pink": ".mi-pink",
    "mi-lila": ".mi-lila",
    "mi-black": ".mi-black",
  }
};

const globalData = {
  "base": [],
};

let lastColorClass = false;


/* Helper
############################################################################ */

const getRandomNumbers = (options) => {
  const { amount, min, max, type } = options;
  const numbers = [];

  for (let i = 0; i < amount; i++) {
    const randomNumber = type === 'int'
      ? Math.floor(Math.random() * (max - min + 1)) + min
      : Math.random() * (max - min) + min;

    numbers.push(randomNumber);
  }

  return numbers;
};

const getRandomColorClass = () => {
  const colors = Object.keys(config.colors);
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  if (lastColorClass === randomColor && randomColor === undefined) {
    getRandomColorClass();
  }

  lastColorClass = randomColor;
  return randomColor;
};

const createLinkList = (links) => {
  const linkList = !links
    ? false
    : links.map(link => {
      return `<li><a href="${link.url}" class="link">${link.text}</a></li>`;
    });

  const linksHtml = !linkList
    ? ''
    : `
      <ul class="links">
        ${linkList.join('')}
      </ul>
    `;

  return linksHtml;
};

/* Layouts
############################################################################ */


const stripLayoutData = (data) => {
  const { links, background, cssClasses } = data;
  const additonalClasses = cssClasses ? cssClasses : '';
  const linksHtml = createLinkList(links);
  const colorClass = background === 'auto' ? getRandomColorClass() : '';
  const randomDelays = getRandomNumbers({
    "amount": 2,
    "min": 0,
    "max": 2,
    "type": "float"
  });

  return {
    linksHtml,
    colorClass,
    additonalClasses,
    randomDelays
  };

};

const homeLayout = (data) => {

  const { id, title, subtitle } = data;
  const { linksHtml, colorClass, additonalClasses, randomDelays } = stripLayoutData(data);

  return `
    <section class="home ${colorClass} ${additonalClasses} snap-in" data-js-observe id="${id}">
      <h1 style="transition-delay:${randomDelays[0]}s">${title}</h1>
      <p style="transition-delay:${randomDelays[1]}s">${subtitle}</p>
      ${linksHtml}
    </section>
  `;
};

const pageLayout = (data) => {

  const { id, title, subtitle, image } = data;
  const { linksHtml, colorClass, additonalClasses, randomDelays } = stripLayoutData(data);

  const imageHtml = !image
    ? ''
    : `
      <figure class="image-wrapper">
        <img src="${image}" alt="${title}">
      </figure>
    `;
  return `
    <section class="page ${colorClass} ${additonalClasses} snap-in" data-js-observe id="${id}">
      <div class="text-wrap">
        <h2 style="transition-delay:${randomDelays[0]}s">${title}</h2>
        <p style="transition-delay:${randomDelays[0]}s">${subtitle}</p>
        ${linksHtml}
      </div>
      ${imageHtml}
    </section>
  `;
};

const quoteLayout = (data) => {

  const { id, quote, author, date, image } = data;
  const { linksHtml, colorClass, additonalClasses, randomDelays } = stripLayoutData(data);

  return `
    <section class="quote ${colorClass} ${additonalClasses} snap-in" data-js-observe id="${id}" style="background-image: url(${image})">
      <blockquote>
        <cite>${quote}</cite>
        <div class="cite-meta">
          <p class="author">${author}</p>
          <p class="date">${date}</p>
        </div>
      </blockquote>
    </section>
  `;
};

const imageStripeLayout = (data) => {
  const { id, images } = data;
  const { linksHtml, colorClass, additonalClasses, randomDelays } = stripLayoutData(data);

  return `
    <section class="image-stripe ${colorClass} ${additonalClasses} snap-in" data-js-observe id="${id}">
      <ul class="image-list" data-js-horizontal-scroll-container>
        ${images.map(image => {
    return `<li data-js-observe><img src="${image}" alt="${id}"></li>`;
  }).join('')}
      </ul>
      ${linksHtml}
    </section>
  `;
};

const layouts = {
  "home": homeLayout,
  "page": pageLayout,
  "image-stripe": imageStripeLayout,
  "quote": quoteLayout
};



/* Functions
############################################################################ */

/* Render Data
---------------------------------------------------------------------------- */

const renderData = (contentData) => {
  const targetContainer = document.querySelector('[data-js-content]');

  const html = contentData.map(item => {
    const { layout } = item;
    return layouts[layout](item);
  });

  targetContainer.innerHTML = html.join('');

};


/* Render Data
---------------------------------------------------------------------------- */

const getContent = (section) => {

  const contentUrl = config.content[section];

  fetch(contentUrl)
    .then(response => response.json())
    .then(responseData => {
      globalData.base = responseData.data;
      renderData(responseData.data);
      addObserver();
      addHorizontalScroll();
      addKeyboardEvents();
    });
};


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




/* Observer
---------------------------------------------------------------------------- */

const addObserver = () => {
  const observedElements = document.querySelectorAll('[data-js-observe]');
  const options = { rootMargin: "0px", threshold: 0.6 };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in-view");
      } else {
        entry.target.classList.remove("is-in-view");
      }
    });
  }, options);

  observedElements.forEach(function (jadeScale) {
    observer.observe(jadeScale);
  });
}


/* Main
############################################################################ */

document.addEventListener('DOMContentLoaded', function () {
  getContent("base");
});