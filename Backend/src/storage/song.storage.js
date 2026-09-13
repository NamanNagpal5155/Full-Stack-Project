const Imagekit = require("imagekit");
const mongoose = require("mongoose");

const hasImagekitConfig = Boolean(
    process.env.IMAGEKIT_PUBLIC_KEY &&
    process.env.IMAGEKIT_PRIVATE_KEY &&
    process.env.IMAGEKIT_URL_ENDPOINT
);

const imagekit = hasImagekitConfig ? new Imagekit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
}) : null;

function uploadFile(file) {
    return new Promise((resolve, reject) => {
        if (!imagekit) {
            reject(new Error("ImageKit credentials are missing. Add IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT to your .env file."));
            return;
        }

        imagekit.upload({
            file: file.buffer,
            folder: "new-songs",
            fileName: new mongoose.Types.ObjectId().toString()
        }, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = uploadFile;