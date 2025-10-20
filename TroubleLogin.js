import React, { Component } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, View, TextInput, Platform, TouchableOpacity, Alert, Image, TouchableWithoutFeedback, Keyboard, StatusBar, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './utils';
import Constants from 'expo-constants';

import ActivityIndi from './activityIndi.js'
import { ServidorExport } from './ServAdress.js'
import { styles } from "./Style.js";

let fontWidth = Dimensions.get('window').width;

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  )



const TroubleLogin = ({route, navigation }) => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [hola, setHola] = React.useState('0');
    const { signIn } = React.useContext(AuthContext);
    const [valueToShow, setvalueToShow] = React.useState(route.params.value)
    const { signOut } = React.useContext(AuthContext);
    
    const activity = () =>{
        if (hola == '1') {
            return (
              <ActivityIndi/>
            )
          } 
    }
    console.log(valueToShow + 'valor');
    const salir = () => {
        AsyncStorage.removeItem('Key_27');
        AsyncStorage.removeItem('Key_28');
        signOut()
        // AsyncStorage.removeItem('Key_28');
        // this.props.navigation.navigate('Ingreso');
    }
     const RenderMensaje = () =>{
        if(valueToShow == '1'){
          return(
            <View>
              <Text allowFontScaling={false} style={styles.titulo}>Ooooops!</Text>
              <Text allowFontScaling={false} style={styles.subtitulo}>Usuario inexistente</Text>
              <Text allowFontScaling={false} style={styles.contenido}>Este usuario no está registrado, intenta nuevamente.</Text>
            </View>
          )
        }else if(valueToShow == '2'){
          return(
            <View>
              <Text allowFontScaling={false} style={styles.titulo}>Ooooops!</Text>
              <Text allowFontScaling={false} style={styles.subtitulo}>Verificar cuenta</Text>
              <Text allowFontScaling={false} style={styles.contenido}>Te enviamos un correo con un link de verificación al momento de tu registro.</Text>
              <Text allowFontScaling={false} style={styles.contenido}>Este correo puede haber llegado a tu carpeta de spam.</Text>
            </View>
          )
        }else if(valueToShow == '3'){
          return(
            <View>
              <Text allowFontScaling={false} style={styles.titulo}>Ooooops!</Text>
              <Text allowFontScaling={false} style={styles.subtitulo}>Contraseña incorrecta</Text>
              <Text allowFontScaling={false} style={styles.contenido}>El usuario no coincide con la contraseña, te recomendamos pedir un cambio de contraseña.</Text>
            </View>
          )
        }
        else if(valueToShow == '4'){
          return(
            <View>
              <Text allowFontScaling={false} style={styles.titulo}>Ooooops!</Text>
              <Text allowFontScaling={false} style={styles.subtitulo}>Error de conexión!</Text>
              <Text allowFontScaling={false} style={styles.contenido}>En estos momento estamos teniendo problemas, intenta mas tarde.</Text>
            </View>
          )
        }
     }
     const ToWp = () =>{
        //Linking.openURL(`whatsapp://send?=&phone=56945394340`)
     }


    
    return (
        <View style={{flex:1}}>
        <DismissKeyboard>
        <View style={styles.containerTroubleScreen}>
        {activity()}
        <StatusBar
            barStyle="dark-content"
            backgroundColor="#fff"
        />
        <View
            style={{
              backgroundColor: Platform.OS === 'ios' ? '#fff' : '#fff',
              height: Constants.statusBarHeight,
              width: '100%',
        }} />
         
       
 
<View style={{width:'100%', marginBottom:15,}}>
  {RenderMensaje()}
</View>
          
          

 



          <TouchableOpacity style={styles.Btn} onPress={() => salir()}>
            <Text allowFontScaling={false} style={styles.txtBtn}>Salir</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={1} style={styles.btnNoBg} onPress={() => ToWp()}>
                <Text style={styles.btnNoBgText}>Contáctanos</Text>
              </TouchableOpacity>





        </View>
      </DismissKeyboard>
      </View>
      );
  }
export default TroubleLogin;

  
  