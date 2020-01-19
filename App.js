import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  PermissionsAndroid,
  ScrollView
} from "react-native";
import CameraRoll from "react-native-cameraroll";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";

import Icon from "react-native-vector-icons/FontAwesome";

export default function App() {
  const [permissao, setPermissao] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState();
  const [loading, setLoading] = useState(true);
  const [imageUri, setImageUri] = useState();

  useEffect(() => {
    async function getPermissao() {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      setPermissao(status == "granted");
      setLoading(false);
    }

    getPermissao();
  }, []);

  async function capturaFoto() {
    if (camera) {
      const options = {
        quality: 0.5,
        base64: true,
        forceUpOrientation: true,
        fixOrientation: true
      };
      let photo = await camera
        .takePictureAsync(options)
        .then(e => {
          const { uri, base64 } = e;
          setImageUri(uri);
          console.log("base64: " + base64);
        })
        .catch(error => {
          console.log(`Error: ${error}`);
        });
    }
  }

  async function salvarFoto() {
    try {
      /*const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Access Storage",
          message: "Access Storage for the pictures"
        }
      );*/
      //if (permissao === PermissionsAndroid.RESULTS.GRANTED) {
      if (permissao) {
        await CameraRoll.saveToCameraRoll(imageUri);
      } else {
        console.log("Permissao de câmera negada.");
      }
    } catch (err) {
      console.warn(err);
    }

    setImageUri(null);
  }

  if (loading) {
    return <Text>AQUI</Text>;
  } else if (permissao == null) {
    return <View />;
  } else if (permissao == false) {
    return <Text>No access to camera</Text>;
  } else {
    return (
      <View style={{ flex: 1 }}>
        {imageUri ? (
          <ImageBackground style={styles.preview} source={{ uri: imageUri }}>
            <ScrollView></ScrollView>
            <View style={styles.buttonsPreview}>
              <Icon
                name="times"
                size={25}
                color="#fff"
                onPress={() => setImageUri(null)}
              />
              <Icon
                name="check"
                size={25}
                color="#fff"
                onPress={() => salvarFoto()}
              />
            </View>
          </ImageBackground>
        ) : (
          <Camera
            style={styles.camera}
            type={type}
            autoFocus={true}
            permissionDialogTitle={"Permissão para usar a câmera"}
            permissionDialogMessage={
              "Precisamos da sua permissão para usar a câmera do seu smartphone"
            }
            ref={ref => setCamera(ref)}
            onMountError={e => console.log(e)}
          >
            <TouchableOpacity onPress={capturaFoto} style={styles.button}>
              <Text
                style={{
                  color: "white",
                  fontSize: 25,
                  fontWeight: "bold",
                  alignSelf: "center"
                }}
              >
                FOTO
              </Text>
            </TouchableOpacity>
          </Camera>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  camera: {
    flex: 1
  },
  button: {
    alignSelf: "center",
    backgroundColor: "red",
    borderRadius: 50,
    width: 100,
    height: 100,
    marginTop: 600,
    justifyContent: "center"
  },
  preview: {
    width: "100%",
    height: "100%",
    flex: 1
  },
  buttonsPreview: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 5
  }
});
