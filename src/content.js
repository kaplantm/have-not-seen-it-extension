/*global chrome*/
/* src/content.js */
import React from "react";
import ReactDOM from "react-dom";
import "./content.css";

class Main extends React.Component {
  componentDidMount() {
    console.log("did mount");
    const url = window.location.href;

    console.log("url ", url);
    const siteType = getSiteType(url);

    if (siteType) {
      // Will need to do logic to get movie name
      const movieTitle = "The Shawshank Redemption";
      console.log("siteType ", siteType);
      //Request movie detected on page
      chrome.runtime.sendMessage({ movieTitle: movieTitle, siteType });
    }
  }

  render() {
    console.log(this.windowURL);
    return (
      <div className={"my-extension"}>
        <h1>Hello world - My first Extension</h1>
      </div>
    );
  }
}

const app = document.createElement("div");
app.id = "my-extension-root";

document.body.appendChild(app);
ReactDOM.render(<Main />, app);
app.style.display = "none";
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("request", request);
  // if (request.message === "clicked_browser_action") {
  //   toggle();
  // }

  if (request.movieSummary && request.siteType) {
    //Get summary and inject into page
    console.log("movieSummary", request.movieSummary);
    updateSummaries("test summary", request.siteType);
  }
});

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

function updateSummaries(summary = "Some stuff happens, probably.", site) {
  switch (site) {
    case "imdb":
      const summaryFields = document.getElementsByClassName("summary_text");
      console.log("site is imdb");
      Array.from(summaryFields).forEach(summaryField => {
        summaryField.innerHTML = summary;
      });
      break;
    default:
      console.log("not an included site, do nothing");
  }
}

// function toggle() {
//   if (app.style.display === "none") {
//     app.style.display = "block";
//   } else {
//     app.style.display = "none";
//   }
// }
