import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:mobilepics/custom_widgets/custom_widgets_index.dart';
import 'package:mobilepics/services/services_index.dart';

class PicturePage extends StatefulWidget {
  final imageFile;

  const PicturePage({Key key, this.imageFile}) : super(key: key);

  @override
  _PicturePageState createState() => _PicturePageState();
}

class _PicturePageState extends State<PicturePage> {
  String title;
  String tags;
  TextEditingController titleController = TextEditingController();
  TextEditingController tagsController = TextEditingController();


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
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Center(
          child: Column(
            children: [
              Card(
                elevation: 10,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(5)
                ),
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Container(
                    height: 300,
                    width: 300,
                    child: (widget.imageFile != null) ? Image.file(
                      widget.imageFile,
                      width: 185,
                      height: 185,
                      fit: BoxFit.cover,
                    ) : Image.network("https://www.micromania.fr/dw/image/v2/BCRB_PRD/on/demandware.static/-/Sites-masterCatalog_Micromania/default/dwb0dd95a8/images/high-res/naruto-shippuden-bandeau-konoha_3_.jpg?sw=480&sh=480&sm=fit",
                    ),
                  ),
                ),
              ),
              SizedBox(height: 50,),
              Column(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  InputCustom(
                    width: 300,
                    height: 50,
                    showText: false,
                    placeholder: "Title",
                    backgroundColor: Colors.white,
                    controller: titleController,
                    keyboardType: TextInputType.text,
                  ),
                  SizedBox(height: 15,),
                  InputCustom(
                    width: 300,
                    height: 50,
                    showText: false,
                    placeholder: "Tags",
                    backgroundColor: Colors.white,
                    controller: tagsController,
                    keyboardType: TextInputType.text,
                  ),
                  SizedBox(height: 15,),
                  BtnCustom(
                    width: 300,
                    textBtn: "Enregistrer",
                    iconName: Icons.save,
                    btnColor: Colors.white,
                    textColor: Colors.black,
                    onPress: () async {
                      String filename = widget.imageFile.path.split('/').last;
                      Api api = Api();
                      var response = await api.saveImage(
                          "609564ee22de9d562fbdc343",
                          "609564ee22de9d562fbdc345",
                          "Fabrice Fabio",
                          widget.imageFile.path,
                          filename);

                      // FormData formData = new FormData.fromMap({
                      //   "albumId": "609564ee22de9d562fbdc343",
                      //   "userId": "609564ee22de9d562fbdc345",
                      //   "title": "Fabrice Fabio",
                      //   "image": await MultipartFile.fromFile(
                      //       widget.imageFile.path,
                      //       filename: filename,)
                      //       //contentType: MediaType("image", "png")),
                      // });
                      // Response response = await Dio().post(
                      //   "https://startepich.waincorp.com/gallery/saveImage",
                      //   data: formData,
                      //   options: Options(
                      //     headers: {
                      //       "accept": "*/*",
                      //       "Authorization": "Bearer putvartoken",
                      //       "Content-Type": "multipart/form-data"
                      //     }
                      //   )
                      // );

                      print("Save img in db");
                      print(response);
                    },
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
