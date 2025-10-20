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
const MisViajesUnoScreen = ({route, navigation}) => {
    
    const [ActivityShow, setActivityShow] = React.useState('');
    const [viaje, setViaje] = React.useState(route.params.Viaje);
    const [user, setUser] = React.useState(route.params.User);

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
            fetchMisViajes(userToken)
            console.log(viaje)
            console.log(user)
  
        });
      
     
        return unsubscribe;
      }, [navigation, dataSource]);

      fetchMisViajes = async (x) => {
        await fetch(`${ServidorExport}/partner/TraerMisViajes.php`, {
           method: 'POST',
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({
            usr: x,
            tipoviaje:viaje
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

      goToDetail = (data) =>{
            if(viaje == 'Viaje Largo'){
                navigation.navigate('DetalleViajeLargo',{InfoUser:[user], InfoViaje:[data]})
            }

            if(viaje == 'Viaje Corto'){
                navigation.navigate('DetalleViajeCorto',{InfoUser:[user], InfoViaje:[data]})
            }

            if(viaje == 'Grua'){
                navigation.navigate('DetalleViajeGrua',{InfoUser:[user], InfoViaje:[data]})
            }

            if(viaje == 'Viaje Largo Especial'){
                navigation.navigate('DetalleViajeLargoEspecial',{InfoUser:[user], InfoViaje:[data]})
            }

            if(viaje == 'Viaje Corto Especial'){
                navigation.navigate('DetalleViajeCortoEspecial',{InfoUser:[user], InfoViaje:[data]})
            }
      }

      RendeViajeShow = (data)=>{
        if(viaje == 'Viaje Largo'){
          return(
            <View style={{width:'100%', flexDirection:'row'}}>
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
          )
        }

        if(viaje == 'Viaje Corto'){
          return(
            <View style={{width:'100%', flexDirection:'row'}}>
            <View style={{flex:1}}>
             <TextTicker style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25,}} duration={5000}
               loop
               bounce
               repeatSpacer={50}
               marqueeDelay={2000}>{data.lugarinicio}</TextTicker>
        
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
                   marqueeDelay={2000}>{data.radio}</TextTicker>
        
             </View>
            
            </View>
          )
        }

        if(viaje == 'Grua'){
          return(
            <View style={{width:'100%', flexDirection:'row'}}>
            <View style={{flex:1}}>
             <TextTicker style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25,}} duration={5000}
               loop
               bounce
               repeatSpacer={50}
               marqueeDelay={2000}>{data.lugarinicio}</TextTicker>
        
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
                   marqueeDelay={2000}>{data.radio}</TextTicker>
        
             </View>
            
            </View>
          )
        }

        if(viaje == 'Viaje Largo Especial'){
          return(
            <View style={{width:'100%', flexDirection:'row'}}>
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
          )
        }

        if(viaje == 'Viaje Corto Especial'){
          return(
            <View style={{width:'100%', flexDirection:'row'}}>
            <View style={{flex:1}}>
             <TextTicker style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25,}} duration={5000}
               loop
               bounce
               repeatSpacer={50}
               marqueeDelay={2000}>{data.lugarinicio}</TextTicker>
        
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
                   marqueeDelay={2000}>{data.radio}</TextTicker>
        
             </View>
            
            </View>
          )
        }
      }

      rendViajes = () =>{
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
                  <TouchableOpacity key={i} onPress={() => goToDetail(data)} style={{width:'100%', marginRight:15, backgroundColor:'#fff', padding:8, borderRadius:10, shadowColor: "#000",shadowOffset: {	width: 0,	height: 2,}, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,}}>
                      {renderEstadoText(data.estado)}                
                      {RendeViajeShow(data)}

                     <Text style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25, textAlign:'center', marginTop:10}}>{data.fechacreacion}</Text>
  
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
  
                        <Text style={styles.txtRenderElements}>No hay cargas</Text>
                    </View>
              )
        }
      }

      renderEstadoText = (status) =>{
        console.log(status)
        if(status == 'activo'){
            return(
              <Text style={{ color: '#808080', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 35}}>Activo</Text>
            )
        }else if(status == 'pagado'){
          return(
            <Text style={{ color: '#808080', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 35}}>Esperando</Text>
          )
        }else if(status == 'cargado'){
          return(
            <Text style={{ color: '#0000FF', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 35}}>Cargado</Text>
          )
        }else if(status == 'enruta'){
          return(
            <Text style={{ color: '#008000', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 35}}>En ruta</Text>
          )
        }
        else if(status == 'retraso'){
          return(
            <Text style={{ color: '#FF0000', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 35}}>Retraso</Text>
          )
        }
        else if(status == 'entregado'){
          return(
            <Text style={{ color: '#FFA500', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 35}}>Carga entregada</Text>
          )
        }
        else if(status == 'finalizado'){
          return(
            <Text style={{ color: '#800080', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 35}}>Carga entregada</Text>
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

   
            <ScrollView style={{flex:1}} keyboardShouldPersistTaps='always'>
  
              <View style={styles.header}>
  
               <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between'}}>

               <TouchableOpacity style={{ padding: 0, marginBottom: 10, }} onPress={() => navigation.goBack()}>
                  <FontAwesome name="arrow-left" style={styles.arrowBack} />
                </TouchableOpacity>


               </View>


                
               <Text style={styles.TextHeader}>{viaje}</Text>
  

  
  
  
   
              </View>
  
   
   
  
              <View style={{ flex: 1, width: '100%', marginTop: 2, paddingHorizontal: 15, backgroundColor:'transparent'}}>





  

  {rendViajes()}
              
  
  
  

  
  
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

export default MisViajesUnoScreen;
