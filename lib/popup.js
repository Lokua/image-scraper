'use strict';

$$.ready(() => {

  document.querySelector('.button--scrape')
    .addEventListener('click', () => $$.getActiveTab($$.scrapeImages));

});
