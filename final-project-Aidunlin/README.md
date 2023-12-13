# CTEC 126 - Final Project

Updated for Spring 2023

## Overview

This assignment will have you develop a web page that displays news stories from the New York Times. The stories will be retrieved using JavaScript fetch() (AJAX) calls to the application programming interface (API) provided by the New York Times.

Your page must allow users to display news from the following sections from the Top Stories API:

- Home (the default news displayed when the page is first loaded)
- Arts
- Business
- Dining
- Fashion
- Health Magazine
- National Opinion
- Politics
- Real Estate
- Science
- Sports
- Technology
- World

## Getting an API Key

- You will need an API key in order to communicate with the API.
- Use the page in Canvas to obtain your API key.

1. A folder named **test-api-key** which has a file named **test_api_key.html** that includes some very simple JavaScript has been provided to help you test your key. Look for the place in the code to insert your API key.
2. Test your API key. If it's not working, contact the instructor as soon as possible.
3. Now that you have your API key and have tested it, you are ready to start coding.

## Assignment Details

- Your page must show all of the stories returned from the API.
- An HTML ```<select>``` control should be used that allows a person to select the news section they want to retrieve stories from.
- The stories should be loaded on page load.
- When the user selects another news section, only the stories section of the page should reload. The entire page MUST NOT reload.
- A Refresh button must be provided that allows a person to click it to get the latest stories.
- For each story, the following information must be displayed:
  - The "section" of the newspaper the article appeared in
  - The "title" of the article. Make the title a clickable link to the URL of the story
  - The story "abstract"
  - The story "byline"
  - The "published date" in a format other than the one supplied.
  - One of the multimedia images for the news story
- All of the news stories should be displayed using a "card" styling
- All of your JavaScript code must be in the **js/nyt.js** file
- Your page needs to be styled using the **nyt.css** stylesheet and look professional
- Your HTML and CSS must validate
- You must not have any WAVE errors, alerts or contrast errors
- Push your code back to GitHub when you have completed the assignment
- Submit the words "Ready to Grade" in Canvas
