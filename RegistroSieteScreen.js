import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, StatusBar, ActivityIndicator, Platform } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Modal from './Modal.js'
import ActivityIndi from './activityIndi.js'
import { ServidorExport } from './ServAdress.js'
import { styles } from "./Style.js";
import * as ImagePicker from 'expo-image-picker';
// import { Camera, CameraType } from 'expo-camera';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { LinearGradient } from 'expo-linear-gradient';

let fontWidth = Dimensions.get('window').width;

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

const RegistroSieteScreen = ({ route, navigation }) => {
  const [load, setLoad] = React.useState(false);
  const [ActivityShow, setActivityShow] = React.useState(false)

  const [firma, setFirma] = React.useState(route.params.FirmaUri);
  const [nombre, setlatitude] = React.useState(route.params.Nombre);
  const [numero, setnumero] = React.useState(route.params.Numero);
  const [rut, setRut] = React.useState(route.params.Rut);
  const [direccion, setDireccion] = React.useState(route.params.Direccion);
  const [correo, setCorreo] = React.useState(route.params.Correo);
  const [fechaNacimiento, setFechaNacimiento] = React.useState(route.params.FechaNacimiento);
  // const [canverso, setCanverso] = React.useState(route.params.CAnverso); 
  // const [creverso, setCreverso] = React.useState(route.params.CReverso); 
  // const [lanverso, setLanverso] = React.useState(route.params.LAnverso); 
  // const [lreverso, setLreverso] = React.useState(route.params.LReverso); 
  // const [correo, setCorreo] = React.useState(route.params.Correo); 

  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const cameraRef = React.useRef();

  const [clave, setclave] = React.useState('');
  const [claveDos, setclaveDos] = React.useState('');
  const [imagePerfil, setImagePerfil] = React.useState(null);
  const [base, setBase64] = React.useState(null);


  //MANEJO DEL MODAL POPUP
  const [ModalVisible, setModalVisible] = React.useState(false);
  const [ModalType, setModalType] = React.useState('');
  const [ModalTitle, setModalTitle] = React.useState('');
  const [ModalBody, setModalBody] = React.useState('');
  const [ModalFunc, setModalfunc] = React.useState()
  const ModalOptions = (type, title, body, func) => {
    setModalVisible(true);
    setModalType(type);
    setModalTitle(title);
    setModalBody(body);

    if (func == 'close') {
      setModalfunc('close')
    } else {
      setModalfunc(() => func)
    }


  }
  const handleClose = () => {
    setModalVisible(false)
  }
  //MANEJO DEL MODAL POPUP
  activity = () => {
    if (ActivityShow == true) {
      return (
        <ActivityIndi />
      )
    }
  }

  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera permissions to make this work!');
        }
      }
    })();
  }, []);

  NextPageSieteScreen = () => {

    Keyboard.dismiss()
    console.log(firma)
    console.log(nombre)
    console.log(numero)
    console.log(rut)
    console.log(direccion)
    console.log(fechaNacimiento)
    console.log(correo)
    console.log(clave)
    console.log(imagePerfil)

    if (!clave) {
      ModalOptions('Error', 'Clave inválida', 'Debes ingresar una clave', 'close');

    } else if (!claveDos) {
      ModalOptions('Error', 'Clave inválida', 'Debes ingresar verificar tu clave', 'close');

    } else if (clave != claveDos) {
      ModalOptions('Error', 'Clave inválida', 'Las claves deben ser iguales', 'close');


    }
    else if (imagePerfil == '' || imagePerfil == null || imagePerfil == 'undefined' || !imagePerfil) {
      ModalOptions('Error', 'Falta foto', 'Debes tomarte una foto de perfil', 'close');
    }
    else {
      navigation.navigate('RegistroCuatro', { FirmaUri: firma, Nombre: nombre, Numero: numero, Rut: rut, Direccion: direccion, FechaNacimiento: fechaNacimiento, Correo: correo, Clave: clave, ImgPerfil: imagePerfil });
    }
  }


  backPassPage = () => {
    navigation.navigate('Primera')
  }

  const openCamera = () => {
    setIsCameraOpen(true);
  };

  const closeCamera = () => {
    console.log('cerrar')
    setIsCameraOpen(prev => false);
  };
  const takePicture = async () => {
    console.log('1')
    console.log('current')
    if (cameraRef.current) {

      const options = {
        quality: 0.5,
        base64: true,
        orientation: 'landscape',
        //cameraType:Camera.Constants.Type.front 
      };
      console.log('cerrar 6')
      const data = await cameraRef.current.takePictureAsync(options);
      const { width, height } = data;
      console.log('cerrar 2')
      setImagePerfil(prev => data.uri)

      console.log('cerrar 3')
      // Aquí puedes manejar la foto tomada (guardarla, mostrarla, etc.)
      closeCamera(); // Cerrar la cámara después de tomar la foto
    }
  };
  rendPicture1 = () => {
    if (imagePerfil) {
      return (

        <Image
          source={{ uri: imagePerfil }}
          resizeMode="contain"

          style={{
            alignSelf: 'center',
            width: 150,
            height: 150,
            marginTop: 10, marginBottom: 10,
            //transform:[{rotate:'90deg'}]
          }}
        />





      )

    }
  }




  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>

      {!isCameraOpen ? (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, position: 'absolute', width: '100%', height: '100%', backgroundColor: '#fff' }}>
            <Image
              resizeMode="contain"
              style={{
                position: 'relative',
                top: 0,
                right: 0,
                alignSelf: 'flex-end',
                width: 248,
                height: 180,
                zIndex: 0,

                marginBottom: 0,
              }}
              source={require('./assets/registroAdornoDos.png')}
            />
            <Image
              style={{
                position: 'absolute',
                bottom: 0,
                alignSelf: 'flex-start',
                width: '100%',
                marginBottom: 0,
              }}
              source={require('./assets/registroAdorno.png')}
            />
          </View>
          <DismissKeyboard style={{ flex: 1 }}>


            <View style={styles.containerAdornos}>
              {activity()}
              <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent={true}
              />
              <View
                style={{
                  backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'transparent',
                  height: Constants.statusBarHeight,
                  width: '100%',
                  //marginTop: Constants.statusBarHeight, //Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,,
                }} />

              <KeyboardAvoidingView
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
                behavior={(Platform.OS === 'ios') ? "padding" : null}
              >

                <View style={styles.headerAdorno}>

                  <TouchableOpacity style={{ padding: 0, marginBottom: 10, }} onPress={() => navigation.goBack()}>
                    <FontAwesome name="arrow-left" style={styles.arrowBack} />
                  </TouchableOpacity>





                </View>


                <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 10, paddingHorizontal: 15, }}>
                  <Text style={[styles.TextHeader, { marginBottom: 15, }]}>Crear contraseña</Text>











                  <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { clave1.focus(); }}>
                    {/* <Text style={styles.labels}>Clave</Text> */}
                    <TextInput
                      style={styles.inputs}
                      placeholderTextColor="#909fac"
                      underlineColorAndroid="transparent"
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect={false}
                      maxLength={100}
                      secureTextEntry={true}
                      value={clave}
                      placeholder="Contraseña"
                      onChangeText={clave => setclave(clave)}
                      ref={(input) => { clave1 = input; }}
                      returnKeyType={"next"}
                      onSubmitEditing={() => { clave2.focus(); }}
                    />
                  </TouchableOpacity>


                  <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { clave2.focus(); }}>
                    {/* <Text style={styles.labels}>Repite Tu Clave</Text> */}
                    <TextInput
                      style={styles.inputs}
                      placeholderTextColor="#909fac"
                      underlineColorAndroid="transparent"
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect={false}
                      maxLength={100}
                      secureTextEntry={true}
                      value={claveDos}
                      placeholder="Confirmar contraseña"
                      onChangeText={clavedos => setclaveDos(clavedos)}
                      ref={(input) => { clave2 = input; }}
                      returnKeyType={"next"}
                      onSubmitEditing={() => NextPageSieteScreen()}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ width: '100%', height: 'auto', padding: 15, borderRadius: 10, backgroundColor: '#eeeeee', marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={openCamera}>
                    <Text style={{ fontSize: fontWidth / 25, color: '#323232', fontFamily: 'Poppins_700Bold', }}>Tomar foto de perfil</Text>
                    <Entypo name="image-inverted" size={fontWidth / 13} color="#000" />
                  </TouchableOpacity>

                  {rendPicture1()}





                  <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

                    <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} onPress={() => NextPageSieteScreen()}>
                      <Text style={styles.txtBtn}>Siguiente</Text>
                    </TouchableOpacity>

                  </LinearGradient>








                </View>
              </KeyboardAvoidingView>
            </View>
          </DismissKeyboard>
        </View>) : (
        <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '80%', height: '60%', borderRadius: 18, }}>
            <CameraView
              style={styles.cameraPerfil}
              ref={cameraRef}
              facing={'front'}
            //type={CameraView.Constants.Type.front}
            //orientation={'landscape'}
            >
              <View style={styles.overlayPerfil} />

            </CameraView>
          </View>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
          />
        </View>
      )}
      <Modal
        visible={ModalVisible}
        type={ModalType}
        title={ModalTitle}
        body={ModalBody}
        options={{ type: 'slide', from: 'bottom' }}
        duration={250}
        onClose={handleClose}
        func={ModalFunc} //escribir function que se quiera usar
      />
    </View>
  )
};

export default RegistroSieteScreen;
