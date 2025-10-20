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
import { Ionicons } from '@expo/vector-icons';

// import { GeoCodingApiGoogle } from './GeoCodingApi.js'

let fontWidth = Dimensions.get('window').width;

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  )

// create a component
const CamionScreen = ({route, navigation}) => {
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
            fetchCamion(userToken)
        });
      
     
        return unsubscribe;
      }, [navigation, dataSource]);

 
      fetchCamion = async (x) => {
        await fetch(`${ServidorExport}/partner/TraerCamion.php`, {
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



      rendCamion = () =>{
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
              {/* Botón para agregar un camión */}
              <TouchableOpacity 
                onPress={() => { 
                  navigation.navigate('AddCamion', { Nombre: '', Patente: '' }); 
                }} 
                style={{
                  width: '100%', 
                  backgroundColor: '#ededed', 
                  borderRadius: 10, 
                  paddingVertical: 25, 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  marginBottom: 20 // Espaciado para separarlo de la lista
                }}
              >
                <FontAwesome 
                  name="plus" 
                  style={{ color: '#757575', fontSize: fontWidth / 12, marginBottom: 15 }} 
                />
                <Text style={styles.txtRenderElements}>Agregar un camión</Text>
              </TouchableOpacity>
        
              {/* Renderiza los elementos del array */}
              {dataSource.map((data, i) => {
                return (
                  <TouchableOpacity 
                    onPress={() => { 
                      navigation.navigate('AddCamion',{IdCamion: data.idcamion,Nombre:data.nombre, Patente:data.patente, ImgPadron:data.padron, ImgCirc:data.permisocirc, ImgFoto:data.img}); 
                    }} 
                    key={i} 
                    style={{ 
                      width: '100%', 
                      flexDirection: 'row', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: 10 
                    }}
                  > 
                    {/* Contenedor para el nombre y la imagen */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      {/* Imagen */}
                      <Image 
                        source={{ uri: `https://www.convey.cl/partner/fotocamion/${data.img}` }} 
                        style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} 
                        resizeMode="cover" 
                      />
                      {/* Nombre */}
                      <Text 
                        style={{ 
                          color: '#262626', 
                          fontFamily: 'Poppins_600SemiBold', 
                          fontSize: fontWidth / 28, 
                          flexShrink: 1 
                        }}
                      >
                        {data.nombre}
                      </Text>
                    </View>
                    {/* Otro texto al lado derecho (si es necesario) */}
                    <Text 
                      style={{ 
                        color: '#262626', 
                        fontFamily: 'Poppins_700Bold', 
                        fontSize: fontWidth / 28 
                      }}
                    >
                      {data.patente}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        }
        else if(dataSource == ''){
            return(
               <View style={styles.ctnnoparse}>
                        <TouchableOpacity onPress={() => {navigation.navigate('AddCamion',{IdCamion: '', Nombre:'', Patente:'', ImgPadron:'', ImgCirc:'', ImgFoto:''})}} style={{width:'100%', backgroundColor:'#ededed', borderRadius:10, paddingVertical:25, justifyContent:'center', alignItems:'center'}}>
                            <FontAwesome name="plus" style={{color:'#757575', fontSize:fontWidth/12, marginBottom:15}} />
                            <Text style={styles.txtRenderElements}>Agregar un camion</Text>
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

   
            <ScrollView style={{flex:1}} keyboardShouldPersistTaps='always'>
  
              <View style={styles.header}>
  
               <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between'}}>

               <TouchableOpacity style={{ padding: 0, marginBottom: 10, }} onPress={() => navigation.goBack()}>
                  <FontAwesome name="arrow-left" style={styles.arrowBack} />
                </TouchableOpacity>


                


               </View>


                
               <Text style={styles.TextHeader}>Mi camión</Text>
  

   
              </View>
   
   
  
              <View style={{ flex: 1, width: '100%', marginTop: 2, paddingHorizontal: 15, backgroundColor:'transparent'}}>

             
  
                    {rendCamion()}
  
     
  
  
  



  
  
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

export default CamionScreen;
