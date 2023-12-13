// script.js
// CTEC 126 Project 1

/* UTILITIES */

// Clears out the innerHTML of the element passed in as a parameter
function clear(panelID) {
    console.log('clear!');
    const panel = document.getElementById(panelID);
    panel.innerHTML = '';
}

// Clears any intervals passed as arguments
function clearIntervals(...intervals) {
    console.log('Stopping intervals...');
    intervals.forEach(interval => clearInterval(interval));
    console.log('All intervals have been stopped');
}

// Gets a random element from an array passed in as a parameter
function randomValueFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/* PANELS */

// Displays a random quote from the array in the HTML element that has the ID of 'quotesPanel'
function displayQuotesPanel() {
    console.log('Quotes function called');
    clear("quotesPanel");

    const quotes = [
        "Nothing is as easy as it looks",
        "Everything takes longer than you think",
        "Anything that can go wrong will go wrong",
        "If there is a possibility of several things going wrong, the one that will cause the most damage will be the one to go wrong",
        "If there is a worse time for something to go wrong, it will happen then.",
        "If anything simply cannot go wrong, it will anyway",
        "If everything seems to be going well, you have obviously overlooked something.",
        "Nature always sides with the hidden flaw", "It is impossible to make anything foolproof because fools are so ingenious.",
        "Whenever you set out to do something, something else must be done first", "Every solution breeds new problems.",
        "Trust everybody ... then cut the cards", "Two wrongs are only the beginning",
        "If at first you don't succeed, destroy all evidence that you tried",
        "To succeed in politics, it is often necessary to rise above your principles",
        "Exceptions prove the rule ... and wreck the budget", "Success always occurs in private, and failure in full view"
    ];

    // Set the existing quote panel to contain a random quote surrounded in quotes
    const quotesPanel = document.getElementById("quotesPanel");
    quotesPanel.innerHTML = `<p>"${randomValueFromArray(quotes)}"</p>`;
}

// Populates content in the HTML element with the ID of 'newsPanel'
function displayNewsPanel() {
    const news = [
        ['May 22, 2023', 'Really Big News', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum iusto provident sit vero, eius fugiat autem laboriosam, molestiae, quidem incidunt ducimus reiciendis fugit illo quisquam. Autem, veniam voluptas officia incidunt.', 'https://clark.edu'],
        ['May 30, 2023', 'OK News', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum iusto provident sit vero, eius fugiat autem laboriosam, molestiae, quidem incidunt ducimus reiciendis fugit illo quisquam. Autem, veniam voluptas officia incidunt.', 'https://clark.edu'],
        ['June 14, 2023', 'GREAT NEWS!', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum iusto provident sit vero, eius fugiat autem laboriosam, molestiae, quidem incidunt ducimus reiciendis fugit illo quisquam. Autem, veniam voluptas officia incidunt.', 'https://clark.edu'],
        ['July 2, 2023', 'Welcome Back', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum iusto provident sit vero, eius fugiat autem laboriosam, molestiae, quidem incidunt ducimus reiciendis fugit illo quisquam. Autem, veniam voluptas officia incidunt.', 'https://clark.edu']
    ];

    const newsItems = document.getElementById("newsPanel");

    news.forEach(([date, title, description, link]) => {
        // Create elements for each part of this particular news article

        const heading = document.createElement("h3");
        heading.classList.add("mt-4");
        heading.innerHTML = `${title} - ${date}`;

        const descriptionParagraph = document.createElement("p");
        descriptionParagraph.innerHTML = description;

        const linkAnchor = document.createElement("a");
        linkAnchor.style.color = "black";
        linkAnchor.href = link;
        linkAnchor.target = "_blank";
        linkAnchor.innerHTML = "Read more >";

        const linkParagraph = document.createElement("p");
        linkParagraph.append(linkAnchor);

        // Create a containing element for these elements, then add it to the existing list
        const article = document.createElement("article");
        article.append(heading, descriptionParagraph, linkParagraph);
        newsItems.append(article);
    });
}

// Populates content in the HTML element with the ID of 'featuredStudentPanel'
function displayFeaturedStudentPanel() {
    clear('featuredStudentPanel');

    const featuredStudents = [
        ['Tommy Henriksen', 'Tommy Henriksen (born February 21, 1964) is an American musician from Port Jefferson, New York best known for his work as a guitarist, bassist and songwriter with Alice Cooper, Hollywood Vampires and German metal band Warlock. He has also fronted punk rockers P.O.L. and released several albums as a solo artist. In addition, Henriksen is a sought-after songwriter, arranger, producer and mixer who has worked with artists such as Lady Gaga, Meat Loaf, Lou Reed, Halestorm, Kesha, and Daughtry. Henriksen is currently based out of Zurich, Switzerland where he lives with his family.', 'img/student1.jpg'],
        ['John Bonham', 'John Henry Bonham (31 May 1948 – 25 September 1980) was an English musician and songwriter, best known as the drummer for the British rock band Led Zeppelin. Bonham was esteemed for his speed, power, fast bass drumming, distinctive sound, and "feel" for the groove. He is regarded as the greatest and most influential rock drummer of all time. Rolling Stone magazine ranked him number 1 in their list of the "100 Greatest Drummers of All Time."', 'img/student2.jpg'],
        ['Dave Matthews', 'David John Matthews (born January 9, 1967) is a South African-born American singer-songwriter, musician and actor, best known as the lead vocalist, songwriter, and guitarist for the Dave Matthews Band. Matthews was born in Johannesburg, and moved frequently between South Africa, the United Kingdom, and the United States while growing up. Matthews mainly plays acoustic guitar, which he started playing at the age of nine.', 'img/student3.jpg'],
        ['Alice Cooper', 'Alice Cooper (born Vincent Damon Furnier; February 4, 1948)is an American singer, songwriter, and actor whose career spans over fifty years. With his distinctive raspy voice and a stage show that features guillotines, electric chairs, fake blood, deadly snakes, baby dolls, and dueling swords, Cooper is considered by music journalists and peers alike to be "The Godfather of Shock Rock". He has drawn equally from horror films, vaudeville, and garage rock to pioneer a macabre and theatrical brand of rock designed to shock people.', 'img/student4.jpg']
    ];

    const [studentName, studentDescription, studentImage] = randomValueFromArray(featuredStudents);

    // Create elements for each part of the panel

    const imageElement = document.createElement("img");
    imageElement.classList.add("studentpic", "rounded", "mx-auto", "d-block");
    imageElement.src = studentImage;
    imageElement.alt = studentName;

    const nameParagraph = document.createElement("p");
    nameParagraph.classList.add("text-center", "fw-bold");
    nameParagraph.innerHTML = studentName;

    const descriptionParagraph = document.createElement("p");
    descriptionParagraph.innerHTML = studentDescription;

    // Add these elements to the existing featured student panel
    const featuredStudentPanel = document.getElementById("featuredStudentPanel");
    featuredStudentPanel.append(imageElement, nameParagraph, descriptionParagraph);
}

// Starts the entire process
window.addEventListener("DOMContentLoaded", () => {
    displayQuotesPanel();
    displayNewsPanel();
    displayFeaturedStudentPanel();

    const quotesTimer = setInterval(displayQuotesPanel, 15000);
    const featuredStudentTimer = setInterval(displayFeaturedStudentPanel, 10000);

    const logo = document.getElementById("theLogo");
    logo.addEventListener("click", () => {
        clearIntervals(quotesTimer, featuredStudentTimer);
    });
});
