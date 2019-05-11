// Called when the user clicks on the browser action
// chrome.browserAction.onClicked.addListener(function(tab) {
//   // Send a message to the active tab
// chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//   var activeTab = tabs[0];
//   chrome.tabs.sendMessage(activeTab.id, {
//     message: "clicked_browser_action"
//   });
// });
// });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.movieTitle && request.siteType) {
    getSummaryAsync(request.movieTitle).then(movieSummary => {
      console.log("before send", movieSummary);
      // sendResponse({ movieSummary, siteType: request.siteType });
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {
          movieSummary,
          siteType: request.siteType
        });
      });
    });
  }
});

// chrome.webNavigation.onCompleted.addListener(function(details) {
//   if (details.url) {
//     const siteType = getSiteType(details.url);
//     if (siteType) {
//       // alert("siteType", siteType);
//       getMoviesAsync().then(movies => {
//         chrome.tabs.query({ active: true, currentWindow: true }, function(
//           tabs
//         ) {
//           var activeTab = tabs[0];
//           chrome.tabs.sendMessage(activeTab.id, {
//             message: "hasMovies",
//             siteType: siteType,
//             movies: movies
//           });
//         });
//       });
//     }
//   }
// });

// function getSiteType(url) {
//   const sites = {
//     imdb: "https://www.imdb.com/title/"
//   };
//   let siteType = null;
//   Object.keys(sites).some(key => {
//     const isKnownSite = url.includes(sites[key]);
//     if (isKnownSite) {
//       siteType = key;
//       return true;
//     }
//     return false;
//   });
//   return siteType;
// }

// add catch? So don't send data to tab if error
async function getSummaryAsync(movieTitle) {
  const encodedTitle = encodeURI(movieTitle);
  const response = await fetch(
    "http://localhost:3001/api/movies?title=" + encodedTitle,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }
  );
  console.log({ response });
  const summary = await response.json();

  return summary;
}

// async function getMoviesAsync() {
//   var response = await fetch("http://localhost:3001/api/movies", {
//     method: "GET",
//     mode: "cors",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json"
//     }
//   });
//   console.log({ response });
//   var movies = await response.json();

//   return movies;
// }
