/*global chrome*/
/* src/content.js */
import React from "react";
import ReactDOM from "react-dom";
import "./content.css";

class Main extends React.Component {
  componentDidMount() {}

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
  if (request.message === "clicked_browser_action") {
    toggle();
  }
  if (request.message === "hasMovies") {
    console.log("hasMovies");
    console.log("movies, siteType", request.movies, request.siteType);

    updateSummaries(request.movies, request.siteType);
  }
});

function updateSummaries(movies, site) {
  switch (site) {
    case "imdb":
      const summaryFields = document.getElementsByClassName("summary_text");
      console.log("site is imdb");
      Array.from(summaryFields).forEach(summaryField => {
        summaryField.innerHTML = "crappy summary";
      });
      break;
    default:
      console.log("not an included site, do nothing");
  }
}

function toggle() {
  if (app.style.display === "none") {
    app.style.display = "block";
  } else {
    app.style.display = "none";
  }
}
