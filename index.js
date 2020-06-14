const pgnmentor = 'https://www.pgnmentor.com/files.html';
// body > div > table > tbody > tr > td > table > tbody > 
const selector = 'tr > td > a';

const rp = require('request-promise');
const $ = require('cheerio');

const downloadLinks = [];

rp(pgnmentor)
  .then((html) => {
    const res = $(selector, html);
    const length = res.length;
    let skipped = 0;

    // console.log($(selector, html));
    for (let i = 0; i < length; i++) {
      const link = $(selector, html)[i].attribs.href;

      // exclude links
      if (link.startsWith('#')) {
        skipped++;
        continue;
      }

      downloadLinks.push(link);
      // console.log('Added link: ' + link)
    }

    console.log('There were ' + length + ' downloads available');
    console.log('There were ' + downloadLinks.length + " added to the list")
    console.log('There were ' + skipped + 'links skipped')
  })
  .catch((err) => {
    console.error(err);
  });