const membersElement = document.getElementById("members");

window.onload = () => {
  fetch("option1.json")
    .then((value) => value.json())
    .then((value) => showPeople(value.members))
    .catch((reason) => console.error(reason));
};

function showPeople(members) {
  members.forEach(memberData => {
    const fullName = `${memberData.firstName} ${memberData.lastName}`;

    const member = document.createElement("div");
    member.classList.add("card");
    member.style.maxWidth = "240px";

    const image = document.createElement("img");
    image.classList.add("img-fluid", "card-img-top", "border", "rounded");
    image.src = memberData.URL;
    image.alt = fullName;

    const body = document.createElement("div");
    body.classList.add("card-body");

    const heading = document.createElement("h2");
    heading.classList.add("card-title");
    heading.innerText = fullName;

    const hobbiesHeading = document.createElement("strong");
    hobbiesHeading.classList.add("card-subtitle");
    hobbiesHeading.innerText = "Hobbies";

    const hobbies = document.createElement("ul");
    memberData.hobbies.forEach((hobby) => hobbies.innerHTML += `<li>${hobby}</li>`);

    const misc = document.createElement("p");
    misc.classList.add("card-text");
    misc.innerHTML = `<strong>Favorite band:</strong><br>${memberData.miscellaneous.favoriteBand}`;
    misc.innerHTML += `<br><strong>Favorite food:</strong><br>${memberData.miscellaneous.favoriteFood}`;

    body.append(heading, hobbiesHeading, hobbies, misc);

    member.append(image, body);

    membersElement.append(member);
  });
}