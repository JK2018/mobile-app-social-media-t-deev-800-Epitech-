import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart'  as F_sec;
import 'package:fluttertoast/fluttertoast.dart';

class Api{

  String url = "https://dev-800.herokuapp.com";
  final storage = F_sec.FlutterSecureStorage();
  String token = "";

  Api({
    String token,
  }){
    this.token = token;
  }

  saveImage(albumId,userId,title,imagePath,fileName) async {
    String myUrl = "$url/gallery/saveImage";
    print("info : "+albumId+"\n"+userId+"\n"+title+"\n"+imagePath+"\n"+fileName);
    FormData formData = new FormData.fromMap({
      "albumId": albumId,
      "userId": userId,
      "title": title,
      "image": await MultipartFile.fromFile(
        imagePath,
        filename: fileName,)
    });
    Response response = await Dio().post(
        myUrl,
        data: formData,
        options: Options(
            headers: {
              "accept": "*/*",
              "Authorization": "Bearer $token",
              "Content-Type": "multipart/form-data"
            }
        )
    );
    return response;
  }

  register(username,email,password,nom,prenom) async {
    String myUrl = "$url/Authentification/inscription";
    print("username : $username");
    var dio = Dio();

    Response response = await dio.post(
      myUrl,
      data: {
        "username": username,
        "email": email,
        "password": password,
        "nom": nom,
        "prenom": prenom,
      },
      options: Options(
        followRedirects: false,
        validateStatus: (status) {
          return status < 600;
        },
      ),
    );

    if(response.statusCode == 200 || response.statusCode == 201){
      displayToast(response.data["message"],Colors.green);
      return response.statusCode;
    }else{
      displayToast(response.data["message"],Colors.red);
      return response.data["message"];
    }
  }

  login(email,password) async{
    String myUrl = "$url/Authentification/login";
    print("email : $email");
    var dio = Dio();
    var auth = 'Basic '+base64Encode(utf8.encode('$email:$password'));


    Response response = await dio.post(
      myUrl,
      data: {},
      options: Options(
        followRedirects: false,
        validateStatus: (status) {
          return status < 600;
        },
        headers: {
          'authorization': auth
        }
      ),
    );

    //print(response);
    if(response.statusCode == 200 || response.statusCode == 201){
      await storage.write(key: "token", value: response.data["token"]);

      // Set Token
      String value = await storage.read(key: "token");
      token = value;

      return response.statusCode;
    }else{
      print(response.data["message"].toString());
      displayToast(response.data["message"],Colors.red);
      //return response.data["message"];
    }
  }

  displayToast(msg,color){
    Fluttertoast.showToast(
        msg: msg,
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.BOTTOM,
        timeInSecForIosWeb: 4,
        backgroundColor: color,
        textColor: Colors.white,
        fontSize: 16.0
    );
  }

}