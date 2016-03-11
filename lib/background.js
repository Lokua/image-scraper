'use strict';

// our app's namespace
const $$ = {};
$$.store = { imageUrls: [] };
$$.NO_TITLE = '(no title)';
$$.store.lastDocumentTitle = $$.NO_TITLE;
$$.store.lastUrl = '';

$$.ready = callback => {
  document.addEventListener('DOMContentLoaded', callback);
};

$$.getActiveTab = callback => {
  const query = { currentWindow: true, active: true };
  chrome.tabs.query(query, tabs => callback(tabs[0]));
};

$$.scrapeImages = tab => {
  chrome.tabs.executeScript(tab.id, {
    file: 'lib/scrape-images.js'
  });
};

$$.showResults = () => {
  // TODO: check if results.html is already open,
  // and try to refresh that page so new scrapes show up...
  // PSUEDO:
  // find out if tab is already open
  // if not open, else focus and send message to update data
  window.open('lib/results.html');
};

chrome.runtime.onMessage.addListener((msg, sender) => {
  switch (msg.action) {

    // emitted from `scrape-images.js` after active tab has been crawled
    case 'scrapeImages':

      $$.store.lastUrl = msg.url;
      $$.store.lastDocumentTitle = msg.documentTitle || $$.NO_TITLE;

      // add newly scraped images that aren't already in store
      msg.imageUrls.forEach(url => {
        if (!$$.store.imageUrls.includes(url)) {
          $$.store.imageUrls.push(url);
        }
      });

      chrome.tabs.query({ title: 'ImageScraper:Results' }, tabs => {
        const tab = tabs[0];

        if (!msg.imageUrls.length) {
          return chrome.tabs.update(tab.id, { active: true });
        }

        // if tab exists, results page is already open
        if (tab) {

          chrome.runtime.sendMessage({
            action: 'ackStore',
            store: $$.store,
            update: true
          });

          chrome.tabs.update(tab.id, { active: true });

        } else {
          $$.showResults();
        }
      });

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
