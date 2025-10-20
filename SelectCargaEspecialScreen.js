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
import * as Location from 'expo-location';
import MapView, { Circle } from 'react-native-maps';
// import { GeoCodingApiGoogle } from './GeoCodingApi.js'

let fontWidth = Dimensions.get('window').width;



const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

const SelectCargaEspecialScreen = ({ route, navigation }) => {
  const [InfoUser, setInfoUser] = React.useState(route.params.InfoUser);
  const { width } = Dimensions.get('window');
  const anchoImagen = 747;
  const altoImagen = 404;
  const aspectRatio = anchoImagen / altoImagen;

  // Calcular la altura utilizando la relación de aspecto
  const alturaCalculada = width / aspectRatio;


  const [ActivityShow, setActivityShow] = React.useState(false)
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

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* 
      <View style={{ flex: 1, position: 'absolute', width: '100%', height: '100%', backgroundColor: '#fff' }}>
        <Image
          //resizeMode="contain"
          style={{ width: '100%', height: alturaCalculada, position: 'absolute', bottom: 0 }}
          resizeMode="contain" // Esto evitará que la imagen se recorte
          source={require('./assets/confetibottom.png')}
        />

      </View> */}

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
              <TouchableOpacity style={{ padding: 0, marginBottom: 10 }} onPress={() => navigation.goBack()}>
                <FontAwesome name="arrow-left" style={styles.arrowBack} />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                <Text style={[styles.TextHeader, { marginBottom: 0 }]}>Cargas especiales</Text>
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
            {/* 
            <View style={styles.header}>

              <TouchableOpacity style={{ padding: 0, marginBottom: 10, }} onPress={() => navigation.goBack()}>
                <FontAwesome name="arrow-left" style={styles.arrowBack} />
              </TouchableOpacity>
              <Text style={styles.TextHeader}>Cargas especiales</Text>

            </View> */}




            <View style={{ flex: 1, width: '100%', marginTop: 2, paddingHorizontal: 15, backgroundColor: 'transparent' }}>




              <View style={{ backgroundColor: 'transparent', justifyContent: 'center' }}>

                <TouchableOpacity onPress={() => navigation.navigate('CrearViajeLargoEspecial', { InfoUser: InfoUser })} style={{ marginBottom: 15 }} >
                  <LinearGradient
                    colors={['#E6F14B', '#E6F14B', '#C3FE70']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{ padding: 15, flexDirection: 'row', borderRadius: 10 }}
                  >
                    <View style={{ width: '80%' }}>
                      <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 24, color: '#343434' }}>Viajes largos</Text>
                      <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 28, color: '#353535' }}>Viajes especiales interurbanos o fuera de la ciudad a mas de 200 km</Text>
                    </View>
                    <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                      <Image
                        style={{
                          alignSelf: 'flex-start',
                          marginLeft: 15,
                          width: fontWidth / 9,
                          height: fontWidth / 9,
                          marginBottom: 0,
                        }}
                        source={require('./assets/viajeLargoEspecial.png')}
                      />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>



                <TouchableOpacity onPress={() => navigation.navigate('CrearViajeCortoEspecial', { InfoUser: InfoUser })} style={{ marginBottom: 15, }} >
                  <LinearGradient
                    colors={['#E6F14B', '#E6F14B', '#C3FE70']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{ padding: 15, flexDirection: 'row', borderRadius: 10 }}
                  >
                    <View style={{ width: '80%' }}>
                      <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 24, color: '#343434' }}>Viajes cortos</Text>
                      <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 28, color: '#353535' }}>Viajes especiales interurbanos o fuera de la ciudad a mas de 200 km</Text>
                    </View>
                    <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                      <Image
                        style={{
                          alignSelf: 'flex-start',
                          marginLeft: 15,
                          width: fontWidth / 9,
                          height: fontWidth / 9,
                          marginBottom: 0,
                        }}
                        source={require('./assets/viajeLargoEspecial.png')}
                      />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                {/* <TouchableOpacity style={{width:'100%', backgroundColor:'#C7FFC3', borderRadius:10, padding:10, marginTop:15,}}>
  <Text style={{fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 24, color:'#343434'}}>Viajes cortos</Text>
  <Text style={{fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 28, color:'#353535'}}>Viajes especiales interurbanos o fuera de la ciudad a mas de 200 km</Text>
</TouchableOpacity> */}

              </View>
















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

export default SelectCargaEspecialScreen;
