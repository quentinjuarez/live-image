const fs = require("fs");
const archiver = require("archiver");

const output = fs.createWriteStream("extension.zip");
const archive = archiver("zip", { zlib: { level: 9 } });

archive.on("error", function (err) {
  throw err;
});

output.on("close", function () {
  console.log(`Extension zippée avec succès : ${archive.pointer()} octets`);
});

archive.pipe(output);
// add manifest.json, background.js, dist/ from ../extension/
archive.directory("../extension/dist/", "dist");
archive.file("../extension/manifest.json", { name: "manifest.json" });
archive.file("../extension/background.js", { name: "background.js" });

archive.finalize();
