/**
@typedef {
  "home" | "arts" | "business" | "dining" | "fashion"
  | "health" | "opinion" | "politics" | "realestate"
  | "science" | "sports" | "technology" | "world"
} Section The main section of a story.
*/

/** 
@typedef {{
  url: string,
  format: string,
  height: number,
  width: number,
  type: string,
  subtype: string,
  caption: string,
  copyright: string,
}} Multimedia Information about media from a story.
*/

/**
@typedef {{
  section: Section,
  subsection: string,
  title: string,
  abstract: string,
  url: string,
  uri: string,
  byline: string,
  item_type: string,
  updated_date: string,
  created_date: string,
  published_date: string,
  kicker: string,
  des_facet: string[],
  org_facet: string[],
  per_facet: string[],
  geo_facet: any[],
  multimedia: Multimedia[]?,
  short_url: string,
}} Story Information about a story.
*/

/**
@typedef {{
  status: string,
  copyright: string,
  section: Section,
  last_updated: string,
  num_results: number,
  results: Story[],
}} Stories Response data from calling the NYT Top Stories API.
*/

/** The API key used for this app. */
const API_KEY = "R9GGKJGSA6T7rkC12818ywYjxoXA108S";

/**
 * A reference to the section select box.
 * @type {HTMLSelectElement}
 */
const sectionSelect = document.getElementById("section-select");

/**
 * A reference to the get stories button.
 * @type {HTMLButtonElement}
 */
const getStoriesButton = document.getElementById("get-stories-button");

/**
 * A reference to the element used to list and display stories.
 * @type {HTMLDivElement}
 */
const storiesDisplay = document.getElementById("stories-display");

/**
 * Used to get dominant color from an image.
 * [View Color Thief API](https://lokeshdhakar.com/projects/color-thief/#api)
 * @type {{ getColor: (image: HTMLImageElement, quality = 10) => [number, number, number] }}
 */
const colorThief = new ColorThief();

/**
 * Creates an endpoint URL to call the NYT Top Stories API.
 * @param {Section} section The section to get stories from.
 */
function makeURL(section = "home") {
  const url = "http://api.nytimes.com/svc/topstories/v2";
  return `${url}/${section}.json?api-key=${API_KEY}`;
}

/**
 * Stores stories and selected section in `localStorage`.
 * @param {Stories} stories
 */
function saveStories(stories) {
  localStorage.setItem("section", sectionSelect.value);
  localStorage.setItem("stories", JSON.stringify(stories));
}

/**
 * Asynchronously returns an array of stories from the specified section.
 * @param {Section} section The section to get stories from.
 * @returns {Promise<Stories>}
 */
async function getStories(section = "home") {
  const url = makeURL(section);
  try {
    const response = await fetch(url);
    const stories = await response.json();
    saveStories(stories);
    return stories;
  } catch (reason) {
    console.error(reason);
  }
}

/**
 * Converts ColorThief color data to an `rgba(...)` string.
 * @param {[number, number, number]} baseColor Color data from ColorThief.
 * @param {number} a Optional alpha value from 0 to 1.
 */
function colorToString(baseColor, a = 1) {
  return `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${a})`;
}

/**
 * Creates a story to be displayed.
 * @param {Story} story The story's data.
 */
function createStoryElement(story) {
  // Need to use one div inside the other to get cards spaced out to work in a BS grid.
  const storyElement = document.createElement("article");
  storyElement.classList.add("col-12", "col-md-6", "col-xl-4", "mb-4");

  const cardElement = document.createElement("div");
  cardElement.classList.add("card", "shadow", "border-2", "rounded-4");
  storyElement.append(cardElement);

  // Some stories might not have any multimedia data.
  // When there is, second multimedia is always a medium-sized thumbnail,
  // which is not too big to significantly slow load times,
  // and not too small to be pixelated on most screen sizes.

  if (story.multimedia && story.multimedia[1]) {
    const imageElement = new Image(story.multimedia[1].width, story.multimedia[1].height);
    imageElement.classList.add("card-img-top", "img-fluid", "rounded-4");

    // Required for Color Thief to work with remote images (from NY Times).
    imageElement.crossOrigin = "anonymous";
    imageElement.src = story.multimedia[1].url;
    imageElement.alt = "";
    // Color Thief only works once the image has fully loaded.
    imageElement.onload = () => {
      const colorData = colorThief.getColor(imageElement);
      const backgroundColor = colorToString(colorData, 0.2);
      const borderColor = colorToString(colorData.map(val => val / 1.5));
      const textColor = colorToString(colorData.map(val => val / 3));

      cardElement.style.backgroundColor = backgroundColor;
      cardElement.style.borderColor = borderColor;
      cardBodyElement.style.color = textColor;
    };
    cardElement.append(imageElement);
  }

  // Textual content is all placed underneath image.

  const cardBodyElement = document.createElement("div");
  cardBodyElement.classList.add("card-body");
  cardElement.append(cardBodyElement);

  const extraDetailsElement = document.createElement("p");
  const date = new Date(story.published_date).toLocaleDateString("en-us", { dateStyle: "long" });
  extraDetailsElement.classList.add("d-flex", "justify-content-between");
  extraDetailsElement.innerHTML = `<span>${story.section}</span><span>${date}</span>`;
  cardBodyElement.append(extraDetailsElement);

  const headingElement = document.createElement("h2");
  headingElement.classList.add("card-title", "card-link");
  const titleLink = document.createElement("a");
  titleLink.classList.add("text-decoration-none");
  // `currentColor` ensures the link will use the color supplied by Color Thief.
  titleLink.style.color = "currentColor";
  titleLink.href = story.url;
  titleLink.target = "_blank";
  titleLink.innerText = story.title;
  headingElement.append(titleLink);
  cardBodyElement.append(headingElement);

  const bylineElement = document.createElement("p");
  bylineElement.classList.add("card-text");
  bylineElement.innerText = story.byline;
  cardBodyElement.append(bylineElement);

  const abstractElement = document.createElement("p");
  abstractElement.classList.add("card-text");
  abstractElement.innerText = story.abstract;
  cardBodyElement.append(abstractElement);

  return storyElement;
}

/**
 * Displays stories.
 * @param {Stories} stories
 */
function displayStories(stories) {
  storiesDisplay.innerHTML = "";

  stories.results.forEach(story => {
    // Just checks for blank/missing section or "admin",
    // as some stories can have valid sections that aren't in the local `Section` typedef.
    if (!story.section || story.section == "admin") {
      return;
    }

    const storyElement = createStoryElement(story);
    storiesDisplay.append(storyElement);
  });

  // (https://masonry.desandro.com/)
  new Masonry(storiesDisplay).layout();
}

/** Displays an error message. */
function showError(reason) {
  console.error(reason);
  storiesDisplay.innerHTML = "Something went wrong, please wait a bit before trying again.";
}

/** Disables select box and get stories button. */
function disableControls() {
  sectionSelect.disabled = true;
  getStoriesButton.disabled = true;
}

/** Enables select box and get stories button. */
function enableControls() {
  sectionSelect.disabled = false;
  getStoriesButton.disabled = false;
}

/** Gets new stories and displays them. */
function updateStories() {
  window.scrollTo({ top: 0 });
  disableControls();

  getStories(sectionSelect.value)
    .then(displayStories)
    .catch(showError)
    .finally(enableControls);
}

window.onload = () => {
  sectionSelect.onchange = () => updateStories();
  getStoriesButton.onclick = () => updateStories();

  const storedSection = localStorage.getItem("section");
  const storedStories = localStorage.getItem("stories");

  if (storedSection && storedStories) {
    sectionSelect.value = storedSection;

    /** @type {Stories} */
    const stories = JSON.parse(storedStories);

    /** Whether the last store is older than 30 minutes. */
    const isStale = Date.now() - Date.parse(stories.last_updated) > 30 * 60 * 1000;

    if (isStale) {
      updateStories();
    } else {
      displayStories(stories);
    }
  } else {
    updateStories();
  }
};
