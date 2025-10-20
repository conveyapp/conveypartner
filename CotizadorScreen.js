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
const CotizadorScreen = ({route, navigation}) => {
    
    
    const [valorCoti, setValorCoti] = React.useState('');
    const [valorDescuento, setValorDescuento] = React.useState('');
    const [valorRestado, setValorRestado] = React.useState(''); // Estado para el 20% que se restará
    let valInp;

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

    const handleValorChange = (val) => {
        // Filtrar solo números
        const numericValue = val.replace(/[^0-9]/g, '');
    
        // Formatear con puntos cada mil y actualizar el estado
        const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        setValorCoti(formattedValue);
    
        // Calcular el monto que representa el 20%
        const originalValue = parseInt(numericValue, 10);
        const montoRestado = originalValue ? Math.round(originalValue * 0.2) : 0;
        const formattedMontoRestado = montoRestado.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
        // Calcular el valor con el 20% menos
        const discountedValue = originalValue ? Math.round(originalValue * 0.8) : 0;
        const formattedDiscountedValue = discountedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
        // Actualizar los estados
        setValorRestado(formattedMontoRestado); // Guardar el 20% que se restará
        setValorDescuento(formattedDiscountedValue); // Guardar el valor con el 20% de descuento
      };


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


                
               <Text style={styles.TextHeader}>Cotizador</Text>
  

               <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { valInp.focus(); }}>
                <View style={{ width: '80%' }}>
                    <Text style={styles.labels}>Ingresa el monto a cotizar</Text>
                    <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}
                    value={valorCoti.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} // Formatear el valor de input
                    placeholder="20.000"
                    onChangeText={handleValorChange}
                    ref={(input) => { valInp = input; }}
                    />
                    
                </View>
                </TouchableOpacity>
  
                {/* Mostrar el valor con el 20% menos debajo del input */}
                {/* <Text style={}>Monto con 20% menos: {valorDescuento}</Text> */}
                {valorCoti && (
          <>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 28 }}>Monto: </Text>
              <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 28 }}>${valorCoti}</Text>
            </View>

            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 28 }}>Comisión Convey -20%: </Text>
              <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 28 }}>${valorRestado}</Text>
            </View>

            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#262626', fontFamily: 'Poppins_600SemiBold', fontSize: fontWidth / 28 }}>Total: </Text>
              <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 28 }}>${valorDescuento}</Text>
            </View>
          </>
        )}
   
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

export default CotizadorScreen;
