import React, { Component } from 'react';
import { View, ScrollView, Text, Dimensions, StyleSheet, Image, TextInput, TouchableOpacity, Platform, Alert, TouchableWithoutFeedback, Keyboard, StatusBar, ActivityIndicator } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Modal from './Modal.js'
import ActivityIndi from './activityIndi.js'
import { ServidorExport } from './ServAdress.js'
import { styles } from "./Style.js";
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';

let fontWidth = Dimensions.get('window').width;

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

const RegistroAntecedentes = ({ route, navigation }) => {
  const [ActivityShow, setActivityShow] = React.useState(false)
  const [load, setLoad] = React.useState(false);

  const [firma, setFirma] = React.useState(route.params.FirmaUri);
  const [nombre, setlatitude] = React.useState(route.params.Nombre);
  const [numero, setnumero] = React.useState(route.params.Numero);
  const [rut, setRut] = React.useState(route.params.Rut);
  const [direccion, setDireccion] = React.useState(route.params.Direccion);
  const [correo, setCorreo] = React.useState(route.params.Correo);
  const [fechaNacimiento, setFechaNacimiento] = React.useState(route.params.FechaNacimiento);
  const [clave, setClave] = React.useState(route.params.Clave);
  const [imgPerfil, setImgPerfil] = React.useState(route.params.ImgPerfil);
  const [canverso, setCanverso] = React.useState(route.params.CAnverso);
  const [creverso, setCreverso] = React.useState(route.params.CReverso);
  const [lanverso, setLanverso] = React.useState(route.params.LAnverso);
  const [lreverso, setLreverso] = React.useState(route.params.LReverso);



  const [image, setImage] = React.useState(null);
  const [base, setBase64] = React.useState(null);

  const [imageTwo, setImageTwo] = React.useState(null);
  const [baseTwo, setBase64Two] = React.useState(null);





  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const cameraRef = React.useRef();

  const [originalImageWidth, setOriginalImageWidth] = React.useState(null);
  const [originalImageHeight, setOriginalImageHeight] = React.useState(null);

  const openCamera = () => {
    setIsCameraOpen(true);
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
  };


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


  const takePicture = async () => {
    console.log('1')
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const { width, height } = data;
      setOriginalImageWidth(width)
      setOriginalImageHeight(height)

      setImage(prev => data.uri)


      // Aquí puedes manejar la foto tomada (guardarla, mostrarla, etc.)
      closeCamera(); // Cerrar la cámara después de tomar la foto
    }
  };



  const takePictureDos = async () => {
    console.log('2')
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const dataDos = await cameraRef.current.takePictureAsync(options);

      // const {width, height} = data;
      // setOriginalImageWidth(width)
      // setOriginalImageHeight(height)

      setImageTwo(prev => dataDos.uri)


      // Aquí puedes manejar la foto tomada (guardarla, mostrarla, etc.)
      closeCamera(); // Cerrar la cámara después de tomar la foto
    }
  };

  React.useEffect(() => {
    ModalOptions('AlertaInfo', 'Atención', 'Puedes obtener tu certificado de antecedentes en línea en la página web del registro civil como “Certificado Fines Particulares”', 'close');
  }, []);

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




  activity = () => {
    if (ActivityShow == true) {
      return (
        <ActivityIndi />
      )
    }
  }
  const aspectRatio = originalImageWidth / originalImageHeight;
  const proportionalHeight = 100 / aspectRatio;

  rendPicture1 = () => {
    if (image) {
      return (
        <Image
          source={{ uri: image }}
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

  rendPicture2 = () => {
    if (imageTwo) {
      return (
        <Image
          source={{ uri: imageTwo }}
          resizeMode="contain"
          style={{
            alignSelf: 'center',
            width: 150,
            height: 150,
            marginTop: 0, marginBottom: 0,
            transform: [{ rotate: '90deg' }]
          }}
        />


      )

    }
  }

  GoInicio = () => {
    navigation.navigate('Ingreso')
  }

  Registro = () => {


    //ModalOptions('Exito', 'Solicitud de registro', 'Tu solicitud de registro ha sido enviada, te avisaremos con un correo si esta fue aceptada o rechazada',GoInicio);

  }

  const registrar = () => {

    if (!image) {
      ModalOptions('Error', 'Ooops!', 'Debes subir tu certificado de antecedentes', 'close')
    } else {
      //console.log(firma)
      //console.log(nombre)
      //console.log(numero)
      //console.log(rut)
      //console.log(direccion)
      //console.log(fechaNacimiento)
      //console.log(correo)
      //console.log(clave)
      //console.log(imgPerfil)


      //console.log(canverso)
      //console.log(creverso)

      //console.log(lanverso)
      //console.log(lreverso)

      Keyboard.dismiss()
      setActivityShow(prev => true);
      const data = new FormData();

      data.append('nombre', nombre.trim());
      data.append('telefono', numero);
      data.append('rut', rut);

      data.append('direccion', direccion);
      data.append('fechan', fechaNacimiento);

      data.append('correo', correo.trim());
      data.append('clave', clave.trim());

      data.append('firma', {//nombre que recibe post image file en php
        uri: firma,
        type: 'image/jpeg', // or photo.type
        name: 'testPhotoName1'
      });
      data.append('fotoperfil', {//nombre que recibe post image file en php
        uri: imgPerfil,
        type: 'image/jpeg', // or photo.type
        name: 'testPhotoName1'
      });
      data.append('canverso', {//nombre que recibe post image file en php
        uri: canverso,
        type: 'image/jpeg', // or photo.type
        name: 'testPhotoName1'
      });
      data.append('creverso', {//nombre que recibe post image file en php
        uri: creverso,
        type: 'image/jpeg', // or photo.type
        name: 'testPhotoName2'
      });
      data.append('lanverso', {//nombre que recibe post image file en php
        uri: lanverso,
        type: 'image/jpeg', // or photo.type
        name: 'testPhotoName3'
      });
      data.append('lreverso', {//nombre que recibe post image file en php
        uri: lreverso,
        type: 'image/jpeg', // or photo.type
        name: 'testPhotoName4'
      });
      data.append('antecedentes', {//nombre que recibe post image file en php
        uri: image,
        type: 'image/jpeg', // or photo.type
        name: 'testPhotoName4'
      });



      fetch(`${ServidorExport}/partner/RegistroPartner.php`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data"
        },
        body: data,
      })
        .then((response) => {
          console.log(response)
          if (!response.ok || response.status != 200 || response.status != '200') {
            setActivityShow(prev => false)
            ModalOptions('Error', 'Ooops!1', 'Hubo un problema, intenta nuevamente', 'close')
            console.log('1')
          } else {
            response.json()
              .then(responser => {
                console.log(responser);
                if (responser == 'exito') {
                  setActivityShow(prev => false)
                  ModalOptions('Exito', 'Solicitud de registro', 'Tu solicitud de registro ha sido enviada, te avisaremos con un correo si esta fue aceptada o rechazada', GoInicio);
                  //ModalOptions('Exito', 'Genial!', 'Registrado con éxito', backPassPage)
                } else if (responser == 'existe') {
                  setActivityShow(prev => false)
                  ModalOptions('Error', 'Ooops!2', 'Ya existe un usuario con este correo', 'close')
                }
                else {
                  setActivityShow(prev => false)
                  console.log(responser);
                  ModalOptions('Error', 'Ooops!3', 'Hubo un problema, intenta nuevamente', 'close')
                }


              })
          }

        })
        .catch((error) => {
          setActivityShow(prev => false)
          ModalOptions('Error', 'Ooops!4', 'Hubo un problema, intenta nuevamente', 'close')
        });


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



          <View style={styles.containerAdornos}>
            <StatusBar
              barStyle="dark-content"
              backgroundColor="#fff"
              translucent={true}
            />
            {activity()}
            <View
              style={{
                backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'transparent',
                height: Constants.statusBarHeight,
                width: '100%',
              }} />

            <View style={styles.headerAdorno}>

              <TouchableOpacity style={{ padding: 0, marginBottom: 10, }} onPress={() => navigation.goBack()}>
                <FontAwesome name="arrow-left" style={styles.arrowBack} />
              </TouchableOpacity>







            </View>


            <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 10, paddingHorizontal: 15, }}>
              <Text style={[styles.TextHeader, { marginBottom: 15, }]}>Certificado de antecedentes</Text>

              <TouchableOpacity style={{ width: '100%', padding: 15, borderRadius: 10, backgroundColor: '#eeeeee', marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={openCamera}>
                <Text style={{ fontSize: fontWidth / 25, color: '#323232', fontFamily: 'Poppins_700Bold', }}>Subir Certificado de antecedentes</Text>
                <Entypo name="image-inverted" size={fontWidth / 13} color="#000" />
              </TouchableOpacity>




              {rendPicture1()}






              <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

                <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} onPress={() => registrar()}>
                  <Text style={styles.txtBtn}>Terminar registro</Text>
                </TouchableOpacity>

              </LinearGradient>




            </View>
          </View>


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
      ) : (
        <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '80%', height: '60%', borderRadius: 18, }}>
            <CameraView
              style={styles.camera}
              ref={cameraRef}
              orientation={'landscape'}
            >
              <View style={styles.overlay} />

            </CameraView>
          </View>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={image ? takePictureDos : takePicture}
          />
        </View>
      )}









    </View>

  );
};

export default RegistroAntecedentes;
