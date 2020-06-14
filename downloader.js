import fs from 'fs';
import https from 'https';

const jsonFile = process.cwd() + '/downloads.json';

// TODO: exit if downloads.json does not exist

// load downloads.json
fs.readFile(jsonFile, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }

    console.log('Loading downloads.json...')
    let downloadLinks = JSON.parse(data);

    console.log('Downloading Links...');

    downloadList(downloadLinks.players);
    downloadList(downloadLinks.openings);
    downloadList(downloadLinks.events);
});

var downloadList = (links) => {
    for (let i = 0; i < links.length; i++) {
        const url = "https://www.pgnmentor.com" + links[i];
        const dest = process.cwd() + "/downloads" + links[i];
        console.log('Downloading ' + links[i] + ' to ' + dest);
        download(url, dest).catch((err) => { console.log(err) });
    }
}

function download(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest, { flags: "wx" });

        const request = https.get(url, response => {
            if (response.statusCode === 200) {
                response.pipe(file);
            } else {
                file.close();
                fs.unlink(dest, () => { }); // Delete temp file
                reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
            }
        });

        request.on("error", err => {
            file.close();
            fs.unlink(dest, () => { }); // Delete temp file
            reject(err.message);
        });

        file.on("finish", () => {
            resolve();
        });

        file.on("error", err => {
            file.close();

            if (err.code === "EEXIST") {
                reject("File already exists");
            } else {
                fs.unlink(dest, () => { }); // Delete temp file
                reject(err.message);
            }
        });
    });
}