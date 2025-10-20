import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, ScrollView, TouchableWithoutFeedback, Platform, Keyboard, Animated, KeyboardAvoidingView, TouchableOpacity, TextInput, ActivityIndicator, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Modal from './Modal.js';
import ActivityIndi from './activityIndi.js'
import { ServidorExport } from './ServAdress.js'
import { styles } from "./Style.js";
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
// import { GeoCodingApiGoogle } from './GeoCodingApi.js'

let fontWidth = Dimensions.get('window').width;



const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

const CrearViajeLargoEspecialScreen = ({ route, navigation }) => {
  const [InfoUser, setInfoUser] = React.useState(route.params.InfoUser);

  const [load, setLoad] = React.useState(false);
  const [desde, setDesde] = React.useState('');
  const [hasta, setHasta] = React.useState('');


  const [nacimiento, setNacimiento] = React.useState('');

  const [fechaIni, setFechaIni] = React.useState('Buscar fecha');
  const [fechaFin, setFechaFin] = React.useState('Buscar fecha');

  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
  const [isDatePickerVisibleDos, setDatePickerVisibilityDos] = React.useState(false);
  const [dateMoment, setDateMoment] = React.useState('Buscar fecha');

  const [dia, setDia] = React.useState('');
  const [mes, setMes] = React.useState('');
  const [ano, setAno] = React.useState('');

  const [diaDos, setDiaDos] = React.useState('');
  const [mesDos, setMesDos] = React.useState('');
  const [anoDos, setAnoDos] = React.useState('');


  const [inicio, setInicio] = React.useState('');
  const [fin, setFin] = React.useState('');


  const [animales, setAnimales] = React.useState(false);
  const [madera, setMadera] = React.useState(false);
  const [aridos, setAridos] = React.useState(false);
  const [maquinaria, setMaquinaria] = React.useState(false);
  const [otro, setOtro] = React.useState(false);
  const [otroContent, setOtroContent] = React.useState('');

  const [resutlSearch, setResutlSearch] = React.useState('');
  const [searchError, setSearchError] = React.useState(false);

  const [resutlSearchDos, setResutlSearchDos] = React.useState('');
  const [searchErrorDos, setSearchErrorDos] = React.useState(false);

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
  const [elonFadeIn] = React.useState(new Animated.Value(0)); // Nuevo nombre del state para la opacidad
  const [elonIsVisible, setElonIsVisible] = React.useState(false); // Nuevo nombre del state para la visibilidad

  const handlePressElon = () => {
    setElonIsVisible(true); // Mostrar el Animated.View
    Animated.timing(elonFadeIn, {
      toValue: 1, // Opacidad final (totalmente visible)
      duration: 1000, // Duración de la animación en milisegundos
      useNativeDriver: true,
    }).start();
  };

  const fadeOutAnimation = () => {
    Animated.timing(elonFadeIn, {
      toValue: 0, // Opacidad final (totalmente transparente)
      duration: 1000, // Duración de la animación en milisegundos
      useNativeDriver: true,
    }).start(() => setElonIsVisible(false)); // Después de la animación, ocultar el Animated.View
  };

  const fadeAnimOtro = React.useRef(new Animated.Value(0)).current;
  const handlePress = () => {
    setOtro(!otro);
    Animated.timing(
      fadeAnimOtro,
      {
        toValue: otro ? 0 : 1,
        duration: 500,
        useNativeDriver: true,
      }
    ).start();
  };

  const showDatePicker = () => {
    Keyboard.dismiss()
    setDatePickerVisibility(true);
  };


  const showDatePickerDos = () => {
    Keyboard.dismiss()
    setDatePickerVisibilityDos(true);
  };

  const hideDatePicker = () => {
    Keyboard.dismiss()
    setDatePickerVisibility(false);
  };
  const hideDatePickerDos = () => {
    Keyboard.dismiss()
    setDatePickerVisibilityDos(false);
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
      console.log(fecha);

      NextPageFechaNacimientoScreen()
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
    setFechaIni(prev => weekDayName)
    hideDatePicker();
  };



  const handleConfirmDos = (date) => {
    console.log("A date has been picked: ", date);
    var mydate = date;
    var weekDayName = moment(mydate).format('DD-MM-YYYY');
    console.log(weekDayName);
    setFechaFin(prev => weekDayName)
    hideDatePickerDos();
  };









  function soloNumerosMaxDosDia(cadena) {
    var toCheckNumbers = /^\d+$/.test(cadena);
    var elLargo = cadena.length;

    if (toCheckNumbers || cadena === '') {
      if (elLargo === 1 && cadena !== '0') {
        // Si la cadena tiene un solo dígito y no es cero, agregar cero al principio
        setDia('0' + cadena);
      } else if (elLargo >= 2) {
        // Mantener los dos últimos dígitos de la cadena
        var numeroDia = parseInt(cadena);
        if (numeroDia <= 31) {
          setDia(cadena.slice(-2));
        }
      } else if (elLargo === 0 || (elLargo === 1 && cadena === '0')) {
        // Si la cadena está vacía o solo contiene un cero, establecerla como vacía
        setDia('');
      }
    } else {
      // Si la cadena no cumple ninguna condición, no hacer nada
    }
  }
  function soloNumerosMaxDosMenos(cadena) {
    var toCheckNumbers = /^\d+$/.test(cadena);
    var elLargo = cadena.length;

    if (toCheckNumbers || cadena === '') {
      if (elLargo === 1 && cadena !== '0') {
        // Si la cadena tiene un solo dígito y no es cero, agregar cero al principio
        setMes('0' + cadena);
      } else if (elLargo >= 2) {
        // Mantener los dos últimos dígitos de la cadena
        var numeroDia = parseInt(cadena);
        if (numeroDia <= 12) {
          setMes(cadena.slice(-2));
        }
      } else if (elLargo === 0 || (elLargo === 1 && cadena === '0')) {
        // Si la cadena está vacía o solo contiene un cero, establecerla como vacía
        setMes('');
      }
    } else {
      // Si la cadena no cumple ninguna condición, no hacer nada
    }
  }
  function soloNumerosMaxDosAno(cadena) {
    var toCheckNumbers = /^\d+$/.test(cadena);
    var elLargo = cadena.length;

    if (toCheckNumbers || cadena === '') {
      if (elLargo === 1 && cadena !== '0') {
        // Si la cadena tiene un solo dígito y no es cero, agregar cero al principio
        setAno('000' + cadena);
      } else if (elLargo === 2) {
        // Mantener los dos últimos dígitos de la cadena
        setAno('00' + cadena);
      } else if (elLargo === 3) {
        // Mantener los tres últimos dígitos de la cadena
        setAno('0' + cadena);
      } else if (elLargo >= 4) {
        // Mantener los cuatro últimos dígitos de la cadena
        setAno(cadena.slice(-4));
      } else if (elLargo === 0 || (elLargo === 1 && cadena === '0')) {
        // Si la cadena está vacía o solo contiene un cero, establecerla como vacía
        setAno('');
      }
    } else {
      // Si la cadena no cumple ninguna condición, no hacer nada
    }


  }
  function soloNumerosMaxDosDiaDos(cadena) {
    var toCheckNumbers = /^\d+$/.test(cadena);
    var elLargo = cadena.length;

    if (toCheckNumbers || cadena === '') {
      if (elLargo === 1 && cadena !== '0') {
        // Si la cadena tiene un solo dígito y no es cero, agregar cero al principio
        setDiaDos('0' + cadena);
      } else if (elLargo >= 2) {
        // Mantener los dos últimos dígitos de la cadena
        var numeroDia = parseInt(cadena);
        if (numeroDia <= 31) {
          setDiaDos(cadena.slice(-2));
        }
      } else if (elLargo === 0 || (elLargo === 1 && cadena === '0')) {
        // Si la cadena está vacía o solo contiene un cero, establecerla como vacía
        setDiaDos('');
      }
    } else {
      // Si la cadena no cumple ninguna condición, no hacer nada
    }
  }
  function soloNumerosMaxDosMenosDos(cadena) {
    var toCheckNumbers = /^\d+$/.test(cadena);
    var elLargo = cadena.length;

    if (toCheckNumbers || cadena === '') {
      if (elLargo === 1 && cadena !== '0') {
        // Si la cadena tiene un solo dígito y no es cero, agregar cero al principio
        setMesDos('0' + cadena);
      } else if (elLargo >= 2) {
        // Mantener los dos últimos dígitos de la cadena
        var numeroDia = parseInt(cadena);
        if (numeroDia <= 12) {
          setMesDos(cadena.slice(-2));
        }
      } else if (elLargo === 0 || (elLargo === 1 && cadena === '0')) {
        // Si la cadena está vacía o solo contiene un cero, establecerla como vacía
        setMesDos('');
      }
    } else {
      // Si la cadena no cumple ninguna condición, no hacer nada
    }
  }
  function soloNumerosMaxDosAnoDos(cadena) {
    var toCheckNumbers = /^\d+$/.test(cadena);
    var elLargo = cadena.length;

    if (toCheckNumbers || cadena === '') {
      if (elLargo === 1 && cadena !== '0') {
        // Si la cadena tiene un solo dígito y no es cero, agregar cero al principio
        setAnoDos('000' + cadena);
      } else if (elLargo === 2) {
        // Mantener los dos últimos dígitos de la cadena
        setAnoDos('00' + cadena);
      } else if (elLargo === 3) {
        // Mantener los tres últimos dígitos de la cadena
        setAnoDos('0' + cadena);
      } else if (elLargo >= 4) {
        // Mantener los cuatro últimos dígitos de la cadena
        setAnoDos(cadena.slice(-4));
      } else if (elLargo === 0 || (elLargo === 1 && cadena === '0')) {
        // Si la cadena está vacía o solo contiene un cero, establecerla como vacía
        setAnoDos('');
      }
    } else {
      // Si la cadena no cumple ninguna condición, no hacer nada
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
  handleConfirmAndroidUno = async () => {

    if (dia == '') {
      ModalOptions('Error', 'Dia no válido', 'Debes ingresar un día de nacimiento', 'close');
    }
    else if (mes == '') {
      ModalOptions('Error', 'Mes no válido', 'Debes ingresar un mes de nacimiento', 'close');
    }
    else if (ano == '') {
      ModalOptions('Error', 'Año no válido', 'Debes ingresar un año de nacimiento', 'close');
    }
    else if (ano.length < 4) {
      ModalOptions('Error', 'Año no válido', 'Debes ingresar un año de nacimiento', 'close');
    } else {

      var newFechaAndroid = dia + '-' + mes + '-' + ano
      //console.log(newFechaAndroid+'1');
      var fechaBien = await corregirFormatoFecha(newFechaAndroid)
      //console.log(fechaBien+'2');

      setInicio(prev => fechaBien)
      //console.log(fecha);

      // NextPageFechaNacimientoScreen()
    }


  }
  handleConfirmAndroidDos = async () => {

    if (diaDos == '') {
      ModalOptions('Error', 'Edad no válida', 'Debes ingresar un día de nacimiento', 'close');
    }
    else if (mesDos == '') {
      ModalOptions('Error', 'Edad no válida', 'Debes ingresar un mes de nacimiento', 'close');
    }
    else if (anoDos == '') {
      ModalOptions('Error', 'Edad no válida', 'Debes ingresar un año de nacimiento', 'close');
    }
    else if (anoDos.length < 4) {
      ModalOptions('Error', 'Edad no válida', 'Debes ingresar un año de nacimiento', 'close');
    } else {

      var newFechaAndroid = diaDos + '-' + mesDos + '-' + anoDos
      //console.log(newFechaAndroid+'1');
      var fechaBien = await corregirFormatoFecha(newFechaAndroid)
      //console.log(fechaBien+'2');

      setFin(prev => fechaBien)
      //console.log(fecha);

      // NextPageFechaNacimientoScreen()
    }


  }

  backPass = () => {
    navigation.navigate('Inicio')
  }


  // crearAndroidViaje = async () => {
  //   const moment = require('moment');

  //   // Fecha ingresada
  //   const hoy = moment().startOf('day'); // Fecha actual
  //   const fechaIni = moment(dia + '-' + mes + '-' + ano, "DD-MM-YYYY");
  //   const fechaFin = moment(diaDos + '-' + mesDos + '-' + anoDos, "DD-MM-YYYY");

  //   if (desde === '') {
  //     ModalOptions('Error', 'Partida no válida', 'Debes ingresar un lugar de partida', 'close');
  //   } else if (hasta === '') {
  //     ModalOptions('Error', 'Llegada no válida', 'Debes ingresar un lugar de llegada', 'close');
  //   } else if (fechaIni.isBefore(hoy, 'day')) {
  //     ModalOptions('Error', 'Fecha de inicio inválida', 'La fecha de inicio no puede ser anterior a hoy', 'close');
  //   } else if (fechaFin.isBefore(fechaIni, 'day')) {
  //     ModalOptions('Error', 'Fecha de llegada inválida', 'La fecha de llegada no puede ser anterior a la de inicio', 'close');
  //   }
  //   else {
  //     var maderaSend;
  //     var maquinariaSend;
  //     var aridosSend;
  //     var animalesSend;

  //     if (madera == true) {
  //       maderaSend = 'true'
  //     } else {
  //       maderaSend = 'false'
  //     }
  //     if (maquinaria == true) {
  //       maquinariaSend = 'true'
  //     } else {
  //       maquinariaSend = 'false'
  //     }

  //     if (aridos == true) {
  //       aridosSend = 'true'
  //     } else {
  //       aridosSend = 'false'
  //     }

  //     if (animales == true) {
  //       animalesSend = 'true'
  //     } else {
  //       animalesSend = 'false'
  //     }

  //     fetch(`${ServidorExport}/partner/viajelargoespecial/CrearViajeLargoEspecial.php`, {
  //       method: 'POST',
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({

  //         idcamionero: InfoUser.iduser,
  //         correocamionero: InfoUser.correo,
  //         nombrecamionero: InfoUser.nombre,
  //         fechaini: fechaIni.format("DD-MM-YYYY"),
  //         fechafin: fechaFin.format("DD-MM-YYYY"),
  //         desde: desde,
  //         hasta: hasta,
  //         madera: maderaSend,
  //         maquinaria: maquinariaSend,
  //         aridos: aridosSend,
  //         animales: animalesSend,
  //         otro: otroContent,
  //         token: InfoUser.tokenpartner


  //       })

  //     })

  //       .then((response) => {


  //         if (!response.ok || response.status != 200 || response.status != '200') {
  //           ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
  //           setHola('0')

  //         } else {
  //           response.json()
  //             .then(responser => {
  //               console.log('3')
  //               console.log(responser);
  //               if (responser === 'exito') {
  //                 ModalOptions('Exito', 'Viaje creado', 'Creaste un viaje nuevo', backPass);
  //               } else if (responser === 'existe') {
  //                 ModalOptions('Error', 'Ya tienes un viaje creado', 'No puedes tener más de un viaje en curso', 'close');
  //               } else {
  //                 ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
  //               }



  //             })
  //         }

  //       })
  //       .catch((error) => {
  //         console.log(error)
  //         ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
  //         setHola('0')

  //       });
  //     //insertar en tabla
  //   }




  //   // console.log(fin + '<--- fin')
  //   // setTimeout(() => {
  //   //   var fechaIniPass = moment(inicio, "DD-MM-YYYY");
  //   //   var fechaFinPass = moment(fin, "DD-MM-YYYY");

  //   // if(desde == ''){
  //   //   ModalOptions('Error', 'Edad no válida', 'Debes ingresar un lugar de partida','close');
  //   // }else if(hasta == ''){
  //   //   ModalOptions('Error', 'Edad no válida', 'Debes ingresar un lugar de llegada','close');
  //   // }else if(inicio == ''){
  //   //   ModalOptions('Error', 'Edad no válida', 'Debes ingresar un fecha de inicio','close');
  //   // }else if(fin == ''){
  //   //   ModalOptions('Error', 'Edad no válida', 'Debes ingresar una fecha de llegada','close');
  //   // }else if(fechaIniPass.isBefore(moment())){
  //   //   ModalOptions('Error', 'Fecha de inicio inválida', 'La fecha de inicio ya pasó','close');
  //   // }else if(fechaFinPass.isBefore(moment())){
  //   //   ModalOptions('Error', 'Fecha de llegada inválida', 'La fecha de llegada ya pasó','close');
  //   // }
  //   // else{
  //   //   console.log(desde)
  //   //   console.log(hasta)
  //   //   console.log(inicio)
  //   //   console.log(fin)
  //   // }
  //   //}, "2000");


  // }

  crearAndroidViaje = async () => {
    const moment = require('moment');

    const hoy = moment().startOf('day'); // Fecha actual
    const limiteMaximo = moment(hoy).add(1, 'month'); // Límite de un mes desde hoy
    const fechaIni = moment(dia + '-' + mes + '-' + ano, "DD-MM-YYYY");
    const fechaFin = moment(diaDos + '-' + mesDos + '-' + anoDos, "DD-MM-YYYY");

    if (desde === '') {
      ModalOptions('Error', 'Partida no válida', 'Debes ingresar un lugar de partida', 'close');
    } else if (hasta === '') {
      ModalOptions('Error', 'Llegada no válida', 'Debes ingresar un lugar de llegada', 'close');
    } else if (fechaIni.isBefore(hoy, 'day')) {
      ModalOptions('Error', 'Fecha de inicio inválida', 'La fecha de inicio no puede ser anterior a hoy', 'close');
    } else if (fechaIni.isAfter(limiteMaximo, 'day')) {
      ModalOptions('Error', 'Fecha de inicio inválida', 'La fecha de inicio no puede ser posterior a un mes desde hoy', 'close');
    } else if (fechaFin.isBefore(fechaIni, 'day')) {
      ModalOptions('Error', 'Fecha de llegada inválida', 'La fecha de llegada no puede ser anterior a la de inicio', 'close');
    } else {
      const maderaSend = madera ? 'true' : 'false';
      const maquinariaSend = maquinaria ? 'true' : 'false';
      const aridosSend = aridos ? 'true' : 'false';
      const animalesSend = animales ? 'true' : 'false';

      fetch(`${ServidorExport}/partner/viajelargoespecial/CrearViajeLargoEspecial.php`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idcamionero: InfoUser.iduser,
          correocamionero: InfoUser.correo,
          nombrecamionero: InfoUser.nombre,
          fechaini: fechaIni.format("DD-MM-YYYY"),
          fechafin: fechaFin.format("DD-MM-YYYY"),
          desde,
          hasta,
          madera: maderaSend,
          maquinaria: maquinariaSend,
          aridos: aridosSend,
          animales: animalesSend,
          otro: otroContent,
          token: InfoUser.tokenpartner,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
          } else {
            response.json().then(responser => {
              if (responser === 'exito') {
                ModalOptions('Exito', 'Viaje creado', 'Creaste un viaje nuevo', backPass);
              } else if (responser === 'existe') {
                ModalOptions('Error', 'Ya tienes un viaje creado', 'No puedes tener más de un viaje en curso', 'close');
              } else {
                ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
          ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
        });
    }
  }


  // crearIosViaje = async () => {
  //   const moment = require('moment');

  //   const hoy = moment().startOf('day'); // Fecha actual
  //   const fechaIniPass = moment(fechaIni, "DD-MM-YYYY");
  //   const fechaFinPass = moment(fechaFin, "DD-MM-YYYY");

  //   if (desde === '') {
  //     ModalOptions('Error', 'Partida no válida', 'Debes ingresar un lugar de partida', 'close');
  //   } else if (hasta === '') {
  //     ModalOptions('Error', 'Llegada no válida', 'Debes ingresar un lugar de llegada', 'close');
  //   } else if (fechaIniPass.isBefore(hoy, 'day')) {
  //     ModalOptions('Error', 'Fecha de inicio inválida', 'La fecha de inicio no puede ser anterior a hoy', 'close');
  //   } else if (fechaFinPass.isBefore(fechaIniPass, 'day')) {
  //     ModalOptions('Error', 'Fecha de llegada inválida', 'La fecha de llegada no puede ser anterior a la de inicio', 'close');
  //   } else {

  //     var maderaSend;
  //     var maquinariaSend;
  //     var aridosSend;
  //     var animalesSend;

  //     if (madera == true) {
  //       maderaSend = 'true'
  //     } else {
  //       maderaSend = 'false'
  //     }
  //     if (maquinaria == true) {
  //       maquinariaSend = 'true'
  //     } else {
  //       maquinariaSend = 'false'
  //     }

  //     if (aridos == true) {
  //       aridosSend = 'true'
  //     } else {
  //       aridosSend = 'false'
  //     }

  //     if (animales == true) {
  //       animalesSend = 'true'
  //     } else {
  //       animalesSend = 'false'
  //     }
  //     fetch(`${ServidorExport}/partner/viajelargoespecial/CrearViajeLargoEspecial.php`, {
  //       method: 'POST',
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({

  //         idcamionero: InfoUser.iduser,
  //         correocamionero: InfoUser.correo,
  //         nombrecamionero: InfoUser.nombre,
  //         fechaini: fechaIniPass.format("DD-MM-YYYY"),
  //         fechafin: fechaFinPass.format("DD-MM-YYYY"),
  //         desde: desde,
  //         hasta: hasta,
  //         madera: maderaSend,
  //         maquinaria: maquinariaSend,
  //         aridos: aridosSend,
  //         animales: animalesSend,
  //         otro: otroContent,
  //         token: InfoUser.tokenpartner

  //       })

  //     })

  //       .then((response) => {


  //         if (!response.ok || response.status != 200 || response.status != '200') {
  //           ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
  //           setHola('0')

  //         } else {
  //           response.json()
  //             .then(responser => {
  //               console.log('3')
  //               console.log(responser);
  //               if (responser === 'exito') {
  //                 ModalOptions('Exito', 'Viaje creado', 'Creaste un viaje nuevo', backPass);
  //               } else if (responser === 'existe') {
  //                 ModalOptions('Error', 'Ya tienes un viaje creado', 'No puedes tener más de un viaje en curso', 'close');
  //               } else {
  //                 ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
  //               }



  //             })
  //         }

  //       })
  //       .catch((error) => {
  //         console.log(error)
  //         ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
  //         setHola('0')

  //       });
  //   }






  // }
  crearIosViaje = async () => {
    const moment = require('moment');

    const hoy = moment().startOf('day'); // Fecha actual
    const limiteMaximo = moment(hoy).add(1, 'month'); // Límite de un mes desde hoy
    const fechaIniPass = moment(fechaIni, "DD-MM-YYYY");
    const fechaFinPass = moment(fechaFin, "DD-MM-YYYY");

    if (desde === '') {
      ModalOptions('Error', 'Partida no válida', 'Debes ingresar un lugar de partida', 'close');
    } else if (hasta === '') {
      ModalOptions('Error', 'Llegada no válida', 'Debes ingresar un lugar de llegada', 'close');
    } else if (fechaIniPass.isBefore(hoy, 'day')) {
      ModalOptions('Error', 'Fecha de inicio inválida', 'La fecha de inicio no puede ser anterior a hoy', 'close');
    } else if (fechaIniPass.isAfter(limiteMaximo, 'day')) {
      ModalOptions('Error', 'Fecha de inicio inválida', 'La fecha de inicio no puede ser posterior a un mes desde hoy', 'close');
    } else if (fechaFinPass.isBefore(fechaIniPass, 'day')) {
      ModalOptions('Error', 'Fecha de llegada inválida', 'La fecha de llegada no puede ser anterior a la de inicio', 'close');
    } else {
      const maderaSend = madera ? 'true' : 'false';
      const maquinariaSend = maquinaria ? 'true' : 'false';
      const aridosSend = aridos ? 'true' : 'false';
      const animalesSend = animales ? 'true' : 'false';

      fetch(`${ServidorExport}/partner/viajelargoespecial/CrearViajeLargoEspecial.php`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idcamionero: InfoUser.iduser,
          correocamionero: InfoUser.correo,
          nombrecamionero: InfoUser.nombre,
          fechaini: fechaIniPass.format("DD-MM-YYYY"),
          fechafin: fechaFinPass.format("DD-MM-YYYY"),
          desde,
          hasta,
          madera: maderaSend,
          maquinaria: maquinariaSend,
          aridos: aridosSend,
          animales: animalesSend,
          otro: otroContent,
          token: InfoUser.tokenpartner,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
          } else {
            response.json().then(responser => {
              if (responser === 'exito') {
                ModalOptions('Exito', 'Viaje creado', 'Creaste un viaje nuevo', backPass);
              } else if (responser === 'existe') {
                ModalOptions('Error', 'Ya tienes un viaje creado', 'No puedes tener más de un viaje en curso', 'close');
              } else {
                ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
          ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
        });
    }
  }



  RendPickerPlatform = () => {
    if (Platform.OS == 'android') {
      return (
        <View style={{ width: '100%', height: 'auto', flexDirection: 'column', backgroundColor: '#F7FFED', borderWidth: 1, borderColor: '#DCFFAF', borderRadius: 10, marginBottom: 20 }}>
          <Text style={[styles.labels, { marginLeft: 10 }]}>¿Cuándo partes?</Text>
          <View style={{ width: '100%', height: 50, flexDirection: 'row', }}>
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
                //maxLength={2}
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
                //maxLength={2}
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
                //maxLength={4}
                placeholder="Año"
                value={ano}
                onChangeText={ano => soloNumerosMaxDosAno(ano)}
                ref={(input) => { yer = input; }}
                returnKeyType={"next"}
                onSubmitEditing={() => UserLoginFunction()}
              />
            </TouchableOpacity>

          </View>

        </View>


      )
    } else {
      return (
        <TouchableOpacity style={styles.ctninputs} activeOpacity={1} onPress={showDatePicker}>
          <Text style={[styles.labels, { marginLeft: 0 }]}>¿Cuándo partes?</Text>
          <Text style={{ color: fechaIni != 'Buscar fecha' ? '#141414' : '#909fac', fontWeight: 'bold', fontSize: fontWidth / 26, marginBottom: 4, marginTop: 1 }}>{fechaIni}</Text>
        </TouchableOpacity>
      )
    }
  }

  RendPickerPlatformDos = () => {
    if (Platform.OS == 'android') {
      return (
        <View style={{ width: '100%', height: 'auto', flexDirection: 'column', backgroundColor: '#F7FFED', borderWidth: 1, borderColor: '#DCFFAF', borderRadius: 10, marginBottom: 20 }}>
          <Text style={[styles.labels, { marginLeft: 10 }]}>¿Cuándo llegas?</Text>
          <View style={{ width: '100%', height: 50, flexDirection: 'row', }}>
            <TouchableOpacity activeOpacity={1} onPress={() => { dayDos.focus(); }} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TextInput
                keyboardType="numeric"
                style={styles.inputsFecha}
                placeholderTextColor="#000"
                placeholderStyle={styles.placeHolderStyle}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                //maxLength={2}
                placeholder="Día"
                value={diaDos}
                onChangeText={diaDos => soloNumerosMaxDosDiaDos(diaDos)}
                ref={(input) => { dayDos = input; }}
                returnKeyType={"next"}
                onSubmitEditing={() => monthDos.focus()}
              />
            </TouchableOpacity>


            <TouchableOpacity activeOpacity={1} onPress={() => { monthDos.focus(); }} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TextInput
                keyboardType="numeric"
                style={styles.inputsFecha}
                placeholderTextColor="#000"
                placeholderStyle={styles.placeHolderStyle}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                //maxLength={2}
                placeholder="Mes"
                value={mesDos}
                onChangeText={mesDos => soloNumerosMaxDosMenosDos(mesDos)}
                ref={(input) => { monthDos = input; }}
                returnKeyType={"next"}
                onSubmitEditing={() => yerDos.focus()}
              />
            </TouchableOpacity>


            <TouchableOpacity activeOpacity={1} onPress={() => { yerDos.focus(); }} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TextInput
                keyboardType="numeric"
                style={styles.inputsFecha}
                placeholderTextColor="#000"
                placeholderStyle={styles.placeHolderStyle}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                //maxLength={4}
                placeholder="Año"
                value={anoDos}
                onChangeText={anoDos => soloNumerosMaxDosAnoDos(anoDos)}
                ref={(input) => { yerDos = input; }}
                returnKeyType={"next"}
              //onSubmitEditing={() =>  UserLoginFunction() }
              />
            </TouchableOpacity>

          </View>

        </View>


      )
    } else {
      return (
        <TouchableOpacity style={styles.ctninputs} activeOpacity={1} onPress={showDatePickerDos}>
          <Text style={[styles.labels, { marginLeft: 0 }]}>¿Cuándo llegas?</Text>
          <Text style={{ color: fechaFin != 'Buscar fecha' ? '#141414' : '#909fac', fontWeight: 'bold', fontSize: fontWidth / 26, marginBottom: 4, marginTop: 1 }}>{fechaFin}</Text>
        </TouchableOpacity>
      )
    }
  }




  const [overlayVisible, setOverlayVisible] = React.useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const toggleOverlay = () => {
    if (!overlayVisible) {
      setOverlayVisible(true); // Mostrar overlay antes de la animación de fadeIn
      Animated.timing(
        fadeAnim,
        {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }
      ).start();
      setTimeout(() => {
        desdeInput.focus();
      }, 100);
    } else {
      Animated.timing(
        fadeAnim,
        {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }
      ).start(() => {
        setOverlayVisible(false)
        Keyboard.dismiss()
      }); // Ocultar overlay después de la animación de fadeOut
    }
  }


  fetchPlaces = async (x) => {
    const apiKey = 'AIzaSyAvBdSZwP2yakKnHJzSQGKL8W8Y5kDy4Gk';
    var lugarABuscar = x; // Puedes cambiar esto al tipo de lugar que desees buscar

    await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${lugarABuscar}&key=${apiKey}&language=es`, {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok || response.status !== 200) {
          //throw new Error('Error al buscar lugares');
          setSearchError(prev => true)
        } else {
          return response.json();
        }
      })
      .then((data) => {
        // Aquí puedes manejar la respuesta de la búsqueda de lugares
        console.log(data.results[0].formatted_address);
        console.log(data);
        if (data.results[0].formatted_address == '' || data.results[0].formatted_address == 'undefined' || data.results[0].formatted_address == undefined) {
          setSearchError(prev => true)
        } else {
          setResutlSearch(prev => data.results[0].formatted_address)
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setSearchError(prev => true)
      });



  }

  ToSearch = async (x) => {
    //var userToken = await AsyncStorage.getItem('Key_27');
    if (x == '') {
      setResutlSearch(prev => '')
      // setAvisoBuscar(prev => false)
      // fetchPrincipalClientes(userToken)
    } else {
      fetchPlaces(x)
      // setAvisoBuscar(false)
      // fetchBuscar(x, userToken)
    }

    //setFiltro(prev => x)

  }




  const [overlayVisibleDos, setOverlayVisibleDos] = React.useState(false);
  const fadeAnimDos = React.useRef(new Animated.Value(0)).current;

  const toggleOverlayDos = () => {
    if (!overlayVisibleDos) {
      setOverlayVisibleDos(true); // Mostrar overlay antes de la animación de fadeIn
      Animated.timing(
        fadeAnimDos,
        {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }
      ).start();
      setTimeout(() => {
        hastaInput.focus();
      }, 100);
    } else {
      Animated.timing(
        fadeAnimDos,
        {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }
      ).start(() => {
        setOverlayVisibleDos(false)
        Keyboard.dismiss()
      }); // Ocultar overlay después de la animación de fadeOut
    }
  }


  fetchPlacesDos = async (x) => {
    const apiKey = 'AIzaSyAvBdSZwP2yakKnHJzSQGKL8W8Y5kDy4Gk';
    var lugarABuscar = x; // Puedes cambiar esto al tipo de lugar que desees buscar

    await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${lugarABuscar}&key=${apiKey}&language=es`, {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok || response.status !== 200) {
          //throw new Error('Error al buscar lugares');
          setSearchErrorDos(prev => true)
        } else {
          return response.json();
        }
      })
      .then((data) => {
        // Aquí puedes manejar la respuesta de la búsqueda de lugares
        console.log(data.results[0].formatted_address);
        if (data.results[0].formatted_address == '' || data.results[0].formatted_address == 'undefined' || data.results[0].formatted_address == undefined) {
          setSearchErrorDos(prev => true)
        } else {
          setResutlSearchDos(prev => data.results[0].formatted_address)
        }

      })
      .catch((error) => {
        console.error('Error:', error);
        setSearchErrorDos(prev => true)
      });



  }

  ToSearchDos = async (x) => {
    //var userToken = await AsyncStorage.getItem('Key_27');
    if (x == '') {
      setResutlSearchDos(prev => '')
      // setAvisoBuscar(prev => false)
      // fetchPrincipalClientes(userToken)
    } else {
      fetchPlacesDos(x)
      // setAvisoBuscar(false)
      // fetchBuscar(x, userToken)
    }

    //setFiltro(prev => x)

  }


  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
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

            <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='always'>

              <View style={styles.headerAdorno}>
                <TouchableOpacity style={{ padding: 0, marginBottom: 10 }} onPress={() => navigation.goBack()}>
                  <FontAwesome name="arrow-left" style={styles.arrowBack} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                  <Text style={[styles.TextHeader, { marginBottom: 0 }]}>Crear viaje</Text>
                  <TouchableOpacity onPress={handlePressElon} style={{ backgroundColor: 'transparent' }}>
                    <Image
                      source={require('./assets/ElonIcon.png')}
                      style={{
                        width: fontWidth / 13,
                        height: fontWidth / 13,
                        marginLeft: 15,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>




              <View style={{ flex: 1, width: '100%', marginTop: 2, paddingHorizontal: 15, backgroundColor: 'transparent' }}>

                {/* <View style={{paddingHorizontal:15, paddingVertical:10, borderRadius:10, backgroundColor:'#07E607', alignSelf:'flex-start', marginBottom:10,}}>
                <Text style={{ color: '#343434', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 30,}}>Viaje largo especial</Text>
              </View> */}

                <TouchableOpacity style={styles.ctninputs} activeOpacity={1} onPress={toggleOverlay}>
                  <Text style={[styles.labels, { marginLeft: 0 }]}>¿Desde dónde partes?</Text>
                  <Text style={{ color: desde == '' ? '#909fac' : '#141414', fontWeight: 'bold', fontSize: fontWidth / 26, marginBottom: 4, marginTop: 1 }}>{desde == '' ? 'Ej Santiago' : desde}</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.ctninputs} activeOpacity={1} onPress={toggleOverlayDos}>
                  <Text style={[styles.labels, { marginLeft: 0 }]}>¿Hasta dónde llegas?</Text>
                  <Text style={{ color: hasta == '' ? '#909fac' : '#141414', fontWeight: 'bold', fontSize: fontWidth / 26, marginBottom: 4, marginTop: 1 }}>{hasta == '' ? 'Ej Santiago' : hasta}</Text>
                </TouchableOpacity>


                {RendPickerPlatform()}

                {RendPickerPlatformDos()}
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                  locale="es_ES"
                />


                <DateTimePickerModal
                  isVisible={isDatePickerVisibleDos}
                  mode="date"
                  onConfirm={handleConfirmDos}
                  onCancel={hideDatePickerDos}
                  locale="es_ES"
                />

                {/* {RendPickerPlatformDos()} */}



                <View style={{ width: '100%', flexDirection: 'row' }}>

                  {/* <TouchableOpacity onPress={() => setAnimales(!animales)} style={{ width: '50%', flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                    <View style={{ width: fontWidth / 18, height: fontWidth / 18, marginRight: 10, borderWidth: 2, borderColor: '#07E607', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{ width: fontWidth / 28, height: fontWidth / 28, borderRadius: 100, backgroundColor: animales == true ? '#07E607' : '#fff' }} />
                    </View>
                    <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 28 }}>Animales</Text>
                  </TouchableOpacity> */}

                  <TouchableOpacity onPress={() => setAridos(!aridos)} style={{ width: '50%', flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                    <View style={{ width: fontWidth / 18, height: fontWidth / 18, marginRight: 10, borderWidth: 2, borderColor: '#07E607', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{ width: fontWidth / 28, height: fontWidth / 28, borderRadius: 100, backgroundColor: aridos == true ? '#07E607' : '#fff' }} />
                    </View>
                    <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 28 }}>Áridos</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setMaquinaria(!maquinaria)} style={{ width: '50%', flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                    <View style={{ width: fontWidth / 18, height: fontWidth / 18, marginRight: 10, borderWidth: 2, borderColor: '#07E607', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{ width: fontWidth / 28, height: fontWidth / 28, borderRadius: 100, backgroundColor: maquinaria == true ? '#07E607' : '#fff' }} />
                    </View>
                    <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 28 }}>Maquinaria</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ width: '100%', flexDirection: 'row' }}>



                  <TouchableOpacity onPress={() => setMadera(!madera)} style={{ width: '50%', flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                    <View style={{ width: fontWidth / 18, height: fontWidth / 18, marginRight: 10, borderWidth: 2, borderColor: '#07E607', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{ width: fontWidth / 28, height: fontWidth / 28, borderRadius: 100, backgroundColor: madera == true ? '#07E607' : '#fff' }} />
                    </View>
                    <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 28 }}>Madera</Text>
                  </TouchableOpacity>


                  <TouchableOpacity onPress={() => handlePress()} style={{ width: '50%', flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                    <View style={{ width: fontWidth / 18, height: fontWidth / 18, marginRight: 10, borderWidth: 2, borderColor: '#07E607', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{ width: fontWidth / 28, height: fontWidth / 28, borderRadius: 100, backgroundColor: otro == true ? '#07E607' : '#fff' }} />
                    </View>
                    <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 28 }}>Otro</Text>
                  </TouchableOpacity>

                </View>



                {otro && (
                  <Animated.View
                    style={{
                      marginTop: 20,
                      opacity: fadeAnimOtro,
                    }}
                  >
                    {/* Contenido que quieres animar */}
                    <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { otroInput.focus(); }}>
                      <View style={{ width: '80%' }}>
                        <Text style={styles.labels}>Otro tipo de carga especial</Text>
                        <TextInput
                          style={styles.inputs}
                          placeholderTextColor="#909fac"
                          underlineColorAndroid="transparent"
                          autoCapitalize="none"
                          autoComplete="off"
                          autoCorrect={false}
                          maxLength={100}

                          placeholder="Ej Fierro"
                          onChangeText={other => setOtroContent(other)}
                          ref={(input) => { otroInput = input; }}
                        //onSubmitEditing={() => { hastaInput.focus() }}
                        //returnKeyType={"next"}
                        />
                      </View>
                    </TouchableOpacity>
                  </Animated.View>

                )}





                <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

                  <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} onPress={() => Platform.OS == 'android' ? crearAndroidViaje() : crearIosViaje()}>
                    <Text style={styles.txtBtn}>Crear viaje</Text>
                  </TouchableOpacity>

                </LinearGradient>


              </View>








            </ScrollView>
          </KeyboardAvoidingView>

          {overlayVisible && (
            <Animated.View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#fff',
                justifyContent: 'flex-start',
                alignItems: 'center',
                opacity: fadeAnim,
                paddingHorizontal: 10,
              }}
            >

              <View
                style={{
                  backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'transparent',
                  height: Constants.statusBarHeight,
                  width: '100%',
                  marginBottom: 15,
                  //marginTop: Constants.statusBarHeight, //Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,,
                }} />

              <View style={{ width: '100%', justifyContent: 'center', alignItems: 'flex-end', marginBottom: 10, }}>
                <TouchableOpacity onPress={toggleOverlay}>
                  <FontAwesome name="close" style={styles.arrowBack} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { hastaInput.focus(); }}>
                <View style={{ width: '80%' }}>
                  <Text style={styles.labels}>¿Desde dónde partes?</Text>
                  <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}

                    placeholder="Ej Santiago"
                    onChangeText={buscar => ToSearch(buscar)}
                    ref={(input) => { desdeInput = input; }}
                    onSubmitEditing={() => {
                      setDesde(prev => resutlSearch)
                      toggleOverlay();
                    }}
                    returnKeyType={"next"}
                  />
                </View>
              </TouchableOpacity>

              {resutlSearch !== '' && !searchError && (
                <TouchableOpacity onPress={() => {
                  setDesde(prev => resutlSearch)
                  toggleOverlay()
                }} style={{ width: '100%', padding: 10, borderBottomWidth: 1, borderBottomColor: '#eaeaea' }}>
                  <Text style={{ color: '#343434', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 30, }}>{resutlSearch}</Text>
                </TouchableOpacity>
              )}

              {searchError && (
                <TouchableOpacity style={{ width: '100%', padding: 10, borderBottomWidth: 1, borderBottomColor: '#eaeaea' }}>
                  <Text style={{ color: '#343434', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 30, }}>Hubo un error al realizar la búsqueda.</Text>
                </TouchableOpacity>

              )}







            </Animated.View>
          )}




          {overlayVisibleDos && (
            <Animated.View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#fff',
                justifyContent: 'flex-start',
                alignItems: 'center',
                opacity: fadeAnimDos,
                paddingHorizontal: 10,
              }}
            >

              <View
                style={{
                  backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'transparent',
                  height: Constants.statusBarHeight,
                  width: '100%',
                  marginBottom: 15,
                  //marginTop: Constants.statusBarHeight, //Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,,
                }} />



              <View style={{ width: '100%', justifyContent: 'center', alignItems: 'flex-end', marginBottom: 10, }}>
                <TouchableOpacity onPress={toggleOverlayDos}>
                  <FontAwesome name="close" style={styles.arrowBack} />
                </TouchableOpacity>
              </View>


              <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { hastaInput.focus(); }}>
                <View style={{ width: '80%' }}>
                  <Text style={styles.labels}>¿Hasta dónde llegas?</Text>
                  <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}

                    placeholder="Ej Temuco"
                    onChangeText={buscar => ToSearchDos(buscar)}
                    ref={(input) => { hastaInput = input; }}
                    onSubmitEditing={() => {
                      setHasta(prev => resutlSearchDos)
                      toggleOverlayDos();
                    }}
                    returnKeyType={"next"}
                  />
                </View>
              </TouchableOpacity>

              {resutlSearchDos !== '' && !searchErrorDos && (
                <TouchableOpacity onPress={() => {
                  setHasta(prev => resutlSearchDos)
                  toggleOverlayDos()
                }} style={{ width: '100%', padding: 10, borderBottomWidth: 1, borderBottomColor: '#eaeaea' }}>
                  <Text style={{ color: '#343434', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 30, }}>{resutlSearchDos}</Text>
                </TouchableOpacity>
              )}

              {searchErrorDos && (
                <TouchableOpacity style={{ width: '100%', padding: 10, borderBottomWidth: 1, borderBottomColor: '#eaeaea' }}>
                  <Text style={{ color: '#343434', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 30, }}>Hubo un error al realizar la búsqueda.</Text>
                </TouchableOpacity>

              )}







            </Animated.View>
          )}
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
      {elonIsVisible && (
        <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', opacity: elonFadeIn, zIndex: 999999 }}>
          <TouchableOpacity onPress={fadeOutAnimation} activeOpacity={1} style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            {/* Aquí colocarías tu imagen u otro contenido */}
            <Image
              source={require('./assets/ElonUno.png')}
              style={{
                alignSelf: 'flex-end',
                width: fontWidth / 1,
                height: fontWidth / 1,
              }}
            />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>

  );
};

export default CrearViajeLargoEspecialScreen;
