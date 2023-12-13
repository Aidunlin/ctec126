window.onload = () => {
  /** @type {HTMLUListElement} */
  const errorBucket = document.getElementById("errors");

  /** @type {HTMLInputElement} */
  const firstNameText = document.getElementById("first-name");
  /** @type {HTMLInputElement} */
  const lastNameText = document.getElementById("last-name");

  /** @type {HTMLInputElement} */
  const addressText = document.getElementById("address");
  /** @type {HTMLInputElement} */
  const cityText = document.getElementById("city");
  /** @type {HTMLSelectElement} */
  const stateSelect = document.getElementById("state");

  /** @type {HTMLSelectElement} */
  const productSelect = document.getElementById("product");
  /** @type {HTMLInputElement} */
  const quantityNumber = document.getElementById("quantity");

  /** @type {HTMLInputElement} */
  const acceptCheckbox = document.getElementById("accept");
  /** @type {HTMLInputElement} */
  const submitButton = document.getElementById("submit");

  const fields = [
    firstNameText,
    lastNameText,
    addressText,
    cityText,
    stateSelect,
    productSelect,
    quantityNumber,
    acceptCheckbox,
  ];

  // Fields should only show an error after the submit button's been pressed or when they've been interacted with.
  // Having all of them show errors on page load is annoying and possibly confusing.

  submitButton.onclick = () => {
    fields.forEach(field => {
      field.classList.add("changed");
    });

    // Only update error bucket when submit button's pressed to prevent content from shifting too much.
    errorBucket.innerHTML = "";

    // Funky CSS selecting to get all the invalid inline errors.
    document.querySelectorAll(".changed:invalid + .error").forEach(error => {
      const item = document.createElement("li");
      item.innerText = error.innerText;
      item.onclick = () => error.previousElementSibling.focus();
      errorBucket.append(item);
    });
  };

  fields.forEach(field => {
    field.onblur = () => {
      field.classList.add("changed");
    };
  });
};
