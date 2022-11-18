const fs = require('fs');
const http = require('http');
const requests = require('requests');

const replaceValue = (tempVal, orgVal) => {
  let tempature = tempVal.replace('{%temp%}', orgVal.main.temp);
  tempature = tempature.replace('{%tempMin%}', orgVal.main.temp_min);
  tempature = tempature.replace('{%tempMax%}', orgVal.main.temp_max);
  tempature = tempature.replace('{%tempMax%}', orgVal.main.temp_max);
  tempature = tempature.replace('{%country%}', orgVal.sys.country);
  tempature = tempature.replace('{%city%}', orgVal.name);
  tempature = tempature.replace('{%tempCondition%}', orgVal.weather[0].main);
  return tempature;
};

const indexFileData = fs.readFileSync('index.html', 'utf-8');

const server = http.createServer((req, res) => {
  if (req.url == '/') {
    requests(
      'https://api.openweathermap.org/data/2.5/weather?q=Sargodha&&units=metric&appid=79d4ef8541181b616b161a109667152d'
    )
      .on('data', (chunk) => {
        const objData = JSON.parse(chunk);
        const arrayData = [objData];
        let realTimeData = arrayData
          .map((curValue) => replaceValue(indexFileData, curValue))
          .join('');
        res.write(realTimeData);
      })
      .on('end', (err) => {
        if (err) return console.log('connection closed due to errors', err);

        res.end();
      });
  }
});
server.listen(8800, '127.0.0.1');
