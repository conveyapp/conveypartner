import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, ScrollView, TouchableWithoutFeedback, Platform, Keyboard, Alert, KeyboardAvoidingView, TouchableOpacity, TextInput, ActivityIndicator, StatusBar } from 'react-native';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Modal from './Modal.js';
import ActivityIndi from './activityIndi.js'
import { ServidorExport } from './ServAdress.js'
import { styles } from "./Style.js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { AuthContext } from './utils';
// import { GeoCodingApiGoogle } from './GeoCodingApi.js'

let fontWidth = Dimensions.get('window').width;

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

// create a component
const SeguridadScreen = ({ route, navigation }) => {
  const [admin, setAdmin] = React.useState('');
  const [ActivityShow, setActivityShow] = React.useState(false);
  const { signOut } = React.useContext(AuthContext);




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
    const unsubscribe = navigation.addListener('focus', async () => {
      var userToken = await AsyncStorage.getItem('Key_27');
      setAdmin(prev => userToken)

    });


    return unsubscribe;
  }, [navigation]);


  recuperarClave = () => {
    setActivityShow(true)
    if (admin == '') {
      ModalOptions('Error', 'Correo inválido', 'Debes ingresar un correo', 'close');
    } else {


      fetch(`${ServidorExport}/partner/CambiarClave.php`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: admin,
        })

      })

        .then(response => {


          if (!response.ok || response.status != 200 || response.status != '200') {
            setActivityShow(false)
            ModalOptions('Error', 'Error de conexión 1', 'Algo falló, intenta nuevamente', 'close');
          } else {
            response.json()
              .then(responser => {
                if (responser === 'Correo Enviado') {

                  setActivityShow(false)
                  ModalOptions('Exito', 'Correo enviado', 'Te enviamos un correo para que cambies tu clave, revisa tu bandeja de entrada o spam', 'close');


                } else if (responser === 'Este correo no existe') {


                  setActivityShow(false)
                  ModalOptions('Error', 'No existe', 'Este correo no está en nuestra base de datos.', 'close');

                } else {
                  setActivityShow(false)
                  ModalOptions('Error', 'Error de conexión 1', 'Algo falló, intenta nuevamente', 'close');
                }




              })
          }
        })
        .catch((error) => {
          setActivityShow(false)
          ModalOptions('Error', 'Error de conexión 1', 'Algo falló, intenta nuevamente', 'close');
        });
    }
  }


  const salir = () => {
    signOut()

  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
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



              <Text style={styles.TextHeader}>Seguridad</Text>

            </View>



            <View style={{ flex: 1, width: '100%', marginTop: 2, paddingHorizontal: 0, backgroundColor: 'transparent' }}>






              <TouchableOpacity onPress={() => recuperarClave()} style={{ width: '100%', backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 10 }}>
                <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 20 }}>Cambiar contraseña</Text>
                <Text style={{ color: '#262626', fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 30 }}>Aprieta aquí para recibir un correo de cambio de clave</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => salir()} style={{ width: '100%', backgroundColor: '#f0f0f0', paddingHorizontal: 15, paddingVertical: 10 }}>
                <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 20 }}>Cerrar sesión</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Camion')} style={{ width: '100%', backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 10 }}>
                <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 20 }}>Eliminar cuenta</Text>
              </TouchableOpacity>









            </View>








          </ScrollView>
        </KeyboardAvoidingView>
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

  );
};

export default SeguridadScreen;
