const columns = document.getElementById("columns");
const newColumnButton = document.getElementById("new-column-button");
const clearAllButton = document.getElementById("clear-all-button");

function save() {
  const data = [];
  columns.querySelectorAll(".column").forEach(column => {
    data.push({
      name: column.querySelector(".column-name").value,
      cards: [...column.querySelectorAll(".card-text")].map(cardText => cardText.value),
    });
  });
  localStorage.setItem("data", JSON.stringify(data));
}

function load() {
  columns.innerHTML = "";

  const data = localStorage.getItem("data");
  if (!data) return;

  JSON.parse(data).forEach((columnData) => {
    const column = newColumn(columnData.name);
    const cards = columnData.cards.map((cardData) => newCard(cardData));
    column.querySelector(".cards").append(...cards);
    columns.append(column);
  });
}

window.onload = () => {
  load();

  newColumnButton.onclick = () => {
    const column = newColumn();
    columns.append(column);
    column.scrollIntoView({ behavior: "smooth" });
    save();
  };

  clearAllButton.onclick = () => {
    if (confirm("Are you sure you want to clear your board?")) {
      localStorage.removeItem("data");
      columns.innerHTML = "";
    }
  };
};

function newColumn(columnName = "Column") {
  const newColumn = document.createElement("div");
  newColumn.classList.add("column");

  const columnHeading = newColumnHeading(newColumn, columnName);
  newColumn.append(columnHeading);

  const cards = document.createElement("div");
  cards.classList.add("cards");
  newColumn.append(cards);

  const newCardButton = document.createElement("button");
  newCardButton.classList.add("new-card-button");
  newCardButton.onclick = () => {
    const card = newCard();
    cards.append(card);
    card.scrollIntoView({ behavior: "smooth" });
    save();
  };
  newCardButton.innerText = "+";
  newColumn.append(newCardButton);

  return newColumn;
}

function newColumnHeading(column, columnName = "Column") {
  const columnHeading = document.createElement("div");
  columnHeading.classList.add("column-heading");

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-column-button");
  deleteButton.onclick = () => {
    if (column.querySelectorAll(".card").length == 0 || confirm("Are you sure you want to delete this column?")) {
      column.remove();
      save();
    }
  };
  deleteButton.innerText = "-";
  columnHeading.append(deleteButton);

  const nameInput = document.createElement("input");
  nameInput.classList.add("column-name");
  nameInput.value = columnName;
  nameInput.ariaLabel = "Column name";
  nameInput.oninput = () => save();
  columnHeading.append(nameInput);

  return columnHeading;
}

function newCard(cardText = "Card") {
  const card = document.createElement("div");
  card.classList.add("card");

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-card-button");
  deleteButton.onclick = () => {
    card.remove();
    save();
  };
  deleteButton.innerText = "-";
  card.append(deleteButton);

  const textInput = document.createElement("textarea");
  textInput.classList.add("card-text");
  textInput.ariaLabel = "Card text";
  textInput.innerText = cardText;
  textInput.oninput = () => save();
  card.append(textInput);

  return card;
}
