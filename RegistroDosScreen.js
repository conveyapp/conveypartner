import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View, Dimensions, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard, SafeAreaView, Alert, TouchableOpacity, TextInput, ActivityIndicator, StatusBar } from 'react-native';
import MapView from 'react-native-maps';
import Modal from './Modal.js'
//import marker from './assets/m1.png';
import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
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


//class RegistroDosScreen extends Component {
const RegistroDosScreen = ({ route, navigation }) => {
  const [load, setLoad] = React.useState(false);

  const [firma, setFirma] = React.useState(route.params.FirmaUri);
  const [nombre, setlatitude] = React.useState(route.params.Nombre);
  const [prefijo, setPrefijo] = React.useState('+56');
  const [paisImg, setPaisImg] = React.useState('chile'); // Solo el nombre del archivo
  const [numero, setnumero] = React.useState('');




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



  onRegionChange = (region) => {
    setlatitude(region.latitude)
    setlongitude(region.longitude)
  }





  activity = () => {
    if (load == true) {
      return (
        <ActivityIndi />

      )
    }
  }



  NextPageDosScreen = () => {
    Keyboard.dismiss();
    setLoad(true);

    if (!numero) {
      setLoad(false);
      ModalOptions('Error', 'Número inválido', 'Debes ingresar un número telefónico', 'close');
    } else {
      var regex = /^[0-9]+$/;
      var isValid = regex.test(numero);
      var count = numero.length;

      // Validación de si todos los caracteres son iguales
      var allEqual = /^(\d)\1+$/.test(numero); // ✅ NUEVO

      if (!isValid) {
        setLoad(false);
        ModalOptions('Error', 'Número inválido', 'Sólo números son permitidos', 'close');
      } else if (allEqual) {
        setLoad(false);
        ModalOptions('Error', 'Número inválido', 'No puedes ingresar un número con todos los dígitos iguales', 'close');
      } else if (count !== 9) {
        setLoad(false);
        ModalOptions('Error', 'Número inválido', 'El número debe tener 9 dígitos', 'close');
      } else {
        setLoad(false);
        navigation.navigate('RegistroTres', {
          FirmaUri: firma,
          Nombre: nombre,
          Numero: numero,
        });
      }
    }
  }


  const [modalVisibleD, setModalVisibleD] = React.useState(false);
  const opacity = React.useState(new Animated.Value(0))[0];
  const translateY = React.useRef(new Animated.Value(600)).current;

  const toggleModal = () => {
    Keyboard.dismiss()
    if (modalVisibleD) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 600,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start(() => setModalVisibleD(false));
    } else {
      setModalVisibleD(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start();
    }
  };

  returnImageFlag = () => {
    if (paisImg == 'chile') {
      return (
        <Image
          resizeMode="contain"
          style={{
            width: 25,
            height: 25,
            marginRight: 10,
          }}
          source={require(`./assets/flags/chile.png`)}
        />
      )
    } else if (paisImg == 'argentina') {
      return (
        <Image
          resizeMode="contain"
          style={{
            width: 25,
            height: 25,
            marginRight: 10,
          }}
          source={require(`./assets/flags/argentina.png`)}
        />
      )
    }
  }

  setToUseFlag = (prefix, country) => {
    setPrefijo(prefix)
    setPaisImg(country)
    toggleModal()
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
            <View style={styles.headerAdorno}>

              <TouchableOpacity style={{ padding: 0, marginBottom: 10, }} onPress={() => navigation.goBack()}>
                <FontAwesome name="arrow-left" style={styles.arrowBack} />
              </TouchableOpacity>



            </View>


            <View style={{ flex: 1, width: '100%', marginTop: 2, paddingHorizontal: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[styles.TextHeader, { marginBottom: 15, }]}>Número de teléfono</Text>
              </View>
              <TouchableOpacity activeOpacity={1} style={styles.ctntelefono} onPress={() => { num.focus(); }}>
                {/* <Text style={styles.labels}>Número De Teléfono</Text> */}
                <View style={{ flexDirection: 'row', }}>
                  <TouchableOpacity onPress={toggleModal} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 5, marginRight: 5, marginLeft: 5, paddingTop: 0, paddingRight: 8, borderRightWidth: 1, borderRightColor: '#cacaca' }}>

                    {returnImageFlag()}
                    <Text style={styles.prevPhono}>{prefijo}</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={styles.inputsfono}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}

                    placeholder='teléfono'
                    onChangeText={numero => setnumero(numero)}
                    ref={(input) => { num = input; }}
                    returnKeyType={"next"}
                    onSubmitEditing={() => NextPageDosScreen()}
                  />
                </View>
              </TouchableOpacity>



              <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

                <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} onPress={() => NextPageDosScreen()}>
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



      {modalVisibleD && (
        <TouchableOpacity activeOpacity={1} onPress={() => { toggleModal() }} style={stylesDos.modalContainer}>
          <Animated.View style={[stylesDos.modalBackground, { opacity: opacity }]} />
          <Animated.View style={[stylesDos.modalContent, { transform: [{ translateY: translateY }] }]}>
            <Text style={{ color: '#141414', fontFamily: 'Poppins_700Bold', fontSize: 15, marginBottom: 15, }}>Anexo de paises disponibles</Text>


            <TouchableOpacity onPress={() => { setToUseFlag('+56', 'chile') }}
              style={{ width: '90%', height: 'auto', backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, }}>
              <View>
                <Image
                  resizeMode="contain"
                  style={{
                    width: 30,
                    height: 30,
                  }}
                  source={require('./assets/flags/chile.png')}
                />
              </View>
              <View>
                <Text style={{ color: '#141414', fontFamily: 'Poppins_700Bold', fontSize: 15, }}>Chile</Text>
              </View>
              <View>
                <Text style={{ color: '#141414', fontFamily: 'Poppins_700Bold', fontSize: 15, }}>+56</Text>
              </View>
            </TouchableOpacity>



            <TouchableOpacity onPress={() => { setToUseFlag('+54', 'argentina') }}
              style={{ width: '90%', height: 'auto', backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Image
                  resizeMode="contain"
                  style={{
                    width: 30,
                    height: 30,
                  }}
                  source={require('./assets/flags/argentina.png')}
                />
              </View>
              <View>
                <Text style={{ color: '#141414', fontFamily: 'Poppins_700Bold', fontSize: 15, }}>Argentina</Text>
              </View>
              <View>
                <Text style={{ color: '#141414', fontFamily: 'Poppins_700Bold', fontSize: 15, }}>+54</Text>
              </View>
            </TouchableOpacity>




            {/* <TouchableOpacity onPress={toggleModal}>
              <Text style={stylesDos.closeButton}>Cerrar</Text>
            </TouchableOpacity> */}


          </Animated.View>
        </TouchableOpacity>
      )}

    </View>
  );


}

export default RegistroDosScreen;

const stylesDos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    fontSize: 18,
    color: 'blue',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  closeButton: {
    marginTop: 10,
    color: 'blue',
    textAlign: 'center',
  },
});

