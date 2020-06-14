const pgnmentor = 'https://www.pgnmentor.com/files.html';
// body > div > table > tbody > tr > td > table > tbody > 
const selector = 'tr > td > a';

import $ from 'cheerio';
import rp from 'request-promise';

const jsonFile = process.cwd() + '/downloads.json';

let downloadLinks = {
  players: [],
  openings: [],
  events: []
};

console.log('`downloads.json` set to ' + jsonFile);

rp(pgnmentor)
  .then((html) => {
    console.log('Starting scanning ' + pgnmentor);
    const res = $(selector, html);
    console.log('Starting analysis...')

    const length = res.length;
    let skipped = 0;

    // console.log($(selector, html));
    for (let i = 0; i < length; i++) {
      var link = $(selector, html)[i].attribs.href;

      // exclude links
      if (!link.endsWith('.zip')/*link.startsWith('#')*/) {
        skipped++;
        continue;
      } else if (!link.startsWith('/'))
        link = '/' + link;

      if (link.startsWith('/players'))
        downloadLinks.players.push(link);
      else if (link.startsWith('/openings'))
        downloadLinks.openings.push(link);
      else if (link.startsWith('/events'))
        downloadLinks.events.push(link);

      console.log('Added link: ' + link)
    }

    console.log('There were ' + length + ' downloads available');
    let totalLinks = downloadLinks.players.length + downloadLinks.openings.length + downloadLinks.events.length;
    console.log('There were ' + totalLinks + ' added to the list');
    console.log('There were ' + skipped + ' links skipped');

    console.log('There were ' + downloadLinks.players.length + 'links in PLAYERS');
    console.log('There were ' + downloadLinks.openings.length + 'links in OPENINGS');
    console.log('There were ' + downloadLinks.events.length + 'links in EVENTS');

  })
  .catch((err) => {
    console.error(err);
  });
