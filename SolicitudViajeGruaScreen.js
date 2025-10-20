import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, ScrollView, TouchableWithoutFeedback, Platform, Keyboard, Animated, KeyboardAvoidingView, TouchableOpacity, TextInput, ActivityIndicator, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Modal from './Modal.js';
import ActivityIndi from './activityIndi.js'
import { ServidorExport } from './ServAdress.js'
import { styles } from "./Style.js";
import { LinearGradient, Ionicons } from 'expo-linear-gradient';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import io from "socket.io-client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ServidorSocket } from './ServAdressSocket.js'
import { getSocket } from './Socket';

let fontWidth = Dimensions.get('window').width;



const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

// create a component
const SolicitudViajeGruaScreen = ({ route, navigation }) => {
  const socket = getSocket();

  const [idCarga, setIdCarga] = React.useState(route.params.IdCarga);
  const [idCamionero, setIdCamionero] = React.useState(route.params.IdCamionero);
  const [idSoli, setIdSoli] = React.useState(route.params.IdSoli);
  const [notiToken, setNotitoken] = React.useState(route.params.Token);
  const [correocliente, setCorreocliente] = React.useState(route.params.CorreoCliente);


  const [load, setLoad] = React.useState(true);
  const [dataSource, setDataSource] = React.useState('');
  const [conexionErr, setConexionErr] = React.useState(false);
  const [precio, setPrecio] = React.useState('');
  const [precioReal, setPrecioReal] = React.useState('');

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
  const formatNumberWithDots = (value) => {
    const num = value.replace(/\D/g, ''); // elimina todo menos números
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // agrega puntos
  };
  connectScoket = async () => {
    const socket = getSocket();
    // var userToken = await AsyncStorage.getItem('Key_27'); 
    // this.socket = io(`${ServidorSocket}`, { reconnection: false }); // mac
    // this.socket.emit("usuario", userToken);
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      var userToken = await AsyncStorage.getItem('Key_27');
      fetchSol(userToken)
      //connectScoket()




    });


    return unsubscribe;
  }, [navigation]);

  fetchSol = async () => {
    await fetch(`${ServidorExport}/partner/viajegrua/TraerSolDetalle.php`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idcarga: idCarga,
      })
    })
      .then((response) => {
        if (!response.ok || response.status != 200 || response.status != '200') {
          setConexionErr(true)
        } else {
          response.json()
            .then(responser => {
              console.log(responser)
              console.log('1')

              if (responser == "no") {
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

  backPass = () => {
    navigation.goBack()
  }

  EnviarCot = () => {

    setLoad(prev => true);
    if (precio == '') {
      setLoad(prev => false);
      ModalOptions('Error', 'Ey!', 'Debes ingresar un costo', 'close');
    } else {
      Keyboard.dismiss()

      console.log(idSoli)
      console.log(precio)
      console.log(correocliente)
      console.log(notiToken)



      fetch(`https://www.convey.cl/partner/viajegrua/EnviarCotizacion.php`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data"
        },
        body: JSON.stringify({
          idsol: idSoli,
          precio: precioReal,
          correocliente: correocliente,
          tokencliente: notiToken
        }),

      })

        .then((response) => {


          if (!response.ok || response.status != 200 || response.status != '200') {
            ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
            setLoad(prev => false);

          } else {
            response.json()
              .then(responser => {
                console.log('3')
                console.log(responser);
                if (responser === 'exito') {
                  //ENVIAR POR SOCKET
                  socket.emit("CotSend", {
                    cliente: correocliente,
                  });
                  ModalOptions('Exito', 'Cotización enviada', 'Enviaste el precio del envío al cliente', backPass);
                } else {
                  ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
                }


                setLoad(prev => false);
              })
          }

        })
        .catch((error) => {
          console.log(error)
          ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
          setLoad(prev => false);

        });

    }
  }

  rendDetalle = () => {
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

      return (
        <View style={{ width: '100%', paddingHorizontal: 15, flex: 1 }}>



          <View style={{ width: '100%', flexDirection: 'row', backgroundColor: '#fff', marginTop: 15, }}>

            <View style={{ flex: 1, padding: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
              <View style={{ width: fontWidth / 5, height: fontWidth / 5, position: 'relative' }}>
                <Image
                  style={{
                    alignSelf: 'flex-start',
                    width: fontWidth / 5,
                    height: fontWidth / 5,
                    borderRadius: 8,
                    alignSelf: 'center',
                    marginBottom: 15,
                  }}
                  source={{ uri: `${ServidorExport}/cliente/bultosimg/${dataSource[0].imguno}` }}
                />
              </View>
            </View>


            <View style={{ flex: 1, padding: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
              <View style={{ width: fontWidth / 5, height: fontWidth / 5, position: 'relative' }}>
                <Image
                  style={{
                    alignSelf: 'flex-start',
                    width: fontWidth / 5,
                    height: fontWidth / 5,
                    borderRadius: 8,
                    alignSelf: 'center',
                    marginBottom: 15,
                  }}
                  source={{ uri: `${ServidorExport}/cliente/bultosimg/${dataSource[0].imgdos}` }}
                />
              </View>
            </View>

            <View style={{ flex: 1, padding: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
              <View style={{ width: fontWidth / 5, height: fontWidth / 5, position: 'relative' }}>
                <Image
                  style={{
                    alignSelf: 'flex-start',
                    width: fontWidth / 5,
                    height: fontWidth / 5,
                    borderRadius: 8,
                    alignSelf: 'center',
                    marginBottom: 15,
                  }}
                  source={{ uri: `${ServidorExport}/cliente/bultosimg/${dataSource[0].imgtres}` }}
                />
              </View>
            </View>


          </View>

          <View style={{ width: '100%', flexDirection: 'row', backgroundColor: '#fff', marginTop: 15, }}>

            <View style={{ flex: 1, padding: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
              <View style={{ width: fontWidth / 5, height: fontWidth / 5, position: 'relative' }}>
                <Image
                  style={{
                    alignSelf: 'flex-start',
                    width: fontWidth / 5,
                    height: fontWidth / 5,
                    borderRadius: 8,
                    alignSelf: 'center',
                    marginBottom: 15,
                  }}
                  source={{ uri: `${ServidorExport}/cliente/bultosimg/${dataSource[0].imgcuatro}` }}
                />
              </View>
            </View>


            <View style={{ flex: 1, padding: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
              <View style={{ width: fontWidth / 5, height: fontWidth / 5, position: 'relative' }}>
                <Image
                  style={{
                    alignSelf: 'flex-start',
                    width: fontWidth / 5,
                    height: fontWidth / 5,
                    borderRadius: 8,
                    alignSelf: 'center',
                    marginBottom: 15,
                  }}
                  source={{ uri: `${ServidorExport}/cliente/bultosimg/${dataSource[0].imgcinco}` }}
                />
              </View>
            </View>

            <View style={{ flex: 1, padding: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
              <View style={{ width: fontWidth / 5, height: fontWidth / 5, position: 'relative' }}>
                <Image
                  style={{
                    alignSelf: 'flex-start',
                    width: fontWidth / 5,
                    height: fontWidth / 5,
                    borderRadius: 8,
                    alignSelf: 'center',
                    marginBottom: 15,
                  }}
                  source={{ uri: `${ServidorExport}/cliente/bultosimg/${dataSource[0].imgseis}` }}
                />
              </View>
            </View>


          </View>







          <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { precioInput.focus(); }}>
            <View style={{ width: '80%' }}>
              {/* <Text style={styles.labels}>Tu Nombre</Text> */}
              <TextInput
                style={styles.inputs}
                placeholderTextColor="#909fac"
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                maxLength={100}
                keyboardType="numeric"
                placeholder="Ingresa el costo del envío"
                onChangeText={(text) => {
                  const onlyNumbers = text.replace(/\D/g, '');
                  const formatted = formatNumberWithDots(onlyNumbers);
                  setPrecio(formatted);
                  setPrecioReal(onlyNumbers);
                }}
                ref={(input) => { precioInput = input; }}
                value={precio}
                defaultValue={precio}
              //onSubmitEditing={() => { NextPageUnoScreen(); }}
              //returnKeyType={"next"}
              />
            </View>
          </TouchableOpacity>



          <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

            <TouchableOpacity onPress={() => EnviarCot()} style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1}>
              <Text style={styles.txtBtn}>Enviar cotización</Text>
            </TouchableOpacity>

          </LinearGradient>

          <TouchableOpacity style={{ width: '100%', padding: 15, marginTop: 15, justifyContent: 'center', alignItems: 'center' }} activeOpacity={1}>
            <Text style={styles.txtBtn}>Rechazar solicitud</Text>
          </TouchableOpacity>

        </View>
      )





    } else if (dataSource == '') {
      return (
        <View style={styles.ctnnoparse}>
          <Image
            style={{
              alignSelf: 'center',
              width: fontWidth / 2,
              height: fontWidth / 2,
              marginBottom: 20,
              marginTop: 30,
            }}
            source={require('./assets/empty.png')}
          />

          <Text style={styles.txtRenderElements}>No hay Notificaciones</Text>
        </View>
      )
    }
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




            <View style={{ flex: 1, width: '100%', marginTop: 2, paddingHorizontal: 15, backgroundColor: 'transparent' }}>
              <Text style={[styles.TextHeader, { marginBottom: 5, }]}>Solicitud de viaje</Text>










              {rendDetalle()}







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
};

//make this component available to the app
export default SolicitudViajeGruaScreen;
