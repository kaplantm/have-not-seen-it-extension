/*global chrome*/
/* src/content.js */
import React from "react";
import ReactDOM from "react-dom";
import "./content.css";

// class Main extends React.Component {
//   componentDidMount() {

//   }

//   render() {
//     console.log(this.windowURL);
//     return (
//       <div className={"my-extension"}>
//         <h1>Hello world - My first Extension</h1>
//       </div>
//     );
//   }
// }

// const app = document.createElement("div");
// app.id = "my-extension-root";

// document.body.appendChild(app);
// ReactDOM.render(<Main />, app);
// app.style.display = "none";

function init() {
  // console.log("did mount");
  const url = window.location.href;

  // console.log("url ", url);
  const siteType = getSiteType(url);

  if (siteType) {
    // Will need to do logic to get movie name
    const movieTitle = findTitleForSite(siteType); //"The Shawshank Redemption";
    // console.log("siteType movieTitle", siteType, movieTitle);
    if (movieTitle) {
      //Request movie detected on page
      chrome.runtime.sendMessage({ movieTitle, siteType });
    }
  }
}
init();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // console.log("request", request);
  // if (request.message === "clicked_browser_action") {
  //   toggle();
  // }
  const { movieSummaries, siteType } = request;
  if (movieSummaries && siteType) {
    //Get summary and inject into page
    // console.log("movieSummary", movieSummaries);
    updateSummaries(movieSummaries, siteType);
  }
});

function findTitleForSite(siteType) {
  let titleText = null;
  //TODO should replace two cases w/ obj that holds conditions for site
  switch (siteType) {
    case "imdb":
      const titleElement = document.getElementsByTagName("H1")[0];
      if (titleElement) {
        const rawTitleText = titleElement.innerText;
        titleText = rawTitleText.split(" (")[0];
        const summaryFields = document.getElementsByClassName("summary_text");
        // console.log("site is imdb");
        Array.from(summaryFields).forEach(summaryField => {
          summaryField.style.minHeight = "50px";
        });
      }
      break;
    default:
    // console.log("not an included site, no title found, do nothing");
  }
  return titleText;
}
function getSiteType(url) {
  const sites = {
    imdb: "https://www.imdb.com/title/"
  };
  let siteType = null;
  Object.keys(sites).some(key => {
    const isKnownSite = url.includes(sites[key]);
    if (isKnownSite) {
      siteType = key;
      return true;
    }
    return false;
  });
  return siteType;
}

function updateSummaries(summaries = ["Some stuff happens, probably."], site) {
  const randomSummaryIndex = Math.floor(summaries.length * Math.random());
  const randomSummary = summaries[randomSummaryIndex].content;
  switch (site) {
    case "imdb":
      const summaryFields = document.getElementsByClassName("summary_text");
      // console.log("site is imdb");
      Array.from(summaryFields).forEach(summaryField => {
        summaryField.innerHTML = randomSummary;
      });
      break;
    default:
    // console.log("not an included site, do nothing");
  }
}

// function toggle() {
//   if (app.style.display === "none") {
//     app.style.display = "block";
//   } else {
//     app.style.display = "none";
//   }
// }
