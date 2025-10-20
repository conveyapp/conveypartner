import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, ScrollView, TouchableWithoutFeedback, Platform, Keyboard, Alert, KeyboardAvoidingView, TouchableOpacity, TextInput, ActivityIndicator, StatusBar } from 'react-native';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Modal from './Modal.js';
import ActivityIndi from './activityIndi.js'
import { ServidorExport } from './ServAdress.js'
import { styles } from "./Style.js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './utils';
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
const InformacionPersonalScreen = ({route, navigation}) => {
  const { signOut } = React.useContext(AuthContext);
    const [admin, setAdmin] = React.useState('');
    const [ActivityShow, setActivityShow] = React.useState('');
    const [load, setLoad] = React.useState(true);
    const [dataSource, setDataSource] = React.useState('');
    const [conexionErr, setConexionErr] = React.useState(false);


    


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
            fetchInfo(userToken)
        });
      
     
        return unsubscribe;
      }, [navigation]);

      fetchInfo = async (x) => {
        await fetch(`${ServidorExport}/partner/TraerInfoPersonal.php`, {
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
                        console.log(responser + 'showww')
                     if(responser == "No Results Found."){
                       setDataSource(prev => '');
                       setLoad(prev => false)
                     }else{
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

      const salir = () => {
        signOut()
        
    }
      rendInfo = () =>{
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
        }else if (dataSource != '') {
          return (
            <View>

        
              {/* Renderiza los elementos del array */}
              {dataSource.map((data, i) => {
                return (

                    <View key={i}>

                <TouchableOpacity onPress={() => navigation.navigate('EditarFotoPerfil',{ImgPerfil:data.foto})} style={{width:fontWidth/4, height:fontWidth/4, borderRadius:100, backgroundColor:'red', alignSelf:'center', justifyContent:'center', alignItems:'center', marginBottom:35, marginTop:35}}>
                
                    <Image 
                        source={{ uri: `https://www.convey.cl/partner/fotoPerfil/${data.foto}` }} 
                        style={{ width: '100%', height:'100%', borderRadius: 25, borderRadius:100}} 
                        resizeMode="contain" 
                        
                      />
                </TouchableOpacity>


<TouchableOpacity onPress={() => navigation.navigate('DatosPersonales')} style={{width:'100%', backgroundColor:'#fff', paddingHorizontal:15, paddingVertical:10}}>
      <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 20 }}>Datos personales</Text>
  </TouchableOpacity>   
<TouchableOpacity onPress={() => navigation.navigate('Descripcion',{Desc:data.descripcion})} style={{width:'100%', backgroundColor:'#f0f0f0', paddingHorizontal:15, paddingVertical:10}}>
      <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 20 }}>Descripción</Text>
      <Text style={{ color: '#262626', fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 30 }}>Añade alguna descripción para que los clientes prefieran tu servicio</Text>
  </TouchableOpacity> 
  <TouchableOpacity onPress={() => navigation.navigate('HistorialMedicos')} style={{width:'100%', backgroundColor:'#fff', paddingHorizontal:15, paddingVertical:10}}>
      <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 20 }}>Historial médico</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => navigation.navigate('Seguridad')} style={{width:'100%', backgroundColor:'#f0f0f0', paddingHorizontal:15, paddingVertical:10}}>
      <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 20 }}>Seguridad</Text>
  </TouchableOpacity> 

                        </View>


                );
              })}
            </View>
          );
        }else if(dataSource == ''){
            return(
               <View style={styles.ctnnoparse}>
                        <TouchableOpacity>
                            <FontAwesome name="plus" style={{color:'#757575', fontSize:fontWidth/12, marginBottom:15}} />
                            <Text style={styles.txtRenderElements}>Agregar una licencia</Text>
                        </TouchableOpacity>
                </View>
              )
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


                
                <Text style={styles.TextHeader}>Información Personal</Text>
   
              </View>
              
   
   
  
              <View style={{ flex: 1, width: '100%', marginTop: 2, paddingHorizontal: 0, backgroundColor:'transparent'}}>

                    {rendInfo()}


              
  
  
  

  
  
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

export default InformacionPersonalScreen;
