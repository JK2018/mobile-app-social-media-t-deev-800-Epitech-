// ignore: avoid_web_libraries_in_flutter

import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobilepics/custom_widgets/custom_widgets_index.dart';
import 'package:mobilepics/screens/picture_page.dart';

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String searchValue;
  bool noData=true;
  TextEditingController searchValueController = TextEditingController();
  File imageFile;
  final picker = ImagePicker();

  Future<void> showChoiceDialog(BuildContext context) {
    return showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text("Selectionner profil"),
            content: SingleChildScrollView(
              child: ListBody(
                children: <Widget>[
                  GestureDetector(
                    child: Text("Galerie"),
                    onTap: () {
                      openGallary(context);
                    },
                  ),
                  Padding(padding: EdgeInsets.all(15.0)),
                  GestureDetector(
                    child: Text("Camera"),
                    onTap: () {
                      openCamera(context);
                    },
                  ),
                  Padding(padding: EdgeInsets.all(15.0)),
                  GestureDetector(
                    child: Text("Créer un album"),
                    onTap: () {
                      // TODO create new page who user can add album's name
                    },
                  ),
                ],
              ),
            ),
          );
        });
  }

  redirectDetailsPage(context){
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => PicturePage(imageFile: imageFile,)),
    );
  }

  openGallary(BuildContext context) async {
    PickedFile picture = await picker.getImage(source: ImageSource.gallery);
    this.setState(() {
      imageFile = File(picture.path);
    });
    print("_file : ${picture.toString()}");
    print("_filePath : ${imageFile.path.split('/').last}");
    redirectDetailsPage(context);
    //Navigator.of(context).pop();
  }

  openCamera(BuildContext context) async {
    PickedFile picture = await picker.getImage(source: ImageSource.camera);
    this.setState(() {
      imageFile = File(picture.path);
    });
    print("_file : $imageFile");
    redirectDetailsPage(context);
    //Navigator.of(context).pop();
  }



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Container(
          child: Row(
          children: [
            Text("StartPic",style: TextStyle(color: Colors.black, fontSize: 15),),
            Icon(Icons.camera_enhance,color: Colors.black,size: 19,)
          ],
          ),
        ),
        backgroundColor: Colors.grey[300],
        elevation: 1,
      ),
      backgroundColor: Colors.grey[300],
      body: !noData ? Center(child: Text("Prenez une photo", style: TextStyle(fontSize: 20),))
      : Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          children: [
            // (imageFile != null)
            //     ? Image.file(
            //   imageFile,
            //   width: 185,
            //   height: 185,
            //   fit: BoxFit.cover,
            // )
            //     : Image.network(
            //   "https://cdn.pixabay.com/photo/2017/01/25/12/31/bitcoin-2007769_960_720.jpg",
            //   fit: BoxFit.fill,
            //   width: 250,
            // ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Center(
                child: InputCustom(
                  width: 300,
                  height: 50,
                  showText: false,
                  placeholder: "Rechercher",
                  backgroundColor: Colors.white,
                  controller: searchValueController,
                  keyboardType: TextInputType.text,
                ),
              ),
            ),
            SizedBox(height: 15,),
            Expanded(
              child: Theme(
                data:
                Theme.of(context).copyWith(accentColor: Colors.red),
                child: RefreshIndicator(
                  onRefresh: () async {
                    await Future.delayed(Duration(seconds: 2));
                    setState(() {
                      //write an function to get all albums/pics
                    });
                    return null;
                  },
                  child: StaggeredGridView.countBuilder(
                    crossAxisCount: 4,
                    itemBuilder: (BuildContext context, int index) =>
                        Container(
                          child: CustomCard(
                            height: 110,
                            text: "Famille",
                            icon: Icons.image,
                            cardColor: Colors.white,
                            onTap: (){
                              print("show album details");
                              /*Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => DepositScreen()));*/
                            },
                          ),
                        ),
                    staggeredTileBuilder: (int index) =>
                        StaggeredTile.fit(2),
                    mainAxisSpacing: 2,
                    crossAxisSpacing: 5,
                    itemCount: 5,
                  ),
                ),
              ),
            )
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.add_a_photo_rounded),
        backgroundColor: Colors.black,
        onPressed: (){
          showChoiceDialog(context);
          //details pages
        },
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }
}
