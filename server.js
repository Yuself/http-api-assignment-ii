const http = require('http');
const { URL } = require('url');

const htmlResponses = require('./htmlResponses');
const jsonResponses = require('./jsonResponses.js');

// parse request body (urlencoded or json)
const parseBody = (request, callback) => {
  const chunks = [];

  request.on('error', () => callback({}));
  request.on('data', (chunk) => chunks.push(chunk));
  request.on('end', () => {
    const raw = Buffer.concat(chunks).toString();

    const contentType = request.headers['content-type'] || '';
    if (contentType.includes('application/json')) {
      try {
        callback(JSON.parse(raw || '{}'));
      } catch (e) {
        callback({});
      }
      return;
    }
    const params = new URLSearchParams(raw);
    callback(Object.fromEntries(params.entries()));
  });
};

const urlStruct = {
  '/': htmlResponses.getIndex,
  '/style.css': htmlResponses.getCSS,
  '/getUsers': jsonResponses.getUsers,
  '/notReal': jsonResponses.notFound,
};

const notFound = (request, response) => jsonResponses.notFound(request, response);

const onRequest = (request, response) => {
  console.log(`[REQ] ${request.method} ${request.url}`);

  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
  const pathname = parsedUrl.pathname;

  // POST routes
  if (request.method === 'POST') {
    if (pathname === '/addUser') {
      return parseBody(request, (body) => jsonResponses.addUser(request, response, body));
    }
    return notFound(request, response);
  }

  // GET/HEAD routes
  const handler = urlStruct[pathname] || notFound;
  return handler(request, response);
};

const port = process.env.PORT || process.env.NODE_PORT || 3000;
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on ${port}`);
});
