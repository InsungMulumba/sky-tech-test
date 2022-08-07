# Tech Test: Help Search 🔍

## Technology Used

- JavaScript
- Node.js
- Express
- React
- Jest
- SCSS (optional)

## Requirements

- Node.js (16.x.x)
- Text Editor or IDE

## Overview

The purpose of this exercise is to help assess your technical skills as an engineer and how you approach a realistic technical task.

- We **don't** expect you to complete the exercise to perfection or to finish everything.
- This isn't a test of your memory. Please feel free to look things up. However blatant copy-pasting is discouraged.
- If you're struggling, please ask for us for help. We don't want you to be stuck.

## The Code

Your Sky interviewer/recruiter should have provided you a zip of this test. Inside you'll find two directories:

- `api` - A basic server written in Node.js using Express
- `web` - A skeleton React app built using [https://create-react-app.dev/](create-react-app)

To get the project started, open a couple of terminal shells, jump into the `api` and `web` directories and run `npm install` followed by `npm run start`

You should now be see the website on http://localhost:3000/ and the api on http://localhost:3001/search

## The Challenge

Within Sky there is a downstream API for providing search results to sky.com/help. This API exists at https://help-search-api-prod.herokuapp.com/search and can be queried using the `query` parameter like so:

```
https://help-search-api-prod.herokuapp.com/search?query=broadband
```

The Node.js API you've been given currently acts as a simple proxy of this and so can be used in the same way.

```
https://localhost:3001/search?query=broadband
```

The challenge you're tasked with is to augment this API and create a frontend interface. This is broken down into a number of tasks below. You're not expected to complete all of these or do them in any particular order.

The Sky [Toolkit](https://sky.com/toolkit) CSS library has been imported in `web/src/styles/index.scss` however you're welcome to remove this and replace it with your own solution.

While tests are appreciated and encouraged, please avoid wasting any time striving for full test coverage .

### Tasks

**Basic Search - COMPLETED**

- Add a search box which retrieves results via the API and displays them in a list.
- The search should occur without the page refreshing

**Pagination - COMPLETED**

- Add a pagination component to the bottom of the results which fetches the next results without refreshing the page.
- There should be 10 results per page

**URL Rewriting**

- Update the search page so that when the user performs a search, the URL is updated and when they refresh the page it displays the same results.
- This should be done in such a way that if the user presses the back button they're taken to the previous results.
- If you've completed the **pagination** task, you should include the page in the URL.

**Search History - COMPLETED**

- Update the search page to save recent search terms in the browser (Cookies or Local Storage) and display them in a list.
- There should never be more than 5 saved terms.
- The terms should be removed according to FIFO (First In First Out)

**Slugs - COMPLETED**

- Update the API to extract the "slug" at the end of each article URL and add them to the response
- For example the slug for `https://www.sky.com/help/articles/sky-broadband-pro` would be `sky=broadband-pro`

**Sky Mobile - COMPLETED**

- Update the API to prioritise any results containing "Sky Mobile" by pushing them to the top.

**Pagination API - COMPLETED**

- Update the API to accept a `page` parameter which will result in it returning only the result for that page.
- There should be 10 results per page
- This parameter should start at 1
- For example given `page=3` you should return results at indicies `30-39`

**LRU Cache**

- Update the API to implement an LRU (Least Recently Used) cache for search results.
- The cache should never contain more than 5 result sets.
- If a request is received for a term which exists in the cache, the results should be served from there and rather than from the downstream API.
