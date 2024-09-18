import 'package:flutter/material.dart';
import 'package:window_manager/window_manager.dart';
import 'screens/card_creator_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await windowManager.ensureInitialized();

  windowManager.waitUntilReadyToShow().then((_) async {
    await windowManager.setSize(const Size(900, 520));
    await windowManager.setMinimumSize(const Size(900, 520));
    await windowManager.center();
    windowManager.show();
  });

  runApp(const SimpleCardCreatorApp());
}

class SimpleCardCreatorApp extends StatelessWidget {
  const SimpleCardCreatorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Simple Card Creator',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const CardCreatorScreen(),
    );
  }
}
