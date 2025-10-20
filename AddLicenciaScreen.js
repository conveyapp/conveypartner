import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, ScrollView, TouchableWithoutFeedback, Platform, Keyboard, Animated, KeyboardAvoidingView, TouchableOpacity, TextInput, ActivityIndicator, StatusBar } from 'react-native';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Modal from './Modal.js';
import ActivityIndi from './activityIndi.js'
import { ServidorExport } from './ServAdress.js'
import { styles } from "./Style.js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');
let fontWidth = Dimensions.get('window').width;

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

// create a component
const AddLicenciaScreen = ({ route, navigation }) => {
  const [admin, setAdmin] = React.useState('');
  const [ActivityShow, setActivityShow] = React.useState(false);

  const [IdUsuario, setIdUsuario] = React.useState('');



  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const cameraRef = React.useRef();
  const [isBottomVisible, setIsBottomVisible] = React.useState(false);
  const slideAnimBottom = React.useRef(new Animated.Value(height)).current;
  const fadeAnimBackground = React.useRef(new Animated.Value(0)).current;
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [originalImageWidth, setOriginalImageWidth] = React.useState(null);
  const [originalImageHeight, setOriginalImageHeight] = React.useState(null);
  const [imageRotation, setImageRotation] = React.useState('-90deg');




  const [anverso, setAnverso] = React.useState(false);
  const [reverso, setReverso] = React.useState(false);

  const [anversoOpener, setAnversoOpener] = React.useState(false);
  const [reversoOpener, setReversoOpener] = React.useState(false);


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

  rendAnverso = () => {
    console.log(anverso)
    if (anverso) {
      const externalLink = `https://convey.cl/partner/padron/${anverso}`;
      const isLocalUri = anverso.startsWith('file://') || anverso.startsWith('content://');
      const isExternalFile = anverso.endsWith('.jpeg') || anverso.endsWith('.jpg') || anverso.endsWith('.png');
      return (
        <View style={{ position: 'relative', }}>
          <TouchableOpacity onPress={() => { openSelectMethodImage('Padron') }} style={{ position: 'absolute', right: 0, top: 0, height: fontWidth / 20, width: fontWidth / 20, backgroundColor: 'red', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
            <FontAwesome name="refresh" size={fontWidth / 30} color="#fff" />
          </TouchableOpacity>
          <Image
            source={
              isLocalUri
                ? { uri: anverso } // URI local tiene prioridad
                : isExternalFile
                  ? { uri: externalLink } // Construye y usa el link externo
                  : null // Si no es válido, no muestra nada
            }
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
        </View>
      )

    }
  }

  const openCamera = () => {
    setIsCameraOpen(true);
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

  // Función para rotar la imagen manualmente
  const rotateImage = () => {
    const rotations = ['0deg', '90deg', '180deg', '270deg'];
    const currentIndex = rotations.indexOf(imageRotation);
    const nextIndex = (currentIndex + 1) % rotations.length;
    setImageRotation(rotations[nextIndex]);
  };
  const openGalleryAnverso = async () => {
    Keyboard.dismiss()
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      //allowsEditing: true,
      //aspect: [4, 4],
      quality: 0,
      base64: true,
    });

    //console.log(result);

    if (!result.canceled) {
      console.log(result.assets[0].height)
      console.log(result.assets[0].width)

      if (result.assets[0].height != 500 || result.assets[0].width != 500) {
        ModalOptions('Error', 'Ooops!', 'La imagen debe tener un tamaño de 400x400 px', 'close');

      } else {
        setAnverso(result.assets[0].uri);
        //   setBase64(result.assets[0].base64);
      }
      hideBottom()
    }

  };

  const closeCamera = () => {
    setIsCameraOpen(false);
  };



  const takePictureAnverso = async () => {
    console.log('1')
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, orientation: 'landscape' };
      const data = await cameraRef.current.takePictureAsync(options);
      const { width, height } = data;
      console.log('Anverso - width:', width, 'height:', height)
      setOriginalImageWidth(width)
      setOriginalImageHeight(height)

      // Determinar la rotación correcta basada en las dimensiones
      const rotation = determineImageRotation(width, height);
      setImageRotation(rotation);

      setAnverso(prev => data.uri)


      // Aquí puedes manejar la foto tomada (guardarla, mostrarla, etc.)
      hideBottom()
      closeCamera(); // Cerrar la cámara después de tomar la foto
    }
  };

  const showBottom = () => {
    setIsBottomVisible(true);

    Animated.parallel([
      Animated.timing(slideAnimBottom, {
        toValue: height - height / 4, // Mover desde la parte inferior hasta la mitad de la pantalla
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimBackground, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideBottom = () => {
    Animated.parallel([
      Animated.timing(slideAnimBottom, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsBottomVisible(false);
      }),
      Animated.timing(fadeAnimBackground, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsBottomVisible(false);
      })
    ]).start(() => {
      setIsMenuOpen(false);
    });
  };

  openSelectMethodImage = (x) => {
    if (x == 'Anverso') {
      setAnversoOpener(prev => true);
      setReversoOpener(prev => false)
    }

    if (x == 'Reverso') {
      setAnversoOpener(prev => false);
      setReversoOpener(prev => true)
    }



    showBottom()
  }








  rendReverso = () => {
    if (reverso) {
      const externalLink = `https://convey.cl/partner/permisocirculacion/${reverso}`;
      const isLocalUri = reverso.startsWith('file://') || reverso.startsWith('content://');
      const isExternalFile = reverso.endsWith('.jpeg') || reverso.endsWith('.jpg') || reverso.endsWith('.png');
      return (
        <View style={{ position: 'relative', }}>
          <TouchableOpacity onPress={() => { openSelectMethodImage('Perm') }} style={{ position: 'absolute', right: 0, top: 0, height: fontWidth / 20, width: fontWidth / 20, backgroundColor: 'red', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
            <FontAwesome name="refresh" size={fontWidth / 30} color="#fff" />
          </TouchableOpacity>
          <Image
            source={
              isLocalUri
                ? { uri: reverso } // URI local tiene prioridad
                : isExternalFile
                  ? { uri: externalLink } // Construye y usa el link externo
                  : null // Si no es válido, no muestra nada
            }
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
        </View>
      )

    }
  }
  const openGalleryReverso = async () => {
    Keyboard.dismiss()
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      //allowsEditing: true,
      //aspect: [4, 4],
      quality: 0,
      base64: true,
    });

    //console.log(result);

    if (!result.canceled) {
      console.log(result.assets[0].height)
      console.log(result.assets[0].width)

      if (result.assets[0].height != 500 || result.assets[0].width != 500) {
        ModalOptions('Error', 'Ooops!', 'La imagen debe tener un tamaño de 400x400 px', 'close');

      } else {
        setReverso(result.assets[0].uri);
        //   setBase64(result.assets[0].base64);
      }
      hideBottom()
    }

  };
  const takePictureReverso = async () => {
    console.log('2')
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, orientation: 'landscape' };
      const data = await cameraRef.current.takePictureAsync(options);
      const { width, height } = data;
      console.log('Reverso - width:', width, 'height:', height)

      // Determinar la rotación correcta basada en las dimensiones
      const rotation = determineImageRotation(width, height);
      setImageRotation(rotation);

      setReverso(prev => data.uri)


      // Aquí puedes manejar la foto tomada (guardarla, mostrarla, etc.)
      hideBottom()
      closeCamera(); // Cerrar la cámara después de tomar la foto
    }
  };









  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      var userToken = await AsyncStorage.getItem('Key_27');
      setAdmin(prev => userToken)

    });


    return unsubscribe;
  }, [navigation]);

  passBack = () => {
    navigation.navigate('LicenciaDeConducir')
  }



  const AddLicencia = () => {

    if (!anverso) {
      ModalOptions('Error', 'Ooops!', 'Debes subir una imagen frontal de tu licencia', 'close')
    }

    else if (!reverso) {
      ModalOptions('Error', 'Ooops!', 'Debes subir una imagen del reverso de tu licencia', 'close')
    }


    else {



      setActivityShow(prev => true);
      const data = new FormData();
      console.log(admin)
      data.append('admin', admin);



      data.append('anverso', {//nombre que recibe post image file en php
        uri: anverso,
        type: 'image/jpeg', // or photo.type
        name: 'testPhotoName1'
      });
      data.append('reverso', {//nombre que recibe post image file en php
        uri: reverso,
        type: 'image/jpeg', // or photo.type
        name: 'testPhotoName1'
      });





      fetch(`${ServidorExport}/partner/CrearLicencia.php`, {
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
                console.log(responser + ' ji');
                if (responser == 'exito') {
                  setActivityShow(prev => false)
                  ModalOptions('Exito', 'Licencia creada', 'Creaste una licencia exitosamente', passBack);
                  //ModalOptions('Exito', 'Genial!', 'Registrado con éxito', backPassPage)
                } else if (responser == 'error') {
                  setActivityShow(prev => false)
                  ModalOptions('Error', 'Ooops!', 'Hubo un problema, intenta nuevamente', 'close')
                }
                else {
                  setActivityShow(prev => false)
                  console.log(responser);
                  ModalOptions('Error', 'Ooops!', 'Hubo un problema, intenta nuevamente', 'close')
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
          <View style={styles.containerAdornos}>
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
              }} />
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
              behavior={(Platform.OS === 'ios') ? "padding" : null}
            >

              <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='always'>
                {activity()}
                <View style={styles.header}>

                  <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>

                    <TouchableOpacity style={{ padding: 0, marginBottom: 10, }} onPress={() => navigation.goBack()}>
                      <FontAwesome name="arrow-left" style={styles.arrowBack} />
                    </TouchableOpacity>





                  </View>



                  <Text style={styles.TextHeader}>Agregar licencia</Text>








                  <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, marginTop: 15, marginBottom: 10, }}>Anverso de la licencia</Text>
                  {anverso ? (
                    null
                  ) : (
                    <TouchableOpacity style={{ width: '100%', backgroundColor: '#E6E6FA', borderRadius: 10, padding: 10, justifyContent: 'center', alignItems: 'center' }} onPress={() => { openSelectMethodImage('Anverso') }}>
                      <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25 }}>Agregar imagen</Text>
                    </TouchableOpacity>
                  )}
                  {rendAnverso()}



                  <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, marginTop: 15, marginBottom: 10, }}>Reverso de la licencia</Text>
                  {reverso ? (
                    null
                  ) : (
                    <TouchableOpacity style={{ width: '100%', backgroundColor: '#E6E6FA', borderRadius: 10, padding: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10, }} onPress={() => { openSelectMethodImage('Reverso') }}>
                      <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25 }}>Agregar imagen</Text>
                    </TouchableOpacity>
                  )}
                  {rendReverso()}













                  <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>
                    <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} onPress={() => AddLicencia()}>
                      <Text style={{ fontWeight: 'bold', color: '#000' }}>Agregar</Text>
                    </TouchableOpacity>
                  </LinearGradient>




                </View>



                <View style={{ flex: 1, width: '100%', marginTop: 2, paddingHorizontal: 15, backgroundColor: 'transparent' }}>












                </View>








              </ScrollView>
            </KeyboardAvoidingView>
          </View>


          {/* MODAL SOLICITUDES DE VIAJES */}
          {isBottomVisible && (
            <Animated.View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: width,
                height: height,
                backgroundColor: 'black',
                opacity: fadeAnimBackground,
              }}
            >
              <TouchableOpacity onPress={hideBottom} style={{ flex: 1 }}></TouchableOpacity>
            </Animated.View>
          )}

          {isBottomVisible && (
            <Animated.View style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: width,
              height: height,
              backgroundColor: 'white',
              padding: 10,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              transform: [{ translateY: slideAnimBottom }]
            }}>
              <TouchableOpacity onPress={hideBottom} style={{ alignSelf: 'flex-end' }}>
                <FontAwesome name="close" size={24} color="black" />
              </TouchableOpacity>
              <View>

                <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10, }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>
                  <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} onPress={() => openCamera(prev => true)}>
                    <Text style={{ fontWeight: 'bold', color: '#000' }}>Abrir cámara</Text>
                  </TouchableOpacity>
                </LinearGradient>

                <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>
                  <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} onPress={() => {
                    if (anversoOpener) {
                      openGalleryAnverso()
                    }

                    if (reversoOpener) {
                      openGalleryReverso()
                    }

                  }}>
                    <Text style={{ fontWeight: 'bold', color: '#000' }}>Abrir galería</Text>
                  </TouchableOpacity>
                </LinearGradient>

              </View>
            </Animated.View>
          )}
          {/* MODAL SOLICITUDES DE VIAJES */}


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
            onPress={() => {
              if (anversoOpener) {
                takePictureAnverso()
              }

              if (reversoOpener) {
                takePictureReverso()
              }
            }}
          />
        </View>
      )}
    </View>

  );
};

export default AddLicenciaScreen;
