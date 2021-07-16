import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:mobilepics/custom_widgets/custom_widgets_index.dart';
import 'package:mobilepics/screens/home_page.dart';
import 'package:mobilepics/services/services_index.dart';

class Auth extends StatefulWidget {
  @override
  _AuthState createState() => _AuthState();
}

class _AuthState extends State<Auth> {
  bool signInOrUp = true;
  String username;
  String email;
  String password;
  TextEditingController usernameController = TextEditingController();
  TextEditingController emailController = TextEditingController();
  TextEditingController pwdController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black38,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset("assets/logo.png"),
            Expanded(
              flex: 2,
              child: SingleChildScrollView(
                child: Wrap(
                  runAlignment: WrapAlignment.center,
                  runSpacing: 30,
                  alignment: WrapAlignment.center,
                  children: [
                    Text("StartPic",
                    style: TextStyle(color: Colors.white,fontSize: 35, fontWeight: FontWeight.bold),),
                    !signInOrUp ? InputCustom(
                      width: 300,
                      showText: false,
                      placeholder: "Username",
                      backgroundColor: Colors.white,
                      controller: usernameController,
                      keyboardType: TextInputType.text,
                    ) : Container(),

                    InputCustom(
                      width: 300,
                      showText: false,
                      placeholder: !signInOrUp ? "Email" : "Email or Username",
                      backgroundColor: Colors.white,
                      controller: emailController,
                      keyboardType: TextInputType.text,
                    ),

                    InputCustom(
                      width: 300,
                      showText: false,
                      placeholder: "Password",
                      backgroundColor: Colors.white,
                      controller: pwdController,
                      keyboardType: TextInputType.text,
                    ),

                    signInOrUp ? BtnCustom(
                      width: 300,
                      textBtn: "Connexion",
                      iconName: Icons.person,
                      btnColor: Colors.white,
                      textColor: Colors.black,
                      onPress: signIn,
                    ) : BtnCustom(
                      width: 300,
                      textBtn: "Inscription",
                      iconName: Icons.person,
                      btnColor: Colors.white,
                      textColor: Colors.black,
                      onPress: signUp,
                    ),
                    GestureDetector(
                      onTap: (){setState(() {
                        signInOrUp=!signInOrUp;
                      });},
                      child: signInOrUp ?
                      Text("Taper ici pour créer son compte",
                      style: TextStyle(color: Colors.white,decoration: TextDecoration.underline)):
                     Text("Taper ici pour vous connectez",
                      style: TextStyle(color: Colors.white,decoration: TextDecoration.underline)),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  signIn() async {
    print("SignIn");
    setState(() {
      email = emailController.text;
      password = pwdController.text;
    });

    Api api = Api();
    var response = await api.login(
        email,
        password,
    );
    if(response == 200 || response == 201){
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => HomePage()),
            (Route<dynamic> route) => false,
      );
    }
  }

  signUp() async {
    setState(() {
      username = usernameController.text;
      email = emailController.text;
      password = pwdController.text;
    });

    Api api = Api();
    var response = await api.register(
        username,
        email,
        password,
        "name",
        "firstname"
    );
    if(response == 200 || response == 201){
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => Auth()),
            (Route<dynamic> route) => false,
      );
    }
  }
}
