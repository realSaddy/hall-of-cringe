const http = require('http');
const app = require("express")()

app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);

console.log("WebServer is online!");

setInterval(() => {
  http.get(`http://${process.env.GLITCH_PROJECT_NAME}.glitch.me/`);
}, 280000);
