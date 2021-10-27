const app = require("./app");

async function main() {
  await app.listen(app.get('port'), () => {
    console.log('Listening on http://localhost:'+app.get('port'));
  })
}

main();
