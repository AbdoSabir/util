import 'dart:async';
import 'package:web_socket_channel/web_socket_channel.dart';

/// Custom Action: Listen to WebSocket Messages
/// This action connects to a WebSocket server and updates the
/// `texto` variable in FFState when a message is received.

Future<void> listenToWebSocket(BuildContext context) async {
    String wsUrl = "";
  String? initialMessage = "";
  try {
    // Create the WebSocket connection
    final WebSocketChannel channel = WebSocketChannel.connect(Uri.parse(wsUrl));

    // Send an initial message if provided
    if (initialMessage != null) {
      channel.sink.add(initialMessage);
    }

    // Listen for incoming messages
    channel.stream.listen((message) {
      // Update the global state variable to rebuild UI
      // Update the global state variable using the update method
      FFAppState().update(() {
        FFAppState().texto = message;
      });
    }, onError: (error) {
      print('WebSocket error: $error');
    }, onDone: () {
      print('WebSocket connection closed.');
    });
  } catch (e) {
    print('Error connecting to WebSocket: $e');
  }
}
