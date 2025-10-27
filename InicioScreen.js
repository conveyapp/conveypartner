import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, TouchableWithoutFeedback, Animated, Platform, PanResponder, Keyboard, Switch, ScrollView, SafeAreaView, Alert, TouchableOpacity, TextInput, ActivityIndicator, StatusBar, Button } from 'react-native';
import Modal from './Modal.js'
import { FontAwesome, FontAwesome5, FontAwesome6, Octicons, Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import ActivityIndi from './activityIndi.js'
import { ServidorExport } from './ServAdress.js'
import { ServidorSocket } from './ServAdressSocket.js'
import { getSocket } from './Socket';
import { styles } from "./Style.js";
import RBSheet from "react-native-raw-bottom-sheet";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Skeleton from './SkeletonLoad.js'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './utils';
import TextTicker from 'react-native-text-ticker'
import * as Notifications from 'expo-notifications';


let fontWidth = Dimensions.get('window').width;
let win = Dimensions.get('window').width;
const { width, height } = Dimensions.get('window');
let alturaOpen = Dimensions.get('window').height;
let heighthorarios = Dimensions.get('window').height - 60;
const projectId = Constants.expoConfig.extra.eas.projectId;


const InicioScreen = ({ navigation, route }) => {
  const socket = getSocket();
  const { signOut } = React.useContext(AuthContext);
  const [activityShow, setActivityShow] = React.useState(false);
  const [correoUser, setCorreoUser] = React.useState('');
  const [expoPushToken, setExpoPushToken] = React.useState('');
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [switchShow, setSwitchShow] = React.useState('');
  const [showSkeleton, setShowSkeleton] = React.useState(true);
  const [conexionErr, setConexionErr] = React.useState(false);
  const [dataSource, setDataSource] = React.useState('');

  const [viajeLargo, setViajeLargo] = React.useState('');
  const [viajeCorto, setViajeCorto] = React.useState('');
  const [viajeGrua, setViajeGrua] = React.useState('');
  const [viajeLargoEspecial, setViajeLargoEspecial] = React.useState('');
  const [viajeCortoEspecial, setViajeCortoEspecial] = React.useState('');

  //VIAJE LARGO
  const [dataSourceViajeLargo, setDataSourceViajeLargo] = React.useState('');
  const [avisoPagoViajeLargo, setAvisoPagoViajeLargo] = React.useState('');

  //VIAJE CORTO
  const [dataSourceViajeCorto, setDataSourceViajeCorto] = React.useState('');
  const [avisoPagoViajeCorto, setAvisoPagoViajeCorto] = React.useState('');

  //VIAJE GRUA
  const [dataSourceViajeGrua, setDataSourceViajeGrua] = React.useState('');
  const [avisoPagoViajeGrua, setAvisoPagoViajeGrua] = React.useState('');

  //VIAJE LARGO ESPECIAL
  const [dataSourceViajeLargoEspecial, setDataSourceViajeLargoEspecial] = React.useState('');
  const [avisoPagoViajeLargoEspecial, setAvisoPagoViajeLargoEspecial] = React.useState('');

  //VIAJE CORTO ESPECIAL
  const [dataSourceViajeCortoEspecial, setDataSourceViajeCortoEspecial] = React.useState('');
  const [avisoPagoViajeCortoEspecial, setAvisoPagoViajeCortoEspecial] = React.useState('');

  const [location, setLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const [chatExis, setChatExi] = React.useState(false)
  const [notificExist, setNotificExist] = React.useState(false)

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

  // NOTIFICACIONES
  React.useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
      fetchTokenToServer(token);
    });
  }, []);

  // TRACKING UBICACION - FOREGROUND (emite por socket cuando está disponible)
  const locationWatchRef = React.useRef(null);
  const locationIntervalRef = React.useRef(null);

  React.useEffect(() => {
    let isMounted = true;

    async function startWatch() {
      try {
        if (!isEnabled) {
          if (locationWatchRef.current) {
            locationWatchRef.current.remove();
            locationWatchRef.current = null;
          }
          return;
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        const userToken = await AsyncStorage.getItem('Key_27');
        const sock = getSocket();

        // Enviar una lectura inmediata al iniciar el tracking
        try {
          const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          if (current && current.coords) {
            console.log('Emitiendo PartnerLocationSend (inicial)', current.coords.latitude, current.coords.longitude);
            sock && sock.emit('PartnerLocationSend', {
              partnerId: userToken,
              lat: current.coords.latitude,
              lng: current.coords.longitude,
              ts: Date.now(),
            });
          }
        } catch (e) { }

        // Intervalo de respaldo cada 5s
        if (locationIntervalRef.current) {
          clearInterval(locationIntervalRef.current);
        }
        locationIntervalRef.current = setInterval(async () => {
          try {
            const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            const { latitude, longitude } = (pos && pos.coords) || {};
            if (latitude && longitude) {
              console.log('Emitiendo PartnerLocationSend (interval)', latitude, longitude);
              sock && sock.emit('PartnerLocationSend', {
                partnerId: userToken,
                lat: latitude,
                lng: longitude,
                ts: Date.now(),
              });
            }
          } catch (e) { }
        }, 5000);

        locationWatchRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000, // enviar cada ~5s
            distanceInterval: 0, // sin filtro de distancia para pruebas
          },
          (pos) => {
            if (!isMounted) return;
            if (!sock) return;
            const { latitude, longitude } = (pos && pos.coords) || {};
            if (latitude && longitude) {
              console.log('Emitiendo PartnerLocationSend (watch)', latitude, longitude);
              sock.emit('PartnerLocationSend', {
                partnerId: userToken,
                lat: latitude,
                lng: longitude,
                ts: Date.now(),
              });
            }
          }
        );
      } catch (e) {
        // intentionally no-op: flujo simple
      }
    }

    startWatch();

    return () => {
      isMounted = false;
      if (locationWatchRef.current) {
        locationWatchRef.current.remove();
        locationWatchRef.current = null;
      }
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
        locationIntervalRef.current = null;
      }
    };
  }, [isEnabled]);

  async function registerForPushNotificationsAsync() {
    let token;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Solicitar permisos para notificaciones
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true, // Permitir los badges en iOS
          allowSound: true,
        },
      });
      finalStatus = status;
    }

    // Si los permisos no son concedidos
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    // Obtener el token de notificaciones
    token = (await Notifications.getExpoPushTokenAsync({
      projectId, // Reemplazar con tu projectId si es necesario
    })).data;

    // Configurar canal de notificaciones para Android
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        badge: true, // Habilitar los badges en Android
      });
    }

    return token;
  }

  async function fetchTokenToServer(token) {
    console.log(token + '     Token noti');
    var userToken = await AsyncStorage.getItem('Key_27');

    fetch(`${ServidorExport}/partner/notificTokenSet.php`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: userToken,
        token: token,
      }),
    })
      .then((response) => {
        if (!response.ok || response.status !== 200) {
          // Manejo de error
        } else {
          response.json().then((responser) => {
            console.log(responser);
            if (responser === 'ok') {
              // Respuesta exitosa
            } else if (responser === 'no') {
              // Manejo de error
            }
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching token to server:', error);
      });
  }


  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('denegado')
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      try {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(prev => loc);
        // console.log(loc)
        // Alert.alert('Latitud: ' + loc.coords.latitude.toString());
        // Alert.alert('Longitud: ' + loc.coords.longitude.toString());

      } catch (error) {
        console.log(error)
        setErrorMsg('Error getting location');
        setLoading(false);
      }
      finally {
        setLoading(false);
      }
    })();
  }, []);


  connectScoket = async () => {
    var userToken = await AsyncStorage.getItem('Key_27');

    socket.on("nuevoViaje", (data) => {
      console.log('llega del socket')
      notiExist(userToken)
      fetchSolicitudesViajeLargo(userToken)

      fetchSolicitudesViajeCorto(userToken)

      fetchSolicitudesViajeGrua(userToken)
    });

    socket.on("PayRecibe", (data) => {
      console.log('aviso de pago ------------------')
      console.log('AVISOOOOOOOO')
      notiExist(userToken)
      fetchPagoViajeLargo(userToken)

      fetchPagoViajeCorto(userToken)

      fetchPagoViajeGrua(userToken)

      fetchPagoViajeLargoEspecial(userToken)

      fetchPagoViajeCortoEspecial(userToken)
    });

    socket.on("RecibeMensaje", (data) => {
      chatExist(userToken)
    });





  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      var userToken = await AsyncStorage.getItem('Key_27');
      setCorreoUser(prev => userToken)
      fetchPrincipal(userToken)
      connectScoket()
      chatExist(userToken)
      notiExist(userToken)

      setTimeout(() => {
        setShowSkeleton(false)

        //VIAJE LARGO
        fetchSolicitudesViajeLargo(userToken)
        fetchPagoViajeLargo(userToken)

        //VIAJE CORTO
        fetchSolicitudesViajeCorto(userToken)
        fetchPagoViajeCorto(userToken)

        //VIAJE GRUA
        fetchSolicitudesViajeGrua(userToken)
        fetchPagoViajeGrua(userToken)

        //VIAJE LARGO ESPECIAL
        fetchSolicitudesViajeLargoEspecial(userToken)
        fetchPagoViajeLargoEspecial(userToken)

        //VIAJE CORTO ESPECIAL
        fetchSolicitudesViajeCortoEspecial(userToken)
        fetchPagoViajeCortoEspecial(userToken)

      }, 2000);




    });


    return unsubscribe;
  }, [navigation, dataSource]);


  fetchPrincipal = (x) => {
    console.log(x)
    fetch(`${ServidorExport}/partner/TraerInfoCamionero.php`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: x,
      })
    })
      .then((response) => {
        if (!response.ok || response.status != 200 || response.status != '200') {
          setConexionErr(true)
        } else {
          response.json()
            .then(responser => {
              console.log(responser)
              if (responser != '') {

                if (responser[0].camioneroInfo[0].activo == 'true') {
                  setIsEnabled(true)
                } else {
                  setIsEnabled(false)
                }

                setDataSource(prev => responser[0].camioneroInfo);

                if (responser[0].viajeLargo != 'No Results Found.') {
                  setViajeLargo(prev => responser[0].viajeLargo)
                } else {
                  setViajeLargo(prev => '')
                }

                if (responser[0].viajeCorto != 'No Results Found.') {
                  setViajeCorto(prev => responser[0].viajeCorto)
                } else {
                  setViajeCorto(prev => '')
                }





                if (responser[0].viajeGrua != 'No Results Found.') {
                  setViajeGrua(prev => responser[0].viajeGrua)
                } else {
                  setViajeGrua(prev => '')
                }


                if (responser[0].viajeLargoEspecial != 'No Results Found.') {
                  setViajeLargoEspecial(prev => responser[0].viajeLargoEspecial)
                } else {
                  setViajeLargoEspecial(prev => '')
                }


                if (responser[0].viajeCortoEspecial != 'No Results Found.') {
                  setViajeCortoEspecial(prev => responser[0].viajeCortoEspecial)
                } else {
                  setViajeCortoEspecial(prev => '')
                }





              } else {
                setDataSource(prev => '');
              }
            })
        }

      })
      .catch((error) => {
        setConexionErr(true)
      });
  }



  // VIAJE LARGO
  fetchSolicitudesViajeLargo = (x) => {
    fetch(`${ServidorExport}/partner/viajelargo/SearchMatches.php`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: x,
      })
    })
      .then((response) => {
        if (!response.ok || response.status != 200 || response.status != '200') {
          setConexionErr(true)
        } else {
          response.json()
            .then(responser => {
              console.log(responser + 'Check Matches')
              console.log(responser[0].origen)
              if (responser != 'No hay') {
                setDataSourceViajeLargo(responser)

                showBottom()
              } else {


              }
            })
        }

      })
      .catch((error) => {
        setConexionErr(true)
      });
  }
  rechazarSolViajeLargo = (idSoli) => {
    fetch(`https://www.convey.cl/partner/viajelargo/RechazarSolicitud.php`, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      },
      body: JSON.stringify({
        idsol: idSoli,
      }),

    })

      .then((response) => {


        if (!response.ok || response.status != 200 || response.status != '200') {
          ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
          //setLoad(prev => false);

        } else {
          response.json()
            .then(responser => {
              console.log('3')
              console.log(responser);
              if (responser === 'exito') {
                ModalOptions('Exito', 'Solicitud rechazada', 'Rechazaste la solicitud de envío', 'close');
              } else {
                ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
              }


              //setLoad(prev => false);
            })
        }

      })
      .catch((error) => {
        console.log(error)
        ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
        //setLoad(prev => false);

      });
  }
  fetchPagoViajeLargo = (x) => {

    console.log('Mostrar viaje pagado')
    if (viajeLargo != '') {
      console.log('Mostrar viaje pagado 2')
      console.log(viajeLargo[0].idviaje)
      console.log(viajeLargo[0].idcamionero)
      fetch(`${ServidorExport}/partner/viajelargo/AvisoPagoViajeLargo.php`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idviaje: viajeLargo[0].idviaje,
          idcamionero: viajeLargo[0].idcamionero,
        })
      })
        .then((response) => {
          if (!response.ok || response.status != 200 || response.status != '200') {
            setConexionErr(true)
          } else {
            response.json()
              .then(responser => {
                console.log(responser + ' <---- para aviso de pago')
                if (responser != 'No Results Found.') {
                  setAvisoPagoViajeLargo(responser)

                  showBottomDos()
                } else {


                }
              })
          }

        })
        .catch((error) => {
          setConexionErr(true)
        });
    }

  }

  //VIAJE CORTO
  fetchSolicitudesViajeCorto = (x) => {
    fetch(`${ServidorExport}/partner/viajecorto/SearchMatches.php`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: x,
      })
    })
      .then((response) => {
        if (!response.ok || response.status != 200 || response.status != '200') {
          setConexionErr(true)
        } else {
          response.json()
            .then(responser => {
              console.log(responser + 'Check Matches')
              console.log(responser[0].origen)
              if (responser != 'No hay') {
                setDataSourceViajeCorto(responser)

                showBottom()
              } else {


              }
            })
        }

      })
      .catch((error) => {
        setConexionErr(true)
      });
  }
  rechazarSolViajeCorto = (idSoli) => {
    fetch(`https://www.convey.cl/partner/viajecorto/RechazarSolicitud.php`, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      },
      body: JSON.stringify({
        idsol: idSoli,
      }),

    })

      .then((response) => {


        if (!response.ok || response.status != 200 || response.status != '200') {
          ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
          //setLoad(prev => false);

        } else {
          response.json()
            .then(responser => {
              console.log('3')
              console.log(responser);
              if (responser === 'exito') {
                ModalOptions('Exito', 'Solicitud rechazada', 'Rechazaste la solicitud de envío', 'close');
              } else {
                ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
              }


              //setLoad(prev => false);
            })
        }

      })
      .catch((error) => {
        console.log(error)
        ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
        //setLoad(prev => false);

      });
  }
  fetchPagoViajeCorto = (x) => {

    console.log('Mostrar viaje pagado')
    if (viajeCorto != '') {
      console.log('Mostrar viaje pagado 2')
      console.log(viajeCorto[0].idviaje)
      console.log(viajeCorto[0].idcamionero)
      fetch(`${ServidorExport}/partner/viajecorto/AvisoPagoViajeCorto.php`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idviaje: viajeCorto[0].idviaje,
          idcamionero: viajeCorto[0].idcamionero,
        })
      })
        .then((response) => {
          if (!response.ok || response.status != 200 || response.status != '200') {
            setConexionErr(true)
          } else {
            response.json()
              .then(responser => {
                console.log(responser + ' <---- para aviso de pago')
                if (responser != 'No Results Found.') {
                  setAvisoPagoViajeCorto(responser)

                  showBottomDos()
                } else {


                }
              })
          }

        })
        .catch((error) => {
          setConexionErr(true)
        });
    }

  }

  //VIAJE GRUA
  fetchSolicitudesViajeGrua = (x) => {
    fetch(`${ServidorExport}/partner/viajegrua/SearchMatches.php`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: x,
      })
    })
      .then((response) => {
        if (!response.ok || response.status != 200 || response.status != '200') {
          setConexionErr(true)
        } else {
          response.json()
            .then(responser => {
              console.log(responser + 'Check Matches')
              console.log(responser[0].origen)
              if (responser != 'No hay') {
                setDataSourceViajeGrua(responser)

                showBottom()
              } else {


              }
            })
        }

      })
      .catch((error) => {
        setConexionErr(true)
      });
  }
  rechazarSolViajeGrua = (idSoli) => {
    fetch(`https://www.convey.cl/partner/viajeGrua/RechazarSolicitud.php`, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      },
      body: JSON.stringify({
        idsol: idSoli,
      }),

    })

      .then((response) => {


        if (!response.ok || response.status != 200 || response.status != '200') {
          ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
          //setLoad(prev => false);

        } else {
          response.json()
            .then(responser => {
              console.log('3')
              console.log(responser);
              if (responser === 'exito') {
                ModalOptions('Exito', 'Solicitud rechazada', 'Rechazaste la solicitud de envío', 'close');
              } else {
                ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
              }


              //setLoad(prev => false);
            })
        }

      })
      .catch((error) => {
        console.log(error)
        ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
        //setLoad(prev => false);

      });
  }
  fetchPagoViajeGrua = (x) => {

    console.log('Mostrar viaje pagado')
    if (viajeGrua != '') {
      console.log('Mostrar viaje pagado 2')
      console.log(viajeGrua[0].idviaje)
      console.log(viajeGrua[0].idcamionero)
      fetch(`${ServidorExport}/partner/viajegrua/AvisoPagoViajeGrua.php`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idviaje: viajeGrua[0].idviaje,
          idcamionero: viajeGrua[0].idcamionero,
        })
      })
        .then((response) => {
          if (!response.ok || response.status != 200 || response.status != '200') {
            setConexionErr(true)
          } else {
            response.json()
              .then(responser => {
                console.log(responser + ' <---- para aviso de pago')
                if (responser != 'No Results Found.') {
                  setAvisoPagoViajeGrua(responser)

                  showBottomDos()
                } else {


                }
              })
          }

        })
        .catch((error) => {
          setConexionErr(true)
        });
    }

  }

  //VIAJE LARGO ESPECIAL
  fetchSolicitudesViajeLargoEspecial = (x) => {
    fetch(`${ServidorExport}/partner/viajelargoespecial/SearchMatches.php`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: x,
      })
    })
      .then((response) => {
        if (!response.ok || response.status != 200 || response.status != '200') {
          setConexionErr(true)
        } else {
          response.json()
            .then(responser => {
              console.log(responser + 'Check Matches')
              console.log(responser[0].origen)
              if (responser != 'No hay') {
                setDataSourceViajeLargoEspecial(responser)

                showBottom()
              } else {


              }
            })
        }

      })
      .catch((error) => {
        setConexionErr(true)
      });
  }
  rechazarSolViajeLargoEspecial = (idSoli) => {
    fetch(`https://www.convey.cl/partner/viajelargoespecial/RechazarSolicitud.php`, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      },
      body: JSON.stringify({
        idsol: idSoli,
      }),

    })

      .then((response) => {


        if (!response.ok || response.status != 200 || response.status != '200') {
          ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
          //setLoad(prev => false);

        } else {
          response.json()
            .then(responser => {
              console.log('3')
              console.log(responser);
              if (responser === 'exito') {
                ModalOptions('Exito', 'Solicitud rechazada', 'Rechazaste la solicitud de envío', 'close');
              } else {
                ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
              }


              //setLoad(prev => false);
            })
        }

      })
      .catch((error) => {
        console.log(error)
        ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
        //setLoad(prev => false);

      });
  }
  fetchPagoViajeLargoEspecial = (x) => {

    console.log('Mostrar viaje pagado')
    if (viajeLargoEspecial != '') {
      console.log('Mostrar viaje pagado 2')
      console.log(viajeLargoEspecial[0].idviaje)
      console.log(viajeLargoEspecial[0].idcamionero)
      fetch(`${ServidorExport}/partner/viajelargoespecial/AvisoPagoViajeLargoEspecial.php`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idviaje: viajeLargoEspecial[0].idviaje,
          idcamionero: viajeLargoEspecial[0].idcamionero,
        })
      })
        .then((response) => {
          if (!response.ok || response.status != 200 || response.status != '200') {
            setConexionErr(true)
          } else {
            response.json()
              .then(responser => {
                console.log(responser + ' <---- para aviso de pago')
                if (responser != 'No Results Found.') {
                  setAvisoPagoViajeLargoEspecial(responser)

                  showBottomDos()
                } else {


                }
              })
          }

        })
        .catch((error) => {
          setConexionErr(true)
        });
    }

  }

  //VIAJE CORTO ESPECIAL
  fetchSolicitudesViajeCortoEspecial = (x) => {
    fetch(`${ServidorExport}/partner/viajecortoespecial/SearchMatches.php`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: x,
      })
    })
      .then((response) => {
        if (!response.ok || response.status != 200 || response.status != '200') {
          setConexionErr(true)
        } else {
          response.json()
            .then(responser => {
              console.log(responser + 'Check Matches')
              console.log(responser[0].origen)
              if (responser != 'No hay') {
                setDataSourceViajeCortoEspecial(responser)

                showBottom()
              } else {


              }
            })
        }

      })
      .catch((error) => {
        setConexionErr(true)
      });
  }
  rechazarSolViajeCortoEspecial = (idSoli) => {
    fetch(`https://www.convey.cl/partner/viajecortoespecial/RechazarSolicitud.php`, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      },
      body: JSON.stringify({
        idsol: idSoli,
      }),

    })

      .then((response) => {


        if (!response.ok || response.status != 200 || response.status != '200') {
          ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
          //setLoad(prev => false);

        } else {
          response.json()
            .then(responser => {
              console.log('3')
              console.log(responser);
              if (responser === 'exito') {
                ModalOptions('Exito', 'Solicitud rechazada', 'Rechazaste la solicitud de envío', 'close');
              } else {
                ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
              }


              //setLoad(prev => false);
            })
        }

      })
      .catch((error) => {
        console.log(error)
        ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
        //setLoad(prev => false);

      });
  }
  fetchPagoViajeCortoEspecial = (x) => {

    console.log('Mostrar viaje pagado')
    if (viajeCortoEspecial != '') {
      console.log('Mostrar viaje pagado viaje corto especial')
      console.log(viajeCortoEspecial[0].idviaje)
      console.log(viajeCortoEspecial[0].idcamionero)
      fetch(`${ServidorExport}/partner/viajecortoespecial/AvisoPagoViajeCortoEspecial.php`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idviaje: viajeCortoEspecial[0].idviaje,
          idcamionero: viajeCortoEspecial[0].idcamionero,
        })
      })
        .then((response) => {
          if (!response.ok || response.status != 200 || response.status != '200') {
            setConexionErr(true)
          } else {
            response.json()
              .then(responser => {
                console.log(responser + ' <---- para aviso de pago')
                if (responser != 'No Results Found.') {
                  setAvisoPagoViajeCortoEspecial(responser)

                  showBottomDos()
                } else {


                }
              })
          }

        })
        .catch((error) => {
          setConexionErr(true)
        });
    }

  }

  toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);

    if (isEnabled) {
      turnSwitch('false')
    } else {
      turnSwitch('true')
    }
  }


  function turnSwitch(x) {
    console.log(x)
    console.log(correoUser)
    setActivityShow(true)
    fetch(`${ServidorExport}/partner/TurnServicio.php`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usr: correoUser,
        turn: x
      })
    })
      .then((response) => {
        if (!response.ok || response.status != 200 || response.status != '200') {
          ModalOptions('Error', 'Ooops!', 'Hubo un problema, intenta nuevamente', 'close')
          setActivityShow(false)
          setIsEnabled(previousState => !previousState);
        } else {
          response.json()
            .then(responser => {
              console.log(responser)
              if (responser == 'exito') {

                if (x == 'false') {
                  ModalOptions('Exito', 'Exito!', 'Desactivaste el servicio', 'close')
                }
                if (x == 'true') {
                  ModalOptions('Exito', 'Exito!', 'Activaste el servicio', 'close')
                }

                setActivityShow(false)
              } else {
                setActivityShow(false)
                ModalOptions('Error', 'Ooops!', 'Hubo un problema, intenta nuevamente', 'close')
                setIsEnabled(previousState => !previousState);

              }

            })
        }

      })
      .catch((error) => {
        ModalOptions('Error', 'Ooops!', 'Hubo un problema, intenta nuevamente', 'close')
        setActivityShow(false)
        setIsEnabled(previousState => !previousState);
      });

  }
  const salir = () => {
    signOut()

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


  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [slideAnim] = React.useState(new Animated.Value(-width));
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const openMenu = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsMenuOpen(false);
    });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      const { dx } = gestureState;
      if (dx > 0 && !isMenuOpen) {
        openMenu();
      }
      if (dx < -50 && isMenuOpen) {
        closeMenu();
      }
    },
    onPanResponderRelease: (event, gestureState) => {
      if (gestureState.dx < 50 && isMenuOpen) {
        closeMenu();
      }
    },
  });

  const menuPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderRelease: (event, gestureState) => {
      const { dx } = gestureState;
      if (dx < -50 && isMenuOpen) {
        closeMenu();
      }
    },
  });

  passToLargo = (data) => {
    this.RBSheet.close()
    navigation.navigate('CrearViajeLargo', { InfoUser: data })
  }

  passToCorto = (data) => {

    this.RBSheet.close()
    navigation.navigate('CrearViajeCorto', { InfoUser: data })
  }

  passToGrua = (data) => {

    this.RBSheet.close()
    navigation.navigate('CrearViajeGrua', { InfoUser: data })
  }

  passToEspecials = (data) => {
    this.RBSheet.close()
    navigation.navigate('SelectCargaEspecial', { InfoUser: data })

  }

  renderSekeleton = () => {
    // if(showSkeleton == true){
    return (
      <View style={{ width: '100%', height: '100%', flex: 1, position: 'absolute', zIndex: 99, backgroundColor: '#fff', }}>
        <View
          style={{
            height: Constants.statusBarHeight,
            width: '100%',
            marginBottom: 5,
          }} />



        <View style={{ flex: 1, width: '100%', paddingHorizontal: 15 }}>
          <Skeleton height={70} width={'100%'} style={{ marginTop: 20, borderRadius: 10 }} />
          <Skeleton height={70} width={'90%'} style={{ marginTop: 20, borderRadius: 10, alignSelf: 'center' }} />

          <Skeleton height={200} width={'90%'} style={{ marginTop: 20, borderRadius: 10, alignSelf: 'center' }} />
        </View>


        <View style={{ width: '100%', position: 'absolute', bottom: 0, }}>
          <SafeAreaView style={{ width: '100%' }}>
            <Skeleton height={150} width={'90%'} style={{ borderRadius: 10, alignSelf: 'center' }} />
          </SafeAreaView>
        </View>













      </View>
    )
    //}
  }

  rendMapCorrect = () => {
    console.log(location + ' jai')
    if (location != null) {
      return (
        <MapView
          provider="google"
          style={styles.mapStyle}
          showsUserLocation={true}
          region={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: location.coords.latitudeDelta,
            longitudeDelta: location.coords.longitudeDelta,
          }}
        ></MapView>
      )
    } else {
      return (
        <View>
          <Text>No podemos mostrar el mapa si no compartes tu ubicación</Text>
        </View>
      )
    }
  }

  cambiarEstadoViaje = (idviaje, status) => {

    fetch(`${ServidorExport}/partner/viajelargo/CambiarStatusViaje.php`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idviaje: idviaje,
        status: status

      })

    })

      .then((response) => {


        if (!response.ok || response.status != 200 || response.status != '200') {
          ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
          setHola('0')

        } else {
          response.json()
            .then(responser => {
              console.log(responser)
              console.log('3')
              console.log(responser[0].status);
              console.log(responser[0].cargas)

              if (responser[0].status === 'ok') {
                fetchPrincipal(correoUser)

                responser[0].cargas.forEach(function (carga) {
                  socket.emit("EstadoChangeSend", {
                    cliente: carga.correo,
                    idcarga: carga.idcarga,
                    estado: status,
                  });
                  //console.log(carga.correo);
                });




                ModalOptions('Exito', 'Cambio de estado', 'Cambiaste el estado del viaje', 'close');
              } else if (responser[0].status === 'faltan cargas') {
                ModalOptions('Error', 'Faltan cargas', 'Hay cargas esperando por ser subidas', 'close');
              } else if (responser[0].status === 'faltan cargas entregar') {
                ModalOptions('Error', 'Faltan cargas', 'Hay cargas esperando por ser entregadas', 'close');
              } else {
                ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
              }



            })
        }

      })
      .catch((error) => {
        console.log(error)
        ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
        setHola('0')

      });


  }
  cambiarEstadoViajeCorto = (idviaje, status) => {

    fetch(`${ServidorExport}/partner/viajecorto/CambiarStatusViaje.php`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idviaje: idviaje,
        status: status

      })

    })

      .then((response) => {


        if (!response.ok || response.status != 200 || response.status != '200') {
          ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
          setHola('0')

        } else {
          response.json()
            .then(responser => {
              console.log(responser)
              console.log('3')
              console.log(responser[0].status);
              console.log(responser[0].cargas)

              if (responser[0].status === 'ok') {
                fetchPrincipal(correoUser)

                responser[0].cargas.forEach(function (carga) {
                  socket.emit("EstadoChangeSend", {
                    cliente: carga.correo,
                    idcarga: carga.idcarga,
                    estado: status,
                  });
                  //console.log(carga.correo);
                });




                ModalOptions('Exito', 'Cambio de estado', 'Cambiaste el estado del viaje', 'close');
              } else if (responser[0].status === 'faltan cargas') {
                ModalOptions('Error', 'Faltan cargas', 'Hay cargas esperando por ser subidas', 'close');
              } else if (responser[0].status === 'faltan cargas entregar') {
                ModalOptions('Error', 'Faltan cargas', 'Hay cargas esperando por ser entregadas', 'close');
              } else {
                ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
              }



            })
        }

      })
      .catch((error) => {
        console.log(error)
        ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
        setHola('0')

      });


  }
  cambiarEstadoViajeGrua = (idviaje, status) => {

    fetch(`${ServidorExport}/partner/viajegrua/CambiarStatusViaje.php`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idviaje: idviaje,
        status: status

      })

    })

      .then((response) => {


        if (!response.ok || response.status != 200 || response.status != '200') {
          ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
          setHola('0')

        } else {
          response.json()
            .then(responser => {
              console.log(responser)
              console.log('3')
              console.log(responser[0].status);
              console.log(responser[0].cargas)

              if (responser[0].status === 'ok') {
                fetchPrincipal(correoUser)

                responser[0].cargas.forEach(function (carga) {
                  socket.emit("EstadoChangeSend", {
                    cliente: carga.correo,
                    idcarga: carga.idcarga,
                    estado: status,
                  });
                  //console.log(carga.correo);
                });




                ModalOptions('Exito', 'Cambio de estado', 'Cambiaste el estado del viaje', 'close');
              } else if (responser[0].status === 'faltan cargas') {
                ModalOptions('Error', 'Faltan cargas', 'Hay cargas esperando por ser subidas', 'close');
              } else if (responser[0].status === 'faltan cargas entregar') {
                ModalOptions('Error', 'Faltan cargas', 'Hay cargas esperando por ser entregadas', 'close');
              } else {
                ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
              }



            })
        }

      })
      .catch((error) => {
        console.log(error)
        ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
        setHola('0')

      });


  }
  cambiarEstadoViajeLargoEspecial = (idviaje, status) => {

    fetch(`${ServidorExport}/partner/viajelargoespecial/CambiarStatusViaje.php`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idviaje: idviaje,
        status: status

      })

    })

      .then((response) => {


        if (!response.ok || response.status != 200 || response.status != '200') {
          ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
          setHola('0')

        } else {
          response.json()
            .then(responser => {
              console.log(responser)
              console.log('3')
              console.log(responser[0].status);
              console.log(responser[0].cargas)

              if (responser[0].status === 'ok') {
                fetchPrincipal(correoUser)

                responser[0].cargas.forEach(function (carga) {
                  socket.emit("EstadoChangeSend", {
                    cliente: carga.correo,
                    idcarga: carga.idcarga,
                    estado: status,
                  });
                  //console.log(carga.correo);
                });




                ModalOptions('Exito', 'Cambio de estado', 'Cambiaste el estado del viaje', 'close');
              } else if (responser[0].status === 'faltan cargas') {
                ModalOptions('Error', 'Faltan cargas', 'Hay cargas esperando por ser subidas', 'close');
              } else if (responser[0].status === 'faltan cargas entregar') {
                ModalOptions('Error', 'Faltan cargas', 'Hay cargas esperando por ser entregadas', 'close');
              } else {
                ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
              }



            })
        }

      })
      .catch((error) => {
        console.log(error)
        ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
        setHola('0')

      });


  }
  cambiarEstadoViajeCortoEspecial = (idviaje, status) => {

    fetch(`${ServidorExport}/partner/viajecortoespecial/CambiarStatusViaje.php`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idviaje: idviaje,
        status: status

      })

    })

      .then((response) => {


        if (!response.ok || response.status != 200 || response.status != '200') {
          ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
          setHola('0')

        } else {
          response.json()
            .then(responser => {
              console.log(responser)
              console.log('3')
              console.log(responser[0].status);
              console.log(responser[0].cargas)

              if (responser[0].status === 'ok') {
                fetchPrincipal(correoUser)

                responser[0].cargas.forEach(function (carga) {
                  socket.emit("EstadoChangeSend", {
                    cliente: carga.correo,
                    idcarga: carga.idcarga,
                    estado: status,
                  });
                  //console.log(carga.correo);
                });




                ModalOptions('Exito', 'Cambio de estado', 'Cambiaste el estado del viaje', 'close');
              } else if (responser[0].status === 'faltan cargas') {
                ModalOptions('Error', 'Faltan cargas', 'Hay cargas esperando por ser subidas', 'close');
              } else if (responser[0].status === 'faltan cargas entregar') {
                ModalOptions('Error', 'Faltan cargas', 'Hay cargas esperando por ser entregadas', 'close');
              } else {
                ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
              }



            })
        }

      })
      .catch((error) => {
        console.log(error)
        ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente', 'close');
        setHola('0')

      });


  }

  renderStatusBtn = (idviaje, status) => {

    if (status == 'activo') {
      return (
        <View style={{ width: '100%', justifyContent: 'flex-start', flexDirection: 'row', paddingHorizontal: 10 }}>
          <TouchableOpacity style={{ padding: 10, borderRadius: 9, backgroundColor: '#07E607', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Activo</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => cambiarEstadoViaje(idviaje, 'enruta')} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>En ruta</Text>
          </TouchableOpacity>
          <View style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Retraso</Text>
          </View>
          <View style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Finalizar</Text>
          </View>
        </View>
      )
    } else if (status == 'enruta') {
      return (
        <View style={{ width: '100%', justifyContent: 'flex-start', flexDirection: 'row', paddingHorizontal: 10 }}>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Activo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 10, borderRadius: 9, backgroundColor: '#07E607', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>En ruta</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => { cambiarEstadoViaje(idviaje, 'retraso') }} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Retraso</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => { cambiarEstadoViaje(idviaje, 'finalizado') }} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (status == 'retraso') {
      return (
        <View style={{ width: '100%', justifyContent: 'flex-start', flexDirection: 'row', paddingHorizontal: 10 }}>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Activo</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => { cambiarEstadoViaje(idviaje, 'enruta') }} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>En ruta</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => cambiarEstadoViaje(idviaje, 'retrazo')} style={{ padding: 10, borderRadius: 9, backgroundColor: '#07E607', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Retraso</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => { cambiarEstadoViaje(idviaje, 'finalizado') }} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (status == 'finalizado') {
      return (
        <View style={{ width: '100%', justifyContent: 'flex-start', flexDirection: 'row', paddingHorizontal: 10 }}>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Activo</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>En ruta</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Retraso</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 10, borderRadius: 9, backgroundColor: '#07E607', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      )
    }

  }

  renderStatusBtnViajeCorto = (idviaje, status) => {

    if (status == 'activo') {
      return (
        <View style={{ width: '100%', justifyContent: 'flex-start', flexDirection: 'row', paddingHorizontal: 10 }}>
          <TouchableOpacity style={{ padding: 10, borderRadius: 9, backgroundColor: '#07E607', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Activo</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => cambiarEstadoViajeCorto(idviaje, 'enruta')} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>En ruta</Text>
          </TouchableOpacity>
          <View style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Retraso</Text>
          </View>
          <View style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Finalizar</Text>
          </View>
        </View>
      )
    } else if (status == 'enruta') {
      return (
        <View style={{ width: '100%', justifyContent: 'flex-start', flexDirection: 'row', paddingHorizontal: 10 }}>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Activo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 10, borderRadius: 9, backgroundColor: '#07E607', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>En ruta</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => { cambiarEstadoViajeCorto(idviaje, 'retraso') }} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Retraso</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => { cambiarEstadoViajeCorto(idviaje, 'finalizado') }} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (status == 'retraso') {
      return (
        <View style={{ width: '100%', justifyContent: 'flex-start', flexDirection: 'row', paddingHorizontal: 10 }}>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Activo</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => { cambiarEstadoViajeCorto(idviaje, 'enruta') }} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>En ruta</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => cambiarEstadoViajeCorto(idviaje, 'retrazo')} style={{ padding: 10, borderRadius: 9, backgroundColor: '#07E607', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Retraso</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => { cambiarEstadoViajeCorto(idviaje, 'finalizado') }} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (status == 'finalizado') {
      return (
        <View style={{ width: '100%', justifyContent: 'flex-start', flexDirection: 'row', paddingHorizontal: 10 }}>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Activo</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>En ruta</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Retraso</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 10, borderRadius: 9, backgroundColor: '#07E607', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      )
    }

  }

  renderStatusBtnViajeGrua = (idviaje, status) => {

    if (status == 'activo') {
      return (
        <View style={{ width: '100%', justifyContent: 'flex-start', flexDirection: 'row', paddingHorizontal: 10 }}>
          <TouchableOpacity style={{ padding: 10, borderRadius: 9, backgroundColor: '#07E607', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Activo</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => cambiarEstadoViajeGrua(idviaje, 'enruta')} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>En ruta</Text>
          </TouchableOpacity>
          <View style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Retraso</Text>
          </View>
          <View style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Finalizar</Text>
          </View>
        </View>
      )
    } else if (status == 'enruta') {
      return (
        <View style={{ width: '100%', justifyContent: 'flex-start', flexDirection: 'row', paddingHorizontal: 10 }}>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Activo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 10, borderRadius: 9, backgroundColor: '#07E607', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>En ruta</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => { cambiarEstadoViajeGrua(idviaje, 'retraso') }} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Retraso</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => { cambiarEstadoViajeGrua(idviaje, 'finalizado') }} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (status == 'retraso') {
      return (
        <View style={{ width: '100%', justifyContent: 'flex-start', flexDirection: 'row', paddingHorizontal: 10 }}>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Activo</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => { cambiarEstadoViajeGrua(idviaje, 'enruta') }} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>En ruta</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => cambiarEstadoViajeGrua(idviaje, 'retrazo')} style={{ padding: 10, borderRadius: 9, backgroundColor: '#07E607', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Retraso</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => { cambiarEstadoViajeGrua(idviaje, 'finalizado') }} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (status == 'finalizado') {
      return (
        <View style={{ width: '100%', justifyContent: 'flex-start', flexDirection: 'row', paddingHorizontal: 10 }}>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Activo</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>En ruta</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Retraso</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 10, borderRadius: 9, backgroundColor: '#07E607', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      )
    }

  }

  renderStatusBtnViajeLargoEspecial = (idviaje, status) => {

    if (status == 'activo') {
      return (
        <View style={{ width: '100%', justifyContent: 'flex-start', flexDirection: 'row', paddingHorizontal: 10 }}>
          <TouchableOpacity style={{ padding: 10, borderRadius: 9, backgroundColor: '#07E607', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Activo</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => cambiarEstadoViajeLargoEspecial(idviaje, 'enruta')} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>En ruta</Text>
          </TouchableOpacity>
          <View style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Retraso</Text>
          </View>
          <View style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Finalizar</Text>
          </View>
        </View>
      )
    } else if (status == 'enruta') {
      return (
        <View style={{ width: '100%', justifyContent: 'flex-start', flexDirection: 'row', paddingHorizontal: 10 }}>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Activo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 10, borderRadius: 9, backgroundColor: '#07E607', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>En ruta</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => { cambiarEstadoViajeLargoEspecial(idviaje, 'retraso') }} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Retraso</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => { cambiarEstadoViajeLargoEspecial(idviaje, 'finalizado') }} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (status == 'retraso') {
      return (
        <View style={{ width: '100%', justifyContent: 'flex-start', flexDirection: 'row', paddingHorizontal: 10 }}>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Activo</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => { cambiarEstadoViajeLargoEspecial(idviaje, 'enruta') }} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>En ruta</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => cambiarEstadoViajeLargoEspecial(idviaje, 'retrazo')} style={{ padding: 10, borderRadius: 9, backgroundColor: '#07E607', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Retraso</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => { cambiarEstadoViajeLargoEspecial(idviaje, 'finalizado') }} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (status == 'finalizado') {
      return (
        <View style={{ width: '100%', justifyContent: 'flex-start', flexDirection: 'row', paddingHorizontal: 10 }}>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Activo</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>En ruta</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Retraso</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 10, borderRadius: 9, backgroundColor: '#07E607', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      )
    }

  }


  renderStatusBtnViajeCortoEspecial = (idviaje, status) => {

    if (status == 'activo') {
      return (
        <View style={{ width: '100%', justifyContent: 'flex-start', flexDirection: 'row', paddingHorizontal: 10 }}>
          <TouchableOpacity style={{ padding: 10, borderRadius: 9, backgroundColor: '#07E607', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Activo</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => cambiarEstadoViajeCortoEspecial(idviaje, 'enruta')} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>En ruta</Text>
          </TouchableOpacity>
          <View style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Retraso</Text>
          </View>
          <View style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Finalizar</Text>
          </View>
        </View>
      )
    } else if (status == 'enruta') {
      return (
        <View style={{ width: '100%', justifyContent: 'flex-start', flexDirection: 'row', paddingHorizontal: 10 }}>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Activo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 10, borderRadius: 9, backgroundColor: '#07E607', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>En ruta</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => { cambiarEstadoViajeCortoEspecial(idviaje, 'retraso') }} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Retraso</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => { cambiarEstadoViajeCortoEspecial(idviaje, 'finalizado') }} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (status == 'retraso') {
      return (
        <View style={{ width: '100%', justifyContent: 'flex-start', flexDirection: 'row', paddingHorizontal: 10 }}>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Activo</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => { cambiarEstadoViajeCortoEspecial(idviaje, 'enruta') }} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>En ruta</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => cambiarEstadoViajeCortoEspecial(idviaje, 'retrazo')} style={{ padding: 10, borderRadius: 9, backgroundColor: '#07E607', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Retraso</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={() => { cambiarEstadoViajeCortoEspecial(idviaje, 'finalizado') }} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (status == 'finalizado') {
      return (
        <View style={{ width: '100%', justifyContent: 'flex-start', flexDirection: 'row', paddingHorizontal: 10 }}>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Activo</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>En ruta</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={{ padding: 10, borderRadius: 9, backgroundColor: '#D3DFF2', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Retraso</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 10, borderRadius: 9, backgroundColor: '#07E607', marginRight: 15, }}>
            <Text style={{ color: '#313131', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      )
    }

  }

  const mapRef = React.useRef(null);  // Crear una referencia al mapa
  const [locationSearch, setLocationSearch] = React.useState(null);
  const handleFindMyLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let userLocation = await Location.getCurrentPositionAsync({});
    const newLocation = {
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
      latitudeDelta: 0.01,  // Valores ajustados para un zoom adecuado
      longitudeDelta: 0.01,
    };

    // Actualizar el estado de la ubicación
    setLocationSearch(newLocation); // Cambié 'setLocation' a 'setLocationSearch'

    // Centrar el mapa en la ubicación del usuario
    mapRef.current.animateToRegion(newLocation, 1000); // 1000ms para animar el enfoque
  };


  const mapRefDos = React.useRef(null);  // Crear una referencia al mapa
  const [locationSearchDos, setLocationSearchDos] = React.useState(null);
  const handleFindMyLocationDos = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let userLocation = await Location.getCurrentPositionAsync({});
    const newLocationDos = {
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
      latitudeDelta: 0.01,  // Valores ajustados para un zoom adecuado
      longitudeDelta: 0.01,
    };

    // Actualizar el estado de la ubicación
    setLocationSearchDos(newLocationDos); // Cambié 'setLocation' a 'setLocationSearch'

    // Centrar el mapa en la ubicación del usuario
    mapRefDos.current.animateToRegion(newLocationDos, 1000); // 1000ms para animar el enfoque
  };

  const mapRefTres = React.useRef(null);  // Crear una referencia al mapa
  const [locationSearchTres, setLocationSearchTres] = React.useState(null);
  const handleFindMyLocationTres = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let userLocation = await Location.getCurrentPositionAsync({});
    const newLocationTres = {
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
      latitudeDelta: 0.01,  // Valores ajustados para un zoom adecuado
      longitudeDelta: 0.01,
    };

    // Actualizar el estado de la ubicación
    setLocationSearchTres(newLocationTres);

    // Centrar el mapa en la ubicación del usuario
    mapRefTres.current.animateToRegion(newLocationTres, 1000); // 1000ms para animar el enfoque
  };

  const mapRefCuatro = React.useRef(null);  // Crear una referencia al mapa
  const [locationSearchCuatro, setLocationSearchCuatro] = React.useState(null);
  const handleFindMyLocationCuatro = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let userLocation = await Location.getCurrentPositionAsync({});
    const newLocationCuatro = {
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
      latitudeDelta: 0.01,  // Valores ajustados para un zoom adecuado
      longitudeDelta: 0.01,
    };

    // Actualizar el estado de la ubicación
    setLocationSearchCuatro(newLocationCuatro);

    // Centrar el mapa en la ubicación del usuario
    mapRefCuatro.current.animateToRegion(newLocationCuatro, 1000);
  };

  const mapRefCinco = React.useRef(null);  // Crear una referencia al mapa
  const [locationSearchCinco, setLocationSearchCinco] = React.useState(null);
  const handleFindMyLocationCinco = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let userLocation = await Location.getCurrentPositionAsync({});
    const newLocationCinco = {
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
      latitudeDelta: 0.01,  // Valores ajustados para un zoom adecuado
      longitudeDelta: 0.01,
    };

    // Actualizar el estado de la ubicación
    setLocationSearchCinco(newLocationCinco);

    // Centrar el mapa en la ubicación del usuario
    mapRefCinco.current.animateToRegion(newLocationCinco, 1000);
  };

  const mapRefSeis = React.useRef(null);  // Crear una referencia al mapa
  const [locationSearchSeis, setLocationSearchSeis] = React.useState(null);
  const handleFindMyLocationSeis = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let userLocation = await Location.getCurrentPositionAsync({});
    const newLocationSeis = {
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
      latitudeDelta: 0.01,  // Valores ajustados para un zoom adecuado
      longitudeDelta: 0.01,
    };

    // Actualizar el estado de la ubicación
    setLocationSearchSeis(newLocationSeis);

    // Centrar el mapa en la ubicación del usuario
    mapRefSeis.current.animateToRegion(newLocationSeis, 1000);
  };



  returnViajesControles = (data) => {
    if (viajeLargo != '') {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="#fff"
            translucent={true}
          />

          <View
            style={{
              backgroundColor: Platform.OS === 'ios' ? '#fff' : '#fff',
              height: Constants.statusBarHeight,
              width: '100%',
            }} />


          <View style={{ width: '100%', backgroundColor: '#fff', paddingHorizontal: 10, borderRadius: 10, }}>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', }}>
              <TouchableOpacity activeOpacity={1} style={{ width: '10%' }} onPress={isMenuOpen ? closeMenu : openMenu}>
                <Image
                  style={{
                    alignSelf: 'flex-start',
                    width: fontWidth / 13,
                    height: fontWidth / 13,
                    marginBottom: 0,
                  }}
                  source={require('./assets/menuSide.png')}
                />
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '30%', backgroundColor: '#fff' }}>
                <TouchableOpacity onPress={() => navigation.navigate('Configuracion')} activeOpacity={1} style={{ flex: 1 }}>
                  <FontAwesome5 name="cog" size={fontWidth / 18} color="#3C3C3C" />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => navigation.navigate('Notis')}>
                  <Octicons name="bell-fill" size={fontWidth / 18} color="#3C3C3C" />
                  <View style={{ marginLeft: 15, position: 'absolute' }}>
                    {renderDotNoti()}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => navigation.navigate('Mensajes')}>
                  <Entypo name="mail" size={fontWidth / 18} color="#3C3C3C" />
                  <View style={{ marginLeft: 15, position: 'absolute' }}>
                    {renderDotMensaje()}
                  </View>
                </TouchableOpacity>
              </View>
            </View>



            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, }}>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 19 }}>Bienvenido, José</Text>

              <Switch
                trackColor={{ false: '#767577', true: '#68C151' }}
                thumbColor={isEnabled ? '#E6F14B' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
          </View>





          <View style={{ flex: 7, paddingHorizontal: 10, marginTop: 10 }}>
            <MapView
              style={{ width: '100%', height: '100%', borderRadius: 10, flex: 1 }}
              provider="google"
              ref={mapRefDos}
              region={locationSearchDos}
              showsUserLocation={true}
              showsMyLocationButton={false}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                alignSelf: 'flex-end',
                backgroundColor: '#fff',
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 2,
                elevation: 5,
                marginTop: 10,
                position: 'absolute', // Posicionar el botón sobre el mapa
                right: 15,
                top: 0,
              }}
              onPress={handleFindMyLocationDos}
            >
              <FontAwesome name="location-arrow" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>


          <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: '#fff', paddingTop: 10 }}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#343434', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Estados del viaje</Text>

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

            {renderStatusBtn(viajeLargo[0].idviaje, viajeLargo[0].estado)}

          </View>





          <View style={{ flex: 3 }}>
            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
              showsVerticalScrollIndicator={false}
            >

              <View style={{ paddingHorizontal: 10, paddingVertical: 10, backgroundColor: '#fff', marginTop: 10, }}>
                <Text style={{ color: '#343434', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29, }}>Datos del viaje</Text>
              </View>


              <View style={{ width: '100%', paddingHorizontal: 10, }}>

                <TouchableOpacity onPress={() => navigation.navigate('DetalleViajeLargo', { InfoUser: data, InfoViaje: viajeLargo })} DetalleViajeLargo style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 8, borderRadius: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, }}>

                  <View style={{ flex: 1 }}>
                    <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                      loop
                      bounce
                      repeatSpacer={50}
                      marqueeDelay={2000}>{viajeLargo[0].desde}</TextTicker>
                    <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                      loop
                      bounce
                      repeatSpacer={50}
                      marqueeDelay={2000}>{viajeLargo[0].fechainicio}</TextTicker>
                  </View>

                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 35, marginBottom: 15, }}>Viaje largo</Text>
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
                      marqueeDelay={2000}>{viajeLargo[0].hasta}</TextTicker>
                    <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                      loop
                      bounce
                      repeatSpacer={50}
                      marqueeDelay={2000}>{viajeLargo[0].fechafin}</TextTicker>
                  </View>

                </TouchableOpacity>

              </View>

            </ScrollView>
          </View>

        </View>
      )

    }
    else if (viajeCorto != '') {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="#fff"
            translucent={true}
          />

          <View
            style={{
              backgroundColor: Platform.OS === 'ios' ? '#fff' : '#fff',
              height: Constants.statusBarHeight,
              width: '100%',
            }}
          />

          {/* Encabezado */}
          <View style={{ width: '100%', backgroundColor: '#fff', paddingHorizontal: 10, borderRadius: 10 }}>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity activeOpacity={1} style={{ width: '10%' }} onPress={isMenuOpen ? closeMenu : openMenu}>
                <Image
                  style={{
                    alignSelf: 'flex-start',
                    width: fontWidth / 13,
                    height: fontWidth / 13,
                  }}
                  source={require('./assets/menuSide.png')}
                />
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '30%', backgroundColor: '#fff' }}>
                <TouchableOpacity onPress={() => navigation.navigate('Configuracion')} activeOpacity={1} style={{ flex: 1 }}>
                  <FontAwesome5 name="cog" size={fontWidth / 18} color="#3C3C3C" />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => navigation.navigate('Notis')}>
                  <Octicons name="bell-fill" size={fontWidth / 18} color="#3C3C3C" />
                  <View style={{ marginLeft: 15, position: 'absolute' }}>{renderDotNoti()}</View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => navigation.navigate('Mensajes')}>
                  <Entypo name="mail" size={fontWidth / 18} color="#3C3C3C" />
                  <View style={{ marginLeft: 15, position: 'absolute' }}>{renderDotMensaje()}</View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 19 }}>Bienvenido, José</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#68C151' }}
                thumbColor={isEnabled ? '#E6F14B' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
          </View>

          {/* Mapa */}
          <View style={{ flex: 7, paddingHorizontal: 10, marginTop: 10 }}>
            <MapView
              style={{ width: '100%', height: '100%', borderRadius: 10 }}
              provider="google"
              ref={mapRefTres}
              region={locationSearchTres}
              showsUserLocation={true}
              showsMyLocationButton={false}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                alignSelf: 'flex-end',
                backgroundColor: '#fff',
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 2,
                elevation: 5,
                position: 'absolute',
                right: 15,
                top: 0,
              }}
              onPress={handleFindMyLocationTres}
            >
              <FontAwesome name="location-arrow" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>

          {/* Estados del viaje */}
          <View style={{ paddingHorizontal: 10, backgroundColor: '#fff', paddingTop: 10, paddingBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#343434', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29 }}>Estados del viaje</Text>
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
            {renderStatusBtnViajeCorto(viajeCorto[0].idviaje, viajeCorto[0].estado)}
          </View>

          {/* Datos del viaje */}
          <View style={{ flex: 3 }}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }} showsVerticalScrollIndicator={false}>
              <View style={{ paddingHorizontal: 10, paddingVertical: 10, backgroundColor: '#fff', marginTop: 10 }}>
                <Text style={{ color: '#343434', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29 }}>Datos del viaje</Text>
              </View>

              <View style={{ width: '100%', paddingHorizontal: 10 }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('DetalleViajeCorto', { InfoUser: data, InfoViaje: viajeCorto })}
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#fff',
                    padding: 8,
                    borderRadius: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                      <Entypo name="location-pin" size={fontWidth / 20} color="#07E607" />
                      <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, marginLeft: 5 }}>
                        {viajeCorto[0].lugarinicio}
                      </Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, marginRight: 10 }}>
                        {viajeCorto[0].radio}Km
                      </Text>

                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      );
    }

    else if (viajeGrua != '') {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="#fff"
            translucent={true}
          />

          <View
            style={{
              backgroundColor: Platform.OS === 'ios' ? '#fff' : '#fff',
              height: Constants.statusBarHeight,
              width: '100%',
            }}
          />

          {/* Encabezado */}
          <View style={{ width: '100%', backgroundColor: '#fff', paddingHorizontal: 10, borderRadius: 10 }}>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity activeOpacity={1} style={{ width: '10%' }} onPress={isMenuOpen ? closeMenu : openMenu}>
                <Image
                  style={{
                    alignSelf: 'flex-start',
                    width: fontWidth / 13,
                    height: fontWidth / 13,
                  }}
                  source={require('./assets/menuSide.png')}
                />
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '30%', backgroundColor: '#fff' }}>
                <TouchableOpacity onPress={() => navigation.navigate('Configuracion')} activeOpacity={1} style={{ flex: 1 }}>
                  <FontAwesome5 name="cog" size={fontWidth / 18} color="#3C3C3C" />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => navigation.navigate('Notis')}>
                  <Octicons name="bell-fill" size={fontWidth / 18} color="#3C3C3C" />
                  <View style={{ marginLeft: 15, position: 'absolute' }}>{renderDotNoti()}</View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => navigation.navigate('Mensajes')}>
                  <Entypo name="mail" size={fontWidth / 18} color="#3C3C3C" />
                  <View style={{ marginLeft: 15, position: 'absolute' }}>{renderDotMensaje()}</View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 19 }}>Bienvenido, José</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#68C151' }}
                thumbColor={isEnabled ? '#E6F14B' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
          </View>

          {/* Mapa */}
          <View style={{ flex: 7, paddingHorizontal: 10, marginTop: 10 }}>
            <MapView
              style={{ width: '100%', height: '100%', borderRadius: 10 }}
              provider="google"
              ref={mapRefCuatro}
              region={locationSearchCuatro}
              showsUserLocation={true}
              showsMyLocationButton={false}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                alignSelf: 'flex-end',
                backgroundColor: '#fff',
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 2,
                elevation: 5,
                position: 'absolute',
                right: 15,
                top: 0,
              }}
              onPress={handleFindMyLocationCuatro}
            >
              <FontAwesome name="location-arrow" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>

          {/* Estados del viaje */}
          <View style={{ paddingHorizontal: 10, backgroundColor: '#fff', paddingTop: 10, paddingBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#343434', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29 }}>Estados del viaje</Text>
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
            {renderStatusBtnViajeGrua(viajeGrua[0].idviaje, viajeGrua[0].estado)}
          </View>

          {/* Datos del viaje */}
          <View style={{ flex: 3 }}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }} showsVerticalScrollIndicator={false}>
              <View style={{ paddingHorizontal: 10, paddingVertical: 10, backgroundColor: '#fff', marginTop: 10 }}>
                <Text style={{ color: '#343434', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29 }}>
                  Datos del viaje
                </Text>
              </View>

              <View style={{ width: '100%', paddingHorizontal: 10 }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('DetalleViajeGrua', { InfoUser: data, InfoViaje: viajeGrua })}
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#fff',
                    padding: 8,
                    borderRadius: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                      <Entypo name="location-pin" size={fontWidth / 20} color="#07E607" />
                      <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, marginLeft: 5 }}>
                        {viajeGrua[0].lugarinicio}
                      </Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, marginRight: 10 }}>
                        {viajeGrua[0].radio}Km
                      </Text>
                      {/* <FontAwesome6 name="edit" size={fontWidth / 20} color="#07E607" /> */}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      );
    }

    else if (viajeLargoEspecial != '') {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={true} />

          <View
            style={{
              backgroundColor: Platform.OS === 'ios' ? '#fff' : '#fff',
              height: Constants.statusBarHeight,
              width: '100%',
            }}
          />

          {/* Encabezado */}
          <View style={{ width: '100%', backgroundColor: '#fff', paddingHorizontal: 10, borderRadius: 10 }}>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity activeOpacity={1} style={{ width: '10%' }} onPress={isMenuOpen ? closeMenu : openMenu}>
                <Image
                  style={{
                    alignSelf: 'flex-start',
                    width: fontWidth / 13,
                    height: fontWidth / 13,
                  }}
                  source={require('./assets/menuSide.png')}
                />
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '30%', backgroundColor: '#fff' }}>
                <TouchableOpacity onPress={() => navigation.navigate('Configuracion')} activeOpacity={1} style={{ flex: 1 }}>
                  <FontAwesome5 name="cog" size={fontWidth / 18} color="#3C3C3C" />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => navigation.navigate('Notis')}>
                  <Octicons name="bell-fill" size={fontWidth / 18} color="#3C3C3C" />
                  <View style={{ marginLeft: 15, position: 'absolute' }}>{renderDotNoti()}</View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => navigation.navigate('Mensajes')}>
                  <Entypo name="mail" size={fontWidth / 18} color="#3C3C3C" />
                  <View style={{ marginLeft: 15, position: 'absolute' }}>{renderDotMensaje()}</View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 19 }}>Bienvenido, José</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#68C151' }}
                thumbColor={isEnabled ? '#E6F14B' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
          </View>

          {/* Mapa */}
          <View style={{ flex: 7, paddingHorizontal: 10, marginTop: 10 }}>
            <MapView
              style={{ width: '100%', height: '100%', borderRadius: 10 }}
              provider="google"
              ref={mapRefCinco}
              region={locationSearchCinco}
              showsUserLocation={true}
              showsMyLocationButton={false}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                alignSelf: 'flex-end',
                backgroundColor: '#fff',
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 2,
                elevation: 5,
                position: 'absolute',
                right: 15,
                top: 0,
              }}
              onPress={handleFindMyLocationCinco}
            >
              <FontAwesome name="location-arrow" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>

          {/* Estados del viaje */}
          <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: '#fff', paddingTop: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#343434', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29 }}>Estados del viaje</Text>
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
            {renderStatusBtnViajeLargoEspecial(viajeLargoEspecial[0].idviaje, viajeLargoEspecial[0].estado)}
          </View>

          {/* Datos del viaje */}
          <View style={{ flex: 3 }}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }} showsVerticalScrollIndicator={false}>
              <View style={{ paddingHorizontal: 10, paddingVertical: 10, backgroundColor: '#fff', marginTop: 10 }}>
                <Text style={{ color: '#343434', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29 }}>Datos del viaje</Text>
              </View>

              <View style={{ width: '100%', paddingHorizontal: 10 }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('DetalleViajeLargoEspecial', { InfoUser: data, InfoViaje: viajeLargoEspecial })}
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    padding: 8,
                    borderRadius: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <TextTicker
                      style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25 }}
                      duration={5000}
                      loop
                      bounce
                      repeatSpacer={50}
                      marqueeDelay={2000}
                    >
                      {viajeLargoEspecial[0].desde}
                    </TextTicker>
                    <TextTicker
                      style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25 }}
                      duration={5000}
                      loop
                      bounce
                      repeatSpacer={50}
                      marqueeDelay={2000}
                    >
                      {viajeLargoEspecial[0].fechainicio}
                    </TextTicker>
                  </View>

                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 38, marginBottom: 15 }}>
                      Viaje largo especial
                    </Text>
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
                    <TextTicker
                      style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25 }}
                      duration={5000}
                      loop
                      bounce
                      repeatSpacer={50}
                      marqueeDelay={2000}
                    >
                      {viajeLargoEspecial[0].hasta}
                    </TextTicker>
                    <TextTicker
                      style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25 }}
                      duration={5000}
                      loop
                      bounce
                      repeatSpacer={50}
                      marqueeDelay={2000}
                    >
                      {viajeLargoEspecial[0].fechafin}
                    </TextTicker>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      );
    }

    else if (viajeCortoEspecial != '') {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={true} />

          <View
            style={{
              backgroundColor: Platform.OS === 'ios' ? '#fff' : '#fff',
              height: Constants.statusBarHeight,
              width: '100%',
            }}
          />

          {/* Encabezado */}
          <View style={{ width: '100%', backgroundColor: '#fff', paddingHorizontal: 10, borderRadius: 10 }}>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity activeOpacity={1} style={{ width: '10%' }} onPress={isMenuOpen ? closeMenu : openMenu}>
                <Image
                  style={{
                    alignSelf: 'flex-start',
                    width: fontWidth / 13,
                    height: fontWidth / 13,
                  }}
                  source={require('./assets/menuSide.png')}
                />
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '30%' }}>
                <TouchableOpacity onPress={() => navigation.navigate('Configuracion')} activeOpacity={1} style={{ flex: 1 }}>
                  <FontAwesome5 name="cog" size={fontWidth / 18} color="#3C3C3C" />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => navigation.navigate('Notis')}>
                  <Octicons name="bell-fill" size={fontWidth / 18} color="#3C3C3C" />
                  <View style={{ marginLeft: 15, position: 'absolute' }}>{renderDotNoti()}</View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => navigation.navigate('Mensajes')}>
                  <Entypo name="mail" size={fontWidth / 18} color="#3C3C3C" />
                  <View style={{ marginLeft: 15, position: 'absolute' }}>{renderDotMensaje()}</View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 19 }}>Bienvenido, José</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#68C151' }}
                thumbColor={isEnabled ? '#E6F14B' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
          </View>

          {/* Mapa */}
          <View style={{ flex: 7, paddingHorizontal: 10, marginTop: 10 }}>
            <MapView
              style={{ width: '100%', height: '100%', borderRadius: 10 }}
              provider="google"
              ref={mapRefSeis}
              region={locationSearchSeis}
              showsUserLocation={true}
              showsMyLocationButton={false}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                alignSelf: 'flex-end',
                backgroundColor: '#fff',
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 2,
                elevation: 5,
                position: 'absolute',
                right: 15,
                top: 0,
              }}
              onPress={handleFindMyLocationSeis}
            >
              <FontAwesome name="location-arrow" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>

          {/* Estados del viaje */}
          <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: '#fff', paddingTop: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#343434', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29 }}>Estados del viaje</Text>
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
            {renderStatusBtnViajeCortoEspecial(viajeCortoEspecial[0].idviaje, viajeCortoEspecial[0].estado)}
          </View>

          {/* Datos del viaje */}
          <View style={{ flex: 3 }}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }} showsVerticalScrollIndicator={false}>
              <View style={{ paddingHorizontal: 10, paddingVertical: 10, backgroundColor: '#fff', marginTop: 10 }}>
                <Text style={{ color: '#343434', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 29 }}>Datos del viaje</Text>
              </View>

              <View style={{ width: '100%', paddingHorizontal: 10 }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('DetalleViajeCortoEspecial', {
                      InfoUser: data,
                      InfoViaje: viajeCortoEspecial,
                    })
                  }
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#fff',
                    padding: 8,
                    borderRadius: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                      <Entypo name="location-pin" size={fontWidth / 20} color="#07E607" />
                      <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, marginLeft: 5 }}>
                        {viajeCortoEspecial[0].lugarinicio}
                      </Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, marginRight: 10 }}>
                        {viajeCortoEspecial[0].radio}Km
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      );
    }

    else {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="#fff"
            translucent={true}
          />

          {/* <View
            style={{
              backgroundColor: Platform.OS === 'ios' ? '#fff' : '#fff',
              height: Constants.statusBarHeight,
              width: '100%',
            }} /> */}


          {activity()}
          <MapView
            ref={mapRef}
            style={styles.mapStyle}
            showsUserLocation={true}
            showsMyLocationButton={false}
            provider="google"
            region={locationSearch}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          ></MapView>

          <View style={{ width: '100%', height: 100, padding: 0, backgroundColor: '#fff' }}>

            <View style={{ width: '100%', backgroundColor: '#fff', padding: 8, borderRadius: 0, }}>
              <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', }}>
                <TouchableOpacity activeOpacity={1} style={{ width: '10%' }} onPress={isMenuOpen ? closeMenu : openMenu}>
                  <Image
                    style={{
                      alignSelf: 'flex-start',
                      width: fontWidth / 13,
                      height: fontWidth / 13,
                      marginBottom: 0,
                    }}
                    source={require('./assets/menuSide.png')}
                  />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '30%', backgroundColor: '#fff' }}>
                  <TouchableOpacity onPress={() => navigation.navigate('Configuracion')} activeOpacity={1} style={{ flex: 1 }}>
                    <FontAwesome5 name="cog" size={fontWidth / 18} color="#3C3C3C" />
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => navigation.navigate('Notis')}>
                    <Octicons name="bell-fill" size={fontWidth / 18} color="#3C3C3C" />
                    <View style={{ marginLeft: 15, position: 'absolute' }}>
                      {renderDotNoti()}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => navigation.navigate('Mensajes')}>
                    <Entypo name="mail" size={fontWidth / 18} color="#3C3C3C" />
                    <View style={{ marginLeft: 15, position: 'absolute' }}>
                      {renderDotMensaje()}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>



              <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, }}>
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 19 }}>Bienvenido, José</Text>

                <Switch
                  trackColor={{ false: '#767577', true: '#68C151' }}
                  thumbColor={isEnabled ? '#E6F14B' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </View>
            </View>

            <TouchableOpacity
              style={{
                //position: 'absolute',
                // bottom: 20,
                // right: 20,
                width: 50,
                height: 50,
                alignSelf: 'flex-end',
                backgroundColor: '#fff',
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 2,
                elevation: 5,
                marginTop: 10,
              }}
              onPress={handleFindMyLocation}
            >
              <FontAwesome name="location-arrow" size={24} color="#007AFF" />
            </TouchableOpacity>

          </View>









          <View style={{
            position: 'absolute',
            bottom: 50,
            width: '100%',
            alignItems: 'center',
            backgroundColor: 'transparent',
          }}>
            <TouchableOpacity
              onPress={() => {
                if (isEnabled == true) {
                  this.RBSheet.open()
                } else {
                  ModalOptions('Error', 'No estas disponible', 'No puedes crear un viaje si estas offline', 'close');
                }
              }}
              activeOpacity={1}
              style={{
                width: fontWidth / 6,
                height: fontWidth / 6,
                backgroundColor: 'transparent',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }}
            >
              <View style={{
                width: '95%',
                height: '95%',
                borderRadius: 100,
                backgroundColor: '#9DC2E4',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <LinearGradient
                  colors={['#E6F14B', '#E6F14B', '#C3FE70']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                    elevation: 5,
                  }}
                >
                  <Entypo name="plus" size={fontWidth / 14} color="#000" />
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      )
    }
  }

  const activity = () => {
    if (activityShow == true) {
      return (
        <ActivityIndi />
      )
    }
  }

  function chatExist(x) {
    fetch(`${ServidorExport}/partner/MensajeDot.php`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: x,
      })
    })
      .then((response) => {
        response.json()
          .then(responser => {
            console.log(responser)
            if (responser == 'hay') {
              setChatExi(true)
            } else {
              setChatExi(false)
            }

          })
      })

  }
  renderDotMensaje = () => {
    if (chatExis == true) {
      return (
        <View style={{ width: 10, height: 10, borderRadius: 100, backgroundColor: '#CA319F' }}>
        </View>
      )
    }
  }

  function notiExist(x) {
    fetch(`${ServidorExport}/partner/NotiDot.php`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: x,
      })
    })
      .then((response) => {
        response.json()
          .then(responser => {
            console.log(responser)
            if (responser == 'hay') {
              setNotificExist(true)
            } else {
              setNotificExist(false)
            }

          })
      })

  }
  renderDotNoti = () => {
    if (notificExist == true) {
      return (
        <View style={{ width: 10, height: 10, borderRadius: 100, backgroundColor: '#CA319F' }}>
        </View>
      )
    }
  }

  RendContent = () => {
    if (loading || showSkeleton) {
      return (
        <View style={styles.container}>
          {renderSekeleton()}
        </View>
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
          <View key={i} style={styles.container}>
            {location ? (
              <View style={styles.container}>












                {returnViajesControles(data)}











                <View style={{ width: 10, height: alturaOpen, backgroundColor: 'transparent', position: 'absolute' }} {...panResponder.panHandlers} />


                {isMenuOpen && (
                  <Animated.View style={{ position: 'absolute', flex: 1, left: 0, width: width, height: '100%', backgroundColor: 'black', opacity: fadeAnim }} >
                    <TouchableOpacity onPress={() => closeMenu()} style={{ flex: 1 }}></TouchableOpacity>
                  </Animated.View>
                )}

                <Animated.View style={{ position: 'absolute', top: 0, left: 0, width: width * 0.8, height: '100%', backgroundColor: '#fff', transform: [{ translateX: slideAnim }], borderRightWidth: 1, borderRightColor: '#3e3e3e3e', }}>
                  <View style={{ flex: 1, }} {...(Platform.OS === 'ios' ? menuPanResponder.panHandlers : {})}>
                    <View pointerEvents="box-none">

                      <View
                        style={{
                          backgroundColor: Platform.OS === 'ios' ? '#fff' : '#fff',
                          height: Constants.statusBarHeight,
                          width: '100%',
                        }}
                      />

                      <TouchableOpacity onPress={() => closeMenu()} style={{ width: '100%', justifyContent: 'flex-end', alignItems: 'flex-end', paddingRight: 15, }}>
                        <FontAwesome name="close" size={fontWidth / 18} color="#3C3C3C" />
                      </TouchableOpacity>

                      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Image
                          style={{
                            alignSelf: 'flex-start',
                            marginLeft: 15,
                            width: fontWidth / 6,
                            height: fontWidth / 6,
                            marginBottom: 0,
                          }}
                          source={require('./assets/logoInside.png')}
                        />
                      </View>

                      <Text style={{ fontFamily: 'Poppins_300Light', fontSize: fontWidth / 30, marginLeft: 15, marginTop: 0, }}>{dataSource[0].correo}</Text>

                      <View style={{ marginTop: 25, }}>



                        <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('MisViajesUno', { User: dataSource[0].usrinfo })} style={{ width: '100%', paddingVertical: 20, paddingLeft: 35, paddingRight: 15, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#fff' }}>
                          <Entypo name="mail" size={fontWidth / 19} color="#3C3C3C" />
                          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 28, marginLeft: 30, }}>Mis viajes Convey</Text>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('Ganancias')} style={{ width: '100%', paddingVertical: 20, paddingLeft: 35, paddingRight: 15, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#fff' }}>
                          <Entypo name="mail" size={fontWidth / 19} color="#3C3C3C" />
                          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 28, marginLeft: 30, }}>Ganancias</Text>
                        </TouchableOpacity>


                        <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('Billetera')} style={{ width: '100%', paddingVertical: 20, paddingLeft: 35, paddingRight: 15, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#fff' }}>
                          <Entypo name="mail" size={fontWidth / 19} color="#3C3C3C" />
                          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 28, marginLeft: 30, }}>Mi billetera</Text>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('Facturacion')} style={{ width: '100%', paddingVertical: 20, paddingLeft: 35, paddingRight: 15, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#fff' }}>
                          <Entypo name="mail" size={fontWidth / 19} color="#3C3C3C" />
                          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 28, marginLeft: 30, }}>Información de facturación</Text>
                        </TouchableOpacity>


                        <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('Calificaciones')} style={{ width: '100%', paddingVertical: 20, paddingLeft: 35, paddingRight: 15, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#fff' }}>
                          <Entypo name="mail" size={fontWidth / 19} color="#3C3C3C" />
                          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 28, marginLeft: 30, }}>Mis calificaciones</Text>
                        </TouchableOpacity>


                        <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('SoS')} style={{ width: '100%', paddingVertical: 20, paddingLeft: 35, paddingRight: 15, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#fff' }}>
                          <Entypo name="mail" size={fontWidth / 19} color="#3C3C3C" />
                          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 28, marginLeft: 30, }}>Activar S.O.S</Text>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('ContactoConvey')} style={{ width: '100%', paddingVertical: 20, paddingLeft: 35, paddingRight: 15, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#fff' }}>
                          <Entypo name="mail" size={fontWidth / 19} color="#3C3C3C" />
                          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 28, marginLeft: 30, }}>Contacto</Text>
                        </TouchableOpacity>


                        {/* <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('Mensajes')} style={{width:'100%', paddingVertical:20,  paddingLeft:35, paddingRight:15, flexDirection:'row', justifyContent:'flex-start', alignItems: 'center', backgroundColor:'#fff'}}>
                                         <Entypo name="mail" size={fontWidth/19} color="#3C3C3C" />
                                           <Text style={{fontFamily:'Poppins_500Medium', fontSize: fontWidth / 23, marginLeft:30,}}>Mensajes</Text>
                                           <View style={{marginLeft:15, position:'absolute'}}>
                                              {renderDotMensaje()}
                                              </View>
                                         </TouchableOpacity> */}


                        {/* <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('Noti',{User: dataSource[0].usrinfo[0].idcliente})} style={{width:'100%', paddingVertical:20,  paddingLeft:35, paddingRight:15, flexDirection:'row', justifyContent:'flex-start', alignItems: 'center', backgroundColor:'#F6F6F6'}}>
                                           <Octicons name="bell-fill" size={fontWidth/19} color="#3C3C3C" />
                                           <Text style={{fontFamily:'Poppins_500Medium', fontSize: fontWidth / 23, marginLeft:30,}}>Avisos</Text>
                                           <View style={{marginLeft:15, position:'absolute'}}>
                                           {renderDotNoti()}
                                           </View>
                                         </TouchableOpacity> */}


                        {/* <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('Solicitudes')} style={{width:'100%', paddingVertical:20,  paddingLeft:35, paddingRight:15, flexDirection:'row', justifyContent:'flex-start', alignItems: 'center', backgroundColor:'#fff'}}>
                                           <MaterialCommunityIcons name="truck-snowflake" size={fontWidth/19} color="#3C3C3C" />
                                           <Text style={{fontFamily:'Poppins_500Medium', fontSize: fontWidth / 23, marginLeft:30,}}>Solicitudes</Text>
                                         </TouchableOpacity> */}



                        {/* <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('Ajustes',{User: dataSource[0].usrinfo[0]})} style={{width:'100%', paddingVertical:20,  paddingLeft:35, paddingRight:15, flexDirection:'row', justifyContent:'flex-start', alignItems: 'center', backgroundColor:'#F6F6F6'}}>
                                           <FontAwesome name="cog" size={fontWidth/19} color="#3C3C3C" />
                                           <Text style={{fontFamily:'Poppins_500Medium', fontSize: fontWidth / 23, marginLeft:30,}}>Ajustes</Text>
                                         </TouchableOpacity> */}


                        {/* <TouchableOpacity activeOpacity={1} onPress={() => salir()} style={{width:'100%', paddingVertical:20, paddingLeft:35, paddingRight:15, flexDirection:'row', justifyContent:'flex-start', alignItems: 'center', backgroundColor:'#fff'}}>
                                           <FontAwesome name="sign-out" size={fontWidth/19} color="#3C3C3C" />
                                           <Text style={{fontFamily:'Poppins_500Medium', fontSize: fontWidth / 23, marginLeft:30,}}>Cerrar sesión</Text>
                                         </TouchableOpacity> */}


                      </View>
                    </View>
                  </View>
                </Animated.View>



                <RBSheet
                  ref={ref => {
                    this.RBSheet = ref;
                  }}
                  height={heighthorarios}
                  closeOnDragDown={true}
                  // draggable={true}
                  // dragOnContent={true}
                  openDuration={300}
                  customStyles={{
                    container: {
                      paddingHorizontal: 15,
                      borderTopLeftRadius: 30,
                      borderTopRightRadius: 30,
                    }
                  }}
                >
                  {/* <ScrollView style={{marginTop:10}} bounces={false} showsVerticalScrollIndicator ={false}> */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 15 }}>
                    <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 15, color: '#000' }}>
                      Servicios Convey
                    </Text>

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


                  <TouchableOpacity onPress={() => passToLargo(data)} activeOpacity={1} style={{ marginBottom: 15, borderRadius: 10, overflow: 'hidden' }}>
                    <LinearGradient
                      colors={['#E6F14B', '#E6F14B', '#C3FE70']}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                      style={{ padding: 15, flexDirection: 'row', borderRadius: 10 }}
                    >
                      <View style={{ width: '80%' }}>
                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 24, color: '#343434' }}>
                          Viajes largos
                        </Text>
                        <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 28, color: '#353535' }}>
                          Viajes interurbanos o fuera de la ciudad a más de 200 km
                        </Text>
                      </View>
                      <View style={{ width: '20%' }}>
                        <Image
                          source={require('./assets/viajeLargo.png')}
                          style={{
                            width: '100%',
                            height: undefined,
                            aspectRatio: 1115 / 654, // Calcula la altura automáticamente 
                            resizeMode: 'contain'
                          }}
                        />
                        {/* <Image
                          style={{
                            alignSelf: 'flex-start',
                            marginLeft: 15,
                            width: fontWidth / 9,
                            height: fontWidth / 9,
                            marginBottom: 0,
                          }}
                          source={require('./assets/3dtruck.png')}
                        /> */}
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>


                  <TouchableOpacity
                    onPress={() => passToCorto(data)}
                    activeOpacity={1}
                    style={{ marginBottom: 15, borderRadius: 10, overflow: 'hidden' }}
                  >
                    <LinearGradient
                      colors={['#E6F14B', '#E6F14B', '#C3FE70']}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                      style={{ padding: 15, flexDirection: 'row', borderRadius: 10 }}
                    >
                      <View style={{ width: '80%' }}>
                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 24, color: '#343434' }}>
                          Flete
                        </Text>
                        <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 28, color: '#353535' }}>
                          Entregas dentro de la misma ciudad o cerca de tu ubicación a menos de 200 km
                        </Text>
                      </View>
                      <View style={{ width: '20%' }}>
                        <Image
                          source={require('./assets/flete.png')}
                          style={{
                            width: '100%',
                            height: undefined,
                            aspectRatio: 1115 / 654, // Calcula la altura automáticamente 
                            resizeMode: 'contain'
                          }}
                        />
                        {/* <Image
                          style={{
                            alignSelf: 'flex-start',
                            marginLeft: 15,
                            width: fontWidth / 9,
                            height: fontWidth / 9,
                            marginBottom: 0,
                          }}
                          source={require('./assets/3dtruck.png')}
                        /> */}
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>



                  <TouchableOpacity
                    onPress={() => passToGrua(data)}
                    activeOpacity={1}
                    style={{ marginBottom: 15, borderRadius: 10, overflow: 'hidden' }}
                  >
                    <LinearGradient
                      colors={['#E6F14B', '#E6F14B', '#C3FE70']}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                      style={{ padding: 15, flexDirection: 'row', borderRadius: 10 }}
                    >
                      <View style={{ width: '80%' }}>
                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 24, color: '#343434' }}>
                          Grúas
                        </Text>
                        <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 28, color: '#353535' }}>
                          Transporte de vehículos y maquinaria menor
                        </Text>
                      </View>
                      <View style={{ width: '20%' }}>
                        {/* <Image
                          style={{
                            alignSelf: 'flex-start',
                            marginLeft: 15,
                            width: fontWidth / 9,
                            height: fontWidth / 9,
                            marginBottom: 0,
                          }}
                          source={require('./assets/3dtruck.png')}
                        /> */}
                        <Image
                          source={require('./assets/grua.png')}
                          style={{
                            width: '100%',
                            height: undefined,
                            aspectRatio: 1115 / 654, // Calcula la altura automáticamente 
                            resizeMode: 'contain'
                          }}
                        />
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>


                  <TouchableOpacity
                    onPress={() => passToEspecials(data)}
                    activeOpacity={1}
                    style={{ marginBottom: 15, borderRadius: 10, overflow: 'hidden' }}
                  >
                    <LinearGradient
                      colors={['#E6F14B', '#E6F14B', '#C3FE70']}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                      style={{ padding: 15, flexDirection: 'row', borderRadius: 10 }}
                    >
                      <View style={{ width: '80%' }}>
                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 24, color: '#343434' }}>
                          Viajes especiales
                        </Text>
                        <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 28, color: '#353535' }}>
                          Transporte de madera, materiales de construcción, cadena de frío, maquinaria pesada, escombros, entre otros.
                        </Text>
                      </View>
                      <View style={{ width: '20%' }}>
                        {/* <Image
                          style={{
                            alignSelf: 'flex-start',
                            marginLeft: 15,
                            width: fontWidth / 9,
                            height: fontWidth / 9,
                            marginBottom: 0,
                          }}
                          source={require('./assets/3dtruck.png')}
                        /> */}
                        <Image
                          source={require('./assets/viajeLargoEspecial.png')}
                          style={{
                            width: '100%',
                            height: undefined,
                            aspectRatio: 1115 / 654, // Calcula la altura automáticamente 
                            resizeMode: 'contain'
                          }}
                        />
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>



                  {/* </ScrollView> */}

                </RBSheet>



              </View>
            ) : (
              //  <Text>{errorMsg || 'No location available'}</Text>
              <View style={{ flex: 1 }}>
                {/* {renderSekeleton()} */}
                <Text>{errorMsg || 'No location available'}</Text>
              </View>
            )}
          </View>
        )
      })






    }

  }


  RenderContentSolicitud = () => {
    //VIAJE LARGO
    if (dataSourceViajeLargo != '') {
      return (
        <View>
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 22 }}>Solicitud de transporte</Text>
          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 25 }}>Tienes una solicitud de envío de carga</Text>


          <View style={{ width: '100%', paddingHorizontal: 10, }}>

            <TouchableOpacity style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 8, borderRadius: 10 }}>

              <View style={{ flex: 1 }}>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{dataSourceViajeLargo[0].origen}</TextTicker>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{dataSourceViajeLargo[0].bultos} Bultos</TextTicker>
              </View>

              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 35, marginBottom: 15, }}>Viaje largo</Text>
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
                  marqueeDelay={2000}>{dataSourceViajeLargo[0].destino}</TextTicker>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{dataSourceViajeLargo[0].kilos} Kilos</TextTicker>
              </View>

            </TouchableOpacity>

            <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, marginTop: 25, justifyContent: 'center', alignItems: 'center' }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

              <TouchableOpacity onPress={() => {
                hideBottom()
                navigation.navigate('SolicitudViajeLargo', { IdCarga: dataSourceViajeLargo[0].idcarga, IdCamionero: dataSourceViajeLargo[0].idcamionero, IdSoli: dataSourceViajeLargo[0].idsolicitud, Token: dataSourceViajeLargo[0].tokencliente, CorreoCliente: dataSourceViajeLargo[0].correocliente, })
              }
              } style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} >
                <Text style={styles.txtBtn}>Ver carga</Text>
              </TouchableOpacity>



            </LinearGradient>


            <TouchableOpacity onPress={() => {
              hideBottom
              rechazarSolViajeLargo(dataSourceViajeLargo[0].idsolicitud)

            }
            } style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 25, }} activeOpacity={1} >
              <Text style={{ color: '#000', fontFamily: 'Poppins_700Bold' }}>Rechazar</Text>
            </TouchableOpacity>

          </View>


        </View>
      )
    }
    //VIAJE CORTO
    if (dataSourceViajeCorto != '') {
      return (
        <View>
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 22 }}>Solicitud de transporte</Text>
          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 25 }}>Tienes una solicitud de envío de carga</Text>


          <View style={{ width: '100%', paddingHorizontal: 10, }}>

            <TouchableOpacity style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 8, borderRadius: 10 }}>

              <View style={{ flex: 1 }}>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{dataSourceViajeCorto[0].origen}</TextTicker>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{dataSourceViajeCorto[0].bultos} Bultos</TextTicker>
              </View>

              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 35, marginBottom: 15, }}>Viaje largo</Text>
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
                  marqueeDelay={2000}>{dataSourceViajeCorto[0].destino}</TextTicker>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{dataSourceViajeCorto[0].kilos} Kilos</TextTicker>
              </View>

            </TouchableOpacity>

            <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, marginTop: 25, justifyContent: 'center', alignItems: 'center' }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

              <TouchableOpacity onPress={() => {
                hideBottom()
                navigation.navigate('SolicitudViajeCorto', { IdCarga: dataSourceViajeCorto[0].idcarga, IdCamionero: dataSourceViajeCorto[0].idcamionero, IdSoli: dataSourceViajeCorto[0].idsolicitud, Token: dataSourceViajeCorto[0].tokencliente, CorreoCliente: dataSourceViajeCorto[0].correocliente, })
              }
              } style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} >
                <Text style={styles.txtBtn}>Ver carga</Text>
              </TouchableOpacity>



            </LinearGradient>


            <TouchableOpacity onPress={() => {
              hideBottom
              rechazarSolViajeCorto(dataSourceViajeCorto[0].idsolicitud)

            }
            } style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 25, }} activeOpacity={1} >
              <Text style={{ color: '#000', fontFamily: 'Poppins_700Bold' }}>Rechazar</Text>
            </TouchableOpacity>

          </View>


        </View>
      )
    }
    //VIAJE GRUA
    if (dataSourceViajeGrua != '') {
      return (
        <View>
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 22 }}>Solicitud de transporte</Text>
          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 25 }}>Tienes una solicitud de envío de carga</Text>


          <View style={{ width: '100%', paddingHorizontal: 10, }}>

            <TouchableOpacity style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 8, borderRadius: 10 }}>

              <View style={{ flex: 1 }}>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{dataSourceViajeGrua[0].origen}</TextTicker>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{dataSourceViajeGrua[0].bultos} Bultos</TextTicker>
              </View>

              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 35, marginBottom: 15, }}>Viaje largo</Text>
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
                  marqueeDelay={2000}>{dataSourceViajeGrua[0].destino}</TextTicker>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{dataSourceViajeGrua[0].kilos} Kilos</TextTicker>
              </View>

            </TouchableOpacity>

            <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, marginTop: 25, justifyContent: 'center', alignItems: 'center' }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

              <TouchableOpacity onPress={() => {
                hideBottom()
                navigation.navigate('SolicitudViajeGrua', { IdCarga: dataSourceViajeGrua[0].idcarga, IdCamionero: dataSourceViajeGrua[0].idcamionero, IdSoli: dataSourceViajeGrua[0].idsolicitud, Token: dataSourceViajeGrua[0].tokencliente, CorreoCliente: dataSourceViajeGrua[0].correocliente, })
              }
              } style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} >
                <Text style={styles.txtBtn}>Ver carga</Text>
              </TouchableOpacity>



            </LinearGradient>


            <TouchableOpacity onPress={() => {
              hideBottom
              rechazarSolViajeGrua(dataSourceViajeGrua[0].idsolicitud)

            }
            } style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 25, }} activeOpacity={1} >
              <Text style={{ color: '#000', fontFamily: 'Poppins_700Bold' }}>Rechazar</Text>
            </TouchableOpacity>

          </View>


        </View>
      )
    }

    //VIAJE LARGO ESPECIAL
    if (dataSourceViajeLargoEspecial != '') {
      return (
        <View>
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 22 }}>Solicitud de transporte</Text>
          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 25 }}>Tienes una solicitud de envío de carga</Text>


          <View style={{ width: '100%', paddingHorizontal: 10, }}>

            <TouchableOpacity style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 8, borderRadius: 10 }}>

              <View style={{ flex: 1 }}>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{dataSourceViajeLargoEspecial[0].origen}</TextTicker>

              </View>

              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 35, marginBottom: 15, }}>Viaje largo</Text>
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
                  marqueeDelay={2000}>{dataSourceViajeLargoEspecial[0].destino}</TextTicker>

              </View>

            </TouchableOpacity>

            <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, marginTop: 25, justifyContent: 'center', alignItems: 'center' }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

              <TouchableOpacity onPress={() => {
                hideBottom()
                navigation.navigate('SolicitudViajeLargoEspecial', { IdCarga: dataSourceViajeLargoEspecial[0].idcarga, IdCamionero: dataSourceViajeLargoEspecial[0].idcamionero, IdSoli: dataSourceViajeLargoEspecial[0].idsolicitud, Token: dataSourceViajeLargoEspecial[0].tokencliente, CorreoCliente: dataSourceViajeLargoEspecial[0].correocliente, })
              }
              } style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} >
                <Text style={styles.txtBtn}>Ver carga</Text>
              </TouchableOpacity>



            </LinearGradient>


            <TouchableOpacity onPress={() => {
              hideBottom
              rechazarSolViajeLargoEspecial(dataSourceViajeLargoEspecial[0].idsolicitud)

            }
            } style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 25, }} activeOpacity={1} >
              <Text style={{ color: '#000', fontFamily: 'Poppins_700Bold' }}>Rechazar</Text>
            </TouchableOpacity>

          </View>


        </View>
      )
    }
    //VIAJE CORTO ESPECIAL
    if (dataSourceViajeCortoEspecial != '') {
      return (
        <View>
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 22 }}>Solicitud de transporte</Text>
          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 25 }}>Tienes una solicitud de envío de carga</Text>


          <View style={{ width: '100%', paddingHorizontal: 10, }}>

            <TouchableOpacity style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 8, borderRadius: 10 }}>

              <View style={{ flex: 1 }}>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{dataSourceViajeCortoEspecial[0].origen}</TextTicker>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{dataSourceViajeCortoEspecial[0].bultos} Bultos</TextTicker>
              </View>

              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 35, marginBottom: 15, }}>Viaje largo</Text>
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
                  marqueeDelay={2000}>{dataSourceViajeCortoEspecial[0].destino}</TextTicker>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{dataSourceViajeCortoEspecial[0].kilos} Kilos</TextTicker>
              </View>

            </TouchableOpacity>

            <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, marginTop: 25, justifyContent: 'center', alignItems: 'center' }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

              <TouchableOpacity onPress={() => {
                hideBottom()
                navigation.navigate('SolicitudViajeCortoEspecial', { IdCarga: dataSourceViajeCortoEspecial[0].idcarga, IdCamionero: dataSourceViajeCortoEspecial[0].idcamionero, IdSoli: dataSourceViajeCortoEspecial[0].idsolicitud, Token: dataSourceViajeCortoEspecial[0].tokencliente, CorreoCliente: dataSourceViajeCortoEspecial[0].correocliente, })
              }
              } style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} >
                <Text style={styles.txtBtn}>Ver carga</Text>
              </TouchableOpacity>



            </LinearGradient>


            <TouchableOpacity onPress={() => {
              hideBottom
              rechazarSolViajeCortoEspecial(dataSourceViajeCortoEspecial[0].idsolicitud)

            }
            } style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 25, }} activeOpacity={1} >
              <Text style={{ color: '#000', fontFamily: 'Poppins_700Bold' }}>Rechazar</Text>
            </TouchableOpacity>

          </View>


        </View>
      )
    }
  }
  const [isBottomVisible, setIsBottomVisible] = React.useState(false);
  const slideAnimBottom = React.useRef(new Animated.Value(height)).current;
  const fadeAnimBackground = React.useRef(new Animated.Value(0)).current;

  const showBottom = () => {
    setIsBottomVisible(true);

    Animated.parallel([
      Animated.timing(slideAnimBottom, {
        toValue: height - height / 2, // Mover desde la parte inferior hasta la mitad de la pantalla
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimBackground, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideBottom = () => {
    Animated.parallel([
      Animated.timing(slideAnimBottom, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsBottomVisible(false);
      }),
      Animated.timing(fadeAnimBackground, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsBottomVisible(false);
      })
    ]).start(() => {
      setIsMenuOpen(false);
    });
  };


  RenderAvisoPago = () => {
    if (avisoPagoViajeLargo != '') {
      return (
        <View>
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 22 }}>Cotización pagada</Text>
          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 25 }}>Tu precio para el transporte ha sido aceptado</Text>
          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 25 }}>Ya puedes chatear con el cliente</Text>


          <View style={{ width: '100%', paddingHorizontal: 10, }}>

            <TouchableOpacity style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 8, borderRadius: 10 }}>

              <View style={{ flex: 1 }}>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{avisoPagoViajeLargo[0].origen}</TextTicker>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{avisoPagoViajeLargo[0].nbultos} Bultos</TextTicker>
              </View>

              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 35, marginBottom: 15, }}>Viaje largo</Text>
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
                  marqueeDelay={2000}>{avisoPagoViajeLargo[0].destino}</TextTicker>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{avisoPagoViajeLargo[0].kl} Kilos</TextTicker>
              </View>

            </TouchableOpacity>

            <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, marginTop: 25, justifyContent: 'center', alignItems: 'center' }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

              <TouchableOpacity onPress={() => {
                hideBottomDos()
                //console.log(dataSource[0].camioneroInfo)
                console.log(avisoPagoViajeLargo)
                console.log(dataSource)
                navigation.navigate('CargaViajeLargo', { IdCarga: avisoPagoViajeLargo[0].idcarga, idCliente: avisoPagoViajeLargo[0].idcliente, CorreoCliente: avisoPagoViajeLargo[0].correo, InfoUser: dataSource[0], InfoCarga: avisoPagoViajeLargo[0] })
              }
              } style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} >
                <Text style={styles.txtBtn}>Ver carga</Text>
              </TouchableOpacity>

            </LinearGradient>

          </View>


        </View>
      )
    }
    if (avisoPagoViajeCorto != '') {
      return (
        <View>
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 22 }}>Cotización pagada</Text>
          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 25 }}>Tu precio para el transporte ha sido aceptado</Text>
          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 25 }}>Ya puedes chatear con el cliente</Text>


          <View style={{ width: '100%', paddingHorizontal: 10, }}>

            <TouchableOpacity style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 8, borderRadius: 10 }}>

              <View style={{ flex: 1 }}>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{avisoPagoViajeCorto[0].origen}</TextTicker>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{avisoPagoViajeCorto[0].nbultos} Bultos</TextTicker>
              </View>

              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 35, marginBottom: 15, }}>Viaje largo</Text>
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
                  marqueeDelay={2000}>{avisoPagoViajeCorto[0].destino}</TextTicker>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{avisoPagoViajeCorto[0].kl} Kilos</TextTicker>
              </View>

            </TouchableOpacity>

            <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, marginTop: 25, justifyContent: 'center', alignItems: 'center' }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

              <TouchableOpacity onPress={() => {
                hideBottomDos()
                //console.log(dataSource[0].camioneroInfo)
                console.log(avisoPagoViajeCorto)
                console.log(dataSource)
                navigation.navigate('CargaViajeCorto', { IdCarga: avisoPagoViajeCorto[0].idcarga, idCliente: avisoPagoViajeCorto[0].idcliente, CorreoCliente: avisoPagoViajeCorto[0].correo, InfoUser: dataSource[0], InfoCarga: avisoPagoViajeCorto[0] })
              }
              } style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} >
                <Text style={styles.txtBtn}>Ver carga</Text>
              </TouchableOpacity>

            </LinearGradient>

          </View>


        </View>
      )
    }
    if (avisoPagoViajeGrua != '') {
      return (
        <View>
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 22 }}>Cotización pagada</Text>
          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 25 }}>Tu precio para el transporte ha sido aceptado</Text>
          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 25 }}>Ya puedes chatear con el cliente</Text>


          <View style={{ width: '100%', paddingHorizontal: 10, }}>

            <TouchableOpacity style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 8, borderRadius: 10 }}>

              <View style={{ flex: 1 }}>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{avisoPagoViajeGrua[0].origen}</TextTicker>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{avisoPagoViajeGrua[0].nbultos} Bultos</TextTicker>
              </View>

              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 35, marginBottom: 15, }}>Viaje largo</Text>
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
                  marqueeDelay={2000}>{avisoPagoViajeGrua[0].destino}</TextTicker>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{avisoPagoViajeGrua[0].kl} Kilos</TextTicker>
              </View>

            </TouchableOpacity>

            <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, marginTop: 25, justifyContent: 'center', alignItems: 'center' }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

              <TouchableOpacity onPress={() => {
                hideBottomDos()
                //console.log(dataSource[0].camioneroInfo)
                console.log(avisoPagoViajeGrua)
                console.log(dataSource)
                navigation.navigate('CargaViajeGrua', { IdCarga: avisoPagoViajeGrua[0].idcarga, idCliente: avisoPagoViajeGrua[0].idcliente, CorreoCliente: avisoPagoViajeGrua[0].correo, InfoUser: dataSource[0], InfoCarga: avisoPagoViajeGrua[0] })
              }
              } style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} >
                <Text style={styles.txtBtn}>Ver carga</Text>
              </TouchableOpacity>

            </LinearGradient>

          </View>


        </View>
      )
    }
    if (avisoPagoViajeLargoEspecial != '') {
      return (
        <View>
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 22 }}>Cotización pagada</Text>
          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 25 }}>Tu precio para el transporte ha sido aceptado</Text>
          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 25 }}>Ya puedes chatear con el cliente</Text>


          <View style={{ width: '100%', paddingHorizontal: 10, }}>

            <TouchableOpacity style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 8, borderRadius: 10 }}>

              <View style={{ flex: 1 }}>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{avisoPagoViajeLargoEspecial[0].origen}</TextTicker>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{avisoPagoViajeLargoEspecial[0].nbultos} Bultos</TextTicker>
              </View>

              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 35, marginBottom: 15, }}>Viaje largo</Text>
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
                  marqueeDelay={2000}>{avisoPagoViajeLargoEspecial[0].destino}</TextTicker>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{avisoPagoViajeLargoEspecial[0].kl} Kilos</TextTicker>
              </View>

            </TouchableOpacity>

            <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, marginTop: 25, justifyContent: 'center', alignItems: 'center' }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

              <TouchableOpacity onPress={() => {
                hideBottomDos()
                //console.log(dataSource[0].camioneroInfo)
                console.log(avisoPagoViajeLargoEspecial)
                console.log(dataSource)
                navigation.navigate('CargaViajeLargoEspecial', { IdCarga: avisoPagoViajeLargoEspecial[0].idcarga, idCliente: avisoPagoViajeLargoEspecial[0].idcliente, CorreoCliente: avisoPagoViajeLargoEspecial[0].correo, InfoUser: dataSource[0], InfoCarga: avisoPagoViajeLargoEspecial[0] })
              }
              } style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} >
                <Text style={styles.txtBtn}>Ver carga</Text>
              </TouchableOpacity>

            </LinearGradient>

          </View>


        </View>
      )
    }
    if (avisoPagoViajeCortoEspecial != '') {
      return (
        <View>
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 22 }}>Cotización pagada</Text>
          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 25 }}>Tu precio para el transporte ha sido aceptado</Text>
          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 25 }}>Ya puedes chatear con el cliente</Text>


          <View style={{ width: '100%', paddingHorizontal: 10, }}>

            <TouchableOpacity style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 8, borderRadius: 10 }}>

              <View style={{ flex: 1 }}>
                <TextTicker style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 25, }} duration={5000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2000}>{avisoPagoViajeCortoEspecial[0].desde}</TextTicker>
              </View>

              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 35, marginBottom: 15, }}>Viaje largo</Text>
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
                  marqueeDelay={2000}>{avisoPagoViajeCortoEspecial[0].hasta}</TextTicker>
              </View>

            </TouchableOpacity>

            <LinearGradient style={{ width: '100%', height: 50, borderRadius: 10, marginTop: 25, justifyContent: 'center', alignItems: 'center' }} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

              <TouchableOpacity onPress={() => {
                hideBottomDos()
                //console.log(dataSource[0].camioneroInfo)
                console.log(avisoPagoViajeCortoEspecial)
                console.log(dataSource)
                navigation.navigate('CargaViajeCortoEspecial', { IdCarga: avisoPagoViajeCortoEspecial[0].idcarga, idCliente: avisoPagoViajeCortoEspecial[0].idcliente, CorreoCliente: avisoPagoViajeCortoEspecial[0].correo, InfoUser: dataSource[0], InfoCarga: avisoPagoViajeCortoEspecial[0] })
              }
              } style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} >
                <Text style={styles.txtBtn}>Ver carga</Text>
              </TouchableOpacity>

            </LinearGradient>

          </View>


        </View>
      )
    }
  }

  const [isBottomVisibleDos, setIsBottomVisibleDos] = React.useState(false);
  const slideAnimBottomDos = React.useRef(new Animated.Value(height)).current;
  const fadeAnimBackgroundDos = React.useRef(new Animated.Value(0)).current;

  const showBottomDos = () => {
    setIsBottomVisibleDos(true);

    Animated.parallel([
      Animated.timing(slideAnimBottomDos, {
        toValue: height - height / 2, // Mover desde la parte inferior hasta la mitad de la pantalla
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimBackgroundDos, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideBottomDos = () => {
    Animated.parallel([
      Animated.timing(slideAnimBottomDos, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsBottomVisibleDos(false);
      }),
      Animated.timing(fadeAnimBackgroundDos, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsBottomVisibleDos(false);
      })
    ]).start(() => {
      setIsMenuOpen(false);
    });
  };





  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: Platform.OS === 'ios' ? '#fff' : '#fff',
          height: Constants.statusBarHeight,
          width: '100%',
        }}
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


      {RendContent()}








      {/* MODAL SOLICITUDES DE VIAJES */}
      {isBottomVisible && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: width,
            height: height,
            backgroundColor: 'black',
            opacity: fadeAnimBackground,
          }}
        >
          <TouchableOpacity onPress={hideBottom} style={{ flex: 1 }}></TouchableOpacity>
        </Animated.View>
      )}

      {isBottomVisible && (
        <Animated.View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: width,
          height: height,
          backgroundColor: 'white',
          padding: 10,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          transform: [{ translateY: slideAnimBottom }]
        }}>
          <TouchableOpacity onPress={hideBottom} style={{ alignSelf: 'flex-end' }}>
            <FontAwesome name="close" size={24} color="black" />
          </TouchableOpacity>
          <View>
            {RenderContentSolicitud()}
          </View>
        </Animated.View>
      )}
      {/* MODAL SOLICITUDES DE VIAJES */}







      {/* MODAL AVISOS DE PAGOS */}
      {isBottomVisibleDos && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: width,
            height: height,
            backgroundColor: 'black',
            opacity: fadeAnimBackgroundDos,
          }}
        >
          <TouchableOpacity onPress={hideBottomDos} style={{ flex: 1 }}></TouchableOpacity>
        </Animated.View>
      )}

      {isBottomVisibleDos && (
        <Animated.View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: width,
          height: height,
          backgroundColor: 'white',
          padding: 10,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          transform: [{ translateY: slideAnimBottomDos }]
        }}>
          <TouchableOpacity onPress={hideBottomDos} style={{ alignSelf: 'flex-end' }}>
            <FontAwesome name="close" size={24} color="black" />
          </TouchableOpacity>
          <View>
            {RenderAvisoPago()}
          </View>
        </Animated.View>
      )}
      {/* MODAL AVISOS DE PAGOS */}





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
  )



};

export default InicioScreen;

