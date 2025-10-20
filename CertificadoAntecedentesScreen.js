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
const CertificadoAntecedentesScreen = ({route, navigation}) => {
    const [user, setUser] = React.useState('');
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
            setUser(prev => userToken)
            fetchCertificado(userToken)
        });
      
     
        return unsubscribe;
      }, [navigation, dataSource]);

 
      fetchCertificado = async (x) => {
        await fetch(`${ServidorExport}/partner/TraerCertificadoAntecedentes.php`, {
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



      rendCertificado = () =>{
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
              {dataSource.map((data, i) => {
                return (
                  <TouchableOpacity 
                    key={i} 
                    style={{ 
                      paddingTop:30,
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      marginBottom: 10,
                      backgroundColor:'#ededed',
                      borderRadius:10,
                    }}
                  >
                      <Image 
                        source={{ uri: `https://www.convey.cl/partner/certificadosantecedentes/${data.certificado}` }} 
                        style={{ width: '100%', aspectRatio: 4 / 3, borderRadius: 25, }} 
                        resizeMode="contain" 
                        
                      />
                    <View style={{flexDirection:'row', gap:10, justifyContent:'flex-end', alignItems:'flex-end', marginTop:15,}}>
                        <TouchableOpacity onPress={() => {navigation.navigate('AddCertificadoAntecedentes',{ImgCertificado: data.certificado, IdCertificado: data.idcertificado})}}  style={{ padding: 0, marginBottom: 10, alignSelf:'flex-end', marginRight:15,}}>
                            <FontAwesome name="pencil" style={styles.arrowBack} />
                        </TouchableOpacity>

                        <TouchableOpacity style={{ padding: 0, marginBottom: 10, alignSelf:'flex-end', marginRight:15,}} onPress={() => DeleteAsk(data.idlicencia)}>
                            <FontAwesome name="trash" style={styles.arrowBack} />
                        </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        }else if(dataSource == ''){
            return(
               <View style={styles.ctnnoparse}>
                        <TouchableOpacity onPress={() => {navigation.navigate('AddCertificadoAntecedentes',{ImgCertificado: '', IdCertificado:''})}} style={{width:'100%', backgroundColor:'#ededed', borderRadius:10, paddingVertical:25, justifyContent:'center', alignItems:'center'}}>
                            <FontAwesome name="plus" style={{color:'#757575', fontSize:fontWidth/12, marginBottom:15}} />
                            <Text style={styles.txtRenderElements}>Agregar un certificado</Text>
                        </TouchableOpacity>
                </View>
              )
        }
      }


      DeleteAsk = (id) =>{
        ModalOptions('Alerta', '¿Eliminar?', '¿Estás seguro quieres eliminar el viaje?', () => DeleteLicencia(id));
      }
      DeleteLicencia = (id) =>{
        console.log(id)
        console.log(user)
        setActivityShow(prev => true)
        fetch(`${ServidorExport}/partner/BorrarLicencia.php`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            admin:user,
            idlicencia: id,
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
                  
                  if (responser === 'exito') {
                    fetchLicencia(user)
                    setActivityShow(prev => false)
                    ModalOptions('Exito', 'Eliminada', 'La licencia se eliminó con éxito', 'close' );
                  }else if(responser === 'existe'){
                    ModalOptions('Error', 'Error', 'Debes tener al menos una licencia','close');
                    setActivityShow(prev => false)
                  }
                  else{
                    ModalOptions('Error', 'Error', 'Error, intenta otra vez','close');
                    setActivityShow(prev => false)
                  }
                })
            }
          })
          .catch((error) => {
            ModalOptions('Error', 'Error de conexión', 'Algo falló, intenta nuevamente','close');
            setActivityShow(prev => false)
          });
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

            {activity()}
            <ScrollView style={{flex:1}} keyboardShouldPersistTaps='always'>
  
              <View style={styles.header}>
  
               <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between'}}>

               <TouchableOpacity style={{ padding: 0, marginBottom: 10, }} onPress={() => navigation.goBack()}>
                  <FontAwesome name="arrow-left" style={styles.arrowBack} />
                </TouchableOpacity>


                


               </View>


                
               <Text style={styles.TextHeader}>Certificado de antecedentes</Text>
  

   
              </View>
   
   
  
              <View style={{ flex: 1, width: '100%', marginTop: 2, paddingHorizontal: 15, backgroundColor:'transparent'}}>

             
  
                    {rendCertificado()}
  
     
  
  
  



  
  
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

export default CertificadoAntecedentesScreen;
