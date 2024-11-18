const net = require('net');
const readline = require('readline');

// Define the port and host (localhost)
const PORT = 5000;
const HOST = '127.0.0.1';

// Create a TCP server
const server = net.createServer();
let clients = []; // Array to keep track of connected clients

// Create a readline interface to capture user input from the command line
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to broadcast a message to all clients
function broadcastMessage(message) {
  clients.forEach((client) => {
    client.write(message);
  });
}

// Handle new client connections
server.on('connection', (socket) => {
  console.log('New client connected:', socket.remoteAddress);
  
  // Add the client to the clients array
  clients.push(socket);

  // When data is received from the client
  socket.on('data', (data) => {
    console.log('Received from client:', data.toString());
  });

  // Handle client disconnection
  socket.on('end', () => {
    console.log('Client disconnected:', socket.remoteAddress);
    // Remove the client from the clients array
    clients = clients.filter(client => client !== socket);
  });

  // Handle errors on the socket
  socket.on('error', (err) => {
    console.error('Socket error:', err.message);
  });
});

// Start the server
server.listen(PORT, HOST, () => {
  console.log(`TCP server listening on ${HOST}:${PORT}`);
});

// Capture user input in the command line to send messages to all clients
rl.on('line', (input) => {
  // Broadcast the message to all connected clients
  broadcastMessage(`Server says: ${input}\n`);
});
