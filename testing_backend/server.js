const http = require('http');

// Create server instances for each port
const server1 = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Server 1!');
});

const server2 = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Server 2!');
});

// Define port numbers for each server
const port1 = 8001;
const port2 = 8002;

// Start each server instance on its respective port
server1.listen(port1, () => {
  console.log(`Server 1 is running on port ${port1}`);
});

server2.listen(port2, () => {
  console.log(`Server 2 is running on port ${port2}`);
});
