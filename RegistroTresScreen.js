import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, Image, TextInput, KeyboardAvoidingView, TouchableOpacity, Platform, Alert, TouchableWithoutFeedback, Keyboard, StatusBar, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Modal from './Modal.js';
import { LinearGradient } from 'expo-linear-gradient';
import ActivityIndi from './activityIndi.js'
import { ServidorExport } from './ServAdress.js'
import { styles } from "./Style.js";

let fontWidth = Dimensions.get('window').width;


const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)


const RegistroTresScreen = ({ route, navigation }) => {

  const [load, setLoad] = React.useState(false);

  const [firma, setFirma] = React.useState(route.params.FirmaUri);
  const [nombre, setlatitude] = React.useState(route.params.Nombre);
  const [numero, setnumero] = React.useState(route.params.Numero);
  const [rut, setRut] = React.useState('');






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



  const validaRut = (rut) => {
    const cuerpo = rut.slice(0, -1); // Números del RUT (sin el dígito verificador)
    const dvIngresado = rut.slice(-1).toUpperCase(); // Dígito verificador (último carácter)

    let suma = 0;
    let multiplicador = 2;

    // Calcular la suma del RUT
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i], 10) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

    return dvCalculado === dvIngresado;
  };








  NextPageTresScreen = () => {
    Keyboard.dismiss(); // Ocultar el teclado
    setLoad(true); // Iniciar carga visual

    if (!rut) {
      // Validar si el R.U.T está vacío
      setLoad(false);
      ModalOptions('Error', 'R.U.T inválido', 'Debes ingresar un R.U.T', 'close');
      return; // Salir de la función
    }

    // Validar si todos los caracteres del R.U.T son iguales (ignorando puntos y guion)
    const rutSinFormato = rut.replace(/[.-]/g, '');
    const todosIguales = rutSinFormato.split('').every((char) => char === rutSinFormato[0]);
    if (todosIguales) {
      setLoad(false);
      ModalOptions('Error', 'Número inválido', 'Tu R.U.T parece no ser válido', 'close');
      return; // Salir de la función
    }

    // Validar la longitud del RUT (8 a 9 caracteres sin puntos ni guion)
    if (rutSinFormato.length < 8 || rutSinFormato.length > 9) {
      setLoad(false);
      ModalOptions('Error', 'R.U.T inválido', 'El R.U.T debe tener entre 8 y 9 caracteres', 'close');
      return; // Salir de la función
    }

    // Validar el dígito verificador
    if (!validaRut(rutSinFormato)) {
      setLoad(false);
      ModalOptions('Error', 'Número inválido', 'El dígito verificador del R.U.T no es válido', 'close');
      return; // Salir de la función
    }

    // Si pasa todas las validaciones, proceder a la siguiente pantalla
    setLoad(false);
    navigation.navigate('RegistroDireccion', { FirmaUri: firma, Nombre: nombre, Numero: numero, Rut: rut });











  }


  const formatRut = (rut) => {
    // Eliminar cualquier caracter que no sea número ni K/k
    rut = rut.replace(/[^\dkK]/g, '');

    // Separar el cuerpo del RUT del dígito verificador
    let rutCuerpo = rut.slice(0, -1);
    let rutDV = rut.slice(-1);

    // Formatear el cuerpo del RUT con puntos y guión
    rutCuerpo = rutCuerpo.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

    // Reunir el cuerpo del RUT con el dígito verificador
    rut = rutCuerpo + '-' + rutDV;

    return rut;
  };

  const handleRutChange = (text) => {
    const formattedRut = formatRut(text);


    setRut(formattedRut);

  };



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

            <View style={styles.headerAdorno}>

              <TouchableOpacity style={{ padding: 0, marginBottom: 10, }} onPress={() => navigation.goBack()}>
                <FontAwesome name="arrow-left" style={styles.arrowBack} />
              </TouchableOpacity>

              {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.TextHeader}>R.U.T</Text>

                  </View> */}





            </View>


            <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 10, paddingHorizontal: 15, }}>

              <Text style={[styles.TextHeader, { marginBottom: 15, }]}>R.U.T</Text>
              <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { rutInput.focus(); }}>
                <View style={{ width: '80%' }}>
                  {/* <Text style={styles.labels}>Tu rut</Text> */}
                  <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}

                    placeholder="Ingresa tu R.U.T"
                    value={rut}
                    onChangeText={handleRutChange}
                    ref={(input) => { rutInput = input; }}
                    onSubmitEditing={() => { NextPageTresScreen(); }}
                    returnKeyType={"next"}
                  />
                </View>
              </TouchableOpacity>
              <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

                <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} onPress={() => NextPageTresScreen()}>
                  <Text style={styles.txtBtn}>Siguiente</Text>
                </TouchableOpacity>

              </LinearGradient>
              {/* <Image
              style={{
                alignSelf: 'center',
                width: 100,
                height: 100,
                marginBottom: 20,
                marginTop: 30,
              }}
              source={require('./assets/r2.png')}
            /> */}

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
  );

}

export default RegistroTresScreen;






