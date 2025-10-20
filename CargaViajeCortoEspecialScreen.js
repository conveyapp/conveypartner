import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, Animated, TouchableWithoutFeedback, Platform, Keyboard, Easing, KeyboardAvoidingView, TouchableOpacity, TextInput, ActivityIndicator, StatusBar } from 'react-native';
import { FontAwesome, FontAwesome6, Entypo } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Modal from './Modal.js';
import ActivityIndi from './activityIndi.js'
import { ServidorExport } from './ServAdress.js'
import { ServidorSocket } from './ServAdressSocket.js'
import { getSocket } from './Socket';
import { styles } from "./Style.js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import TextTicker from 'react-native-text-ticker'
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import io from "socket.io-client";
// import { GeoCodingApiGoogle } from './GeoCodingApi.js'
 
let fontWidth = Dimensions.get('window').width;
 
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
 
const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

// create a component
const CargaViajeCortoEspecialScreen = ({route, navigation}) => {
  const socket = getSocket();
    const [ActivityShow, setActivityShow] = React.useState(false)
    const [load, setLoad] = React.useState(true);
    const [dataSource, setDataSource] = React.useState('');
    const [conexionErr, setConexionErr] = React.useState(false);
    const [idCarga, setIdCarga] = React.useState(route.params.IdCarga);
    const [idCliente, setIdCliente] = React.useState(route.params.idCliente);
    const [correoCliente, setCorreoCliente] = React.useState(route.params.CorreoCliente);

    const [animalesSelected, setAnimalesSelected] = React.useState(false);
    const [aridosSelected, setAridosSelected] = React.useState(false);
    const [maderaSelected, setMaderaSelected] = React.useState(false);
    const [maquinariaSelected, setMaquinariaSelected] = React.useState(false);
    const [otroSelected, setOtroSelected] = React.useState(false);
    const [aceptoCargaSelected, setAceptoCargaSelected] = React.useState(false)
    
    
    const [image, setImage] = React.useState(null);
    const [imageTwo, setImageTwo] = React.useState(null);
 
    
    const [entregaDisplay, setEntregaDisplay] = React.useState(false);


    const [InfoUser, setInfoUser] = React.useState(route.params.InfoUser);
    const [InfoCarga, setInfoCarga] = React.useState(route.params.InfoCarga);
    
    const [chatExis, setChatExi] = React.useState(false)

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
    connectScoket = async () =>{
      //var userToken = await AsyncStorage.getItem('Key_27'); 
      // this.socket = io(`${ServidorSocket}`, { reconnection: false }); // mac
      // this.socket.emit("usuario", userToken);
  


    }

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            var userToken = await AsyncStorage.getItem('Key_27');
            VistoCamionero()
            fetchCargaViajeCortoEspecial(userToken)
            chatExist(userToken)
            //connectScoket()
            console.log(InfoUser.correo + ' InfoUsercorreo')
            console.log(InfoUser + ' InfoUser')
            console.log(InfoCarga + ' InfoCarga')
  
    });
      
     
        return unsubscribe;
    }, [navigation, dataSource]);
    
    React.useEffect(() => {
    (async () => {
        if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera permissions to make this work!');
        }
        }
    })();
    }, []);
 
    fetchCargaViajeCortoEspecial = async (x) => {
      console.log('ixx')
      console.log(idCarga)
        await fetch(`${ServidorExport}/partner/viajecortoespecial/TraerCargaUnicaViajeCortoEspecial.php`, {
           method: 'POST',
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({
            idcarga: idCarga,
           })
         }) 
           .then((response) => {
             if (!response.ok || response.status != 200 || response.status != '200') { 
                 setConexionErr(true)
             } else {
               response.json()
                 .then(responser => {
  
                     if(responser == "No Results Found."){
                      console.log(responser + ' kkk')
                       setDataSource(prev => '');
                       setLoad(prev => false)
                     }else{
                      console.log(responser + ' kholitkk')
                       setDataSource(prev => responser);
                       setLoad(prev => false)
                     }
  
  
                 })
             }
   
           })
           .catch((error) => {
             setConexionErr(true)
           });
      }
      const VistoCamionero = () =>{
      
        fetch(`${ServidorExport}/partner/viajecortoespecial/MarcarVistoPago.php`, {
          method: 'POST',
          headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data"
          }, 
          body: JSON.stringify({
    
            idcarga: idCarga,
  
          })
        })
            .then((response) => {
                if (!response.ok || response.status != 200 || response.status != '200') { 
                      
                } else {
                response.json()
                    .then(responser => {
                      console.log(responser);
                      if(responser == 'exito'){
                            console.log('marcadoVisto')
                      }else{
                        console.log('marcadoNoVisto')
                      }
    
    
                    })
                }
    
            })
            .catch((error) => {           
            });
    
    
      
    
      } 
      const cargarViajeCorto = () =>{


        var animalesSend;
        var aridosSend;
        var maderaSend;
        var maquinariaSend;
        var otroSend;
        var aceptoSend;
        
        if (animalesSelected == true) {
            animalesSend = 'si';
        } else {
            animalesSend = 'no';
        }
        
        if (aridosSelected == true) {
            aridosSend = 'si';
        } else {
            aridosSend = 'no';
        }
        
        if (maderaSelected == true) {
            maderaSend = 'si';
        } else {
            maderaSend = 'no';
        }
        
        if (maquinariaSelected == true) {
            maquinariaSend = 'si';
        } else {
            maquinariaSend = 'no';
        }
        
        if (otroSelected == true) {
            otroSend = 'si';
        } else {
            otroSend = 'no';
        }
        if(aceptoCargaSelected == true){
            aceptoSend = 'si'
        }else{
            aceptoSend = 'no'
        }
        
        Keyboard.dismiss()
        setActivityShow(prev => true);



        const data = new FormData();
        
        data.append('idcarga', idCarga);
        
        data.append('idcliente', idCliente);
        data.append('correocliente', correoCliente);

        data.append('animalesacept', animalesSend);
        data.append('aridosacept', aridosSend);
        data.append('maderaacept', maderaSend);
        data.append('maquinariaacept', maquinariaSend);
        data.append('otroacept', otroSend);
        

        data.append('cargaacept', aceptoSend);

        if(image){
            data.append('img', {//nombre que recibe post image file en php
              uri: image,
              type: 'image/jpeg', // or photo.type
              name: 'testPhotoName1'
            });
           
          }
        

        //data.append('comentario', coment);
    
      
        fetch(`${ServidorExport}/partner/viajecortoespecial/CargarViajeCortoEspecial.php`, {
          method: 'POST',
          headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data"
          }, 
          body: data,
        })
            .then((response) => {
                console.log(response) 
                if (!response.ok || response.status != 200 || response.status != '200') { 
                  setActivityShow(prev => false)  
                        ModalOptions('Error', 'Ooops!', 'Hubo un problema, intenta nuevamente','close')
                      
                } else {
                response.json()
                    .then(responser => {
                      console.log(responser);
                      if(responser == 'exito'){
                        setActivityShow(prev => false)
                        fetchCargaViajeCortoEspecial()

 
                        socket.emit("CargarSend", {
                            cliente: correoCliente,
                            idcarga: idCarga,
                            estado:'Cargada'
                        });
 

                        ModalOptions('Exito', 'Carga arriba', 'Bien! Subiste la carga al camión','close');
                      }else{
                        setActivityShow(prev => false)  
                        ModalOptions('Error', 'Ooops!', 'Hubo un problema, intenta nuevamente','close')
                      }
    
    
                    })
                }
    
            })
            .catch((error) => {
              setActivityShow(prev => false)  
                ModalOptions('Error', 'Ooops!', 'Hubo un problema, intenta nuevamente','close')             
            });
    
    
      
    
      } 
      backPass = () =>{
        navigation.goBack()
      }
      const EntregarCarga = async () =>{
        var userToken = await AsyncStorage.getItem('Key_27');

 
    
        Keyboard.dismiss()
        setActivityShow(prev => true);



        const data = new FormData();
    
        data.append('idcarga', idCarga);
        data.append('idcliente', idCliente);
        data.append('correo', userToken);
        
        
        if(imageTwo){
            data.append('img', {//nombre que recibe post image file en php
              uri: imageTwo,
              type: 'image/jpeg', // or photo.type
              name: 'testPhotoName1'
            });
           
          }
        

    
      
        fetch(`${ServidorExport}/partner/viajecortoespecial/EntregarViajeCortoEspecial.php`, {
          method: 'POST',
          headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data"
          }, 
          body: data,
        })
            .then((response) => {
                console.log(response)
                if (!response.ok || response.status != 200 || response.status != '200') { 
                  setActivityShow(prev => false)  
                        ModalOptions('Error', 'Ooops!', 'Hubo un problema, intenta nuevamente','close')
                      
                } else { 
                response.json()
                    .then(responser => {
                      console.log(responser);
                      if(responser == 'exito'){
                        socket.emit("EntregarSend", {
                            cliente: correoCliente,
                            idcarga: idCarga,
                            estado: 'Entregada'
                        });
                        setActivityShow(prev => false)
                        fetchCargaViajeCortoEspecial()
                        ModalOptions('Exito', 'Carga Entregada', 'Bien! Entrgaste la carga',backPass);
                      }else{
                        setActivityShow(prev => false)  
                        ModalOptions('Error', 'Ooops!', 'Hubo un problema, intenta nuevamente','close')
                      }
    
    
                    })
                }
    
            })
            .catch((error) => {
              setActivityShow(prev => false)  
                ModalOptions('Error', 'Ooops!', 'Hubo un problema, intenta nuevamente','close')             
            });
    
    
      
    
      } 


    const [isCameraOpen, setIsCameraOpen] = React.useState(false);
    const cameraRef = React.useRef();
  
    const [originalImageWidth, setOriginalImageWidth] = React.useState(null);
    const [originalImageHeight, setOriginalImageHeight] = React.useState(null);
  
    const openCamera = () => {
      setIsCameraOpen(true);
    };
  
    const closeCamera = () => {
      setIsCameraOpen(false);
    };

    const aspectRatio = originalImageWidth / originalImageHeight;
    const proportionalHeight = 100 / aspectRatio;
    const takePicture = async () => {
        console.log('1')
        if (cameraRef.current) {
          const options = { quality: 0.5, base64: true };
          const data = await cameraRef.current.takePictureAsync(options);
          const {width, height} = data;
          setOriginalImageWidth(width)
          setOriginalImageHeight(height)
    
          setImage(prev =>  data.uri)
    
    
          // Aquí puedes manejar la foto tomada (guardarla, mostrarla, etc.)
          closeCamera(); // Cerrar la cámara después de tomar la foto
        }
    };

    const takePictureDos = async () => {
        console.log('2')
        if (cameraRef.current) {
          const options = { quality: 0.5, base64: true };
          const dataDos = await cameraRef.current.takePictureAsync(options);
    
          // const {width, height} = data;
          // setOriginalImageWidth(width)
          // setOriginalImageHeight(height)
    
          setImageTwo(prev => dataDos.uri)
    
    
          // Aquí puedes manejar la foto tomada (guardarla, mostrarla, etc.)
          closeCamera(); // Cerrar la cámara después de tomar la foto
        }
    };

    rendPicture1 = () =>{
        if(image){
          return(
            <Image 
            source={{ uri: image }}
            resizeMode="contain"
            
            style={{ 
              alignSelf:'center',
              width: 150, 
              height: 150, 
              marginTop: 10, marginBottom:10, 
              //transform:[{rotate:'90deg'}]
            }}
            />
          )
    
        }
    }
    rendPicture2 = () =>{
        if(imageTwo){
          return(
            <Image 
            source={{ uri: imageTwo }}
            resizeMode="contain"
            style={{ 
              alignSelf:'center',
              width: 150, 
              height: 150, 
              marginTop: 20, marginBottom:0, 
            }}
            />
      
      
          )
      
        }
    }


    const [isTextInputVisible, setIsTextInputVisible] = React.useState(false);
    const [text, setText] = React.useState('');
    const fadeInAnim = React.useRef(new Animated.Value(0)).current;
  
    const handleButtonPress = () => {
        setIsTextInputVisible(true);
        Animated.timing(fadeInAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();
      };
    
      const handleTextInputHide = () => {
        Animated.timing(fadeInAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start(() => {
          setIsTextInputVisible(false);
          setText(''); // Limpiar el texto cuando se oculta
        });
      };

      renderEstadoText = (status) =>{
        console.log(status)
        if(status == 'pagado'){
          return(
            <Text style={{ color: '#808080', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25}}>Pagado</Text>
          )
        }else if(status == 'cargado'){
          return(
            <Text style={{ color: '#0000FF', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25}}>Cargado</Text>
          )
        }else if(status == 'enruta'){
          return(
            <Text style={{ color: '#008000', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25}}>En ruta</Text>
          )
        }
        else if(status == 'retraso'){
          return(
            <Text style={{ color: '#FF0000', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25}}>Retraso</Text>
          )
        }
        else if(status == 'entregado'){
          return(
            <Text style={{ color: '#FFA500', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25}}>Carga entregada</Text>
          )
        }
        else if(status == 'finalizado'){
          return(
            <Text style={{ color: '#800080', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25}}>Carga entregada</Text>
          )
        }
      }
    rendCarga = () =>{
        if(load == true){
            return(
              <ActivityIndi/>
            )
        }else if(conexionErr == true){
           return(
             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal:15,}}>
               <Image
               style={{
                 width:150,
                 height:150,
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
        }else if(dataSource != ''){
            return dataSource.map((data, i) => {
                if(entregaDisplay == true){
                    return(
                        <View key={i}>
                            <TouchableOpacity style={{width:'100%', padding:15, borderRadius:10, backgroundColor:'#eeeeee', marginBottom:1, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}} onPress={openCamera}>
                                <Text style={{fontSize: fontWidth / 25, color: '#323232', fontFamily:'Poppins_700Bold',}}>Tomar foto de entrega de carga</Text>
                                <Entypo name="image-inverted" size={fontWidth / 13} color="#000"/>
                            </TouchableOpacity>
                            {rendPicture2()}

                            <LinearGradient style={{width:'100%', height:50, borderRadius:10, marginTop:25, justifyContent:'center', alignItems:'center'}} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

                              <TouchableOpacity onPress={() => EntregarCarga()} style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}} activeOpacity={1} >
                              <Text style={styles.txtBtn}>Entregar carga</Text>
                              </TouchableOpacity>

                            </LinearGradient>
                        </View>
                    )
                }


                if(data.estado == 'buscando'){
                    return(
                        <View key={i}>


                                    <View style={{width:'100%', marginBottom:15,}}>
                                    {renderEstadoText(data.estado)}
                                    </View>
                                    <View style={{width:'100%', marginRight:15, flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:'#fff', padding:8, borderRadius:10, shadowColor: "#000",shadowOffset: {	width: 0,	height: 2,}, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,}}>
                                        
                                        <View style={{flex:1}}>
                                        <TextTicker style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25,}} duration={5000}
                                            loop
                                            bounce
                                            repeatSpacer={50}
                                            marqueeDelay={2000}>{data.desde}</TextTicker>

                                        </View>
                    
                    
                                    <View style={{marginHorizontal:20,}}>
                                        <Image
                                            style={{
                                                alignSelf: 'center',
                                                width: fontWidth / 15,
                                                height: fontWidth / 15,
                                                marginBottom: 0,
                                            }}
                                            source={require('./assets/arrowColor.png')}
                                        />
                                    </View>
                    
                    
                    
                                    <View style={{flex:1}}>
                                        <TextTicker style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25,}} duration={5000}
                                            loop
                                            bounce
                                            repeatSpacer={50}
                                            marqueeDelay={2000}>{data.hasta}</TextTicker>

                                        </View>
                    
                                    </View>
                    
                                    <TouchableOpacity onPress={() => setAnimalesSelected(!animalesSelected)} style={{width:'100%', flexDirection:'row', alignItems:'center', marginBottom:15, marginTop:15,}}>
                                        <View style={{width:fontWidth/18, height: fontWidth/18, marginRight:10, borderWidth:2, borderColor:'#07E607', borderRadius:100, justifyContent:'center', alignItems:'center'}}>
                                            <View style={{width:fontWidth/28, height: fontWidth/28, borderRadius:100, backgroundColor: animalesSelected == true ? '#07E607' : '#fff'}}/>
                                        </View>
                                        <Text style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 28}}>Animales</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => setAridosSelected(!aridosSelected)} style={{width:'100%', flexDirection:'row', alignItems:'center', marginBottom:15,}}>
                                        <View style={{width:fontWidth/18, height: fontWidth/18, marginRight:10, borderWidth:2, borderColor:'#07E607', borderRadius:100, justifyContent:'center', alignItems:'center'}}>
                                            <View style={{width:fontWidth/28, height: fontWidth/28, borderRadius:100, backgroundColor: aridosSelected == true ? '#07E607' : '#fff'}}/>
                                        </View>
                                        <Text style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 28}}>Áridos</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => setMaderaSelected(!maderaSelected)} style={{width:'100%', flexDirection:'row', alignItems:'center', marginBottom:15,}}>
                                        <View style={{width:fontWidth/18, height: fontWidth/18, marginRight:10, borderWidth:2, borderColor:'#07E607', borderRadius:100, justifyContent:'center', alignItems:'center'}}>
                                            <View style={{width:fontWidth/28, height: fontWidth/28, borderRadius:100, backgroundColor: maderaSelected == true ? '#07E607' : '#fff'}}/>
                                        </View>
                                        <Text style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 28}}>Madera</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => setMaquinariaSelected(!maquinariaSelected)} style={{width:'100%', flexDirection:'row', alignItems:'center', marginBottom:15,}}>
                                        <View style={{width:fontWidth/18, height: fontWidth/18, marginRight:10, borderWidth:2, borderColor:'#07E607', borderRadius:100, justifyContent:'center', alignItems:'center'}}>
                                            <View style={{width:fontWidth/28, height: fontWidth/28, borderRadius:100, backgroundColor: maquinariaSelected == true ? '#07E607' : '#fff'}}/>
                                        </View>
                                        <Text style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 28}}>Maquinaria</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => setOtroSelected(!otroSelected)} style={{width:'100%', flexDirection:'row', alignItems:'center', marginBottom:15,}}>
                                        <View style={{width:fontWidth/18, height: fontWidth/18, marginRight:10, borderWidth:2, borderColor:'#07E607', borderRadius:100, justifyContent:'center', alignItems:'center'}}>
                                            <View style={{width:fontWidth/28, height: fontWidth/28, borderRadius:100, backgroundColor: otroSelected == true ? '#07E607' : '#fff'}}/>
                                        </View>
                                        <Text style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 28}}>Otro</Text>
                                    </TouchableOpacity>

                    


                                    <TouchableOpacity style={{width:'100%', padding:15, borderRadius:10, backgroundColor:'#eeeeee', marginBottom:1, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}} onPress={openCamera}>
                                        <Text style={{fontSize: fontWidth / 25, color: '#323232', fontFamily:'Poppins_700Bold',}}>Tomar foto de respaldo</Text>
                                        <Entypo name="image-inverted" size={fontWidth / 13} color="#000"/>
                                    </TouchableOpacity>
                                    {rendPicture1()}


                                    <TouchableOpacity onPress={() => setAceptoCargaSelected(!aceptoCargaSelected)} style={{width:'100%', flexDirection:'row', alignItems:'center', marginBottom:15, marginTop:15,}}>
                                        <View style={{width:fontWidth/18, height: fontWidth/18, marginRight:10, borderWidth:2, borderColor:'#07E607', borderRadius:100, justifyContent:'center', alignItems:'center'}}>
                                            <View style={{width:fontWidth/28, height: fontWidth/28, borderRadius:100, backgroundColor: aceptoCargaSelected == true ? '#07E607' : '#fff'}}/>
                                        </View>
                                        <Text style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 28}}>Acepto carga veridica</Text>
                                    </TouchableOpacity>


                                    <LinearGradient style={{width:'100%', height:50, borderRadius:10, marginTop:25, justifyContent:'center', alignItems:'center'}} colors={['#9fd3c7', '#9fd3c7']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

                                        <TouchableOpacity onPress={isTextInputVisible ? handleTextInputHide : handleButtonPress} style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}} activeOpacity={1} >
                                            <Text style={styles.txtBtn}>Carga no coincide carga</Text>
                                        </TouchableOpacity>

                                    </LinearGradient>










                                    {isTextInputVisible &&
                                        <Animated.View style={{ opacity: fadeInAnim }}>
                                        {/* <View style={{ padding: 10 }}>
                                            <AnimatedTextInput
                                            placeholder="Ingrese texto..."
                                            value={text}
                                            onChangeText={(value) => setText(value)}
                                            style={{ borderWidth: 1, borderColor: 'gray', padding: 10 }}
                                            />
                                        </View> */}

                                        <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { comentInput.focus(); }}>
                                            <View style={{ width: '80%' }}>
                                            {/* <Text style={styles.labels}>Tu Nombre</Text> */}
                                            <AnimatedTextInput
                                                style={styles.inputs}
                                                placeholderTextColor="#909fac"
                                                underlineColorAndroid="transparent"
                                                autoCapitalize="none"
                                                autoComplete="off"
                                                autoCorrect={false}
                                                maxLength={100}
                                                placeholder="Agrega un comentario"
                                                onChangeText={coment => setComent(coment)}
                                                ref={(input) => { comentInput = input; }}
                                            />
                                            </View>
                                        </TouchableOpacity> 
                                        </Animated.View>
                                    }



















                                    <LinearGradient style={{width:'100%', height:50, borderRadius:10, marginTop:25, justifyContent:'center', alignItems:'center'}} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

                                            <TouchableOpacity onPress={() => cargarViajeCorto()} style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}} activeOpacity={1} >
                                            <Text style={styles.txtBtn}>Subir carga</Text>
                                            </TouchableOpacity>

                                    </LinearGradient>



                        </View>
                    )
                }
                if(data.estado == 'pagado'){
                  return(
                      <View key={i}>


                                  <View style={{width:'100%', marginBottom:15,}}>
                                  {renderEstadoText(data.estado)}
                                  </View>
                                  <View style={{width:'100%', marginRight:15, flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:'#fff', padding:8, borderRadius:10, shadowColor: "#000",shadowOffset: {	width: 0,	height: 2,}, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,}}>
                                      
                                      <View style={{flex:1}}>
                                      <TextTicker style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25,}} duration={5000}
                                          loop
                                          bounce
                                          repeatSpacer={50}
                                          marqueeDelay={2000}>{data.desde}</TextTicker>

                                      </View>
                  
                  
                                  <View style={{marginHorizontal:20,}}>
                                      <Image
                                          style={{
                                              alignSelf: 'center',
                                              width: fontWidth / 15,
                                              height: fontWidth / 15,
                                              marginBottom: 0,
                                          }}
                                          source={require('./assets/arrowColor.png')}
                                      />
                                  </View>
                  
                  
                  
                                  <View style={{flex:1}}>
                                      <TextTicker style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25,}} duration={5000}
                                          loop
                                          bounce
                                          repeatSpacer={50}
                                          marqueeDelay={2000}>{data.hasta}</TextTicker>

                                      </View>
                  
                                  </View>
                  
                                  <TouchableOpacity onPress={() => setAnimalesSelected(!animalesSelected)} style={{width:'100%', flexDirection:'row', alignItems:'center', marginBottom:15, marginTop:15,}}>
                                    <View style={{width:fontWidth/18, height: fontWidth/18, marginRight:10, borderWidth:2, borderColor:'#07E607', borderRadius:100, justifyContent:'center', alignItems:'center'}}>
                                        <View style={{width:fontWidth/28, height: fontWidth/28, borderRadius:100, backgroundColor: animalesSelected == true ? '#07E607' : '#fff'}}/>
                                    </View>
                                    <Text style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 28}}>Animales</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setAridosSelected(!aridosSelected)} style={{width:'100%', flexDirection:'row', alignItems:'center', marginBottom:15,}}>
                                    <View style={{width:fontWidth/18, height: fontWidth/18, marginRight:10, borderWidth:2, borderColor:'#07E607', borderRadius:100, justifyContent:'center', alignItems:'center'}}>
                                        <View style={{width:fontWidth/28, height: fontWidth/28, borderRadius:100, backgroundColor: aridosSelected == true ? '#07E607' : '#fff'}}/>
                                    </View>
                                    <Text style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 28}}>Áridos</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setMaderaSelected(!maderaSelected)} style={{width:'100%', flexDirection:'row', alignItems:'center', marginBottom:15,}}>
                                    <View style={{width:fontWidth/18, height: fontWidth/18, marginRight:10, borderWidth:2, borderColor:'#07E607', borderRadius:100, justifyContent:'center', alignItems:'center'}}>
                                        <View style={{width:fontWidth/28, height: fontWidth/28, borderRadius:100, backgroundColor: maderaSelected == true ? '#07E607' : '#fff'}}/>
                                    </View>
                                    <Text style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 28}}>Madera</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setMaquinariaSelected(!maquinariaSelected)} style={{width:'100%', flexDirection:'row', alignItems:'center', marginBottom:15,}}>
                                    <View style={{width:fontWidth/18, height: fontWidth/18, marginRight:10, borderWidth:2, borderColor:'#07E607', borderRadius:100, justifyContent:'center', alignItems:'center'}}>
                                        <View style={{width:fontWidth/28, height: fontWidth/28, borderRadius:100, backgroundColor: maquinariaSelected == true ? '#07E607' : '#fff'}}/>
                                    </View>
                                    <Text style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 28}}>Maquinaria</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setOtroSelected(!otroSelected)} style={{width:'100%', flexDirection:'row', alignItems:'center', marginBottom:15,}}>
                                    <View style={{width:fontWidth/18, height: fontWidth/18, marginRight:10, borderWidth:2, borderColor:'#07E607', borderRadius:100, justifyContent:'center', alignItems:'center'}}>
                                        <View style={{width:fontWidth/28, height: fontWidth/28, borderRadius:100, backgroundColor: otroSelected == true ? '#07E607' : '#fff'}}/>
                                    </View>
                                    <Text style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 28}}>Otro</Text>
                                </TouchableOpacity>

                  


                                  <TouchableOpacity style={{width:'100%', padding:15, borderRadius:10, backgroundColor:'#eeeeee', marginBottom:1, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}} onPress={openCamera}>
                                      <Text style={{fontSize: fontWidth / 25, color: '#323232', fontFamily:'Poppins_700Bold',}}>Tomar foto de respaldo</Text>
                                      <Entypo name="image-inverted" size={fontWidth / 13} color="#000"/>
                                  </TouchableOpacity>
                                  {rendPicture1()}


                                  <TouchableOpacity onPress={() => setAceptoCargaSelected(!aceptoCargaSelected)} style={{width:'100%', flexDirection:'row', alignItems:'center', marginBottom:15, marginTop:15,}}>
                                      <View style={{width:fontWidth/18, height: fontWidth/18, marginRight:10, borderWidth:2, borderColor:'#07E607', borderRadius:100, justifyContent:'center', alignItems:'center'}}>
                                          <View style={{width:fontWidth/28, height: fontWidth/28, borderRadius:100, backgroundColor: aceptoCargaSelected == true ? '#07E607' : '#fff'}}/>
                                      </View>
                                      <Text style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 28}}>Acepto carga veridica</Text>
                                  </TouchableOpacity>


                                  <LinearGradient style={{width:'100%', height:50, borderRadius:10, marginTop:25, justifyContent:'center', alignItems:'center'}} colors={['#9fd3c7', '#9fd3c7']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

                                      <TouchableOpacity onPress={isTextInputVisible ? handleTextInputHide : handleButtonPress} style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}} activeOpacity={1} >
                                          <Text style={styles.txtBtn}>Carga no coincide carga</Text>
                                      </TouchableOpacity>

                                  </LinearGradient>










                                  {isTextInputVisible &&
                                      <Animated.View style={{ opacity: fadeInAnim }}>
                                      {/* <View style={{ padding: 10 }}>
                                          <AnimatedTextInput
                                          placeholder="Ingrese texto..."
                                          value={text}
                                          onChangeText={(value) => setText(value)}
                                          style={{ borderWidth: 1, borderColor: 'gray', padding: 10 }}
                                          />
                                      </View> */}

                                      <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { comentInput.focus(); }}>
                                          <View style={{ width: '80%' }}>
                                          {/* <Text style={styles.labels}>Tu Nombre</Text> */}
                                          <AnimatedTextInput
                                              style={styles.inputs}
                                              placeholderTextColor="#909fac"
                                              underlineColorAndroid="transparent"
                                              autoCapitalize="none"
                                              autoComplete="off"
                                              autoCorrect={false}
                                              maxLength={100}
                                              placeholder="Agrega un comentario"
                                              onChangeText={coment => setComent(coment)}
                                              ref={(input) => { comentInput = input; }}
                                          />
                                          </View>
                                      </TouchableOpacity> 
                                      </Animated.View>
                                  }



















                                  <LinearGradient style={{width:'100%', height:50, borderRadius:10, marginTop:25, justifyContent:'center', alignItems:'center'}} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

                                          <TouchableOpacity onPress={() => cargarViajeCorto()} style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}} activeOpacity={1} >
                                          <Text style={styles.txtBtn}>Subir carga</Text>
                                          </TouchableOpacity>

                                  </LinearGradient>



                      </View>
                  )
                }
                if(data.estado == 'cargado'){
                    return(
                        <View key={i}>
                                    <View style={{width:'100%', marginBottom:15,}}>
                                      {renderEstadoText(data.estado)}
                                    </View>
                                    <View style={{width:'100%', marginRight:15, flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:'#fff', padding:8, borderRadius:10, shadowColor: "#000",shadowOffset: {	width: 0,	height: 2,}, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,}}>
                                        
                                        <View style={{flex:1}}>
                                        <TextTicker style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25,}} duration={5000}
                                            loop
                                            bounce
                                            repeatSpacer={50}
                                            marqueeDelay={2000}>{data.desde}</TextTicker>

                                        </View>
                    
                    
                                    <View style={{marginHorizontal:20,}}>
                                        <Image
                                            style={{
                                                alignSelf: 'center',
                                                width: fontWidth / 15,
                                                height: fontWidth / 15,
                                                marginBottom: 0,
                                            }}
                                            source={require('./assets/arrowColor.png')}
                                        />
                                    </View>
                    
                    
                    
                                    <View style={{flex:1}}>
                                        <TextTicker style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25,}} duration={5000}
                                            loop
                                            bounce
                                            repeatSpacer={50}
                                            marqueeDelay={2000}>{data.hasta}</TextTicker>

                                        </View>
                    
                                    </View>
                    

                    

 

































                                    <LinearGradient style={{width:'100%', height:50, borderRadius:10, marginTop:25, justifyContent:'center', alignItems:'center'}} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

                                            <TouchableOpacity onPress={() => setEntregaDisplay(prev => !entregaDisplay)} style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}} activeOpacity={1} >
                                            <Text style={styles.txtBtn}>Entregar carga</Text>
                                            </TouchableOpacity>

                                    </LinearGradient>



                        </View>
                    )
                }
                if(data.estado == 'enruta'){
                  return(
                      <View key={i}>
                                    <View style={{width:'100%', marginBottom:15,}}>
                                      {renderEstadoText(data.estado)}
                                    </View>                        
                                  <View style={{width:'100%', marginRight:15, flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:'#fff', padding:8, borderRadius:10, shadowColor: "#000",shadowOffset: {	width: 0,	height: 2,}, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,}}>
                                      
                                      <View style={{flex:1}}>
                                      <TextTicker style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25,}} duration={5000}
                                          loop
                                          bounce
                                          repeatSpacer={50}
                                          marqueeDelay={2000}>{data.desde}</TextTicker>

                                      </View>
                  
                  
                                  <View style={{marginHorizontal:20,}}>
                                      <Image
                                          style={{
                                              alignSelf: 'center',
                                              width: fontWidth / 15,
                                              height: fontWidth / 15,
                                              marginBottom: 0,
                                          }}
                                          source={require('./assets/arrowColor.png')}
                                      />
                                  </View>
                  
                  
                  
                                  <View style={{flex:1}}>
                                      <TextTicker style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25,}} duration={5000}
                                          loop
                                          bounce
                                          repeatSpacer={50}
                                          marqueeDelay={2000}>{data.hasta}</TextTicker>

                                      </View>
                  
                                  </View>
                  

                  



































                                  <LinearGradient style={{width:'100%', height:50, borderRadius:10, marginTop:25, justifyContent:'center', alignItems:'center'}} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

                                          <TouchableOpacity onPress={() => setEntregaDisplay(prev => !entregaDisplay)} style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}} activeOpacity={1} >
                                          <Text style={styles.txtBtn}>Entregar carga</Text>
                                          </TouchableOpacity>

                                  </LinearGradient>



                      </View>
                  )
                }
                if(data.estado == 'retraso'){
                  return(
                      <View key={i}>
                                    <View style={{width:'100%', marginBottom:15,}}>
                                      {renderEstadoText(data.estado)}
                                    </View>
                                  <View style={{width:'100%', marginRight:15, flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:'#fff', padding:8, borderRadius:10, shadowColor: "#000",shadowOffset: {	width: 0,	height: 2,}, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,}}>
                                      
                                      <View style={{flex:1}}>
                                      <TextTicker style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25,}} duration={5000}
                                          loop
                                          bounce
                                          repeatSpacer={50}
                                          marqueeDelay={2000}>{data.desde}</TextTicker>

                                      </View>
                  
                  
                                  <View style={{marginHorizontal:20,}}>
                                      <Image
                                          style={{
                                              alignSelf: 'center',
                                              width: fontWidth / 15,
                                              height: fontWidth / 15,
                                              marginBottom: 0,
                                          }}
                                          source={require('./assets/arrowColor.png')}
                                      />
                                  </View>
                  
                  
                  
                                  <View style={{flex:1}}>
                                      <TextTicker style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25,}} duration={5000}
                                          loop
                                          bounce
                                          repeatSpacer={50}
                                          marqueeDelay={2000}>{data.hasta}</TextTicker>

                                      </View>
                  
                                  </View>
                  

                  



































                                  <LinearGradient style={{width:'100%', height:50, borderRadius:10, marginTop:25, justifyContent:'center', alignItems:'center'}} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>

                                          <TouchableOpacity onPress={() => setEntregaDisplay(prev => !entregaDisplay)} style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}} activeOpacity={1} >
                                          <Text style={styles.txtBtn}>Entregar carga</Text>
                                          </TouchableOpacity>

                                  </LinearGradient>



                      </View>
                  )
                }
                if(data.estado == 'entregado'){
                    return(
                        <View key={i}>
                                    <View style={{width:'100%', marginBottom:15,}}>
                                      {renderEstadoText(data.estado)}
                                    </View>
                                    <View style={{width:'100%', marginRight:15, flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:'#fff', padding:8, borderRadius:10, shadowColor: "#000",shadowOffset: {	width: 0,	height: 2,}, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,}}>
                                        
                                        <View style={{flex:1}}>
                                        <TextTicker style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25,}} duration={5000}
                                            loop
                                            bounce
                                            repeatSpacer={50}
                                            marqueeDelay={2000}>{data.desde}</TextTicker>

                                        </View>
                    
                    
                                    <View style={{marginHorizontal:20,}}>
                                        <Image
                                            style={{
                                                alignSelf: 'center',
                                                width: fontWidth / 15,
                                                height: fontWidth / 15,
                                                marginBottom: 0,
                                            }}
                                            source={require('./assets/arrowColor.png')}
                                        />
                                    </View>
                    
                    
                    
                                    <View style={{flex:1}}>
                                        <TextTicker style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25,}} duration={5000}
                                            loop
                                            bounce
                                            repeatSpacer={50}
                                            marqueeDelay={2000}>{data.hasta}</TextTicker>

                                        </View>
                    
                                    </View>
                    

                        </View>
                    )
                }


        })
  
            
   
   
   
        }else if(dataSource == ''){
            return(
               <View style={styles.ctnnoparse}>
                        <Image
                            style={{
                                alignSelf: 'center',
                                width: fontWidth / 2,
                                height:  fontWidth / 2 ,
                                marginBottom: 20,
                                marginTop: 30,
                            }}
                            source={require('./assets/empty.png')}
                        />
  
                        <Text style={styles.txtRenderElements}>No hay carga</Text>
                    </View>
              )
        }
    }


    function chatExist(x){
      console.log(x)

      console.log(idCarga)
      fetch(`${ServidorExport}/partner/MensajeDotCarga.php`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: x,
          idcarga:idCarga,
        })
      })
        .then((response) => {
         response.json()
              .then(responser => {
                console.log(responser + ' Respuesta')
                if(responser == 'hay'){
                  setChatExi(true)
                }else{
                  setChatExi(false)
                }

              })
        })

    }
    renderDotMensaje = () =>{
      if(chatExis == true){
        return(
          <View style={{width:10, height:10, borderRadius:100, backgroundColor:'#CA319F'}}>
          </View>
        )
      }
    }
    return (
        <View style={{flex:1, backgroundColor:'#fff'}}>
        {!isCameraOpen ? (
        <View style={{ flex: 1, backgroundColor:'#fff' }}>
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
            keyboardVerticalOffset={Platform.select({ios: 0, android: 0})}
            behavior= {(Platform.OS === 'ios')? "padding" : null}
          >
    
            {/* <ScrollView style={{flex:1}} keyboardShouldPersistTaps='always'> */}
  
              <View style={styles.header}>
  
               <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between'}}>

               <TouchableOpacity style={{ padding: 0, marginBottom: 10, }} onPress={() => navigation.goBack()}>
                  <FontAwesome name="arrow-left" style={styles.arrowBack} />
                </TouchableOpacity>

                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                  <TouchableOpacity style={{ padding: 0, }} onPress={() => navigation.navigate('Chat',{IdCarga:idCarga, Sender:InfoUser.correo, SenderN:  InfoUser.nombre,   ReciberN:InfoCarga.nombre, Reciber:InfoCarga.correo, })}>
                  <Entypo name="chat" style={styles.iconsBesideArrow} size={fontWidth/15} color="black" />
                  <View style={{marginLeft:15, position:'absolute'}}>
                    {renderDotMensaje()}
                  </View>
                  </TouchableOpacity>
                </View>

               </View>


                
               <Text style={styles.TextHeader}>Carga</Text>
  
  
  
  
  
  
              </View>
  
   
   
  
              <View style={{ flex: 1, width: '100%', marginTop: 2, paddingHorizontal: 15, backgroundColor:'transparent'}}>
              {/* <View style={{paddingHorizontal:15, paddingVertical:10, borderRadius:10, backgroundColor:'#07E607', alignSelf:'flex-start',}}>
                    <Text style={{ color: '#343434', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 30,}}>Viaje largo</Text>
                  </View> */}

                   {/* <Text style={{ color: '#313131', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25, marginTop:15, marginBottom:15}}>Información del viaje</Text> */}





                    {/* <Text style={{ color: '#313131', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25, marginTop:25, marginBottom:15}}>Cargas del viaje</Text> */}



                    {rendCarga()}



          
  
                
  
  
  

  
  
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
  
        </View>
        ) : (
            <View style={{flex:1, backgroundColor:'#000', justifyContent:'center', alignItems:'center'}}>
            <View style={{width:fontWidth, height:fontWidth, borderRadius:18,}}>
                        <CameraView
                    style={styles.camera}
                    ref={cameraRef}
                    >
                    <View style={styles.overlay} />

                    </CameraView>
            </View>
            <TouchableOpacity
                        style={styles.captureButton}
                        onPress={entregaDisplay == true ? takePictureDos : takePicture}
                    />
            </View>
      ) }
      </View>
      );
};



//make this component available to the app
export default CargaViajeCortoEspecialScreen;
