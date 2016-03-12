((global) => { 'use strict';

/**
 * Global extension namespace shared between
 * `background.js` and `popup.js`
 *
 * @type {Object}
 */
global.$$ = {

  /**
   * Our app's in-memory store
   *
   * @type {Object}
   */
  store: {

    /**
     * stores the results of each `scrape-images.js` execution
     *
     * @type {Array}
     */
    scrapes: []
  },

  /**
   * Execute `callback` after the `DOMContentLoaded` event is fired
   *
   * @param  {Function} callback
   */
  ready(callback) {
    document.addEventListener('DOMContentLoaded', callback);
  },

  /**
   * Execute `callback` after the current active tab is queried
   *
   * @param  {Function} callback
   */
  getActiveTab(callback) {
    const query = { currentWindow: true, active: true };
    chrome.tabs.query(query, tabs => callback(tabs[0]));
  },

  /**
   * Execute the content script `scrape-images.js`
   *
   * @param  {Tab} tab - active `chrome.tabs.Tab` object
   */
  scrapeImages(tab) {
    chrome.tabs.executeScript(tab.id, {
      file: 'lib/_.js'
    }, () => {
      chrome.tabs.executeScript(tab.id, {
        file: 'lib/scrape-images.js'
      });
    });
  }
};

/**
 * OO/Functional equiv of "switch" statement for event handles
 *
 * @type {Object}
 */
const actionHandlers = {

  'scrapeImages:scrapeComplete' (msg) {
    console.log('scrapeImages:scrapeComplete called');

    // TODO: push to local storage, etc etc
    $$.store.scrapes.push(msg);

    // if this message is the first, let results:loaded handle
    // msg forwarding
    if ($$.store.scrapes.length === 1) {
      return showResultsPage();
    }

    chrome.tabs.query({ title: 'ImageScraper:Results' }, tabs => {
      const tab = tabs[0];

      // if no results tab is present, this is either
      // the first time the tab has been activated, or the tab
      // was manually closed
      //
      // TODO: logic to provide past messages if this is a reopen
      if (!tab) {
        showResultsPage(/*() => sendResults(msg)*/);

      } else {
        sendResults(msg);

        // refocus the results tab
        chrome.tabs.update(tab.id, { active: true });
      }
    });
  },

  'results:loaded' (msg) {
    console.log('results:loaded called');
    const last = $$.store.scrapes[$$.store.scrapes.length-1];
    sendResults(last);
  }
};

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (actionHandlers.hasOwnProperty(msg.action)) {
    actionHandlers[msg.action](msg);
  }
});

function sendResults(msg) {
  console.log('sendResults called');
  chrome.runtime.sendMessage({
    action: 'background:scrapeProcessed',
    imageUrls: msg.imageUrls,
    title: msg.title
  });
}

function showResultsPage(callback) {
  window.open('lib/results.html');
  if (callback) callback();
}

// end iife
})(this);
