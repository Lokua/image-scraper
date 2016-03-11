;(() => { 'use strict'

const cache = new Set();

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.action === 'ackStore') {

    let imageUrls = [];

    // if update, the results page has already been
    // loaded and is now the active tab.
    if (msg.update) {

      console.log('updating...');

      // only add new images
      imageUrls = msg.store.imageUrls.filter(x => {
        const include = !cache.has(x);
        cache.add(x);
        return include;
      });

    } else {
      imageUrls = msg.store.imageUrls;
    }

    appendImages(msg.store.lastDocumentTitle, imageUrls);
  }
});

chrome.runtime.sendMessage({
  action: 'reqStore'
});

function appendImages(title, imageUrls) {
  const div = document.createElement('div');
  div.className = 'images-container';

  const heading = document.createElement('h2');
  heading.textContent = title;
  div.appendChild(heading);

  imageUrls.forEach(url => {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'image-container';

    const img = document.createElement('img');
    img.src = url;

    const caption = document.createElement('small');
    caption.textContent = url.slice(url.lastIndexOf('/')+1);

    imgContainer.appendChild(img);
    imgContainer.appendChild(caption);
    div.appendChild(imgContainer);
  });

  document.body.appendChild(div);
}

function inspect(msg, obj) {
  try {
    console.log(`${msg}: %o`, JSON.parse(JSON.stringify(obj)));
  } catch (e) {
    console.warn('inspect error (most likely a circular reference)');
  }
}

// end iife
})();
