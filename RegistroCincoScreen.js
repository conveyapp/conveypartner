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

const RegistroCincoScreen = ({ route, navigation }) => {
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



  const [image, setImage] = React.useState(null);
  const [base, setBase64] = React.useState(null);

  const [imageTwo, setImageTwo] = React.useState(null);
  const [baseTwo, setBase64Two] = React.useState(null);





  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const cameraRef = React.useRef();

  const [originalImageWidth, setOriginalImageWidth] = React.useState(null);
  const [originalImageHeight, setOriginalImageHeight] = React.useState(null);
  const [imageRotation, setImageRotation] = React.useState('-90deg');

  const openCamera = () => {
    setIsCameraOpen(true);
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
  };

  // Función para determinar la rotación correcta basada en las dimensiones de la imagen
  const determineImageRotation = (width, height) => {
    // Si la imagen es más alta que ancha (portrait), necesita rotación para mostrar como landscape
    if (height > width) {
      return '-90deg'; // Rotar para orientación horizontal
    } else {
      return '0deg'; // No rotar si ya está en orientación horizontal
    }
  };



  const takePicture = async () => {
    console.log('1')
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, orientation: 'landscape' };
      const data = await cameraRef.current.takePictureAsync(options);
      const { width, height } = data;
      console.log('Primera foto - width:', width, 'height:', height)
      setOriginalImageWidth(width)
      setOriginalImageHeight(height)

      // Determinar la rotación correcta basada en las dimensiones
      const rotation = determineImageRotation(width, height);
      setImageRotation(rotation);

      setImage(prev => data.uri)

      // Aquí puedes manejar la foto tomada (guardarla, mostrarla, etc.)
      closeCamera(); // Cerrar la cámara después de tomar la foto
    }
  };



  const takePictureDos = async () => {
    console.log('2')
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, orientation: 'landscape' };
      const dataDos = await cameraRef.current.takePictureAsync(options);
      const { width, height } = dataDos;
      console.log('Segunda foto - width:', width, 'height:', height)

      // Determinar la rotación correcta basada en las dimensiones
      const rotation = determineImageRotation(width, height);
      setImageRotation(rotation);

      setImageTwo(prev => dataDos.uri)

      // Aquí puedes manejar la foto tomada (guardarla, mostrarla, etc.)
      closeCamera(); // Cerrar la cámara después de tomar la foto
    }
  };

  // const takePicture = async () => {
  //   if (cameraRef.current) {
  //     const options = { quality: 0.5, base64: true };
  //     cameraRef.current.takePictureAsync(options).then(data => {
  //       setImage(data.uri);
  //       // Obtener las dimensiones originales de la imagen
  //       launchCamera({ mediaType: 'photo' }, response => {
  //         if (!response.didCancel) {
  //           const { width, height } = response.assets[0];
  //           setOriginalImageWidth(width);
  //           setOriginalImageHeight(height);
  //         }
  //       });
  //       closeCamera(); // Cerrar la cámara después de tomar la foto
  //     });
  //   }
  // };




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
    if (load == true) {
      return (
        <ActivityIndi />
      )
    }
  }

  React.useEffect(() => {
    ModalOptions('AlertaInfo', 'Atención', 'Recuerda que según el tipo de camión que conduzcas puedes requerir una licencia profesional.', 'close');
  }, []);

  NextPageCincoScreen = () => {
    Keyboard.dismiss()
    setLoad(true)



    if (image == '' || image == null) {
      setLoad(false)
      ModalOptions('Error', 'Error frontal', 'Debes subir una imagen del anverso de tu C.I', 'close');

    } else if (imageTwo == '' || imageTwo == null) {
      setLoad(false)
      ModalOptions('Error', 'Error posterior', 'Debes subir una imagen del reverso de tu C.I', 'close');

    } else {
      setLoad(false)
      navigation.navigate('RegistroAntecedentes', { FirmaUri: firma, Nombre: nombre, Numero: numero, Rut: rut, Direccion: direccion, FechaNacimiento: fechaNacimiento, Correo: correo, Clave: clave, ImgPerfil: imgPerfil, CAnverso: canverso, CReverso: creverso, LAnverso: image, LReverso: imageTwo });
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
            width: 250,
            height: 150,
            marginTop: 10,
            marginBottom: 10,
            // Rotación para orientación horizontal de licencia
            transform: [{ rotate: imageRotation }],
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#ddd'
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
            width: 250,
            height: 150,
            marginTop: 10,
            marginBottom: 10,
            // Rotación para orientación horizontal de licencia
            transform: [{ rotate: imageRotation }],
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#ddd'
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




          <View style={styles.containerAdornos}>
            <StatusBar
              barStyle="dark-content"
              backgroundColor="transparent"
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


            <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 10, paddingHorizontal: 15 }}>
              <Text style={[styles.TextHeader, { marginBottom: 15, }]}>Licencia de conducir</Text>
              <TouchableOpacity style={{ width: '100%', padding: 15, borderRadius: 10, backgroundColor: '#eeeeee', marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={openCamera}>
                <Text style={{ fontSize: fontWidth / 25, color: '#323232', fontFamily: 'Poppins_700Bold', }}>Tomar foto frontal</Text>
                <Entypo name="image-inverted" size={fontWidth / 13} color="#000" />
              </TouchableOpacity>




              {rendPicture1()}


              <TouchableOpacity style={{ width: '100%', padding: 15, borderRadius: 10, backgroundColor: '#eeeeee', marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={openCamera}>
                <Text style={{ fontSize: fontWidth / 25, color: '#323232', fontFamily: 'Poppins_700Bold', }}>Tomar foto posterior</Text>
                <Entypo name="image-inverted" size={fontWidth / 13} color="#000" />
              </TouchableOpacity>

              {rendPicture2()}



              <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

                <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} onPress={() => NextPageCincoScreen()}>
                  <Text style={styles.txtBtn}>Siguiente</Text>
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

}

export default RegistroCincoScreen;



