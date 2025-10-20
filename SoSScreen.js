import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, ScrollView, TouchableWithoutFeedback, Platform, Keyboard, Alert, KeyboardAvoidingView, TouchableOpacity, TextInput, ActivityIndicator, StatusBar } from 'react-native';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';
import Modal from './Modal.js';
import ActivityIndi from './activityIndi.js'
import { ServidorExport } from './ServAdress.js'
import { styles } from "./Style.js";
import AsyncStorage from '@react-native-async-storage/async-storage';

let fontWidth = Dimensions.get('window').width;

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  )

// create a component
const SoSScreen = ({route, navigation}) => {
    
    const [ActivityShow, setActivityShow] = React.useState('');
    const [load, setLoad] = React.useState(true);
    const [dataSource, setDataSource] = React.useState('');
    const [dataSourceServ, setDataSourceServ] = React.useState('');
    const [conexionErr, setConexionErr] = React.useState(false);


    
    //const [user, setUser] = React.useState(route.params.User);
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
            fetchContacto(userToken)
        });
      
     
        return unsubscribe;
      }, [navigation, dataSource]);

      fetchContacto = async (x) => {
        await fetch(`${ServidorExport}/partner/TraerContactoEmergencia.php`, {
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
      rendContact = () =>{
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
                    <View  style={{gap:10}} key={i}>
                        <TouchableOpacity onPress={() => navigation.navigate('AddContactoEmergencia', {Nombre:data.nombre, Numero:data.numero})}  style={{width:'100%', flexDirection:'row', padding:9, borderRadius:10, backgroundColor:'#f0f0f0'}}>
                            <View style={{width:'80%'}}>
                                <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 28 }}>Contacto de emergencia</Text>
                                <Text style={{ color: '#262626', fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 32 }}>Nombre</Text>
                                <Text style={{ color: '#262626', fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 32 }}>+56 9 87261034</Text>
                            </View>
                            <View  style={{width:'20%', justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
                                <TouchableOpacity style={{ padding: 0, marginBottom: 0, }} onPress={() => marcadorTel('987261034')}>
                                    <FontAwesome name="phone" style={styles.arrowBack} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>

                        <View style={{width:'100%', flexDirection:'row', padding:9, borderRadius:10, backgroundColor:'#f0f0f0'}}>
                            <View style={{width:'80%'}}>
                                <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 28 }}>Ambulancia</Text>
                                <Text style={{ color: '#262626', fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 32 }}>131</Text>
                            </View>
                            <View  style={{width:'20%', justifyContent:'center', alignItems:'center'}}>
                                <TouchableOpacity style={{ padding: 0, marginBottom: 0, }} onPress={() => marcadorEmergencia('131')}>
                                <FontAwesome name="phone" style={styles.arrowBack} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{width:'100%', flexDirection:'row', padding:9, borderRadius:10, backgroundColor:'#f0f0f0'}}>
                            <View style={{width:'80%'}}>
                                <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 28 }}>Bomberos</Text>
                                <Text style={{ color: '#262626', fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 32 }}>132</Text>
                            </View>
                            <View  style={{width:'20%', justifyContent:'center', alignItems:'center'}}>
                                <TouchableOpacity style={{ padding: 0, marginBottom: 0, }} onPress={() => marcadorEmergencia('132')}>
                                <FontAwesome name="phone" style={styles.arrowBack} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{width:'100%', flexDirection:'row', padding:9, borderRadius:10, backgroundColor:'#f0f0f0'}}>
                            <View style={{width:'80%'}}>
                                <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 28 }}>Carabineros</Text>
                                <Text style={{ color: '#262626', fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 32 }}>133</Text>
                            </View>
                            <View  style={{width:'20%', justifyContent:'center', alignItems:'center'}}>
                                <TouchableOpacity style={{ padding: 0, marginBottom: 0, }} onPress={() => marcadorEmergencia('133')}>
                                <FontAwesome name="phone" style={styles.arrowBack} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{width:'100%', flexDirection:'row', padding:9, borderRadius:10, backgroundColor:'#f0f0f0'}}>
                            <View style={{width:'80%'}}>
                                <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 28 }}>Policia de investigaciones (PDI)</Text>
                                <Text style={{ color: '#262626', fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 32 }}>134</Text>
                            </View>
                            <View  style={{width:'20%', justifyContent:'center', alignItems:'center'}}>
                                <TouchableOpacity style={{ padding: 0, marginBottom: 0, }} onPress={() => marcadorEmergencia('134')}>
                                <FontAwesome name="phone" style={styles.arrowBack} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{width:'100%', flexDirection:'row', padding:9, borderRadius:10, backgroundColor:'#f0f0f0'}}>
                            <View style={{width:'80%'}}>
                                <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 28 }}>Asociación chilena de seguridad (ACHS)</Text>
                                <Text style={{ color: '#262626', fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 32 }}>1404</Text>
                            </View>
                            <View  style={{width:'20%', justifyContent:'center', alignItems:'center'}}>
                                <TouchableOpacity style={{ padding: 0, marginBottom: 0, }} onPress={() => marcadorEmergencia('1404')}>
                                <FontAwesome name="phone" style={styles.arrowBack} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{width:'100%', flexDirection:'row', padding:9, borderRadius:10, backgroundColor:'#f0f0f0'}}>
                            <View style={{width:'80%'}}>
                                <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 28 }}>Mutual de seguridad</Text>
                                <Text style={{ color: '#262626', fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 32 }}>1407</Text>
                            </View>
                            <View  style={{width:'20%', justifyContent:'center', alignItems:'center'}}>
                                <TouchableOpacity style={{ padding: 0, marginBottom: 0, }} onPress={() => marcadorEmergencia('1407')}>
                                <FontAwesome name="phone" style={styles.arrowBack} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{width:'100%', flexDirection:'row', padding:9, borderRadius:10, backgroundColor:'#f0f0f0'}}>
                            <View style={{width:'80%'}}>
                                <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 28 }}>Urgencias por intoxicaciones y accidentes por sustancias químicas, Tóxicos o materiales peligrosos (Corporación RITA - Chile)</Text>
                                <Text style={{ color: '#262626', fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 32 }}>+56 227772994</Text>
                            </View>
                            <View  style={{width:'20%', justifyContent:'center', alignItems:'center'}}>
                                <TouchableOpacity style={{ padding: 0, marginBottom: 0, }} onPress={() => marcadorTel('227772994')}>
                                <FontAwesome name="phone" style={styles.arrowBack} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{width:'100%', flexDirection:'row', padding:9, borderRadius:10, backgroundColor:'#f0f0f0'}}>
                            <View style={{width:'80%'}}>
                                <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 28 }}>Emergencias toxicológicas (CITUC)</Text>
                                <Text style={{ color: '#262626', fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 32 }}>+56 226353800</Text>
                            </View>
                            <View  style={{width:'20%', justifyContent:'center', alignItems:'center'}}>
                                <TouchableOpacity style={{ padding: 0, marginBottom: 0, }} onPress={() => marcadorTel('226353800')}>
                                <FontAwesome name="phone" style={styles.arrowBack} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )
        })
  
            
   
   
   
        }else if(dataSource == ''){
            return(
                <View style={{gap:10}}>
                <TouchableOpacity onPress={() => navigation.navigate('AddContactoEmergencia', {Nombre:'', Numero:''})}  style={{width:'100%', flexDirection:'row', padding:9, borderRadius:10, backgroundColor:'#f0f0f0'}}>
                    <View style={{width:'80%'}}>
                        <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 28 }}>Contacto de emergencia</Text>
                        <Text style={{ color: '#262626', fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 32 }}>Agrega un contacto de emergencia</Text>
                    </View>
                    <View  style={{width:'20%', justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
                        <TouchableOpacity style={{ padding: 0, marginBottom: 0, }} onPress={() => marcadorTel('987261034')}>
                            <FontAwesome name="phone" style={styles.arrowBack} />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>

                <View style={{width:'100%', flexDirection:'row', padding:9, borderRadius:10, backgroundColor:'#f0f0f0'}}>
                    <View style={{width:'80%'}}>
                        <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 28 }}>Ambulancia</Text>
                        <Text style={{ color: '#262626', fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 32 }}>131</Text>
                    </View>
                    <View  style={{width:'20%', justifyContent:'center', alignItems:'center'}}>
                        <TouchableOpacity style={{ padding: 0, marginBottom: 0, }} onPress={() => marcadorEmergencia('131')}>
                        <FontAwesome name="phone" style={styles.arrowBack} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{width:'100%', flexDirection:'row', padding:9, borderRadius:10, backgroundColor:'#f0f0f0'}}>
                    <View style={{width:'80%'}}>
                        <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 28 }}>Bomberos</Text>
                        <Text style={{ color: '#262626', fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 32 }}>132</Text>
                    </View>
                    <View  style={{width:'20%', justifyContent:'center', alignItems:'center'}}>
                        <TouchableOpacity style={{ padding: 0, marginBottom: 0, }} onPress={() => marcadorEmergencia('132')}>
                        <FontAwesome name="phone" style={styles.arrowBack} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{width:'100%', flexDirection:'row', padding:9, borderRadius:10, backgroundColor:'#f0f0f0'}}>
                    <View style={{width:'80%'}}>
                        <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 28 }}>Carabineros</Text>
                        <Text style={{ color: '#262626', fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 32 }}>133</Text>
                    </View>
                    <View  style={{width:'20%', justifyContent:'center', alignItems:'center'}}>
                        <TouchableOpacity style={{ padding: 0, marginBottom: 0, }} onPress={() => marcadorEmergencia('133')}>
                        <FontAwesome name="phone" style={styles.arrowBack} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{width:'100%', flexDirection:'row', padding:9, borderRadius:10, backgroundColor:'#f0f0f0'}}>
                    <View style={{width:'80%'}}>
                        <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 28 }}>Policia de investigaciones (PDI)</Text>
                        <Text style={{ color: '#262626', fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 32 }}>134</Text>
                    </View>
                    <View  style={{width:'20%', justifyContent:'center', alignItems:'center'}}>
                        <TouchableOpacity style={{ padding: 0, marginBottom: 0, }} onPress={() => marcadorEmergencia('134')}>
                        <FontAwesome name="phone" style={styles.arrowBack} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{width:'100%', flexDirection:'row', padding:9, borderRadius:10, backgroundColor:'#f0f0f0'}}>
                    <View style={{width:'80%'}}>
                        <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 28 }}>Asociación chilena de seguridad (ACHS)</Text>
                        <Text style={{ color: '#262626', fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 32 }}>1404</Text>
                    </View>
                    <View  style={{width:'20%', justifyContent:'center', alignItems:'center'}}>
                        <TouchableOpacity style={{ padding: 0, marginBottom: 0, }} onPress={() => marcadorEmergencia('1404')}>
                        <FontAwesome name="phone" style={styles.arrowBack} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{width:'100%', flexDirection:'row', padding:9, borderRadius:10, backgroundColor:'#f0f0f0'}}>
                    <View style={{width:'80%'}}>
                        <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 28 }}>Mutual de seguridad</Text>
                        <Text style={{ color: '#262626', fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 32 }}>1407</Text>
                    </View>
                    <View  style={{width:'20%', justifyContent:'center', alignItems:'center'}}>
                        <TouchableOpacity style={{ padding: 0, marginBottom: 0, }} onPress={() => marcadorEmergencia('1407')}>
                        <FontAwesome name="phone" style={styles.arrowBack} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{width:'100%', flexDirection:'row', padding:9, borderRadius:10, backgroundColor:'#f0f0f0'}}>
                    <View style={{width:'80%'}}>
                        <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 28 }}>Urgencias por intoxicaciones y accidentes por sustancias químicas, Tóxicos o materiales peligrosos (Corporación RITA - Chile)</Text>
                        <Text style={{ color: '#262626', fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 32 }}>+56 227772994</Text>
                    </View>
                    <View  style={{width:'20%', justifyContent:'center', alignItems:'center'}}>
                        <TouchableOpacity style={{ padding: 0, marginBottom: 0, }} onPress={() => marcadorTel('227772994')}>
                        <FontAwesome name="phone" style={styles.arrowBack} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{width:'100%', flexDirection:'row', padding:9, borderRadius:10, backgroundColor:'#f0f0f0'}}>
                    <View style={{width:'80%'}}>
                        <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 28 }}>Emergencias toxicológicas (CITUC)</Text>
                        <Text style={{ color: '#262626', fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 32 }}>+56 226353800</Text>
                    </View>
                    <View  style={{width:'20%', justifyContent:'center', alignItems:'center'}}>
                        <TouchableOpacity style={{ padding: 0, marginBottom: 0, }} onPress={() => marcadorTel('226353800')}>
                        <FontAwesome name="phone" style={styles.arrowBack} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
              )
        }
      }


    marcadorTel = (numero) => {
        Linking.openURL(`tel:+56${numero}`)
    }
    marcadorEmergencia = (numero) => {
        Linking.openURL(`tel:${numero}`)
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


                
               <Text style={styles.TextHeader}>S.O.S</Text>
  

  
  
  
   
              </View>
  
   
   
  
              <View style={{ flex: 1, width: '100%', marginTop: 15, paddingHorizontal: 15, backgroundColor:'transparent', gap:10}}>

              







 {rendContact()}
  
              
  
  
  

  
  
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

export default SoSScreen;
