import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, ScrollView, TouchableWithoutFeedback, Platform, Keyboard, Animated, KeyboardAvoidingView, TouchableOpacity, TextInput, ActivityIndicator, StatusBar } from 'react-native';
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
const AddContactoEmergenciaScreen = ({route, navigation}) => {
    const [admin, setAdmin] = React.useState('');
    const [ActivityShow, setActivityShow] = React.useState(false);

    const [nombre, setNombre] = React.useState(route.params.Nombre);
    const [prefijo, setPrefijo] = React.useState('+56');
    const [paisImg, setPaisImg] = React.useState('chile'); // Solo el nombre del archivo
    const [numero, setnumero] = React.useState(route.params.Numero);

    
    


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
  
        });
      
     
        return unsubscribe;
      }, [navigation]);

      passBack = () =>{
        navigation.goBack()
      }

    const AddContacto = () =>{
        console.log(admin)
        console.log(nombre)
        console.log(numero)
        setActivityShow(prev => true)
          Keyboard.dismiss()
      
          if (nombre == '') {
            ModalOptions('Error', 'Falta un correo', 'Debes ingresar un correo','close');
            setActivityShow(prev => false)
      
          } else if (numero == '') {
            ModalOptions('Error', 'Falta un número', 'Debes ingresar un número telefónico','close');
            setActivityShow(prev => false)
          } 
          
          else {
            console.log(admin)
            console.log(nombre)
            console.log(numero)
            fetch(`${ServidorExport}/partner/CrearContactoEmergencia.php`, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
      
                correo: admin,
                nombre: nombre,
                numero: numero,

      
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
                        ModalOptions('Exito', 'Genial!', 'Contacto creado con éxito',passBack);
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

      const EditarContacto = () =>{
        setActivityShow(prev => true)
          Keyboard.dismiss()
      
          if (nombre == '') {
            ModalOptions('Error', 'Falta un correo', 'Debes ingresar un correo','close');
            setActivityShow(prev => false)
      
        } else if (numero == '') {
            ModalOptions('Error', 'Falta un número', 'Debes ingresar un número telefónico','close');
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
                numero: numero,

      
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
    
      returnImageFlag = () =>{
        if(paisImg == 'chile'){
          return(
            <Image
            resizeMode="contain"
              style={{
                width:25,
                height:25,
                marginRight:10,
              }}
              source={require(`./assets/flags/chile.png`)}
          />
          )
        }else if(paisImg == 'argentina'){
          return(
            <Image
            resizeMode="contain"
              style={{
                width:25,
                height:25,
                marginRight:10,
              }}
              source={require(`./assets/flags/argentina.png`)}
          />
          )
        }
      }
    
      setToUseFlag = (prefix, country) =>{
        setPrefijo(prefix) 
        setPaisImg(country)
        toggleModal()
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


                
               <Text style={styles.TextHeader}>Contacto de emergencia</Text>
  

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

                <TouchableOpacity activeOpacity={1} style={styles.ctntelefono} onPress={() => { num.focus(); }}>
                    {/* <Text style={styles.labels}>Número De Teléfono</Text> */}
                    <View style={{ flexDirection: 'row', }}>
                    <TouchableOpacity onPress={toggleModal} style={{ flexDirection:'row', justifyContent:'center', alignItems:'center', marginBottom: 5, marginRight: 5, marginLeft:5, paddingTop: 0, paddingRight: 8, borderRightWidth: 1, borderRightColor: '#cacaca' }}>
                        
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
                        value={numero}
                        placeholder='teléfono'
                        onChangeText={numero => setnumero(numero)}
                        ref={(input) => { num = input; }}
                        returnKeyType={"next"}
                        onSubmitEditing={() =>  NextPageDosScreen() }
                    />
                    </View>
                </TouchableOpacity>








                
                {route.params.Nombre != '' ? (
        <LinearGradient style={{width:'100%', height:50, borderRadius:10, justifyContent:'center', alignItems:'center'}} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>
          <TouchableOpacity style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}} activeOpacity={1} onPress={() => EditarContacto()}>
            <Text style={{ fontWeight: 'bold', color: '#000' }}>Editar</Text>
          </TouchableOpacity>
        </LinearGradient>
      ) : (
        <LinearGradient style={{width:'100%', height:50, borderRadius:10, justifyContent:'center', alignItems:'center'}} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>
          <TouchableOpacity style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}} activeOpacity={1} onPress={() => AddContacto()}>
            <Text style={{ fontWeight: 'bold', color: '#000' }}>Agregar</Text>
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



        {modalVisibleD && (
                <TouchableOpacity activeOpacity={1} onPress={() => { toggleModal()}} style={stylesDos.modalContainer}>
                <Animated.View style={[stylesDos.modalBackground, { opacity: opacity }]} />
                <Animated.View style={[stylesDos.modalContent, { transform: [{ translateY: translateY }] }]}>
                    <Text style={{ color: '#141414', fontFamily: 'Poppins_700Bold', fontSize: 15, marginBottom:15,}}>Anexo de paises disponibles</Text>


                    <TouchableOpacity  onPress={() => { setToUseFlag('+56','chile') }} 
                    style={{width:'90%', height:'auto', backgroundColor:'#fff', flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10, }}>
                    <View>
                        <Image
                        resizeMode="contain"
                            style={{
                            width:30,
                            height:30,
                            }}
                            source={require('./assets/flags/chile.png')}
                        />
                    </View>
                    <View>
                        <Text style={{ color: '#141414', fontFamily: 'Poppins_700Bold', fontSize: 15,}}>Chile</Text>
                    </View>
                    <View>
                        <Text style={{ color: '#141414', fontFamily: 'Poppins_700Bold', fontSize: 15,}}>+56</Text>
                    </View>
                    </TouchableOpacity>



                    <TouchableOpacity onPress={() => { setToUseFlag('+54','argentina') }} 
                    style={{width:'90%', height:'auto', backgroundColor:'#fff', flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                    <View>
                        <Image
                        resizeMode="contain"
                            style={{
                            width:30,
                            height:30,
                            }}
                            source={require('./assets/flags/argentina.png')}
                        />
                    </View>
                    <View>
                        <Text style={{ color: '#141414', fontFamily: 'Poppins_700Bold', fontSize: 15,}}>Argentina</Text>
                    </View>
                    <View>
                        <Text style={{ color: '#141414', fontFamily: 'Poppins_700Bold', fontSize: 15,}}>+54</Text>
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
};

export default AddContactoEmergenciaScreen;
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