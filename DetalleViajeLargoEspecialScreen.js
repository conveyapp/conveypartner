import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, ScrollView, TouchableWithoutFeedback, Platform, Keyboard, Animated, KeyboardAvoidingView, TouchableOpacity, TextInput, ActivityIndicator, StatusBar } from 'react-native';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Modal from './Modal.js';
import ActivityIndi from './activityIndi.js'
import { ServidorExport } from './ServAdress.js'
import { styles } from "./Style.js";
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import TextTicker from 'react-native-text-ticker'
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { GeoCodingApiGoogle } from './GeoCodingApi.js'

let fontWidth = Dimensions.get('window').width;



const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

const DetalleViajeLargoEspecialScreen = ({ route, navigation }) => {
  const [ActivityShow, setActivityShow] = React.useState(false)
  const [load, setLoad] = React.useState(true);
  const [dataSource, setDataSource] = React.useState('');
  const [conexionErr, setConexionErr] = React.useState(false);

  const [InfoUser, setInfoUser] = React.useState(route.params.InfoUser);
  const [InfoViaje, setInfoViaje] = React.useState(route.params.InfoViaje);

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
  const [elonFadeIn] = React.useState(new Animated.Value(0)); // Nuevo nombre del state para la opacidad
  const [elonIsVisible, setElonIsVisible] = React.useState(false); // Nuevo nombre del state para la visibilidad

  const handlePress = () => {
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
  backPass = () => {
    navigation.goBack()
  }
  DeleteAsk = () => {
    ModalOptions('Alerta', '¿Eliminar?', '¿Estás seguro quieres eliminar el viaje?', DeleteViaje);
  }
  DeleteViaje = () => {
    console.log(InfoViaje[0].idviaje)
    setActivityShow(prev => true)
    fetch(`${ServidorExport}/partner/BorrarViajeLargoEspecial.php`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: InfoViaje[0].idviaje,
      })

    })
      .then((response) => {
        if (!response.ok || response.status != 200 || response.status != '200') {
          ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
          setActivityShow(prev => false)
        } else {
          response.json()
            .then(responser => {
              console.log('3')

              if (responser === 'exito') {
                setActivityShow(prev => false)
                ModalOptions('Exito', 'Eliminado', 'El viaje se eliminó con éxito', backPass);
              } else {
                ModalOptions('Error', 'Error', 'Error, intenta otra vez', 'close');
                setActivityShow(prev => false)
              }
            })
        }
      })
      .catch((error) => {
        ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
        setActivityShow(prev => false)
      });
  }
  renderEstadoText = (status) => {
    console.log(status)
    if (status == 'pagado') {
      return (
        <Text style={{ color: '#808080', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 35 }}>Esperando</Text>
      )
    } else if (status == 'cargado') {
      return (
        <Text style={{ color: '#0000FF', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 35 }}>Cargado</Text>
      )
    } else if (status == 'enruta') {
      return (
        <Text style={{ color: '#008000', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 35 }}>En ruta</Text>
      )
    }
    else if (status == 'retraso') {
      return (
        <Text style={{ color: '#FF0000', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 35 }}>Retraso</Text>
      )
    }
    else if (status == 'entregado') {
      return (
        <Text style={{ color: '#FFA500', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 35 }}>Carga entregada</Text>
      )
    }
    else if (status == 'finalizado') {
      return (
        <Text style={{ color: '#800080', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 35 }}>Carga entregada</Text>
      )
    }
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      var userToken = await AsyncStorage.getItem('Key_27');
      fetchCargasViajeLargoEspecial(userToken)

    });


    return unsubscribe;
  }, [navigation, dataSource]);

  fetchCargasViajeLargoEspecial = async (x) => {
    await fetch(`${ServidorExport}/partner/viajelargoespecial/TraerCargasViajeLargoEspecial.php`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idcamionero: InfoUser.iduser,
        idviaje: InfoViaje[0].idviaje,
      })
    })
      .then((response) => {
        if (!response.ok || response.status != 200 || response.status != '200') {
          setConexionErr(true)
        } else {
          response.json()
            .then(responser => {
              console.log(responser)
              if (responser == "No Results Found.") {
                setDataSource(prev => '');
                setLoad(prev => false)
              } else {
                setDataSource(prev => responser);
                setLoad(prev => false)
              }


            })
        }

      })
      .catch((error) => {
        setConexionErr(true)
      });
  }
  rendCargas = () => {
    if (load == true) {
      return (
        <ActivityIndi />
      )
    } else if (conexionErr == true) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 15, }}>
          <Image
            style={{
              width: 150,
              height: 150,
              alignSelf: 'center',
              marginBottom: 20,
              marginTop: 30,
            }}
            source={require('./assets/warning.png')}
          />
          <Text style={styles.tituloRendError}>Lo sentimos :(</Text>
          <Text style={styles.subtituloRendError}>Error de conexión</Text>
          <TouchableOpacity style={styles.Btn} onPress={() => refreshFunction()}>
            <Text style={styles.txtBtn}>Recargar</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (dataSource != '') {
      return dataSource.map((data, i) => {
        return (
          <TouchableOpacity key={i} onPress={() => navigation.navigate('CargaViajeLargoEspecial', { IdCarga: data.idcarga, idCliente: data.idcliente, CorreoCliente: data.correo, InfoUser: InfoUser, InfoCarga: data })} style={{ width: '100%', marginRight: 15, backgroundColor: '#fff', padding: 8, borderRadius: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, }}>
            {renderEstadoText(data.estado)}
            <View style={{ width: '100%', flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{data.desde}</TextTicker>

              </View>


              <View style={{ marginHorizontal: 20, }}>
                <Image
                  style={{
                    alignSelf: 'center',
                    width: fontWidth / 15,
                    height: fontWidth / 15,
                    marginBottom: 0,
                  }}
                  source={require('./assets/arrowColor.png')}
                />
              </View>



              <View style={{ flex: 1 }}>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{data.hasta}</TextTicker>

              </View>

            </View>

          </TouchableOpacity>
        )
      })





    } else if (dataSource == '') {
      return (
        <View style={styles.ctnnoparse}>
          {/* <Image
                          style={{
                              alignSelf: 'center',
                              width: fontWidth / 2,
                              height:  fontWidth / 2 ,
                              marginBottom: 20,
                              marginTop: 30,
                          }}
                          source={require('./assets/empty.png')}
                      /> */}

          <Text style={styles.txtRenderElements}>No hay cargas</Text>
        </View>
      )
    }
  }
  backPass = () => {
    navigation.goBack()
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                  <TouchableOpacity style={{ padding: 0, marginBottom: 10 }} onPress={() => navigation.goBack()}>
                    <FontAwesome name="arrow-left" style={styles.arrowBack} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ padding: 0, }} onPress={() => DeleteAsk()}>
                    <FontAwesome6 name="trash" style={styles.iconsBesideArrow} size={fontWidth / 15} />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                  <Text style={[styles.TextHeader, { marginBottom: 0 }]}>Detalle viaje</Text>
                  <TouchableOpacity onPress={handlePress} style={{ backgroundColor: 'transparent' }}>
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
                {/* <View style={{paddingHorizontal:15, paddingVertical:10, borderRadius:10, backgroundColor:'#07E607', alignSelf:'flex-start',}}>
                    <Text style={{ color: '#343434', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 30,}}>Viaje largo especial</Text>
                  </View> */}

                <TouchableOpacity onPress={() => navigation.navigate('EditViajeLargoEspecial', { InfoUser: InfoUser, InfoViaje: InfoViaje })} style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 8, borderRadius: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, }}>

                  <View style={{ flex: 1 }}>
                    <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                      loop
                      bounce
                      repeatSpacer={50}
                      marqueeDelay={2000}>{InfoViaje[0].desde}</TextTicker>
                    <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                      loop
                      bounce
                      repeatSpacer={50}
                      marqueeDelay={2000}>{InfoViaje[0].fechainicio}</TextTicker>
                  </View>

                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 38, marginBottom: 15, }}>Viaje largo especial</Text>
                    <Image
                      style={{
                        alignSelf: 'center',
                        width: fontWidth / 13,
                        height: fontWidth / 13,
                        marginBottom: 0,
                      }}
                      source={require('./assets/arrowColor.png')}
                    />
                  </View>

                  <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                      loop
                      bounce
                      repeatSpacer={50}
                      marqueeDelay={2000}>{InfoViaje[0].hasta}</TextTicker>
                    <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                      loop
                      bounce
                      repeatSpacer={50}
                      marqueeDelay={2000}>{InfoViaje[0].fechafin}</TextTicker>
                  </View>

                </TouchableOpacity>




                <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, marginTop: 25, marginBottom: 15 }}>Cargas del viaje</Text>


                {rendCargas()}










              </View>








            </ScrollView>
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

export default DetalleViajeLargoEspecialScreen;
