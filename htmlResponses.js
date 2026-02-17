const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, './client/client.html');
const cssPath = path.join(__dirname, './client/style.css');

const index = fs.readFileSync(indexPath);
const css = fs.readFileSync(cssPath);

const respondBytes = (request, response, status, type, bytes) => {
  response.writeHead(status, {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(bytes),
  });

  if (request.method !== 'HEAD') {
    response.write(bytes);
  }
  response.end();
};

const getIndex = (request, response) => respondBytes(request, response, 200, 'text/html', index);
const getCSS = (request, response) => respondBytes(request, response, 200, 'text/css', css);

module.exports = {
  getIndex,
  getCSS,
};
