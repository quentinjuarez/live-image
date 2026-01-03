const fs = require("fs");
const archiver = require("archiver");

const devUrl = "http://localhost:3333";
const prodUrl = "https://live-image-server.onrender.com";

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
const manifestPath = "../extension/manifest.json";
const manifestContent = fs.readFileSync(manifestPath, "utf-8");
const modifiedManifest = manifestContent.replace(devUrl, prodUrl);

// add manifest.json, background.js, dist/ from ../extension/
archive.directory("../extension/dist/", "dist");
archive.append(modifiedManifest, { name: "manifest.json" });
archive.file("../extension/background.js", { name: "background.js" });

archive.finalize();
