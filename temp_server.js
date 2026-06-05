const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const root = process.cwd();
const server = http.createServer((req, res) => {
  let p = url.parse(req.url).pathname;
  if (p.endsWith('/')) p += 'index.html';
  if (p === '/') p = '/index.html';
  const file = path.join(root, decodeURIComponent(p));
  const ext = path.extname(file).toLowerCase();
  const map = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };
  fs.readFile(file, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('404');
      return;
    }
    res.setHeader('Content-Type', map[ext] || 'application/octet-stream');
    res.end(data);
  });
});
server.listen(8000, () => console.log('server listening on 8000'));
setInterval(() => {}, 10000);
