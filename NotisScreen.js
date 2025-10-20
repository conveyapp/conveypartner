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
const NotisScreen = ({route, navigation}) => {
    const [ActivityShow, setActivityShow] = React.useState(false)
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
            fetchNotis(userToken)
            VistoNotific(userToken)
  
        });
      
     
        return unsubscribe;
      }, [navigation, dataSource]);
      
      const VistoNotific = (x) =>{
      
        fetch(`${ServidorExport}/partner/VistoNotis.php`, {
          method: 'POST',
          headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data"
          }, 
          body: JSON.stringify({
    
            usuario: x,
  
          })
        })
            .then((response) => {
                if (!response.ok || response.status != 200 || response.status != '200') { 
                      
                } else {
                response.json()
                    .then(responser => {
                      console.log(responser);
                      if(responser == 'exito'){
                            console.log('check')
                      }else{
                        console.log('no chek')
                      }
    
    
                    })
                }
    
            })
            .catch((error) => {           
            });
    
    
      
    
      } 

      fetchNotis = async (x) => {
        await fetch(`${ServidorExport}/partner/TraerNotis.php`, {
           method: 'POST',
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({
            usuario: x,
           })
         }) 
           .then((response) => {
             if (!response.ok || response.status != 200 || response.status != '200') { 
                 setConexionErr(true)
             } else {
               response.json()
                 .then(responser => {
                    console.log(responser)
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

      rendCargas = () =>{
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
                return(
                    <TouchableOpacity key={i} onPress={ () => {
                      console.log('hola')
                      navigation.navigate('DetalleNoti',{Titulo: data.titulo, Cuerpo:data.cuerpo})
                    }    } style={{width:'100%', paddingVertical:10, borderWidth:1, borderColor:'#f0f0f0', marginBottom:10, borderRadius:10, paddingLeft:10, backgroundColor: data.visto != 'si' ? '#f0f0f0' : '#fff'}}>
                        <Text style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 30,}}>{data.titulo}</Text>
                        <Text style={{ color: '#262626', fontFamily:'Poppins_600SemiBold', fontSize: fontWidth / 35,}}>{data.cuerpo}</Text>
                    </TouchableOpacity>
                )
        })
  
            
    
   
   
        }else if(dataSource == ''){
            return(
               <View style={styles.ctnnoparse}>
                        {/* <Image
                            style={{
                                alignSelf: 'center',
                                width: fontWidth / 2,
                                height:  fontWidth / 2 ,
                                marginBottom: 20,
                                marginTop: 30,
                            }}
                            source={require('./assets/empty.png')}
                        /> */}
  
                        <Text style={styles.txtRenderElements}>No hay notificaciones</Text>
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
              {activity()}
              <View
                style={{
                  backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'transparent',
                  height: Constants.statusBarHeight,
                  width: '100%',
                }} />

   
            <ScrollView style={{flex:1}} keyboardShouldPersistTaps='always'>
  
              <View style={styles.header}>
  
               <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between'}}>

               <TouchableOpacity style={{ padding: 0, marginBottom: 10, }} onPress={() => navigation.goBack()}>
                  <FontAwesome name="arrow-left" style={styles.arrowBack} />
                </TouchableOpacity>


               </View>


                
               <Text style={styles.TextHeader}>Noticaciones</Text>
  
  
  
  
  
  
              </View>
  
   
   
  
              <View style={{ flex: 1, width: '100%', marginTop: 2, paddingHorizontal: 15, backgroundColor:'transparent'}}>




          
  
                {rendCargas()}
  
  
  

  
  
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
  
        </View>
  
      );
};



//make this component available to the app
export default NotisScreen;
