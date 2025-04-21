import 'dart:io';
import 'dart:typed_data';
import 'package:path/path.dart' as path;
import 'package:screenshot/screenshot.dart';

class ScreenshotService {
  final ScreenshotController screenshotController;

  ScreenshotService(this.screenshotController);

  // Function to save the card as a screenshot with specified width and height
  Future<void> saveCardScreenshot(
    String cardsFolderPath,
    String cardName, {
    required double savedWidth, // Required width
    required double savedHeight, // Required height
  }) async {
    // Capture the screenshot
    screenshotController.capture().then((Uint8List? image) {
      if (image != null) {
        // Create the file path using the card name
        File file = File(path.join(cardsFolderPath, '$cardName.png'));
        file.writeAsBytesSync(image); // Save the screenshot as a PNG
      }
    }).catchError((onError) {
      print(
          onError); // Handle any errors that might occur during screenshot saving
    });
  }
}
