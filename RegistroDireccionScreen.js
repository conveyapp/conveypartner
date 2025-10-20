import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, ScrollView, Animated, TouchableWithoutFeedback, Platform, Keyboard, Alert, KeyboardAvoidingView, TouchableOpacity, TextInput, ActivityIndicator, StatusBar } from 'react-native';
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

const RegistroDireccionScreen = ({ route, navigation }) => {
  const [load, setLoad] = React.useState(false);
  const [firma, setFirma] = React.useState(route.params.FirmaUri);
  const [nombre, setlatitude] = React.useState(route.params.Nombre);
  const [numero, setnumero] = React.useState(route.params.Numero);
  const [rut, setRut] = React.useState(route.params.Rut);

  const [region, setRegion] = React.useState('');
  const [comuna, setComuna] = React.useState('');
  const [calle, setCalle] = React.useState('');
  const [numeracion, setNumeracion] = React.useState('');

  const [resutlSearch, setResutlSearch] = React.useState('');
  const [searchError, setSearchError] = React.useState(false);

  const [direccion, setDireccion] = React.useState('');



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
          //setSearchError(prev => true)
        } else {
          setSearchError(prev => false)
          setResutlSearch(prev => data.results[0].formatted_address)
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setSearchError(prev => false)
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

  NextPageDireccionScreen = () => {
    if (!direccion) {
      ModalOptions('Error', 'Dirección inválida', 'Debes ingresar una dirección', 'close');
    }
    else {
      var direcFinal = direccion;
      navigation.navigate('RegistroFechaNacimiento', { FirmaUri: firma, Nombre: nombre, Numero: numero, Rut: rut, Direccion: direcFinal })
      // navigation.navigate('RegistroSeis', {FirmaUri: firma, Nombre:nombre, Numero: numero, Rut: rut, Direccion: direcFinal})
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
            <ScrollView contentContainerStyle={{ flex: 1, }} keyboardShouldPersistTaps='always'>

              <View style={styles.headerAdorno}>

                <TouchableOpacity style={{ padding: 0, marginBottom: 10, }} onPress={() => navigation.goBack()}>
                  <FontAwesome name="arrow-left" style={styles.arrowBack} />
                </TouchableOpacity>

              </View>




              <View style={{ flex: 1, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 2, paddingHorizontal: 15 }}>

                <Text style={[styles.TextHeader, { marginBottom: 15, }]}>Dirección</Text>

                {/* <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { regionInput.focus(); }}>
                <View style={{ width: '80%' }}>
                  <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}

                    placeholder="Región"
                    onChangeText={region => setRegion(region)}
                    ref={(input) => { regionInput = input; }}
                    onSubmitEditing={() => { comunaInput.focus(); }}
                    returnKeyType={"next"}
                  />
                </View>
              </TouchableOpacity>  */}

                {/* 
              <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { comunaInput.focus(); }}>
                <View style={{ width: '80%' }}>
                  <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}

                    placeholder="Comuna / ciudad"
                    onChangeText={comuna => setComuna(comuna)}
                    ref={(input) => { comunaInput = input; }}
                    onSubmitEditing={() => { calleInput.focus(); }}
                    returnKeyType={"next"}
                  />
                </View>
              </TouchableOpacity>  */}


                {/* <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { calleInput.focus(); }}>
                <View style={{ width: '80%' }}>
                  <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}

                    placeholder="Calle"
                    onChangeText={calle => setCalle(calle)}
                    ref={(input) => { calleInput = input; }}
                    onSubmitEditing={() => { numInput.focus(); }}
                    returnKeyType={"next"}
                  />
                </View>
              </TouchableOpacity>  */}


                {/* <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { numInput.focus(); }}>
                <View style={{ width: '80%' }}>
                  <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}

                    placeholder="Numeración"
                    onChangeText={num => setNumeracion(num)}
                    ref={(input) => { numInput = input; }}
                    onSubmitEditing={() => { NextPageDireccionScreen(); }}
                    returnKeyType={"next"}
                  />
                </View>
              </TouchableOpacity>  */}

                <TouchableOpacity style={styles.ctninputs} activeOpacity={1} onPress={toggleOverlay}>
                  <Text style={[styles.labels, { marginLeft: 0 }]}>Direccion</Text>
                  <Text style={{ color: direccion == '' ? '#909fac' : '#141414', fontWeight: 'bold', fontSize: fontWidth / 26, marginBottom: 4, marginTop: 1 }}>{direccion == '' ? 'Ej Santiago' : direccion}</Text>
                </TouchableOpacity>



                <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

                  <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} onPress={() => NextPageDireccionScreen()}>
                    <Text style={styles.txtBtn}>Siguiente</Text>
                  </TouchableOpacity>

                </LinearGradient>


              </View>








            </ScrollView>
          </KeyboardAvoidingView>
        </View>

      </DismissKeyboard>
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
              backgroundColor: Platform.OS === 'ios' ? '#fff' : '#fff',
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
              <Text style={styles.labels}>Dirección</Text>
              <TextInput
                style={styles.inputs}
                placeholderTextColor="#909fac"
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                maxLength={100}

                placeholder="Bulnes 505"
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
              setDireccion(prev => resutlSearch)
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

export default RegistroDireccionScreen;

