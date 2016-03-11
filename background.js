'use strict';

// our app's namespace
const $$ = {
  store: {
    imageUrls: []
  }
};

$$.ready = callback => {
  document.addEventListener('DOMContentLoaded', callback);
};

$$.getActiveTab = callback => {
  const query = { currentWindow: true, active: true };
  chrome.tabs.query(query, tabs => callback(tabs[0]));
};

$$.scrapeImages = tab => {
  chrome.tabs.executeScript(tab.id, {
    file: 'scrape-images.js'
  });
};

$$.open = () => {
  // TODO: check if results.html is already open,
  // and try to refresh that page so new scrapes show up...
  window.open('results.html');
};

chrome.runtime.onMessage.addListener((msg, sender) => {
  switch (msg.action) {

    // emitted from `scrape-images.js` after active tab has been crawled
    case 'scrapeImages':

      // add newly scraped images that aren't already in store
      msg.imageUrls.forEach(url => {
        if (!$$.store.imageUrls.includes(url)) {
          $$.store.imageUrls.push(url);
        }
      });
      $$.open();
      break;

    // emitted from results page to gain access to the `store`
    case 'reqStore':
      chrome.runtime.sendMessage({
        action: 'ackStore',
        store: $$.store
      });
      break;

    default:
      console.warn(`There is no listener for action ${msg.action}`);
  }
});
