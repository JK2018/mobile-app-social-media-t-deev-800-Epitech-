import 'package:flutter/material.dart';

class BtnCustom extends StatelessWidget {
  final textColor;
  final textBtn;
  final iconName;
  final onPress;
  final btnColor;
  final double borderRadius;
  final double width;
  final double height;

  BtnCustom(
      {this.textColor,
      this.textBtn="Test",
      this.iconName,
      this.onPress,
      this.borderRadius = 15.0,
      this.width = 200,
      this.height,
      this.btnColor=Colors.blue});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      child: TextButton.icon(
        onPressed: onPress,
        icon: Icon(
          iconName,
          color: textColor,
        ),
        label: Center(
          child: Text(
            textBtn,
            style: TextStyle(color: textColor),
          ),
        ),
        style: ButtonStyle(
          shape: MaterialStateProperty.all<RoundedRectangleBorder>(
            RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(borderRadius),
            ),
          ),
          backgroundColor: MaterialStateProperty.all<Color>(
              btnColor
          ),
        ),
      ),
    );
  }
}
