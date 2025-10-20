import * as React from 'react';
import { Button, Text, TextInput, View, Alert, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';

import { initiateSocketConnection, disconnectSocket } from './Socket.js';

import SplashScreen from './SplashScreen';
import PrimeraScreen from './PrimeraScreen.js'
import IngresoScreen from './IngresoScreen.js'
import RecuperarClaveScreen from './RecuperarClaveScreen.js'

import RegistroTerminosScreen from './RegistroTerminosScreen.js'
import RegistroUnoScreen from './RegistroUnoScreen.js'
import RegistroDosScreen from './RegistroDosScreen.js'
import RegistroTresScreen from './RegistroTresScreen.js'
import RegistroCuatroScreen from './RegistroCuatroScreen.js'
import RegistroLocalScreen from './RegistroLocalScreen.js'
import RegistroCincoScreen from './RegistroCincoScreen.js'
import RegistroSeisScreen from './RegistroSeisScreen.js'
import RegistroSieteScreen from './RegistroSieteScreen.js'

import RegistroDireccionScreen from './RegistroDireccionScreen.js'
import RegistroFechaNacimientoScreen from './RegistroFechaNacimientoScreen.js'

import RegistroAntecedentes from './RegistroAntecedentes.js'




//import InicioOffScreen from './InicioOffScreen.js'







import LoadScreen from './LoadScreen.js';

import InicioScreen from './InicioScreen.js'

import CrearViajeLargoScreen from './CrearViajeLargoScreen.js'
import DetalleViajeLargoScreen from './DetalleViajeLargoScreen.js'
import EditViajeLargoScreen from './EditViajeLargoScreen.js'

import CrearViajeCortoScreen from './CrearViajeCortoScreen.js'
import DetalleViajeCortoScreen from './DetalleViajeCortoScreen.js'
import EditViajeCortoScreen from './EditViajeCortoScreen.js'




import CrearViajeGruaScreen from './CrearViajeGruaScreen.js'
import DetalleViajeGruaScreen from './DetalleViajeGruaScreen.js'
import EditViajeGruaScreen from './EditViajeGruaScreen.js'


import SelectCargaEspecialScreen from './SelectCargaEspecialScreen.js'



import CrearViajeLargoEspecialScreen from './CrearViajeLargoEspecialScreen.js'
import DetalleViajeLargoEspecialScreen from './DetalleViajeLargoEspecialScreen.js'
import EditViajeLargoEspecialScreen from './EditViajeLargoEspecialScreen.js'

import CrearViajeCortoEspecialScreen from './CrearViajeCortoEspecialScreen.js'
import DetalleViajeCortoEspecialScreen from './DetalleViajeCortoEspecialScreen.js'
import EditViajeCortoEspecialScreen from './EditViajeCortoEspecialScreen.js'

import SolicitudViajeLargoScreen from './SolicitudViajeLargoScreen.js'
import SolicitudViajeCortoScreen from './SolicitudViajeCortoScreen.js'
import SolicitudViajeGruaScreen from './SolicitudViajeGruaScreen.js'
import SolicitudViajeLargoEspecialScreen from './SolicitudViajeLargoEspecialScreen.js'

import SolicitudViajeCortoEspecialScreen from './SolicitudViajeCortoEspecialScreen.js'


import SolicitudesScreen from './SolicitudesScreen.js'


import CargaViajeLargoScreen from './CargaViajeLargoScreen.js'
import CargaViajeCortoScreen from './CargaViajeCortoScreen.js'
import CargaViajeGruaScreen from './CargaViajeGruaScreen.js'
import CargaViajeLargoEspecialScreen from './CargaViajeLargoEspecialScreen.js'
import CargaViajeCortoEspecialScreen from './CargaViajeCortoEspecialScreen.js'



import MensajesScreen from './MensajesScreen.js'
import ChatScreen from './ChatScreen.js'

import NotisScreen from './NotisScreen.js'
import DetalleNotiScreen from './DetalleNotiScreen.js'

import MisViajesUnoScreen from './MisViajesUnoScreen.js'
import MisViajesDosScreen from './MisViajesDosScreen.js'

import GananciasScreen from './GananciasScreen.js'
import CotizadorScreen from './CotizadorScreen.js'

import BilleteraScreen from './BilleteraScreen.js'
import AddBancoScreen from './AddBancoScreen.js'

import FacturacionScreen from './FacturacionScreen.js'

import CalificacionesScreen from './CalificacionesScreen'
import DetalleCalifScreen from './DetalleCalifScreen.js'
import SoSScreen from './SoSScreen.js'

import AddContactoEmergenciaScreen from './AddContactoEmergenciaScreen.js'
import ContactoConveyScreen from './ContactoConveyScreen.js'


import ConfiguracionScreen from './ConfiguracionScreen.js'

import CamionScreen from './CamionScreen.js'
import AddCamionScreen from './AddCamionScreen.js'

import MisDocScreen from './MisDocScreen.js'
import LicenciaDeConducirScreen from './LicenciaDeConducirScreen.js'
import AddLicenciaScreen from './AddLicenciaScreen.js'

import CertificadoAntecedentesScreen from './CertificadoAntecedentesScreen.js'
import AddCertificadoAntecedentesScreen from './AddCertificadoAntecedentesScreen.js'

import CedulaScreen from './CedulaScreen.js'
import AddCedulaScreen from './AddCedulaScreen.js'

import AutSiiScreen from './AutSiiScreen.js'
import AddAutSiiScreen from './AddAutSiiScreen.js'

import InformacionPersonalScreen from './InformacionPersonalScreen.js'
import EditarFotoPerfilScreen from './EditarFotoPerfilScreen.js'

import DescripcionScreen from './DescripcionScreen.js'

import HistorialMedicosScreen from './HistorialMedicosScreen.js'
import DatosPersonalesScreen from './DatosPersonalesScreen.js'
import SeguridadScreen from './SeguridadScreen.js'
// import ProdScreen from './ProdScreen.js'
// import CarritoScreen from './CarritoScreen.js'
// import ConfirmarPedidoScreen from './ConfirmarPedidoScreen.js'
// import PedidoScreen from './PedidoScreen.js'
// import DetallePedidoScreen from './DetallePedidoScreen.js'
import TroubleLogin from './TroubleLogin.js'
// import NotificacionesScreen from './NotificacionesScreen.js'
// import NotifiDetalleScreen from './NotifiDetalleScreen.js'
// import AjustesScreen from './AjustesScreen.js'
// import InfoUsuario from './InfoUsuario.js'
// import HistorialScreen from './HistorialScreen.js'
// import DetalleHistorialScreen from './DetalleHistorialScreen.js'

// import EditarDireUno from './EditarDireUno.js'
// import EditarDireDos from './EditarDireDos.js'

// import ReclamoScreen from './ReclamoScreen.js'
// import WebpayScreen from './WebpayScreen.js'



import { AuthContext } from './utils';





import {
  useFonts,
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from '@expo-google-fonts/poppins'

const prefix = Linking.createURL('/');
console.log(prefix)
const config = {
  screens: {
    HomeStack: {
      path: 'HomeStack',
      screens: {
        // Compras:{
        //   path:'Compras',
        // },
        // Perfil:{
        //   path:'Perfil'
        // },
        Noti: {
          path: 'Noti/:User'
        }
        // Producto:{
        //   path:'Producto'
        // }
      }
    }
  }
};
const linking = {
  prefixes: [prefix],
  config,
  // async getInitialURL() {
  //   // First, you may want to do the default deep link handling
  //   // Check if app was opened from a deep link
  //   const urli = await Linking.getInitialURL();
  //   console.log(urli +' iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
  //   if (urli != null) {
  //     return urli;
  //   }


  //   // Handle URL from expo push notifications
  //   //  const response = await Notifications.getLastNotificationResponseAsync();
  //   //  const urln = response?.notification.request.content.data.url;
  //   //  console.log(urln +' n')

  //   //  return urln;
  // },
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => listener(url);

    // Listen to incoming links from deep linking
    const linkingSubscription = Linking.addEventListener('url', onReceiveURL);

    // Listen to expo push notifications
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {

      //el de abajo es el dato del json cuando la notificacion viene desde expo tool
      //Alert.alert(response.notification.request.content.data.data.path)
      //console.log(response.notification.request.content.data.data.path);
      //const url = response.notification.request.content.data.data.path

      //el de abajo es el dato del json cuando la notificacion viene desde la app despachador
      //Alert.alert(response.notification.request.content.data.path)
      //console.log(response.notification.request.content.data.path);
      const url = response.notification.request.content.data.path


      //console.log(url +' u');

      //con el de abajo de prueba el deeplink de la notificacion en el expo tool notification
      //{"data": {"path": "exp://192.168.100.24:19000/--/HomeStack/Compras"}}
      //cuando esta construida la app se envia des notification tool de expo
      //{"data": {"path": "fluvi:///HomeStack/Compras"}}
      // Let React Navigation handle the URL
      listener(url);
    });

    return () => {
      if (linkingSubscription && linkingSubscription.remove) {
        linkingSubscription.remove();
      }
      subscription.remove();
    };

  },
};
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});








Text.defaultProps = {
  ...(Text.defaultProps || {}),
  allowFontScaling: false,
};
TextInput.defaultProps = {
  ...(TextInput.defaultProps || {}),
  allowFontScaling: false,
};





const Stack = createNativeStackNavigator();


const HomeStack = createNativeStackNavigator();
const HomeStackScreens = () => {

  return (
    <HomeStack.Navigator initialRouteName={'Load'} screenOptions={{ animationEnabled: true, headerShown: false, animation: 'none' }}>
      <Stack.Screen name="Load" component={LoadScreen} />
      <Stack.Screen name="TroubleLogin" component={TroubleLogin} options={{
        animationEnabled: false,
        animationEnabled: false,
        transitionConfig: () => ({
          transitionSpec: {
            duration: 0,
            timing: 0,
          },
        })
      }} />


      <Stack.Screen name="Inicio" component={InicioScreen} options={{
        animationEnabled: false,
        animationEnabled: false,
        transitionConfig: () => ({
          transitionSpec: {
            duration: 0,
            timing: 0,
          },
        })
      }} />
      <Stack.Screen name="CrearViajeLargo" component={CrearViajeLargoScreen} />
      <Stack.Screen name="DetalleViajeLargo" component={DetalleViajeLargoScreen} />
      <Stack.Screen name="EditViajeLargo" component={EditViajeLargoScreen} />


      <Stack.Screen name="CrearViajeCorto" component={CrearViajeCortoScreen} />
      <Stack.Screen name="DetalleViajeCorto" component={DetalleViajeCortoScreen} />
      <Stack.Screen name="EditViajeCorto" component={EditViajeCortoScreen} />



      <Stack.Screen name="CrearViajeGrua" component={CrearViajeGruaScreen} />
      <Stack.Screen name="DetalleViajeGrua" component={DetalleViajeGruaScreen} />
      <Stack.Screen name="EditViajeGrua" component={EditViajeGruaScreen} />

      <Stack.Screen name="SelectCargaEspecial" component={SelectCargaEspecialScreen} />



      <Stack.Screen name="CrearViajeLargoEspecial" component={CrearViajeLargoEspecialScreen} />
      <Stack.Screen name="DetalleViajeLargoEspecial" component={DetalleViajeLargoEspecialScreen} />
      <Stack.Screen name="EditViajeLargoEspecial" component={EditViajeLargoEspecialScreen} />

      <Stack.Screen name="CrearViajeCortoEspecial" component={CrearViajeCortoEspecialScreen} />
      <Stack.Screen name="DetalleViajeCortoEspecial" component={DetalleViajeCortoEspecialScreen} />
      <Stack.Screen name="EditViajeCortoEspecial" component={EditViajeCortoEspecialScreen} />

      <Stack.Screen name="SolicitudViajeLargo" component={SolicitudViajeLargoScreen} />
      <Stack.Screen name="SolicitudViajeCorto" component={SolicitudViajeCortoScreen} />
      <Stack.Screen name="SolicitudViajeGrua" component={SolicitudViajeGruaScreen} />
      <Stack.Screen name="SolicitudViajeLargoEspecial" component={SolicitudViajeLargoEspecialScreen} />
      <Stack.Screen name="SolicitudViajeCortoEspecial" component={SolicitudViajeCortoEspecialScreen} />



      <Stack.Screen name="Solicitudes" component={SolicitudesScreen} />


      <Stack.Screen name="CargaViajeLargo" component={CargaViajeLargoScreen} />
      <Stack.Screen name="CargaViajeCorto" component={CargaViajeCortoScreen} />
      <Stack.Screen name="CargaViajeGrua" component={CargaViajeGruaScreen} />
      <Stack.Screen name="CargaViajeLargoEspecial" component={CargaViajeLargoEspecialScreen} />
      <Stack.Screen name="CargaViajeCortoEspecial" component={CargaViajeCortoEspecialScreen} />



      <Stack.Screen name="Mensajes" component={MensajesScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />


      <Stack.Screen name="Notis" component={NotisScreen} />
      <Stack.Screen name="DetalleNoti" component={DetalleNotiScreen} />



      {/* PANTALLAS NUEVAS */}
      <Stack.Screen name="MisViajesUno" component={MisViajesUnoScreen} />
      <Stack.Screen name="MisViajesDos" component={MisViajesDosScreen} />

      <Stack.Screen name="Ganancias" component={GananciasScreen} />
      <Stack.Screen name="Cotizador" component={CotizadorScreen} />

      <Stack.Screen name="Billetera" component={BilleteraScreen} />
      <Stack.Screen name="AddBanco" component={AddBancoScreen} />

      <Stack.Screen name="Facturacion" component={FacturacionScreen} />
      <Stack.Screen name="Calificaciones" component={CalificacionesScreen} />

      <Stack.Screen name="DetalleCalif" component={DetalleCalifScreen} />
      <Stack.Screen name="SoS" component={SoSScreen} />

      <Stack.Screen name="AddContactoEmergencia" component={AddContactoEmergenciaScreen} />
      <Stack.Screen name="ContactoConvey" component={ContactoConveyScreen} />


      <Stack.Screen name="Configuracion" component={ConfiguracionScreen} />
      <Stack.Screen name="Camion" component={CamionScreen} />
      <Stack.Screen name="AddCamion" component={AddCamionScreen} />

      <Stack.Screen name="MisDoc" component={MisDocScreen} />
      <Stack.Screen name="LicenciaDeConducir" component={LicenciaDeConducirScreen} />
      <Stack.Screen name="AddLicencia" component={AddLicenciaScreen} />

      <Stack.Screen name="CertificadoAntecedentes" component={CertificadoAntecedentesScreen} />
      <Stack.Screen name="AddCertificadoAntecedentes" component={AddCertificadoAntecedentesScreen} />

      <Stack.Screen name="Cedula" component={CedulaScreen} />
      <Stack.Screen name="AddCedula" component={AddCedulaScreen} />

      <Stack.Screen name="AutSii" component={AutSiiScreen} />
      <Stack.Screen name="AddAutSii" component={AddAutSiiScreen} />

      <Stack.Screen name="InformacionPersonal" component={InformacionPersonalScreen} />
      <Stack.Screen name="EditarFotoPerfil" component={EditarFotoPerfilScreen} />

      <Stack.Screen name="Descripcion" component={DescripcionScreen} />

      <Stack.Screen name="HistorialMedicos" component={HistorialMedicosScreen} />

      <Stack.Screen name="DatosPersonales" component={DatosPersonalesScreen} />
      <Stack.Screen name="Seguridad" component={SeguridadScreen} />



      {/*<Stack.Screen name="Prod" component={ProdScreen} />
      <Stack.Screen name="Carrito" component={CarritoScreen} />
      <Stack.Screen name="ConfirmarPedido" component={ConfirmarPedidoScreen} />
      <Stack.Screen name="Pedido" component={PedidoScreen} />
      <Stack.Screen name="DetallePedido" component={DetallePedidoScreen} />
      
      <Stack.Screen name="Noti" component={NotificacionesScreen} />
      <Stack.Screen name="DetalleNoti" component={NotifiDetalleScreen} />
      
      <Stack.Screen name="Ajustes" component={AjustesScreen} />  
      <Stack.Screen name="InfoUsuario" component={InfoUsuario} />   
      <Stack.Screen name="Historial" component={HistorialScreen} />
      <Stack.Screen name="DetalleHistorial" component={DetalleHistorialScreen} />
      
      <Stack.Screen name="EditDireUno" component={EditarDireUno} />  
      <Stack.Screen name="EditDireDos" component={EditarDireDos} />  

       

      
      <Stack.Screen name="Reclamo" component={ReclamoScreen} /> 


      <Stack.Screen name="Webpay" component={WebpayScreen} options={{
              animationEnabled: false,
              animationEnabled:false,
              gestureEnabled:false,
              transitionConfig: () => ({
                transitionSpec: {
                  duration:0,
                  timing: 0,
                },
              })
      }}/>       */}


    </HomeStack.Navigator>
  )
}

const AuthStack = createNativeStackNavigator();
const AuthStackScreens = () => {

  return (
    <HomeStack.Navigator initialRouteName={"Ingreso"}
      screenOptions={{ headerShown: false, animationEnabled: false, gestureEnabled: false, animation: 'none' }}>
      {/* <Stack.Screen name="Primera" component={PrimeraScreen} /> */}

      <Stack.Screen name="Ingreso" component={IngresoScreen} />
      <Stack.Screen name="RecuperarClave" component={RecuperarClaveScreen} />

      <Stack.Screen name="RegistroTerminos" component={RegistroTerminosScreen} />



      <Stack.Screen name="RegistroUno" component={RegistroUnoScreen} />
      <Stack.Screen name="RegistroDos" component={RegistroDosScreen} />
      <Stack.Screen name="RegistroTres" component={RegistroTresScreen} />
      <Stack.Screen name="RegistroCuatro" component={RegistroCuatroScreen} />
      <Stack.Screen name="RegistroLocal" component={RegistroLocalScreen} />

      <Stack.Screen name="RegistroCinco" component={RegistroCincoScreen} />
      <Stack.Screen name="RegistroSeis" component={RegistroSeisScreen} />
      <Stack.Screen name="RegistroSiete" component={RegistroSieteScreen} />

      <Stack.Screen name="RegistroDireccion" component={RegistroDireccionScreen} />
      <Stack.Screen name="RegistroFechaNacimiento" component={RegistroFechaNacimientoScreen} />

      <Stack.Screen name="RegistroAntecedentes" component={RegistroAntecedentes} />



      {/* <Stack.Screen name="InicioOff" component={InicioOffScreen}/> */}
      {/* <Stack.Screen name="ProductosOff" component={productosOffScreen}/> */}

    </HomeStack.Navigator>
  )
}

export default function App({ navigation }) {
  const [state, dispatch] = React.useReducer(

    (prevState, action) => {
      console.log(action.token + '<--- el action.tocken');
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          if (action.token) {
            AsyncStorage.setItem('Key_27', action.token)
          }
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          AsyncStorage.removeItem('Key_27')
          AsyncStorage.removeItem('Key_28')
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
      //let dbLogin;

      try {
        userToken = await AsyncStorage.getItem('Key_27');//poner token Key_27  userToken
        //poner funciones aqui ? logeo y webpay pedido pendiente
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };








    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        //console.log('SignIn Data:', data,  data.okof)

        dispatch({ type: 'SIGN_IN', token: data.okof });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: data.okof });
      },
    }),
    []
  );


  let [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
  });



  // SOCKET CONNECTION
  const [appState, setAppState] = React.useState(AppState.currentState);

  React.useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // La app ha vuelto al foreground, re-iniciamos la conexión
        initiateSocketConnection();
      }

      if (nextAppState === 'background') {
        // La app ha pasado a segundo plano, desconectamos el socket
        disconnectSocket();
      }

      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      disconnectSocket(); // Limpiar la conexión si el componente se desmonta
    };
  }, [appState]);

  React.useEffect(() => {
    // Iniciar la conexión cuando la app se monta
    initiateSocketConnection();

    return () => {
      // Desconectar el socket cuando la app se desmonte
      disconnectSocket();
    };
  }, []);
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer linking={linking} screenoptions={{ headerShown: false, animationEnabled: false, animation: 'none' }}>
        <Stack.Navigator screenOptions={{ animationEnabled: false, headerShown: false }}>
          {state.isLoading || !fontsLoaded ? (
            <Stack.Screen name="Splash" component={SplashScreen} options={{
              animationEnabled: false,
              headerShown: false,
              animation: 'none'
            }} />
          ) : state.userToken == null ? (
            <Stack.Screen name="AuthStack" component={AuthStackScreens} options={{
              animationEnabled: false,
              headerShown: false,
              animation: 'none'
            }} />
          ) : (
            <Stack.Screen name="HomeStack" component={HomeStackScreens} options={{
              animationEnabled: false,
              headerShown: false,
              animation: 'none'
            }} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
