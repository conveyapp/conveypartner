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
const BilleteraScreen = ({route, navigation}) => {
    const [ActivityShow, setActivityShow] = React.useState('');
    const [load, setLoad] = React.useState(true);
    const [dataSource, setDataSource] = React.useState('');
    const [dataSourceServ, setDataSourceServ] = React.useState('');
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
            fetchBanco(userToken)
            fecthServicios(userToken)
        });
      
     
        return unsubscribe;
      }, [navigation, dataSource]);


      fetchBanco = async (x) => {
        await fetch(`${ServidorExport}/partner/TraerBanco.php`, {
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

      rendTarjeta = () =>{
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
                    <TouchableOpacity key={i} onPress={() => navigation.navigate('AddBanco',{Nombre:data.nombre, Rut:data.rut, Banco:data.banco, TipoCuenta: data.tipocuenta, NumeroCuenta: data.numcuenta, Email: data.email})}>
                    <LinearGradient
                    colors={['#1F4AA2', '#0A3B71']}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.card}
                    >
                    <View style={styles.cardHeader}>
                        <Text style={styles.bankName}>{data.banco}</Text>
                        <Ionicons name="pencil" size={24} color="white" />
                    </View>
                    <View style={styles.cardNumberContainer}>
                        <Text style={styles.cardNumber}>{data.numcuenta}</Text>
                        <Text style={styles.cardNumber}>{data.tipocuenta}</Text>
                    </View>
                    <View style={styles.cardDetails}>
                        <View>
                        <Text style={styles.label}>Titular</Text>
                        <Text style={styles.cardHolder}>{data.nombre}</Text>
                        <Text style={styles.cardHolder}>{data.rut}</Text>
                        <Text style={styles.cardHolder}>{data.email}</Text>
                        </View>

                    </View>
                    </LinearGradient>
            </TouchableOpacity>
                )
        })
  
            
   
   
   
        }else if(dataSource == ''){
            return(
               <View style={styles.ctnnoparse}>
                <TouchableOpacity onPress={() => navigation.navigate('AddBanco',{Nombre:'', Rut:'', Banco:'', TipoCuenta: '', NumeroCuenta: '', Email: ''})} style={{width:'100%', backgroundColor:'#ededed', borderRadius:10, paddingVertical:25, justifyContent:'center', alignItems:'center'}}>
                    <FontAwesome name="plus" style={{color:'#757575', fontSize:fontWidth/12, marginBottom:15}} />
                     <Text style={styles.txtRenderElements}>Agregar datos bancarios</Text>
                </TouchableOpacity>
                        {/* <Image
                            style={{
                                alignSelf: 'center',
                                width: fontWidth / 2,
                                height:  fontWidth / 2 ,
                                marginBottom: 20,
                                marginTop: 30,
                            }}
                            source={require('./assets/empty.png')}
                        />
  
                        <Text style={styles.txtRenderElements}>No hay datos bancarios</Text> */}
                    </View>
              )
        }
      }

      rendServs = () =>{
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
        }else if(dataSourceServ != ''){
          return dataSourceServ.map((data, i) => {
            // Formato de fecha
            const fechaOriginal = new Date(data.fecha);
            const dia = String(fechaOriginal.getDate()).padStart(2, '0');
            const mes = String(fechaOriginal.getMonth() + 1).padStart(2, '0');
            const anio = fechaOriginal.getFullYear();
            const fechaFormateada = `${dia}-${mes}-${anio}`;
          
            // Calcular precio con descuento del 20% y formatearlo con puntos
            const precioOriginal = data.precio;
            const precioConDescuento = precioOriginal * 0.8;
            const precioFormateado = precioConDescuento.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
          
            return (
              <View key={i} style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 0 }}>
                <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 28 }}>{fechaFormateada}</Text>
                <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 28 }}>{`$${precioFormateado}`}</Text>
              </View>
            );
          });
          
  
            
   
   
   
        }else if(dataSourceServ == ''){
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
  
                        <Text style={styles.txtRenderElements}>sin servicios</Text>
                    </View>
              )
        }
      }

      fecthServicios = async (x) =>{
        await fetch(`${ServidorExport}/partner/TraerServicios.php`, {
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
                       console.log(responser + 'servs')
                    if(responser == "No Results Found."){
                      setDataSourceServ(prev => '');
                      setLoad(prev => false)
                    }else{
                      setDataSourceServ(prev => responser);
                      setLoad(prev => false)
                    }
 
 
                })
            }
  
          })
          .catch((error) => {
            setConexionErr(true)
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

   
            <ScrollView style={{flex:1}} keyboardShouldPersistTaps='always'>
  
              <View style={styles.header}>
  
               <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between'}}>

               <TouchableOpacity style={{ padding: 0, marginBottom: 10, }} onPress={() => navigation.goBack()}>
                  <FontAwesome name="arrow-left" style={styles.arrowBack} />
                </TouchableOpacity>


                


               </View>


                
               <Text style={styles.TextHeader}>Mi billetera</Text>
  

   
              </View>
   
   
  
              <View style={{ flex: 1, width: '100%', marginTop: 2, paddingHorizontal: 15, backgroundColor:'transparent'}}>

              
  
{rendTarjeta()}
  
     
  
  
  


  <View style={{width:'100%', backgroundColor:'#f0f0f0', padding:10, borderRadius:5, gap:10, marginTop:15}}>

  {rendServs()} 



  </View>

  
  
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

export default BilleteraScreen;
