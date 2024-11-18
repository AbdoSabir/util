const https = require('https');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const readline = require('readline');

// Constants for configuration
const HOST = ''; // Change this to your desired hostname (e.g., '0.0.0.0' or '127.0.0.1')
const PORT = 8081;
const CERT_DIR = __dirname;
const CERT_PATH = path.join(CERT_DIR, 'YOUR CERTIFICATE DIR');
const KEY_PATH = path.join(CERT_DIR, 'YOUR KEY DIR');
const PASSPHRASE = 'PASSWORD'; // Change this to your actual passphrase

// SSL options for HTTPS server
const sslOptions = {
  cert: fs.readFileSync(CERT_PATH),
  key: fs.readFileSync(KEY_PATH),
  passphrase: PASSPHRASE,
};

// Create the HTTPS server
const server = https.createServer(sslOptions);

// Initialize the WebSocket server on top of the HTTPS server
const wss = new WebSocket.Server({ server });

// Broadcast message to all clients
function broadcastMessage(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Handle new WebSocket connections
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  // Send a welcome message
  ws.send('Welcome to the WebSocket server!');

  // Listen for messages from clients
  ws.on('message', (message) => {
    console.log(`Received message from client: ${message}`);
    broadcastMessage(`Broadcast: ${message}`);
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });

  // Handle WebSocket errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error.message);
  });
});

// Start the HTTPS server
server.listen(PORT, HOST, () => {
  console.log(`WebSocket server is running on https://${HOST}:${PORT}`);
});

// Command-line interface for broadcasting messages
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Listen for user input from the command line
rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('Shutting down server...');
    rl.close();
    server.close();
    process.exit(0);
  } else {
    console.log(`Broadcasting message: ${input}`);
    broadcastMessage(input);
  }
});
