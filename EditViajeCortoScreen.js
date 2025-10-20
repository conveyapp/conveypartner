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

const EditViajeCortoScreen = ({ route, navigation }) => {
  const [InfoUser, setInfoUser] = React.useState(route.params.InfoUser);
  const [InfoViaje, setInfoViaje] = React.useState(route.params.InfoViaje);

  const mapRef = React.useRef(null)
  const [ActivityShow, setActivityShow] = React.useState(false)
  const [load, setLoad] = React.useState(false);
  const [refri, setRefri] = React.useState(false);
  const [location, setLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [longNamePlace, setLongNamePlace] = React.useState('');


  //const centerCoordinates = { latitude: route.params.Latitude, longitude: route.params.Longitude }; // Coordenadas del centro del círculo
  const [centerCoordinates, setCenterCoordinates] = React.useState({
    latitude: '',
    longitude: ''
  });




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

  getCityName = (lat, lon) => {

    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyAfW179ke3iNCQTSxLYmX2UrBM-2ia0JPo`)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        // console.log(responseJson.status);
        var Larespuesta = ''
        if (responseJson.status == 'OK') {
          Larespuesta = responseJson.results;
          console.log(Larespuesta[0].formatted_address);
          console.log(Larespuesta[0].address_components[2].long_name);
          setLongNamePlace(Larespuesta[0].address_components[2].long_name)
          // console.log(JSON.stringify(Larespuesta[0].address_components) + '<--------------');
          // console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(Larespuesta[0].geometry.location.lat));
          // console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(Larespuesta[0].geometry.location.lng));
          // setLoad(false)

          // var ToPassComuna;
          // if(Larespuesta[0].address_components[2].long_name){
          //   ToPassComuna = Larespuesta[0].address_components[2].long_name
          // }else{
          //   ToPassComuna = comuna;
          // }

          // navigation.navigate('RegistroDos', {
          //   Direc: direc,
          //   Comuna: Larespuesta[0].address_components[2].long_name,
          //   Latitude: JSON.stringify(Larespuesta[0].geometry.location.lat),
          //   Longitude: JSON.stringify(Larespuesta[0].geometry.location.lng),
          //   DeptoBlock: deptoblock,
          // }) 
        } else if (responseJson.status == 'ZERO_RESULTS') {
          // console.log(responseJson)
          // //Alert.alert('Dirección invalida')
          // Keyboard.dismiss()

          // setLoad(false)
          // ModalOptions('Error', 'Dirección inválida', 'Tu dirección parece no estar en Chile','close');
        } else {
          // console.log(responseJson)
          // Keyboard.dismiss()

          // setLoad(false)
          // ModalOptions('Error', 'Dirección inválida', 'Tu dirección parece no ser válida','close');
        }






      }).catch((err) => {
        //setLoad(false)
        //ModalOptions('Error', 'No podemos encontrar la dirección', 'Escribe más detalles como país, ciudad, localidad. Agrega la palabra pasaje o avenida antes del nombre de la calle','close');

      })
  }


  React.useEffect(() => {
    if (InfoViaje[0].equipofrio == 'true') {
      setRefri(true)
    }
    if (InfoViaje[0].equipofrio == 'false') {
      setRefri(false)
    }
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        getCityName(location.coords.latitude, location.coords.longitude)
        setCenterCoordinates({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });

        setLocation(location);
      } catch (error) {
        setErrorMsg('Error getting location');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  BigZona = () => {
    if (circleRadiusKm >= 125) {

    } else {
      var sum = circleRadiusKm + 1;
      var mul = circleRadius + 1000
      setCircleRadiusKm(prev => sum)
      setCircleRadius(prev => mul)

      AnimateToRegionFunc()
    }

  }
  SmallZona = () => {
    if (circleRadiusKm <= 1) {

    } else {
      var sum = circleRadiusKm - 1;
      var mul = circleRadius - 1000
      setCircleRadiusKm(prev => sum)
      setCircleRadius(prev => mul)
    }

    AnimateToRegionFunc()

  }
  backPass = () => {
    navigation.navigate('Inicio')
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

  const [circleRadius, setCircleRadius] = React.useState(1000);
  const [circleRadiusKm, setCircleRadiusKm] = React.useState(Number(route.params.InfoViaje[0].radio));

  //const [circleRadiusKm, setCircleRadiusKm] = React.useState(2); // Cambié el valor inicial a 2 kilómetros
  const marginKm = 1; // Margen adicional de 3 kilómetros

  const AnimateToRegionFunc = () => {
    const latitudinalDegrees = (circleRadiusKm + marginKm) / 111.32; // Aproximadamente 111,320 metros por grado de latitud
    const longitudinalDegrees = latitudinalDegrees / Math.cos((Math.PI / 180) * centerCoordinates.latitude);

    const region = {
      latitude: centerCoordinates.latitude,
      longitude: centerCoordinates.longitude,
      latitudeDelta: latitudinalDegrees * 2,
      longitudeDelta: longitudinalDegrees * 2,
    };

    mapRef.current.animateToRegion(region, 1000);
  };




  CrearViaje = async () => {
    console.log(circleRadiusKm)
    console.log(InfoViaje[0].idviaje)
    setActivityShow(prev => true)
    var refriSend;
    if (refri == true) {
      refriSend = 'true'
    } else {
      refriSend = 'false'
    }




    fetch(`${ServidorExport}/partner/viajecorto/EditViajeCorto.php`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idviaje: InfoViaje[0].idviaje,

        km: circleRadiusKm,
        frio: refriSend,

      })

    })

      .then((response) => {


        if (!response.ok || response.status != 200 || response.status != '200') {
          ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
          setActivityShow(prev => false)

        } else {
          response.json()
            .then(responser => {
              //console.log('3')
              console.log(responser);
              if (responser === 'exito') {
                ModalOptions('Exito', 'Viaje actualizado', 'Editaste el viaje', backPass);
              } else if (responser === 'existe') {
                ModalOptions('Error', 'Ya tienes un viaje creado', 'No puedes tener más de un viaje en curso', 'close');
              } else {
                ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
              }


              setActivityShow(prev => false)
            })
        }

      })
      .catch((error) => {
        console.log(error)
        ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
        setActivityShow(prev => false)

      });
    //insertar en tabla





  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>

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


        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='always'>

          <View style={styles.headerAdorno}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <TouchableOpacity style={{ padding: 0, marginBottom: 10 }} onPress={() => navigation.goBack()}>
                <FontAwesome name="arrow-left" style={styles.arrowBack} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <Text style={[styles.TextHeader, { marginBottom: 0 }]}>Actualizar</Text>
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



            {/* <View style={{paddingHorizontal:15, paddingVertical:10, borderRadius:10, backgroundColor:'#07E607', alignSelf:'flex-start', marginBottom:10}}>
                    <Text style={{ color: '#343434', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 30,}}>Viaje corto</Text>
                  </View> */}



            {location ? (


              <View style={{ width: '100%', height: fontWidth * 1.4, borderRadius: 15, overflow: 'hidden', marginBottom: 20 }}>
                <MapView
                  ref={mapRef}
                  style={{ width: '100%', height: '100%', borderRadius: 10, }}
                  showsUserLocation={true}
                  provider="google"
                  initialRegion={{
                    latitude: Number(InfoViaje[0].lat),
                    longitude: Number(InfoViaje[0].lon),
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  <Circle
                    center={{
                      latitude: Number(InfoViaje[0].lat),
                      longitude: Number(InfoViaje[0].lon),
                    }}
                    radius={circleRadius}
                    strokeColor="rgba(158, 158, 255, 1)"
                    fillColor="rgba(158, 158, 255, 0.3)"
                  />
                </MapView>



              </View>



            ) : (
              <View style={{ flex: 1 }}>
                <Text>Cargando...</Text>
              </View>
            )}



            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginBottom: 15, marginTop: 15, flexDirection: 'row', paddingHorizontal: 0, }}>

              <TouchableOpacity onPress={() => SmallZona()} style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1, }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2, }}>
                <FontAwesome name="minus" size={fontWidth / 20} color="#07E607" />
              </TouchableOpacity>

              <View style={{ flex: 1, backgroundColor: '#eae6da', justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 24, }}>{circleRadiusKm} KM</Text>
              </View>

              <TouchableOpacity onPress={() => BigZona()} style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1, }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2, }}>
                <FontAwesome name="plus" size={fontWidth / 20} color="#07E607" />
              </TouchableOpacity>

            </View>

            <TouchableOpacity onPress={() => setRefri(!refri)} style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
              <View style={{ width: fontWidth / 18, height: fontWidth / 18, marginRight: 10, borderWidth: 2, borderColor: '#07E607', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: fontWidth / 28, height: fontWidth / 28, borderRadius: 100, backgroundColor: refri == true ? '#07E607' : '#fff' }} />
              </View>
              <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 28 }}>Vehículo con refrigeración</Text>
            </TouchableOpacity>


            <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

              <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} onPress={() => CrearViaje()}>
                <Text style={styles.txtBtn}>Actualizar</Text>
              </TouchableOpacity>

            </LinearGradient>


          </View>








        </ScrollView>
      </View>




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

export default EditViajeCortoScreen;
