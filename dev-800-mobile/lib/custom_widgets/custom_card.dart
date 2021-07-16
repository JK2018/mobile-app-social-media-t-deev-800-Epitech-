import 'package:flutter/material.dart';

class CustomCard extends StatelessWidget {
  final IconData icon;
  final String text;
  final String subtitle;
  final cardColor;
  final onTap;
  final double height;
  final double width;
  final double textSize;

  const CustomCard({
    Key key,
    @required this.icon,
    @required this.text,
    @required this.cardColor,
    @required this.onTap,
    this.height,
    this.width=100,
    this.textSize=15,
    this.subtitle="",
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      width: width,
      child: InkWell(
        onTap: onTap,
        child: Card(
          elevation: 5,
          color: cardColor,
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(15)
          ),
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: <Widget>[
                Icon(
                  icon,
                  size: 30,
                  color: Colors.black,
                ),
                SizedBox(height: 8,),
                Text(text,
                  style: TextStyle(
                      fontSize: textSize,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1,
                      color: Colors.black
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
