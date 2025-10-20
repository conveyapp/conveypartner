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
const DetalleNotiScreen = ({route, navigation}) => {
    const [Titulo, SetTitulo] = React.useState(route.params.Titulo);
    const [Cuerpo, setCuerpo] = React.useState(route.params.Cuerpo);
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


                
               <Text style={styles.TextHeader}>Noticaciones</Text>
  
  <Text style={{ color: '#262626', fontFamily:'Poppins_700Bold', fontSize: fontWidth / 20,}}>{Titulo}</Text>
  <Text style={{ color: '#262626', fontFamily:'Poppins_600SemiBold', fontSize: fontWidth / 30,}}>{Cuerpo}</Text>
  
  
  
   
              </View>
  
   
   
  
              <View style={{ flex: 1, width: '100%', marginTop: 2, paddingHorizontal: 15, backgroundColor:'transparent'}}>




          
  
              
  
  
  

  
  
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
export default DetalleNotiScreen;
