import 'dart:io';
import 'dart:convert'; // For JSON parsing
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path/path.dart' as path;
import 'package:screenshot/screenshot.dart'; // For taking screenshots
import '../widgets/card_image_display.dart'; // Import the new widget
import '../widgets/sidebar_menu.dart'; // Import the sidebar menu
import '../services/screenshot_service.dart'; // Import the new service
import 'package:intl/intl.dart'; // For date formatting

class CardCreatorScreen extends StatefulWidget {
  const CardCreatorScreen({super.key});

  @override
  _CardCreatorScreenState createState() => _CardCreatorScreenState();
}

class _CardCreatorScreenState extends State<CardCreatorScreen> {
  // Controllers for form fields
  final TextEditingController nameController = TextEditingController();
  final TextEditingController typeController = TextEditingController();
  final TextEditingController descriptionController = TextEditingController();
  final TextEditingController attackController = TextEditingController();
  final TextEditingController defenseController = TextEditingController();

  // Variables for storing selected images
  File? mainImage;
  File? overlayImage;

  // Screenshot service
  ScreenshotController screenshotController = ScreenshotController();
  ScreenshotService? screenshotService;

  // Directory to save all card images
  String? cardsFolderPath;

  // Checkbox state to control if we use the image's actual size
  bool useImageSize = false;

  // Preview size (defaults to 400x600)
  double previewWidth = 400;
  double previewHeight = 600;

  @override
  void initState() {
    super.initState();
    screenshotService = ScreenshotService(
        screenshotController); // Initialize the screenshot service
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Simple Card Creator'),
      ),
      drawer: SidebarMenu(
          onJsonFilePicked:
              _processJsonFile), // Pass the callback to handle file
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Left side: Card image and text display
                Column(
                  children: [
                    // Use the new CardImageDisplay widget
                    Screenshot(
                      controller: screenshotController,
                      child: CardImageDisplay(
                        mainImage: mainImage,
                        overlayImage: overlayImage,
                        cardName: nameController.text,
                        cardType: typeController.text,
                        cardDescription: descriptionController.text,
                        cardAttack: attackController.text,
                        cardDefense: defenseController.text,
                        imageWidth: previewWidth, // Dynamic preview width
                        imageHeight: previewHeight, // Dynamic preview height
                      ),
                    ),
                    const SizedBox(height: 10),
                    // Checkbox for "Use image's size?"
                    Row(
                      children: [
                        Checkbox(
                          value: useImageSize,
                          onChanged: (bool? value) {
                            setState(() {
                              useImageSize = value ?? false;
                              // Update preview size based on checkbox
                              if (useImageSize && mainImage != null) {
                                _updatePreviewSizeToImage(mainImage!);
                              } else {
                                _resetPreviewSize();
                              }
                            });
                          },
                        ),
                        const Text("Use image's size?"),
                      ],
                    ),
                    Row(
                      children: [
                        ElevatedButton(
                          onPressed: _selectMainImage,
                          child: const Text('Add Image'),
                        ),
                        const SizedBox(width: 10),
                        ElevatedButton(
                          onPressed: _addOverlayImage,
                          child: const Text('Add Overlay'),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(width: 20),
                // Right side: Form fields for card details
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildTextField('Card Name', nameController),
                      _buildTextField('Card Type', typeController),
                      _buildTextField('Card Description', descriptionController,
                          maxLines: 3),
                      Row(
                        children: [
                          Expanded(
                              child:
                                  _buildTextField('Attack', attackController)),
                          const SizedBox(width: 10),
                          Expanded(
                              child: _buildTextField(
                                  'Defense', defenseController)),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // Function to build the text fields for card data input
  Widget _buildTextField(String label, TextEditingController controller,
      {int maxLines = 1}) {
    return TextField(
      controller: controller,
      decoration: InputDecoration(labelText: label),
      maxLines: maxLines,
      onChanged: (_) => setState(() {}),
    );
  }

  // Function to process the JSON file and populate the card fields
  void _processJsonFile(String filePath) async {
    String jsonString =
        await File(filePath).readAsString(); // Read the JSON file
    List<dynamic> jsonDataList =
        json.decode(jsonString); // Parse the JSON as a List

    // Loop through all entries in the JSON file and process each card
    for (int i = 0; i < jsonDataList.length; i++) {
      Map<String, dynamic> cardData = jsonDataList[i];

      // Populate the fields with card data
      await _populateFieldsFromJson(cardData, filePath);

      // Wait for 3 seconds before processing the next card
      await Future.delayed(const Duration(seconds: 3));
    }
  }

  // Function to populate fields from JSON and take screenshots
  Future<void> _populateFieldsFromJson(
      Map<String, dynamic> jsonData, String jsonFilePath) async {
    setState(() {
      nameController.text = jsonData['name'] ?? '';
      typeController.text = jsonData['type'] ?? '';
      descriptionController.text = jsonData['description'] ?? '';
      attackController.text = jsonData['ATK'].toString();
      defenseController.text = jsonData['DEF'].toString();
      _setMainImage(jsonData['imagePath']);
    });

    // Wait for the image to be rendered before taking the screenshot
    await Future.delayed(const Duration(milliseconds: 500));

    // Create the folder if not already created
    if (cardsFolderPath == null) {
      cardsFolderPath = await _createCardsFolder(jsonFilePath);
    }

    // Wait for a short delay to ensure the image is fully rendered
    await Future.delayed(const Duration(milliseconds: 1000));

    // Get the saved size based on whether the checkbox is checked
    double savedWidth;
    double savedHeight;

    if (useImageSize && mainImage != null) {
      savedWidth = await _getImageWidth(mainImage!); // Use original image width
      savedHeight =
          await _getImageHeight(mainImage!); // Use original image height
      // Update preview size to match image dimensions
      setState(() {
        previewWidth = savedWidth;
        previewHeight = savedHeight;
      });
    } else {
      savedWidth = 400; // Default width
      savedHeight = 600; // Default height
      _resetPreviewSize();
    }

    // Save the screenshot using actual image size if the checkbox is checked
    await screenshotService?.saveCardScreenshot(
      cardsFolderPath!,
      nameController.text,
      savedWidth: savedWidth, // Pass the desired width
      savedHeight: savedHeight, // Pass the desired height
    );
  }

  // Function to create a folder to save screenshots
  Future<String> _createCardsFolder(String jsonFilePath) async {
    String timestamp = DateFormat('yyyy-MM-dd_HH-mm-ss').format(DateTime.now());

    // Get the directory where the JSON file is located
    String jsonDir = path.dirname(jsonFilePath);

    // Create the folder with the timestamp
    String cardsFolder = path.join(jsonDir, '${timestamp}_cards');
    Directory(cardsFolder).createSync(); // Create the directory

    return cardsFolder; // Return the path to the created folder
  }

  // Function to get the actual image width
  Future<double> _getImageWidth(File imageFile) async {
    var decodedImage = await decodeImageFromList(imageFile.readAsBytesSync());
    return decodedImage.width.toDouble();
  }

  // Function to get the actual image height
  Future<double> _getImageHeight(File imageFile) async {
    var decodedImage = await decodeImageFromList(imageFile.readAsBytesSync());
    return decodedImage.height.toDouble();
  }

  // Function to set the main image from the JSON file
  void _setMainImage(String imagePath) {
    setState(() {
      mainImage = File(imagePath);
    });
    // If the checkbox is checked, update the preview size
    if (useImageSize && mainImage != null) {
      _updatePreviewSizeToImage(mainImage!);
    }
  }

  // Function to update preview size to the actual image size
  Future<void> _updatePreviewSizeToImage(File imageFile) async {
    double imageWidth = await _getImageWidth(imageFile);
    double imageHeight = await _getImageHeight(imageFile);
    setState(() {
      previewWidth = imageWidth;
      previewHeight = imageHeight;
    });
  }

  // Reset preview size to default
  void _resetPreviewSize() {
    setState(() {
      previewWidth = 400;
      previewHeight = 600;
    });
  }

  // Function to pick the main image using image picker
  Future<void> _selectMainImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);

    if (image != null) {
      setState(() {
        mainImage = File(image.path);
      });
      // If the checkbox is checked, update the preview size
      if (useImageSize && mainImage != null) {
        _updatePreviewSizeToImage(mainImage!);
      }
    }
  }

  // Function to pick the overlay image using image picker
  Future<void> _addOverlayImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);

    if (image != null) {
      setState(() {
        overlayImage = File(image.path);
      });
    }
  }
}
