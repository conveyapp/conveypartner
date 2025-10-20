import React, { Component } from 'react';
import { View, Text, Dimensions ,StyleSheet, Image, TextInput, TouchableOpacity, Platform, Alert, TouchableWithoutFeedback, Keyboard, StatusBar, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from './Modal.js'
import ActivityIndi from './activityIndi.js'
import { ServidorExport } from './ServAdress.js'
import { styles } from "./Style.js";

let fontWidth = Dimensions.get('window').width;

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

//class RegistroCincoScreen extends Component {
  const RegistroLocalScreen = ({route, navigation }) => {
    const [load, setLoad] = React.useState(false);
    const [dataSource, setDataSource] = React.useState('');
    const [conexionErr, setConexionErr] = React.useState(false);


    const [latitude, setlatitude] = React.useState(route.params.Latitude);
    const [longitude, setlongitude] = React.useState(route.params.Longitude);
    const [direc, setdirec] = React.useState(route.params.Direc);
    const [comuna, setcomuna] = React.useState(route.params.Comuna);
    const [deptoblock, setdeptoblock] = React.useState(route.params.DeptoBlock);

    const [numero, setnumero] = React.useState(route.params.Numero); 
    const [correo, setcorreo] = React.useState(route.params.Correo); 

    const [LocalFinal, setLocalFinal] = React.useState(''); 


    // const [clave, setclave] = React.useState(''); 
    // const [claveDos, setclaveDos] = React.useState(''); 




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

    React.useEffect(() => {
        fetchPrincipal()
    }, []);

    fetchPrincipal = () => {
        fetch(`${ServidorExport}/GoApp/cliente/TraerLocales.php`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
        })
          .then((response) => {
            if (!response.ok || response.status != 200 || response.status != '200') { 
                setConexionErr(true)
            } else {
              response.json()
                .then(responser => {
                    console.log(responser)
                    if(responser == 'No Results Found.'){
                      setDataSource(prev => 'empty');
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

    RenderLocales = () =>{
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
          }else if(dataSource == 'empty'){
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
                  source={require('./assets/empty.png')}
                />
                  <Text style={styles.tituloRendError}>No hay productos</Text>
                    <Text style={styles.subtituloRendError}>Esta categoría no tiene productos</Text>
                
                </View>
              )
          }else if(dataSource != ''){
                return dataSource.map((data, i) => {
                  return(
                  <TouchableOpacity key={i} onPress={()=>{ setLocalFinal(data.correo) }} style={{ width:'100%', marginBottom:10 , paddingVertical:10,}}>
                        <Text style={{color: data.correo == LocalFinal ? '#7A2FFF' : '#262626', fontFamily:'Montserrat_600SemiBold', fontSize: fontWidth / 22,}}>{data.correo}</Text>
                  </TouchableOpacity>
              
              
              )
              })
      
          }
    }
  

  activity = () => {
        if (load == true) {
        return (
            <ActivityIndi/>
        )
        } 
  }

  registroExito = () =>{
    navigation.navigate('Primera');
  }

  Verificar = () => {
    
    if (LocalFinal == '') {
      ModalOptions('Error', 'Falta un local', 'Debes elegir un local','close');

    } else {
      navigation.navigate('RegistroCinco', {Direc: direc, Comuna:comuna, Latitude: latitude, Longitude: longitude, DeptoBlock: deptoblock, Numero: numero, Correo:correo, Local:LocalFinal});
    }
  }

 


  


    return (
      <View style={{flex:1}}>
      <DismissKeyboard style={{flex:1}}>


        <View style={styles.container}>
          {activity()}
          <StatusBar
          barStyle="dark-content"
          backgroundColor="#fff"
          translucent={true}
        />
        <View
          style={{
            backgroundColor: Platform.OS === 'ios' ? '#fff' : '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#fafafa',
            height: Constants.statusBarHeight,
            width: '100%',
            //marginTop: Constants.statusBarHeight, //Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,,
          }} />

        <View style={styles.header}>

        <TouchableOpacity style={{ padding: 0, marginBottom: 10, }} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" style={styles.arrowBack} />
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.TextHeader}>Local</Text>

        </View>





        </View>


        <View style={{ flex: 1, width: '100%', alignItems: 'center', marginTop: 10, paddingHorizontal: 15, }}>
            




{RenderLocales()}






             

                    <TouchableOpacity style={styles.Btn} onPress={() => Verificar()}>
                    <Text style={styles.txtBtn}>Siguiente</Text>
                    </TouchableOpacity>


                </View>
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

export default RegistroLocalScreen;

