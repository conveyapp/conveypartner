import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, StatusBar, ActivityIndicator, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Modal from './Modal.js'
import ActivityIndi from './activityIndi.js'
import { ServidorExport } from './ServAdress.js'
import { styles } from "./Style.js";
import { LinearGradient } from 'expo-linear-gradient';

let fontWidth = Dimensions.get('window').width;

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

const RegistroSeisScreen = ({ route, navigation }) => {
  const [load, setLoad] = React.useState(false);
  const [ActivityShow, setActivityShow] = React.useState(false)

  const [firma, setFirma] = React.useState(route.params.FirmaUri);
  const [nombre, setlatitude] = React.useState(route.params.Nombre);
  const [numero, setnumero] = React.useState(route.params.Numero);
  const [rut, setRut] = React.useState(route.params.Rut);
  const [direccion, setDireccion] = React.useState(route.params.Direccion);
  const [fechaNacimiento, setFechaNacimiento] = React.useState(route.params.FechaNacimiento);
  // const [canverso, setCanverso] = React.useState(route.params.CAnverso); 
  // const [creverso, setCreverso] = React.useState(route.params.CReverso); 
  // const [lanverso, setLanverso] = React.useState(route.params.LAnverso); 
  // const [lreverso, setLreverso] = React.useState(route.params.LReverso); 



  const [correo, setCorreo] = React.useState('');


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

  NextPageSeisScreen = () => {
    Keyboard.dismiss();

    if (!correo) {
      ModalOptions('Error', 'Correo inválido', 'Este campo no puede estar vacío', 'close');
    } else {
      const validarArroba = correo.indexOf("@");
      const validarPunto = correo.indexOf(".");

      if (validarArroba === -1) {
        ModalOptions('Error', 'Correo inválido', 'Debes ingresar un correo válido', 'close');
      } else if (validarPunto === -1) {
        ModalOptions('Error', 'Correo inválido', 'Debes ingresar un correo válido', 'close');
      } else {
        navigation.navigate('RegistroSiete', {
          FirmaUri: firma,
          Nombre: nombre,
          Numero: numero,
          Rut: rut,
          Direccion: direccion,
          FechaNacimiento: fechaNacimiento,
          Correo: correo,
        });
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
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
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent={true}
          />
          {/* {activity()} */}
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




            <View style={{ flex: 1, width: '100%', marginTop: 2, paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center', }}>
              <Text style={[styles.TextHeader, { marginBottom: 15, }]}>Correo</Text>
              <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { nombreInput.focus(); }}>
                <View style={{ width: '80%' }}>
                  {/* <Text style={styles.labels}>Tu correo</Text> */}
                  <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}

                    placeholder="Ingresa tu email"
                    onChangeText={correo => setCorreo(correo)}
                    ref={(input) => { nombreInput = input; }}
                    onSubmitEditing={() => { NextPageSeisScreen(); }}
                    returnKeyType={"next"}
                  />
                </View>
              </TouchableOpacity>





              <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

                <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} onPress={() => NextPageSeisScreen()}>
                  <Text style={styles.txtBtn}>Siguiente</Text>
                </TouchableOpacity>

              </LinearGradient>


            </View>







          </KeyboardAvoidingView>
        </View>

      </DismissKeyboard>


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

export default RegistroSeisScreen;
