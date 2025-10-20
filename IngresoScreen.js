//import * as React from 'react';
import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, StatusBar, ActivityIndicator, ScrollView, Platform, Button } from 'react-native';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from './Modal.js'
import { LinearGradient } from 'expo-linear-gradient';
import { Notifications } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';

import { AuthContext } from './utils';
import ActivityIndi from './activityIndi.js'
import { ServidorExport } from './ServAdress.js'
import { styles } from "./Style.js";

let fontWidth = Dimensions.get('window').width;

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  )



const IngresoScreen = ({navigation }) => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [hola, setHola] = React.useState('0');
    const { signIn } = React.useContext(AuthContext);
    const inputElementRef = React.useRef(null);



        //MANEJO DEL MODAL POPUP
        const [ModalVisible, setModalVisible] = React.useState(false);
        const [ModalType, setModalType] = React.useState('');
        const [ModalTitle, setModalTitle] = React.useState('');
        const [ModalBody, setModalBody] = React.useState('');
        const [ModalFunc, setModalfunc] = React.useState()
        const ModalOptions = (type, title, body, func) =>{
          setModalVisible(true);
          setModalType(type);
          setModalTitle(title);
          setModalBody(body);
    
          if(func == 'close'){
            setModalfunc('close')
          }else{
            setModalfunc(() => func)
          }
          
    
        }
        const handleClose = () =>{
          setModalVisible(false)
        }
        //MANEJO DEL MODAL POPUP

    const activity = () =>{
        if (hola == '1') {
            return (
              <ActivityIndi/>
            )
          } 
    }

    const UserLoginFunction = () =>{
      console.log('1')
        Keyboard.dismiss()
        setHola('1')
    
        if (username == '') {
          ModalOptions('Error', 'Falta un correo', 'Debes ingresar un correo','close');
          setHola('0')
    
        } else if (password == '') {
          ModalOptions('Error', 'Falta una clave', 'Debes ingresar una clave','close');
          setHola('0')
        } else {
          console.log('2')
          console.log(username)
          console.log(password)
          fetch(`${ServidorExport}/partner/login.php`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
    
              correo: username,
    
              clave: password
    
            })
    
          })
     
            .then((response) => {
    
    
              if (!response.ok || response.status != 200 || response.status != '200') {
                ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente','close');
                setHola('0')
                
              } else {
                response.json()
                  .then(responser => {
                    console.log('3')
                    console.log(responser);
                    if (responser === 'Ingreso exitoso') {
                        setHola('0')
                     
                      var sSpace = username;
                      var okof = sSpace.trim();
                      AsyncStorage.setItem('Key_28', password);
                      console.log('ingreso exitoso')
                      signIn({ okof, password });


 
                      //AsyncStorage.setItem('Key_27', okof);
                      
                      //this.props.navigation.navigate('Inicio');
    
    
    
                    } else if (responser == 'Este usuario no existe') {
                      ModalOptions('Error', 'Ooops!', 'Este usuario no existe, revisa que hayas escrito bien el correo','close');
                      setHola('0')

                    } else if (responser == 'Debes Verificar tu cuenta') {
                      ModalOptions('Error', 'Ooops!', 'Debes verificar tu cuenta para ingresar','close');
                      setHola('0')
    
                    } else if (responser == 'Usuario o clave erroneos') {
                      ModalOptions('Error', 'Ooops!', 'El correo o la clave no coinciden','close');
                      setHola('0')
    
                    } else {
                      ModalOptions('Error', 'Error', 'Error, intenta otra vez','close');
                      setHola('0')
                    
    
                    }
    
    
                  })
              }
    
            })
            .catch((error) => {
              console.log(error)
              ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente','close');
              setHola('0')
             
            });
    
        }
    }




    
    return (
        <View style={{ flex: 1 }}>
  
  
          <DismissKeyboard style={{ flex: 1 }}>
  
  
  
            <View style={styles.container}>

  
  
  
              <StatusBar
                barStyle="ligth-content"
              />
              {activity()}
              {/* <View
                style={{
                  backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'transparent',
                  height: Constants.statusBarHeight,
                  width: '100%',
                }} /> */}

                <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={Platform.select({ios: 0, android: 0})} behavior= {(Platform.OS === 'ios')? "padding" : null} >


                <View style={{flex:1}}>
                  <Image
                      style={{
                          alignSelf: 'flex-start',
                          width: '100%',
                          height: '100%',
                          marginBottom: 0,
                      }}
                      source={require('./assets/bgIngreso.png')}
                  />
                </View>






<View style={{flex:1, width:'100%', height:'100%', position:'absolute', zIndex:99, backgroundColor:'transparent'}}>
                <View style={{flex:1}}>
              </View>
  
        
        
        
        
        
        
        

         <View style={{flex:1, width:'100%',alignItems:'center', paddingTop:25, paddingHorizontal:15, borderWidth:1, borderColor:'#fff', backgroundColor:'#fff', borderTopRightRadius:20, borderTopLeftRadius:20,}}>
  
         <Text style={[styles.NewTextHeader,{marginBottom:19}]}>Ingresar</Text>
  
              <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { usr.focus(); }}>

                <TextInput
                style={styles.inputs}
                placeholderTextColor="#909fac"
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                maxLength={100}

                  placeholder="Correo"
                  onChangeText={correo => setUsername(correo)}
                  ref={(input) => { usr = input; }}
                  returnKeyType={"next"}
                  onSubmitEditing={() => { clave.focus(); }}
                />
              </TouchableOpacity>
  
              <TouchableOpacity activeOpacity={1} style={[styles.ctninputs,{marginBottom:0}]} onPress={() => { clave.focus(); }}>
            
                <TextInput
                  style={styles.inputs}
                  placeholderTextColor="#909fac"
                  placeholderStyle={styles.placeHolderStyle}
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect={false}
                  maxLength={100}

                  
                  placeholder="Clave"
                  secureTextEntry={true}
                  onChangeText={clave => setPassword(clave)}
                  ref={(input) => { clave = input; }}
                  returnKeyType={"next"}
                  onSubmitEditing={() =>  UserLoginFunction() }
                />
              </TouchableOpacity>
  
              <TouchableOpacity activeOpacity={1} style={styles.btnNoBg} onPress={() => navigation.navigate('RecuperarClave')}>
                <Text style={styles.btnNoBgText}>Recuperar clave</Text>
              </TouchableOpacity>
  
              <LinearGradient style={{width:'100%', height:50, borderRadius:10, justifyContent:'center', alignItems:'center'}} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>
       
                <TouchableOpacity style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}} activeOpacity={1} onPress={() => UserLoginFunction()}>
                  <Text style={styles.txtBtn}>Ingresar</Text>
                </TouchableOpacity>

              </LinearGradient>


              <TouchableOpacity activeOpacity={1} style={styles.btnNoBgRigth} onPress={() => navigation.navigate('RegistroTerminos')}>
                <Text style={styles.btnNoBgText}>Regístrate</Text>
              </TouchableOpacity>
  
  
  
          </View>
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
              
        </View>
      );
  }
export default IngresoScreen;
  