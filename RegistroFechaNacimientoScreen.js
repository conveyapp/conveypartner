import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, ScrollView, TouchableWithoutFeedback, Platform, Keyboard, Alert, KeyboardAvoidingView, TouchableOpacity, TextInput, ActivityIndicator, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Modal from './Modal.js';
import ActivityIndi from './activityIndi.js'
import { ServidorExport } from './ServAdress.js'
import { styles } from "./Style.js";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { LinearGradient } from 'expo-linear-gradient';
// import { GeoCodingApiGoogle } from './GeoCodingApi.js'

let fontWidth = Dimensions.get('window').width;



const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

const RegistroFechaNacimientoScreen = ({ route, navigation }) => {
  const [load, setLoad] = React.useState(false);
  const [firma, setFirma] = React.useState(route.params.FirmaUri);
  const [nombre, setlatitude] = React.useState(route.params.Nombre);
  const [numero, setnumero] = React.useState(route.params.Numero);
  const [rut, setRut] = React.useState(route.params.Rut);
  const [direccion, setDireccion] = React.useState(route.params.Direccion);

  const [nacimiento, setNacimiento] = React.useState('');
  const [fecha, setFecha] = React.useState('Buscar fecha');
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
  const [dateMoment, setDateMoment] = React.useState('Buscar fecha');

  const [dia, setDia] = React.useState('');
  const [mes, setMes] = React.useState('');
  const [ano, setAno] = React.useState('');

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


  NextPageFechaNacimientoScreen = () => {
    console.log(fecha)
    const edad = calcularEdad(fecha);
    console.log("La edad de la persona es:", edad);

    if (fecha == 'Buscar fecha') {
      ModalOptions('Error', 'Fecha inválida', 'Debes ingresar una fecha', 'close');
    } else if (edad < 18) {
      ModalOptions('Error', 'Edad no válida', 'Debes ser mayor de edad para registrarte', 'close');
    } else if (edad > 70) {
      ModalOptions('Error', 'Edad no válida', 'La edad máxima para registrarte es 70 años', 'close');
    } else {
      navigation.navigate('RegistroSeis', {
        FirmaUri: firma,
        Nombre: nombre,
        Numero: numero,
        Rut: rut,
        Direccion: direccion,
        FechaNacimiento: fecha
      });
    }

  }

  NextPageFechaNacimientoScreenWithFecha = (fechaParametro) => {
    console.log(fechaParametro)
    const edad = calcularEdad(fechaParametro);
    console.log("La edad de la persona es:", edad);

    if (fechaParametro == 'Buscar fecha') {
      ModalOptions('Error', 'Fecha inválida', 'Debes ingresar una fecha', 'close');
    } else if (edad < 18) {
      ModalOptions('Error', 'Edad no válida', 'Debes ser mayor de edad para registrarte', 'close');
    } else if (edad > 70) {
      ModalOptions('Error', 'Edad no válida', 'La edad máxima para registrarte es 70 años', 'close');
    } else {
      navigation.navigate('RegistroSeis', {
        FirmaUri: firma,
        Nombre: nombre,
        Numero: numero,
        Rut: rut,
        Direccion: direccion,
        FechaNacimiento: fechaParametro
      });
    }

  }



  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmAndroid = async () => {

    if (dia == '') {
      ModalOptions('Error', 'Edad no válida', 'Debes ingresar un día de nacimiento', 'close');
    }
    else if (mes == '') {
      ModalOptions('Error', 'Edad no válida', 'Debes ingresar un mes de nacimiento', 'close');
    }
    else if (ano == '') {
      ModalOptions('Error', 'Edad no válida', 'Debes ingresar un año de nacimiento', 'close');
    }
    else if (ano.length < 4) {
      ModalOptions('Error', 'Edad no válida', 'Debes ingresar un año de nacimiento', 'close');
    } else {

      var newFechaAndroid = dia + '-' + mes + '-' + ano
      console.log(newFechaAndroid + '1');
      var fechaBien = await corregirFormatoFecha(newFechaAndroid)
      console.log(fechaBien + '2');

      setFecha(prev => fechaBien)

      // Pasar la fecha directamente para evitar problemas de estado asíncrono
      NextPageFechaNacimientoScreenWithFecha(fechaBien)
    }


  }


  function corregirFormatoFecha(fecha) {
    const formatoDeseado = 'DD-MM-YYYY';
    const fechaMoment = moment(fecha, ['DD-MM-YYYY', 'D-M-YYYY'], true);

    if (fechaMoment.isValid()) {
      return fechaMoment.format(formatoDeseado);
    } else {
      // Si el formato no es válido, se corrige al formato deseado
      const fechaCorregida = moment(fecha, 'D-M-YYYY').format(formatoDeseado);
      return fechaCorregida;
    }
  }

  const handleConfirm = (date) => {
    console.log("A date has been picked: ", date);
    var mydate = date;
    var weekDayName = moment(mydate).format('DD-MM-YYYY');
    console.log(weekDayName);
    setFecha(prev => weekDayName)
    hideDatePicker();
  };

  // Función para calcular la edad a partir de una fecha en formato "dd-mm-yyyy"
  function calcularEdad(fechaNacimiento) {
    // Convertir la fecha de nacimiento a un objeto de fecha
    const partesFecha = fechaNacimiento.split("-");
    const dia = parseInt(partesFecha[0], 10);
    const mes = parseInt(partesFecha[1], 10) - 1; // Restar 1 porque los meses en JavaScript son de 0 a 11
    const anio = parseInt(partesFecha[2], 10);
    const fechaNacimientoObj = new Date(anio, mes, dia);

    // Calcular la diferencia de tiempo entre la fecha de nacimiento y la fecha actual
    const diferenciaTiempo = Date.now() - fechaNacimientoObj.getTime();

    // Convertir la diferencia de tiempo a años
    const edad = new Date(diferenciaTiempo).getFullYear() - 1970;

    return edad;
  }

  function soloNumerosMaxDosDia(cadena) {
    var toCheckNumbers = /^\d+$/.test(cadena);
    if (cadena == '') {
      setDia('')
    } else if (toCheckNumbers) {
      //console.log('numero')
      setDia(cadena)
    } else {
      //ModalOptions('Error', 'Día inválido', 'Debes ingresar una comuna o ciudad','close');
    }
  }

  function soloNumerosMaxDosMenos(cadena) {
    var toCheckNumbers = /^\d+$/.test(cadena);
    if (cadena == '') {
      setMes('')
    } else if (toCheckNumbers) {
      //console.log('numero')
      setMes(cadena)
    } else {
      //ModalOptions('Error', 'Día inválido', 'Debes ingresar una comuna o ciudad','close');
    }
  }


  function soloNumerosMaxDosAno(cadena) {
    var toCheckNumbers = /^\d+$/.test(cadena);
    if (cadena == '') {
      setAno('')
    } else if (toCheckNumbers) {
      //console.log('numero')
      setAno(cadena)
    } else {
      //ModalOptions('Error', 'Día inválido', 'Debes ingresar una comuna o ciudad','close');
    }
  }

  RendPickerPlatform = () => {
    if (Platform.OS == 'android') {
      return (




        <View style={{ width: '100%', height: 50, flexDirection: 'row', backgroundColor: '#F7FFED', borderWidth: 1, borderColor: '#DCFFAF', borderRadius: 10, }}>
          <TouchableOpacity activeOpacity={1} onPress={() => { day.focus(); }} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TextInput
              keyboardType="numeric"
              style={styles.inputsFecha}
              placeholderTextColor="#000"
              placeholderStyle={styles.placeHolderStyle}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              maxLength={2}
              placeholder="Día"
              value={dia}
              onChangeText={dia => soloNumerosMaxDosDia(dia)}
              ref={(input) => { day = input; }}
              returnKeyType={"next"}
              onSubmitEditing={() => month.focus()}
            />
          </TouchableOpacity>


          <TouchableOpacity activeOpacity={1} onPress={() => { month.focus(); }} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TextInput
              keyboardType="numeric"
              style={styles.inputsFecha}
              placeholderTextColor="#000"
              placeholderStyle={styles.placeHolderStyle}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              maxLength={2}
              placeholder="Mes"
              value={mes}
              onChangeText={mes => soloNumerosMaxDosMenos(mes)}
              ref={(input) => { month = input; }}
              returnKeyType={"next"}
              onSubmitEditing={() => yer.focus()}
            />
          </TouchableOpacity>


          <TouchableOpacity activeOpacity={1} onPress={() => { yer.focus(); }} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TextInput
              keyboardType="numeric"
              style={styles.inputsFecha}
              placeholderTextColor="#000"
              placeholderStyle={styles.placeHolderStyle}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              maxLength={4}
              placeholder="Año"
              value={ano}
              onChangeText={ano => soloNumerosMaxDosAno(ano)}
              ref={(input) => { yer = input; }}
              returnKeyType={"next"}
              onSubmitEditing={() => UserLoginFunction()}
            />
          </TouchableOpacity>
        </View>


      )
    } else {
      return (
        <TouchableOpacity style={styles.ctninputs} activeOpacity={1} onPress={showDatePicker}>
          <Text style={{ color: '#141414', fontWeight: 'bold', fontSize: fontWidth / 26, marginBottom: 4, marginTop: 1 }}>{fecha}</Text>
        </TouchableOpacity>
      )
    }
  }

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







            </View>




            <View style={{ flex: 1, width: '100%', marginTop: 2, paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center', }}>
              <Text style={[styles.TextHeader, { marginBottom: 15, }]}>Fecha nacimiento</Text>
              <View style={{ marginBottom: 15 }}>

                {RendPickerPlatform()}
              </View>


              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                locale="es_ES"
              />




              <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

                <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} onPress={() => Platform.OS == 'android' ? handleConfirmAndroid() : NextPageFechaNacimientoScreen()}>
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

  );
};

export default RegistroFechaNacimientoScreen;
