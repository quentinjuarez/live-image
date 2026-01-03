const fs = require("fs");
const archiver = require("archiver");

const devServerUrl = "http://localhost:3333";
const prodServerUrl = "https://live-image-server.onrender.com";
const devFrontUrl = "http://localhost:5173";
const prodFrontUrl = "https://live-image-overlay.vercel.app";

const output = fs.createWriteStream("extension.zip");
const archive = archiver("zip", { zlib: { level: 9 } });

archive.on("error", function (err) {
  throw err;
});

output.on("close", function () {
  console.log(`Extension zippée avec succès : ${archive.pointer()} octets`);
});

archive.pipe(output);

// Read and modify manifest.json
const backgroundPath = "./background.js";
const backgroundContent = fs.readFileSync(backgroundPath, "utf-8");
const modifiedBackground = backgroundContent.replace(
  devServerUrl,
  prodServerUrl
);
console.log(modifiedBackground);

// add manifest.json, background.js, dist/ from ./
archive.directory("./dist/", "dist");
archive.directory("./icons/", "icons");
archive.append(modifiedBackground, { name: "background.js" });
archive.file("./manifest.json", { name: "manifest.json" });
archive.file("./contentScript.js", { name: "contentScript.js" });

archive.finalize();
