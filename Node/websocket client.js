const WebSocket = require('ws');
const readline = require('readline');

// Constants for configuration
const HOST = 'YOUR SERVER'; // Change this if needed (e.g., to the server's IP or domain)
const PORT = 8081;
const SERVER_URL = `wss://${HOST}:${PORT}`;

// Create a readline interface to capture user input from the command line
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Disable certificate verification for testing purposes (self-signed certificates)
const ws = new WebSocket(SERVER_URL, {
  rejectUnauthorized: false // Note: This should only be used for testing with self-signed certificates
});

// When the client connects to the server
ws.on('open', () => {
  console.log(`Connected to WebSocket server at ${SERVER_URL}`);
  console.log('Type a message and press Enter to send it:');
});

// When the client receives a message from the server
ws.on('message', (message) => {
  console.log(`Received from server: ${message}`);
});

// Handle errors
ws.on('error', (error) => {
  console.error('WebSocket error:', error.message);
});

// Handle connection close
ws.on('close', () => {
  console.log('Disconnected from server');
  rl.close();
});

// Listen for user input from the command line
rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('Disconnecting from server...');
    ws.close();
  } else {
    // Send the user input as a message to the server
    ws.send(input);
  }
});
