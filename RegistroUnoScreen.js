import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, ScrollView, TouchableWithoutFeedback, Platform, Keyboard, Alert, KeyboardAvoidingView, TouchableOpacity, TextInput, ActivityIndicator, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Modal from './Modal.js';
import ActivityIndi from './activityIndi.js'
import { ServidorExport } from './ServAdress.js'
import { styles } from "./Style.js";
import { LinearGradient } from 'expo-linear-gradient';
// import { GeoCodingApiGoogle } from './GeoCodingApi.js'

let fontWidth = Dimensions.get('window').width;



const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

const RegistroUnoScreen = ({ route, navigation }) => {
  //  const [direc, setDirec] = React.useState('');
  //  const [comuna, setComuna] = React.useState('');
  //  const [deptoblock, setDeptoblock] = React.useState('');
  const [firma, setFirma] = React.useState(route.params.FirmaUri);

  const [nombre, setNombre] = React.useState('');
  const [load, setLoad] = React.useState(false);



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
    if (load == true) {
      return (
        <ActivityIndi />

      )
    }
  }

  NextPageUnoScreen = () => {
    // Expresión regular que permite letras (mayúsculas/minúsculas), espacios y tildes
    var expresionRegular = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    var nombreTrimmed = nombre.trim(); // Elimina espacios al inicio y al final

    if (nombreTrimmed === '') {
      ModalOptions('Error', 'Nombre inválido', 'Debes ingresar un nombre', 'close');
    }
    else if (!expresionRegular.test(nombreTrimmed)) {
      ModalOptions('Error', 'Nombre inválido', 'Debes ingresar sólo letras, espacios y tildes', 'close');
    }
    else if (nombreTrimmed.length < 5) {
      ModalOptions('Error', 'Nombre demasiado corto', 'El nombre debe tener al menos 5 caracteres', 'close');
    }
    else {
      navigation.navigate('RegistroDos', {
        FirmaUri: firma,
        Nombre: nombreTrimmed
      });
    }
  }


  return (
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
              //marginTop: Constants.statusBarHeight, //Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,,
            }} />
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
            behavior={(Platform.OS === 'ios') ? "padding" : null}
          >

            {/* <ScrollView style={{flex:1}} keyboardShouldPersistTaps='always'> */}

            <View style={styles.headerAdorno}>

              <TouchableOpacity style={{ padding: 0, marginBottom: 10, }} onPress={() => navigation.goBack()}>
                <FontAwesome name="arrow-left" style={styles.arrowBack} />
              </TouchableOpacity>







            </View>




            <View style={{ flex: 1, width: '100%', marginTop: 2, paddingHorizontal: 15, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={[styles.TextHeader, { marginBottom: 15, }]}>Nombre</Text>
              <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { nombreInput.focus(); }}>

                {/* <Text style={styles.labels}>Tu Nombre</Text> */}
                <TextInput
                  style={styles.inputs}
                  placeholderTextColor="#909fac"
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect={false}
                  maxLength={100}

                  placeholder="Ingresa tu nombre completo"
                  onChangeText={nombre => setNombre(nombre)}
                  ref={(input) => { nombreInput = input; }}
                  onSubmitEditing={() => { NextPageUnoScreen(); }}
                  returnKeyType={"next"}
                />

              </TouchableOpacity>







              <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

                <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} onPress={() => NextPageUnoScreen()}>
                  <Text style={styles.txtBtn}>Siguiente</Text>
                </TouchableOpacity>

              </LinearGradient>


            </View>








            {/* </ScrollView> */}
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

  );

}

export default RegistroUnoScreen;

