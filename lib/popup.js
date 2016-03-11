'use strict';

$$.ready(() => {

  const scrapeButton = document.querySelector('.button--scrape');
  // const openButton = document.querySelector('.button--open');
  // openButton.addEventListener('click', $$.open);

  scrapeButton.addEventListener('click', () => {
    $$.getActiveTab($$.scrapeImages);
  });

});
