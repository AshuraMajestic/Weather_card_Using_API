const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("index.html", "utf-8");
const replaceVal = (tempVal, orgval) => {
  let temperature = tempVal.replace("{%tempval%}", orgval.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgval.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgval.main.temp_max);
  temperature = temperature.replace("{%location%}", orgval.name);
  temperature = temperature.replace("{%country%}", orgval.sys.country);
  temperature = temperature.replace("{%tempStatus%}", orgval.weather[0].status);
  return temperature;
};
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=Kalol&appid=be0b5b0806ddd33a0b3769489b72ce31&units=metric"
    )
      .on("data", function (chunk) {
        const objData = JSON.parse(chunk);
        const arrData = [objData];
        const realTimeData = arrData
          .map((val) => {
            return replaceVal(homeFile, val);
          })
          .join("");
        res.write(realTimeData);
      })
      .on("end", function (err) {
        if (err) return console.log("Connection closed due to error");
        res.end();
      });
  }
});

server.listen(7000, "127.0.0.1");
