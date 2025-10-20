import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, ScrollView, TouchableWithoutFeedback, Platform, Keyboard, Alert, KeyboardAvoidingView, TouchableOpacity, TextInput, ActivityIndicator, StatusBar } from 'react-native';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Modal from './Modal.js';
import ActivityIndi from './activityIndi.js'
import { ServidorExport } from './ServAdress.js'
import { styles } from "./Style.js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import TextTicker from 'react-native-text-ticker'
// import { GeoCodingApiGoogle } from './GeoCodingApi.js'

let fontWidth = Dimensions.get('window').width;

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  )

// create a component
const AddBancoScreen = ({route, navigation}) => {
    const [admin, setAdmin] = React.useState('');
    const [ActivityShow, setActivityShow] = React.useState(false);

    const [nombre, setNombre] = React.useState(route.params.Nombre);
    const [rut, setRut] = React.useState(route.params.Rut);
    const [banco, setBanco] = React.useState(route.params.Banco);
    const [tipoCuenta, setTipocuenta] = React.useState(route.params.TipoCuenta);
    const [numCuenta, setNumCuenta] = React.useState(route.params.NumeroCuenta);
    const [email, setEmail] = React.useState(route.params.Email);
    


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
    activity = () => {
        if (ActivityShow == true) {
            return (
                    <ActivityIndi/>
            )
        } 
    }
 
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            var userToken = await AsyncStorage.getItem('Key_27');
            setAdmin(prev =>userToken )
            fetchBanco(userToken)
  
        });
      
     
        return unsubscribe;
      }, [navigation]);

      passBack = () =>{
        navigation.navigate('Billetera')
      }

    const AddTarjeta = () =>{
        setActivityShow(prev => true)
          Keyboard.dismiss()
      
          if (nombre == '') {
            ModalOptions('Error', 'Falta un correo', 'Debes ingresar un correo','close');
            setActivityShow(prev => false)
      
          } else if (rut == '') {
            ModalOptions('Error', 'Falta una clave', 'Debes ingresar una clave','close');
            setActivityShow(prev => false)
          } else if (banco == '') {
            ModalOptions('Error', 'Falta una clave', 'Debes ingresar una clave','close');
            setActivityShow(prev => false)
          }
          else if (tipoCuenta == '') {
            ModalOptions('Error', 'Falta una clave', 'Debes ingresar una clave','close');
            setActivityShow(prev => false)
          }
          else if (numCuenta == '') {
            ModalOptions('Error', 'Falta una clave', 'Debes ingresar una clave','close');
            setActivityShow(prev => false)
          }
          
          else {

            fetch(`${ServidorExport}/partner/CrearBanco.php`, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
      
                correo: admin,
                nombre: nombre,
                banco: banco,
                rut:rut,
                tipocuenta: tipoCuenta,
                numcuenta: numCuenta,
                email: email,

      
              })
      
            })
       
              .then((response) => {
      
      
                if (!response.ok || response.status != 200 || response.status != '200') {
                  ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente','close');
                  setActivityShow(prev => false)
                } else {
                  response.json()
                    .then(responser => {
                      console.log('3')
                      console.log(responser);
                      if (responser === 'exito') {
                        ModalOptions('Exito', 'Genial!', 'Tarjeta creada con éxito',passBack);
                        setActivityShow(prev => false)
      
                      } else {
                        ModalOptions('Error', 'Error', 'Error, intenta otra vez','close');
                        setActivityShow(prev => false)
      
                      }
      
      
                    })
                }
      
              })
              .catch((error) => {
                console.log(error)
                ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente','close');
                setActivityShow(prev => false)
               
              });
      
          }
      }

      const EditarBanco = () =>{
        setActivityShow(prev => true)
          Keyboard.dismiss()
      
          if (nombre == '') {
            ModalOptions('Error', 'Falta un correo', 'Debes ingresar un correo','close');
            setActivityShow(prev => false)
      
          } else if (rut == '') {
            ModalOptions('Error', 'Falta una clave', 'Debes ingresar una clave','close');
            setActivityShow(prev => false)
          } else if (banco == '') {
            ModalOptions('Error', 'Falta una clave', 'Debes ingresar una clave','close');
            setActivityShow(prev => false)
          }
          else if (tipoCuenta == '') {
            ModalOptions('Error', 'Falta una clave', 'Debes ingresar una clave','close');
            setActivityShow(prev => false)
          }
          else if (numCuenta == '') {
            ModalOptions('Error', 'Falta una clave', 'Debes ingresar una clave','close');
            setActivityShow(prev => false)
          }
          
          else {

            fetch(`${ServidorExport}/partner/EditarBanco.php`, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
      
                correo: admin,
                nombre: nombre,
                banco: banco,
                rut:rut,
                tipocuenta: tipoCuenta,
                numcuenta: numCuenta,
                email: email,

      
              })
      
            })
       
              .then((response) => {
      
      
                if (!response.ok || response.status != 200 || response.status != '200') {
                  ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente','close');
                  setActivityShow(prev => false)
                } else {
                  response.json()
                    .then(responser => {
                      console.log('3')
                      console.log(responser);
                      if (responser === 'exito') {
                        ModalOptions('Exito', 'Genial!', 'Tarjeta editada con éxito',passBack);
                        setActivityShow(prev => false)
      
                      } else {
                        ModalOptions('Error', 'Error', 'Error, intenta otra vez','close');
                        setActivityShow(prev => false)
      
                      }
      
      
                    })
                }
      
              })
              .catch((error) => {
                console.log(error)
                ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente','close');
                setActivityShow(prev => false)
               
              });
      
          }
      }



    return (
        <View style={{ flex: 1, backgroundColor:'#fff' }}>
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
                }} />
<KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.select({ios: 0, android: 0})}
        behavior= {(Platform.OS === 'ios')? "padding" : null}
      >
   
            <ScrollView style={{flex:1}} keyboardShouldPersistTaps='always'>
                {activity()}
              <View style={styles.header}>
  
               <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between'}}>

               <TouchableOpacity style={{ padding: 0, marginBottom: 10, }} onPress={() => navigation.goBack()}>
                  <FontAwesome name="arrow-left" style={styles.arrowBack} />
                </TouchableOpacity>


                


               </View>


                
               <Text style={styles.TextHeader}>Cuenta bancaria</Text>
  

               <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { nombreInp.focus(); }}>
                <View style={{ width: '80%' }}>
                    <Text style={styles.labels}>Nombre</Text>
                    <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}
                    value={nombre}
                    placeholder="ingresa tu nombre completo"
                    onChangeText={nombre => setNombre(nombre)}
                    ref={(input) => { nombreInp = input; }}
                    />
                    
                </View>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { rutInp.focus(); }}>
                <View style={{ width: '80%' }}>
                    <Text style={styles.labels}>Rut</Text>
                    <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}
                    value={rut}
                    placeholder="ingresa tu rut con puntos y guión"
                    onChangeText={rut => setRut(rut)}
                    ref={(input) => { rutInp = input; }}
                    />
                    
                </View>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { bancoInp.focus(); }}>
                <View style={{ width: '80%' }}>
                    <Text style={styles.labels}>Banco</Text>
                    <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}
                    value={banco}
                    placeholder="ingresa el nombre del banco"
                    onChangeText={banco => setBanco(banco)}
                    ref={(input) => { bancoInp = input; }}
                    />
                    
                </View>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { tipoInp.focus(); }}>
                <View style={{ width: '80%' }}>
                    <Text style={styles.labels}>Tipo cuenta</Text>
                    <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}
                    value={tipoCuenta}
                    placeholder="ingresa el tipo de cuenta"
                    onChangeText={tipo => setTipocuenta(tipo)}
                    ref={(input) => { tipoInp = input; }}
                    />
                    
                </View>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { numInp.focus(); }}>
                <View style={{ width: '80%' }}>
                    <Text style={styles.labels}>N° cuenta</Text>
                    <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}
                    value={numCuenta}
                    placeholder="ingresa el número de cuenta"
                    onChangeText={num => setNumCuenta(num)}
                    ref={(input) => { numInp = input; }}
                    />
                    
                </View>
                </TouchableOpacity>


                <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { correoInp.focus(); }}>
                <View style={{ width: '80%' }}>
                    <Text style={styles.labels}>Correo</Text>
                    <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}
                    value={email}
                    placeholder="ingresa el número de cuenta (opcional)"
                    onChangeText={correo => setEmail(correo)}
                    ref={(input) => { correoInp = input; }}
                    />
                    
                </View>
                </TouchableOpacity>
                
                {route.params.Nombre != '' ? (
        <LinearGradient style={{width:'100%', height:50, borderRadius:10, justifyContent:'center', alignItems:'center'}} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>
          <TouchableOpacity style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}} activeOpacity={1} onPress={() => EditarBanco()}>
            <Text style={{ fontWeight: 'bold', color: '#000' }}>Editar</Text>
          </TouchableOpacity>
        </LinearGradient>
      ) : (
        <LinearGradient style={{width:'100%', height:50, borderRadius:10, justifyContent:'center', alignItems:'center'}} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>
          <TouchableOpacity style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}} activeOpacity={1} onPress={() => AddTarjeta()}>
            <Text style={{ fontWeight: 'bold', color: '#000' }}>Editar</Text>
          </TouchableOpacity>
        </LinearGradient>
      )}


   
              </View>
   
   
  
              <View style={{ flex: 1, width: '100%', marginTop: 2, paddingHorizontal: 15, backgroundColor:'transparent'}}>


  

  
              
  
  
  

  
  
              </View>
  
  
  
  
  
  
  
  
            </ScrollView>
            </KeyboardAvoidingView>
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
  
        </View>
  
      );
};

export default AddBancoScreen;
