const net = require('net');
const readline = require('readline');

// Create a readline interface to capture user input from the command line
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Connect to the TCP server
const client = new net.Socket();
const PORT = 5000;
const HOST = '127.0.0.1';

client.connect(PORT, HOST, () => {
  console.log('Connected to server');
});

// Listen for data from the server
client.on('data', (data) => {
  console.log('Received from server:', data.toString());
});

// Handle errors
client.on('error', (err) => {
  console.error('Client error:', err.message);
});

// Handle connection end (if the server closes the connection)
client.on('end', () => {
  console.log('Disconnected from server');
});

// Capture user input in the command line to send messages to the server
rl.on('line', (input) => {
  // If the user types "d", disconnect gracefully from the server
  if (input.trim().toLowerCase() === 'd') {
    console.log('Disconnecting from the server...');
    client.end(); // Gracefully close the connection
    rl.close(); // Close the readline interface
  } else {
    // Send the message to the server
    client.write(input);
  }
});
