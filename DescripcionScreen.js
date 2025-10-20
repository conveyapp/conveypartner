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
const DescripcionScreen = ({route, navigation}) => {
    const [admin, setAdmin] = React.useState('');
    const [ActivityShow, setActivityShow] = React.useState('');
    const [load, setLoad] = React.useState(true);
    const [dataSource, setDataSource] = React.useState('');
    const [conexionErr, setConexionErr] = React.useState(false);

    const [desc, setDesc] = React.useState(route.params.Desc);
    
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

    passBack = () =>{
        navigation.navigate('InformacionPersonal')
      }



      const AddDesc = () =>{


    
        Keyboard.dismiss()
        setActivityShow(prev => true);
        const data = new FormData();
    

        data.append('desc', desc);
        data.append('admin', admin);
    

    


        console.log(data.foto)
    
      
        fetch(`${ServidorExport}/partner/EditarDesc.php`, {
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
                        ModalOptions('Error', 'Ooops!1', 'Hubo un problema, intenta nuevamente','close')
                        console.log('1')
                } else {
                response.json()
                    .then(responser => {
                      console.log(responser + ' ji');
                      if(responser == 'exito'){
                        setActivityShow(prev => false)
                        ModalOptions('Exito', 'Descripción editada', 'Descripción agregada exitosamente',passBack);
                        //ModalOptions('Exito', 'Genial!', 'Registrado con éxito', backPassPage)
                      }else if(responser == 'error'){
                        setActivityShow(prev => false)  
                        ModalOptions('Error', 'Ooops!', 'Hubo un problema, intenta nuevamente','close')
                      }
                      else{
                        setActivityShow(prev => false)  
                        console.log(responser);
                        ModalOptions('Error', 'Ooops!', 'Hubo un problema, intenta nuevamente','close')
                      }
    
    
                    })
                }
     
            })
            .catch((error) => {
              setActivityShow(prev => false)  
                ModalOptions('Error', 'Ooops!4', 'Hubo un problema, intenta nuevamente','close')             
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


                
                <Text style={styles.TextHeader}>Descripción</Text>
   
              </View>
              
   
   
  
              <View style={{ flex: 1, width: '100%', marginTop: 2, paddingHorizontal: 15, backgroundColor:'transparent'}}>

              <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { descInp.focus(); }}>
                <View style={{ width: '80%' }}>
                    <Text style={styles.labels}>Descripción</Text>
                    <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}
                    value={desc}
                    placeholder="Ingresa una descripción"
                    onChangeText={desc => setDesc(desc)}
                    ref={(input) => { descInp = input; }}
                    />
                    
                </View>
                </TouchableOpacity>


              
  
                {route.params.Desc != '' ? (
                    <LinearGradient style={{width:'100%', height:50, borderRadius:10, justifyContent:'center', alignItems:'center'}} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>
                    <TouchableOpacity style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}} activeOpacity={1} onPress={() => AddDesc()}>
                        <Text style={{ fontWeight: 'bold', color: '#000' }}>Editar</Text>
                    </TouchableOpacity>
                    </LinearGradient>
                ) : (
                    <LinearGradient style={{width:'100%', height:50, borderRadius:10, justifyContent:'center', alignItems:'center'}} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>
                    <TouchableOpacity style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}} activeOpacity={1} onPress={() => AddDesc()}>
                        <Text style={{ fontWeight: 'bold', color: '#000' }}>Agregar</Text>
                    </TouchableOpacity>
                    </LinearGradient>
                )}
  

  
  
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

//make this component available to the app
export default DescripcionScreen;
