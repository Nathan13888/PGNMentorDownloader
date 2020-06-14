const pgnmentor = 'https://www.pgnmentor.com/files.html';
// body > div > table > tbody > tr > td > table > tbody > 
const selector = 'tr > td > a';

import $ from 'cheerio';
import { createWriteStream, unlink } from 'fs';
import { get } from 'http';
import rp from 'request-promise';

let downloadLinks = [];
/*= {
  players: [],
  events: []
};*/

rp(pgnmentor)
  .then((html) => {
    console.log('Starting scanning ' + pgnmentor);
    const res = $(selector, html);
    console.log('Starting analysing...')

    const length = res.length;
    let skipped = 0;

    // console.log($(selector, html));
    for (let i = 0; i < length; i++) {
      var link = $(selector, html)[i].attribs.href;

      // exclude links
      if (link.startsWith('#')) {
        skipped++;
        continue;
      } else if (!link.startsWith('/'))
        link = '/' + link;

      downloadLinks.push(link);
      console.log('Added link: ' + link)
    }

    console.log('There were ' + length + ' downloads available');
    console.log('There were ' + downloadLinks.length + " added to the list")
    console.log('There were ' + skipped + 'links skipped')
    console.log('\n\n Downloading Links...');

    for (let i = 0; i < downloadLinks.length; i++) {
      const url = "https://www.pgnmentor.com" + downloadLinks[i];
      const dest = ""
    }
  })
  .catch((err) => {
    console.error(err);
  });


var download = (url, dest, cb) => {
  var file = createWriteStream(dest);
  var request = get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', (err) => { // Handle errors
    unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};