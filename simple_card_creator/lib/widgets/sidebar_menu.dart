import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';

class SidebarMenu extends StatelessWidget {
  final Function(String) onJsonFilePicked; // Callback when JSON file is picked

  const SidebarMenu({required this.onJsonFilePicked, super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          const DrawerHeader(
            decoration: BoxDecoration(
              color: Colors.blue,
            ),
            child: Text(
              'Menu',
              style: TextStyle(
                color: Colors.white,
                fontSize: 24,
              ),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.file_upload),
            title: const Text('Generate cards from JSON'),
            onTap: () async {
              Navigator.pop(context); // Close the drawer
              _pickJsonFile(context);
            },
          ),
        ],
      ),
    );
  }

  // Method to pick the JSON file and pass its path to the callback
  Future<void> _pickJsonFile(BuildContext context) async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['json'],
    );

    if (result != null) {
      String filePath = result.files.single.path!;
      onJsonFilePicked(filePath); // Pass the file path to the callback
    } else {
      // User canceled the picker
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('No file selected')),
      );
    }
  }
}
