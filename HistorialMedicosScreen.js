import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Switch, ScrollView, TouchableWithoutFeedback, Platform, Keyboard, Alert, KeyboardAvoidingView, TouchableOpacity, TextInput, ActivityIndicator, StatusBar } from 'react-native';
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
const HistorialMedicosScreen = ({route, navigation}) => {
    const [admin, setAdmin] = React.useState('');
    const [ActivityShow, setActivityShow] = React.useState('');
    const [load, setLoad] = React.useState(true);
    const [dataSource, setDataSource] = React.useState('');
    const [conexionErr, setConexionErr] = React.useState(false);

    const [isEnabled, setIsEnabled] = React.useState(false);
    const [switchShow, setSwitchShow] = React.useState('');

    const [enfermedades, setEnfermedades] = React.useState('');
    const [medicamentos, setMedicamentos] = React.useState('');
    const [alergias, setAlergias] = React.useState('');
    const [grupoSanguineo, setGrupoSanguineo] = React.useState('');
    
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
            setAdmin(pprev => userToken)
            fetchInfoMedica(userToken)
        });
       
     
        return unsubscribe;
      }, [navigation, dataSource]);

 
      fetchInfoMedica = async (x) => {
        await fetch(`${ServidorExport}/partner/TraerInfoMedica.php`, {
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
                        setDataSource(prev => 'no');
                        setLoad(prev => false)

                        setIsEnabled(prev => false)
                        setEnfermedades(prev => '')
                        setMedicamentos(prev => '')
                        setAlergias(prev => '')
                        setGrupoSanguineo(prev => '')
                     }else{
                        setDataSource(prev => responser);
                        setLoad(prev => false)

                        if(responser[0].compartir == 'si'){
                            setIsEnabled(prev => true)
                        }
                        if(responser[0].enfermedades != ''){
                            setEnfermedades(prev => responser[0].enfermedades)
                        }
                        if(responser[0].medicamentos != ''){
                            setMedicamentos(prev => responser[0].medicamentos)
                        }
                        if(responser[0].alergias != ''){
                            setAlergias(prev => responser[0].alergias)
                        }
                        if(responser[0].grupo != ''){
                            setGrupoSanguineo(prev => responser[0].grupo)
                        }

                     }
  
  
                 })
             }
   
           })
           .catch((error) => {
             setConexionErr(true)
           });
      }

      const EditDatos = () =>{


    
        Keyboard.dismiss()
        setActivityShow(prev => true);
        const data = new FormData();
    
        
        data.append('usr', admin);
        data.append('enfermedades', enfermedades);
        data.append('medicamentos', medicamentos);
        data.append('alergias', alergias);
        data.append('grupo', grupoSanguineo);
    
      console.log(admin)
      console.log(enfermedades)
      console.log(medicamentos)
      console.log(alergias)
      console.log(grupoSanguineo)

        fetch(`${ServidorExport}/partner/EditarInfoMedica.php`, {
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
                        ModalOptions('Exito', 'Información editada', 'Información médica editada exitosamente',passBack);
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

    toggleSwitch = () =>{
        setIsEnabled(previousState => !previousState);
    
        if(isEnabled){
          turnSwitch('false')
        }else{
          turnSwitch('true')
        }
      }
     
    
      function turnSwitch(x){
        console.log(x)
        console.log(correoUser)
        setActivityShow(true)
        fetch(`${ServidorExport}/partner/TurnMedicamentos.php`, {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usr:correoUser,
                    turn: x
                })
            })
                .then((response) => {
                if (!response.ok || response.status != 200 || response.status != '200') {
                    ModalOptions('Error', 'Ooops!', 'Hubo un problema, intenta nuevamente','close')
                    setActivityShow(false)
                    setIsEnabled(previousState => !previousState);
                } else {
                    response.json()
                    .then(responser => {
                      console.log(responser)
                        if(responser == 'exito'){
    
                            if(x == 'false'){
                                ModalOptions('Exito', 'Exito!', 'Desactivaste el servicio','close')
                            }
                            if(x == 'true'){
                                ModalOptions('Exito', 'Exito!', 'Activaste el servicio','close')
                            }
                            
                            setActivityShow(false)
                        }else{
                            setActivityShow(false)
                            ModalOptions('Error', 'Ooops!', 'Hubo un problema, intenta nuevamente','close')
                            setIsEnabled(previousState => !previousState);
    
                        }
                        
                    })
                }
        
                })
                .catch((error) => {
                    ModalOptions('Error', 'Ooops!', 'Hubo un problema, intenta nuevamente','close')
                    setActivityShow(false)
                    setIsEnabled(previousState => !previousState);
                });
    
    }

    passBack = () =>{
        navigation.navigate('InformacionPersonal')
      }


      rendInfoMedico = () =>{
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
        }else if (dataSource != '' ) {
          return (
            <View>
              
               

                    <View >

                    <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:15, marginBottom:15,}}>
                    <Text style={{fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 25}}>Compartir ante emergencias</Text>

                    <Switch
                        trackColor={{false: '#767577', true: '#68C151'}}
                        thumbColor={isEnabled ? '#E6F14B' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>

              <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { enfInp.focus(); }}>
                <View style={{ width: '80%' }}>
                    <Text style={styles.labels}>Enfermedades</Text>
                    <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}
                    value={enfermedades}
                    placeholder="Ingresa las enfermedades que padeces"
                    onChangeText={enf => setEnfermedades(enf)}
                    ref={(input) => { enfInp = input; }}
                    />
                    
                </View>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { medInp.focus(); }}>
                <View style={{ width: '80%' }}>
                    <Text style={styles.labels}>Medicamentos</Text>
                    <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}
                    value={medicamentos}
                    placeholder="Ingresa los medicamentos que tomas"
                    onChangeText={medicamentos => setMedicamentos(medicamentos)}
                    ref={(input) => { medInp = input; }}
                    />
                    
                </View>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { alergiasInp.focus(); }}>
                <View style={{ width: '80%' }}>
                    <Text style={styles.labels}>Alergias a medicamentos</Text>
                    <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}
                    value={alergias}
                    placeholder="Ingresa los alergias medicas"
                    onChangeText={alergias => setAlergias(alergias)}
                    ref={(input) => { alergiasInp = input; }}
                    />
                    
                </View>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { alergiasInp.focus(); }}>
                <View style={{ width: '80%' }}>
                    <Text style={styles.labels}>Grupo Sanguineo</Text>
                    <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}
                    value={grupoSanguineo}
                    placeholder="Ingresa tu grupo sanguineo"
                    onChangeText={grupoSanguineo => setGrupoSanguineo(grupoSanguineo)}
                    ref={(input) => { alergiasInp = input; }}
                    />
                    
                </View>
                </TouchableOpacity>


                <LinearGradient style={{width:'100%', height:50, borderRadius:10, justifyContent:'center', alignItems:'center'}} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>
                    <TouchableOpacity style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}} activeOpacity={1} onPress={() => EditDatos()}>
                        <Text style={{ fontWeight: 'bold', color: '#000' }}>Guardar</Text>
                    </TouchableOpacity>
                    </LinearGradient>

                    </View>


             
         
            </View>
          );
        }else if (dataSource === 'no' ) {
          return (
            <View>
              
            

                    <View >

                    <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:15, marginBottom:15,}}>
                    <Text style={{fontFamily: 'Poppins_500Medium', fontSize: fontWidth / 25}}>Compartir ante emergencias</Text>

                    <Switch
                        trackColor={{false: '#767577', true: '#68C151'}}
                        thumbColor={isEnabled ? '#E6F14B' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>

              <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { enfInp.focus(); }}>
                <View style={{ width: '80%' }}>
                    <Text style={styles.labels}>Enfermedades</Text>
                    <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}
                    value={enfermedades}
                    placeholder="Ingresa las enfermedades que padeces"
                    onChangeText={enf => setEnfermedades(enf)}
                    ref={(input) => { enfInp = input; }}
                    />
                    
                </View>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { medInp.focus(); }}>
                <View style={{ width: '80%' }}>
                    <Text style={styles.labels}>Medicamentos</Text>
                    <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}
                    value={medicamentos}
                    placeholder="Ingresa los medicamentos que tomas"
                    onChangeText={medicamentos => setMedicamentos(medicamentos)}
                    ref={(input) => { medInp = input; }}
                    />
                    
                </View>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { alergiasInp.focus(); }}>
                <View style={{ width: '80%' }}>
                    <Text style={styles.labels}>Alergias a medicamentos</Text>
                    <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}
                    value={alergias}
                    placeholder="Ingresa los alergias medicas"
                    onChangeText={alergias => setAlergias(alergias)}
                    ref={(input) => { alergiasInp = input; }}
                    />
                    
                </View>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { alergiasInp.focus(); }}>
                <View style={{ width: '80%' }}>
                    <Text style={styles.labels}>Grupo Sanguineo</Text>
                    <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}
                    value={grupoSanguineo}
                    placeholder="Ingresa tu grupo sanguineo"
                    onChangeText={grupoSanguineo => setGrupoSanguineo(grupoSanguineo)}
                    ref={(input) => { alergiasInp = input; }}
                    />
                    
                </View>
                </TouchableOpacity>


                <LinearGradient style={{width:'100%', height:50, borderRadius:10, justifyContent:'center', alignItems:'center'}} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>
                    <TouchableOpacity style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}} activeOpacity={1} onPress={() => EditDatos()}>
                        <Text style={{ fontWeight: 'bold', color: '#000' }}>Guardar</Text>
                    </TouchableOpacity>
                    </LinearGradient>

                    </View>


            
             
            </View>
          );
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


                
                <Text style={styles.TextHeader}>Historial médico</Text>
   
              </View>
              
   
   
  
              <View style={{ flex: 1, width: '100%', marginTop: 2, paddingHorizontal: 15, backgroundColor:'transparent'}}>

  

  {rendInfoMedico()}
  
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
export default HistorialMedicosScreen;
