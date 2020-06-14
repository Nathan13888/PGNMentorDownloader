import { createWriteStream, unlink } from 'fs';
import { get } from 'http';

const jsonFile = process.cwd() + '/downloads.json';

let downloadLinks = {
    players: [],
    openings: [],
    events: [],
    misc: []
};

// exit if downloads.json does not exist

console.log('Downloading Links...');

for (let i = 0; i < downloadLinks.length; i++) {
    const url = "https://www.pgnmentor.com" + downloadLinks[i];
    const dest = process.cwd() + "/downloads" + downloadLinks[i];
    console.log('Downloading ' + downloadLinks[i] + ' to ' + dest);
}

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