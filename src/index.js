const app = require("./app");

async function main() {
  await app.listen(3030);
  console.log("Server on port", 3030);
}

main();
