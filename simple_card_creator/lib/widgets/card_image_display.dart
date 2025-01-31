import 'dart:io';
import 'package:flutter/material.dart';

class CardImageDisplay extends StatelessWidget {
  final File? mainImage;
  final File? overlayImage;
  final String attackValue;
  final String cardName;
  final String unitType;
  final String cardDescription;
  final String footerText;
  final double imageWidth;
  final double imageHeight;

  const CardImageDisplay({
    Key? key,
    required this.mainImage,
    required this.overlayImage,
    required this.attackValue,
    required this.cardName,
    required this.unitType,
    required this.cardDescription,
    required this.footerText,
    required this.imageWidth,
    required this.imageHeight,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: imageWidth,
      height: imageHeight,
      child: Stack(
        children: [
          // Card Image Background (Base Image)
          if (mainImage != null)
            Image.file(
              mainImage!,
              width: imageWidth,
              height: imageHeight,
              fit: BoxFit.cover,
            )
          else
            Container(
              color: Colors.grey[300], // Default background if no image
              width: imageWidth,
              height: imageHeight,
              child: const Center(child: Text('No Image Selected')),
            ),

          // Overlay Image on top of the base image
          if (overlayImage != null)
            Positioned(
              left: 0,
              top: 0,
              child: Image.file(
                overlayImage!,
                width: imageWidth,
                height: imageHeight,
                fit: BoxFit
                    .cover, // Ensure the overlay image covers the entire card area
              ),
            ),

          // ATK Value (Candara Bold with custom color)
          Positioned(
            left: imageWidth * 0.105,
            top: imageHeight * 0.565,
            child: Text(
              attackValue,
              style: const TextStyle(
                fontSize: 66,
                fontWeight: FontWeight.bold,
                fontFamily: 'Candara', // Use Candara for ATK value
                color: Color(0xFFA14456), // Custom color #a14456
                shadows: [
                  Shadow(
                    offset: Offset(2, 2),
                    blurRadius: 3.0,
                    color: Colors.black,
                  ),
                ],
              ),
            ),
          ),

          // Card Name (Montserrat)
          Positioned(
            left: imageWidth * 0.26,
            top: imageHeight * 0.67,
            child: Text(
              cardName,
              style: const TextStyle(
                fontSize: 36,
                fontWeight: FontWeight.bold,
                fontFamily: 'Montserrat', // Use Montserrat for other text
                color: Colors.white,
                shadows: [
                  Shadow(
                    offset: Offset(2, 2),
                    blurRadius: 3.0,
                    color: Colors.black,
                  ),
                ],
              ),
            ),
          ),

          // Unit Type (Montserrat)
          Positioned(
            left: imageWidth * 0.26,
            top: imageHeight * 0.75,
            child: Text(
              unitType,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                fontFamily: 'Montserrat',
                color: Colors.white,
                shadows: [
                  Shadow(
                    offset: Offset(1.5, 1.5),
                    blurRadius: 2.0,
                    color: Colors.black,
                  ),
                ],
              ),
            ),
          ),

          // Card Description (Montserrat) with word wrapping
          Positioned(
            left: imageWidth * 0.26,
            top: imageHeight * 0.81,
            child: SizedBox(
              width: imageWidth * 0.7, // Limit the width for word wrapping
              child: Text(
                cardDescription,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.normal,
                  fontFamily: 'Montserrat',
                  color: Colors.white,
                ),
                maxLines: 4, // Maximum number of lines to display
                overflow: TextOverflow.ellipsis, // Handle overflow
                softWrap: true, // Enable soft wrapping
              ),
            ),
          ),

          // Footer Text (Montserrat)
          Positioned(
            left: imageWidth * 0.05,
            top: imageHeight * 0.94,
            child: Text(
              footerText,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.normal,
                fontFamily: 'Montserrat',
                color: Colors.white,
                shadows: [
                  Shadow(
                    offset: Offset(1.5, 1.5),
                    blurRadius: 2.0,
                    color: Colors.black,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
