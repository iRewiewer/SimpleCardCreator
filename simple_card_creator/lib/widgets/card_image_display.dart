import 'package:flutter/material.dart';
import 'dart:io';

class CardImageDisplay extends StatelessWidget {
  final File? mainImage;
  final File? overlayImage;
  final String cardName;
  final String cardType;
  final String cardDescription;
  final String cardAttack;
  final String cardDefense;
  final double imageWidth;
  final double imageHeight;

  const CardImageDisplay({
    Key? key,
    required this.mainImage,
    required this.overlayImage,
    required this.cardName,
    required this.cardType,
    required this.cardDescription,
    required this.cardAttack,
    required this.cardDefense,
    required this.imageWidth,
    required this.imageHeight,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: imageWidth,
      height: imageHeight,
      child: Stack(
        fit: StackFit.expand,
        children: [
          // Main image (card background)
          if (mainImage != null)
            Image.file(
              mainImage!,
              width: 200,
              height: 300,
              fit: BoxFit.cover,
            )
          else
            Container(
              width: 200,
              height: 300,
              color: Colors.grey[300],
              child: const Center(child: Text('No Image Selected')),
            ),
          // Overlay image if selected
          if (overlayImage != null)
            Image.file(
              overlayImage!,
              width: 200,
              height: 300,
              fit: BoxFit.cover,
            ),
          // Card name displayed on top of the image
          Positioned(
            top: 10,
            left: 10,
            child: Text(
              cardName,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.white,
                shadows: [
                  Shadow(
                    offset: Offset(1.5, 1.5),
                    blurRadius: 3.0,
                    color: Colors.black,
                  ),
                ],
              ),
            ),
          ),
          // Other text elements
          Positioned(
            top: 40,
            left: 10,
            child: Text(
              cardType,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
          Positioned(
            top: 70,
            left: 10,
            child: Text(
              cardDescription,
              style: const TextStyle(
                fontSize: 14,
                color: Colors.white,
              ),
            ),
          ),
          Positioned(
            bottom: 40,
            left: 10,
            child: Text(
              cardAttack,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
          Positioned(
            bottom: 10,
            left: 10,
            child: Text(
              cardDefense,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
