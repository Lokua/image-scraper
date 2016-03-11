;(() => { 'use strict'

let store

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.action === 'ackStore') {
    console.log('store:', msg.store);
    store = msg.store;
    exec();
  }
});

chrome.runtime.sendMessage({
  action: 'reqStore'
});

function exec() {
  const div = document.createElement('div');
  div.className = 'images-container';
  store.imageUrls.forEach(url => {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'image-container';
    const img = document.createElement('img');
    img.src = url;
    imgContainer.appendChild(img);
    div.appendChild(imgContainer);
  });
  document.body.appendChild(div);
}

// end iife
})();
