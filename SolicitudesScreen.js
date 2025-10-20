import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, ScrollView, TouchableWithoutFeedback, Platform, Keyboard, Animated, KeyboardAvoidingView, TouchableOpacity, TextInput, ActivityIndicator, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Modal from './Modal.js';
import ActivityIndi from './activityIndi.js'
import { ServidorExport } from './ServAdress.js'
import { styles } from "./Style.js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextTicker from 'react-native-text-ticker'
// import { GeoCodingApiGoogle } from './GeoCodingApi.js'

let fontWidth = Dimensions.get('window').width;

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  )
// create a component
const SolicitudesScreen = ({route, navigation}) => {
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
        if (load == true) {
            return (
                    <ActivityIndi/>
            )
        } 
    }



    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            var userToken = await AsyncStorage.getItem('Key_27');
            fetchAllSolitudes(userToken)

        });
      
    
        return unsubscribe;
      }, [navigation, dataSource]);

      fetchAllSolitudes = async (x) => {
        await fetch(`${ServidorExport}/partner/TraerAllSolicitudes.php`, {
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

    rendSolicitudes = () =>{
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
                if(data.tipoviaje == 'Viaje largo'){
                  return(
                        
                    <View style={{width:'100%', paddingHorizontal:10,}}>

                    <TouchableOpacity onPress={() => navigation.navigate('SolicitudViajeLargo',{IdCarga:data.idcarga, IdCamionero:data.idcamionero, IdSoli: data.idsolicitud})} DetalleViajeLargo style={{width:'100%', alignSelf:'center', flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:'#fff', padding:8, borderRadius:10, shadowColor: "#000",shadowOffset: {	width: 0,	height: 2,}, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,}}>
                        
                        <View style={{flex:1}}>
                        <TextTicker style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25,}} duration={5000}
                          loop
                          bounce
                          repeatSpacer={50}
                          marqueeDelay={2000}>{data.origen}</TextTicker>
                        <TextTicker style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25,}} duration={5000}
                          loop
                          bounce
                          repeatSpacer={50}
                          marqueeDelay={2000}>{data.bultos} Bultos</TextTicker>
                        </View>

                        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                            <Text style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 35, marginBottom:15,}}>Viaje largo</Text>
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

                        <View style={{flex:1, justifyContent:'flex-end', alignItems:'flex-end'}}>
                        <TextTicker style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25,}} duration={5000}
                          loop
                          bounce
                          repeatSpacer={50}
                          marqueeDelay={2000}>{data.destino}</TextTicker>
                        <TextTicker style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 25,}} duration={5000}
                          loop
                          bounce
                          repeatSpacer={50}
                          marqueeDelay={2000}>{data.kilos} Kilos</TextTicker>
                        </View>

                    </TouchableOpacity>

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

                        <Text style={styles.txtRenderElements}>No hay Notificaciones</Text>
                    </View>
              )
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor:'#fff' }}>
          <DismissKeyboard style={{ flex: 1 }}>
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
                  //marginTop: Constants.statusBarHeight, //Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,,
                }} />
  <KeyboardAvoidingView
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.select({ios: 0, android: 0})}
            behavior= {(Platform.OS === 'ios')? "padding" : null}
          >
   
            {/* <ScrollView style={{flex:1}} keyboardShouldPersistTaps='always'> */}
  
              <View style={styles.headerAdorno}>
  
                <TouchableOpacity style={{ padding: 0, marginBottom: 10, }} onPress={() => navigation.goBack()}>
                  <FontAwesome name="arrow-left" style={styles.arrowBack} />
                </TouchableOpacity>
  
  
  
  
  
  
  
              </View>
  
  
  
  
              <View style={{ flex: 1, width: '100%', marginTop: 2, paddingHorizontal: 15, backgroundColor:'transparent'}}>
              <Text style={[styles.TextHeader,{marginBottom:5,}]}>Solicitudes de cargas</Text>

                






  
  
              {rendSolicitudes()}
  
  
  
  

  
  
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
  
      );
};

//make this component available to the app
export default SolicitudesScreen;
