/*eslint-disable consistent-return*/
(() => { 'use strict';

let urls = [];

_.walk(document.body, node => {
  
  // ignore text nodes
  if (node.nodeType === 3 ||
      node.tagName && node.tagName.toLowerCase() === 'script') {
    return;
  }

  // regular image
  if (node.src && !urls.includes(node.src)) {
    return urls.push(node.src);
  }

  // background-image
  if (node.style) {
    let url = node.style.getPropertyValue('background-image');
    if (url) {
      url = url.replace(/url\(|[)"]/g, '');
      if (!urls.includes(url)) urls.push(url);
    }
  }
});

// urls {wrapped} for easier debugging
console.log('urls: %o', { urls });

// notify `background.js`
chrome.runtime.sendMessage({
  action: 'scrapeImages:scrapeComplete',
  imageUrls: urls,
  title: document.title
});

// end iife
})();
