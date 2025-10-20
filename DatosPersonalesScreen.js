import React, { Component } from 'react';
import { StyleSheet, Animated, Dimensions, Text, View, Image, ScrollView, TouchableWithoutFeedback, Platform, Keyboard, Alert, KeyboardAvoidingView, TouchableOpacity, TextInput, ActivityIndicator, StatusBar } from 'react-native';
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
const DatosPersonalesScreen = ({route, navigation}) => {
    const [admin, setAdmin] = React.useState('');
    const [ActivityShow, setActivityShow] = React.useState('');
    const [load, setLoad] = React.useState(true);
    const [dataSource, setDataSource] = React.useState('');
    const [conexionErr, setConexionErr] = React.useState(false);

    const [direccion, setDireccion] = React.useState('');

    const [resutlSearch, setResutlSearch] = React.useState('');
    const [searchError, setSearchError] = React.useState(false);

    const [prefijo, setPrefijo] = React.useState('+56');
    const [paisImg, setPaisImg] = React.useState('chile'); // Solo el nombre del archivo
    const [numero, setNumero] = React.useState('');
    
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
            fetchDatosPersonales(userToken)
        });
       
     
        return unsubscribe;
      }, [navigation, dataSource]);

 
      fetchDatosPersonales = async (x) => {
        await fetch(`${ServidorExport}/partner/TraerDatosPersonales.php`, {
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

                        setIsEnabled(prev => false)
                        setEnfermedades(prev => '')
                        setMedicamentos(prev => '')
                        setAlergias(prev => '')
                        setGrupoSanguineo(prev => '')
                     }else{
                        setDataSource(prev => responser);
                        setLoad(prev => false)

                        if(responser[0].direccion != ''){
                          setDireccion(prev => responser[0].direccion)
                        }

                        if(responser[0].telefono != ''){
                            setNumero(prev => responser[0].telefono)
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
        data.append('direccion', direccion);
        data.append('numero', numero);

        console.log(admin)
        console.log(direccion)
        console.log(numero)
 

        fetch(`${ServidorExport}/partner/EditarDatosPersona.php`, {
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
                        ModalOptions('Exito', 'Información editada', 'Información personal editada exitosamente',passBack);
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


     

    passBack = () =>{
        navigation.navigate('InformacionPersonal')
      }


      rendDatosPersonales = () =>{
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
              {dataSource.map((data, i) => {
                return (

                    <View key={i}>


                {/* <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { direInput.focus(); }}>
                <View style={{ width: '80%' }}>
                  <Text style={styles.labels}>Dirección</Text>
                  <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#909fac"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    maxLength={100}
                    value={direccion}
                    placeholder="Dirección"
                    onChangeText={dire => setDireccion(dire)}
                    ref={(input) => { direInput = input; }}
                    //onSubmitEditing={() => { comunaInput.focus(); }}
                    returnKeyType={"next"}
                  />
                </View>
              </TouchableOpacity>  */}


<TouchableOpacity style={styles.ctninputs} activeOpacity={1} onPress={toggleOverlay}>
                  <Text style={[styles.labels,{marginLeft:0}]}>Direccion</Text>
                <Text style={{  color: direccion == '' ? '#909fac' : '#141414', fontWeight: 'bold', fontSize: fontWidth/26, marginBottom:4, marginTop:1}}>{direccion == '' ? 'Ej Santiago' : direccion}</Text>
              </TouchableOpacity>  




                        <TouchableOpacity activeOpacity={1} style={styles.ctntelefono} onPress={() => { num.focus(); }}>
                          {/* <Text style={styles.labels}>Número De Teléfono</Text> */}
                          <View style={{ flexDirection: 'row', }}>
                            <TouchableOpacity onPress={toggleModal} style={{ flexDirection:'row', justifyContent:'center', alignItems:'center', marginBottom: 5, marginRight: 5, marginLeft:5, paddingTop: 0, paddingRight: 8, borderRightWidth: 1, borderRightColor: '#cacaca' }}>
                             
                                {returnImageFlag()}
                                 <Text style={styles.prevPhono}>{prefijo}</Text>
                            </TouchableOpacity>
                            <TextInput
                              style={styles.inputsfono}
                              placeholderTextColor="#909fac"
                              underlineColorAndroid="transparent"
                              autoCapitalize="none"
                              autoComplete="off"
                              autoCorrect={false}
                              maxLength={100}
                              value={numero}
                              placeholder='teléfono'
                              onChangeText={numero => setNumero(numero)}
                              ref={(input) => { num = input; }}
                              returnKeyType={"next"}
                              onSubmitEditing={() =>  NextPageDosScreen() }
                            />
                          </View>
                        </TouchableOpacity>
















                <LinearGradient style={{width:'100%', height:50, borderRadius:10, justifyContent:'center', alignItems:'center'}} colors={['#E6F14B', '#E6F14B', '#C3FE70']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}>
                    <TouchableOpacity style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}} activeOpacity={1} onPress={() => EditDatos()}>
                        <Text style={{ fontWeight: 'bold', color: '#000' }}>Editar</Text>
                    </TouchableOpacity>
                    </LinearGradient>

                    </View>


                );
              })}
            </View>
          );
        }
      }


      const [modalVisibleD, setModalVisibleD] = React.useState(false);
      const opacity = React.useState(new Animated.Value(0))[0];
      const translateY = React.useRef(new Animated.Value(600)).current;
    
      const toggleModal = () => {
        Keyboard.dismiss()
        if (modalVisibleD) {
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: 600,
              duration: 500,
              useNativeDriver: true,
            })
          ]).start(() => setModalVisibleD(false));
        } else {
          setModalVisibleD(true);
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0.5,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            })
          ]).start();
        }
      };
    
      returnImageFlag = () =>{
        if(paisImg == 'chile'){
          return(
            <Image
            resizeMode="contain"
              style={{
                width:25,
                height:25,
                marginRight:10,
              }}
              source={require(`./assets/flags/chile.png`)}
          />
          )
        }else if(paisImg == 'argentina'){
          return(
            <Image
            resizeMode="contain"
              style={{
                width:25,
                height:25,
                marginRight:10,
              }}
              source={require(`./assets/flags/argentina.png`)}
          />
          )
        }
      }
    
      setToUseFlag = (prefix, country) =>{
        setPrefijo(prefix) 
        setPaisImg(country)
        toggleModal()
      }

      const [overlayVisible, setOverlayVisible] = React.useState(false);
      const fadeAnim = React.useRef(new Animated.Value(0)).current;
    
      const toggleOverlay = () => {
        if (!overlayVisible) {
          setOverlayVisible(true); // Mostrar overlay antes de la animación de fadeIn
          Animated.timing(
            fadeAnim,
            {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }
          ).start();
          setTimeout(() => {
            desdeInput.focus();
          }, 100);
        } else {
          Animated.timing(
            fadeAnim,
            {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }
          ).start(() => {
            setOverlayVisible(false)
            Keyboard.dismiss() 
          }); // Ocultar overlay después de la animación de fadeOut
        }
      } 
  
      
      fetchPlaces = async (x) => {
        const apiKey = 'AIzaSyAvBdSZwP2yakKnHJzSQGKL8W8Y5kDy4Gk';
        var lugarABuscar = x; // Puedes cambiar esto al tipo de lugar que desees buscar
        
        await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${lugarABuscar}&key=${apiKey}&language=es`, {
            method: 'GET',
        })
        .then((response) => {
            if (!response.ok || response.status !== 200) { 
                //throw new Error('Error al buscar lugares');
                setSearchError(prev => true)
            } else {
                return response.json();
            }
        })
        .then((data) => {
            // Aquí puedes manejar la respuesta de la búsqueda de lugares
            console.log(data.results[0].formatted_address);
            console.log(data);
            if(data.results[0].formatted_address == '' || data.results[0].formatted_address == 'undefined' || data.results[0].formatted_address == undefined ){
              //setSearchError(prev => true)
            }else{
              setSearchError(prev => false)
              setResutlSearch(prev => data.results[0].formatted_address)
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            setSearchError(prev => false)
            setSearchError(prev => true)
        });
  
    
    
      }
  
      ToSearch = async (x) =>{
        //var userToken = await AsyncStorage.getItem('Key_27');
        if(x == ''){
          setResutlSearch(prev => '')
          // setAvisoBuscar(prev => false)
          // fetchPrincipalClientes(userToken)
        }else{
          fetchPlaces(x)
          // setAvisoBuscar(false)
          // fetchBuscar(x, userToken)
        }
        
        //setFiltro(prev => x)
    
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


                
                <Text style={styles.TextHeader}>Datos personales</Text>
   
              </View>
              
   
   
  
              <View style={{ flex: 1, width: '100%', marginTop: 2, paddingHorizontal: 15, backgroundColor:'transparent'}}>

                {rendDatosPersonales()}
  
              </View>
  
  
  
  
  
  
  
  
            </ScrollView>

            {overlayVisible && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            justifyContent: 'flex-start',
            alignItems: 'center',
            opacity: fadeAnim,
            paddingHorizontal:10,
          }}
        >

                <View
                  style={{
                    backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'transparent',
                    height: Constants.statusBarHeight,
                    width: '100%',
                    marginBottom:15,
                    //marginTop: Constants.statusBarHeight, //Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,,
                  }} />

                  <View style={{width:'100%', justifyContent:'center', alignItems:'flex-end', marginBottom:10,}}>    
                    <TouchableOpacity onPress={toggleOverlay}>
                      <FontAwesome name="close" style={styles.arrowBack} />
                    </TouchableOpacity>
                  </View>

                <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { hastaInput.focus(); }}>
                  <View style={{ width: '80%' }}>
                    <Text style={styles.labels}>¿Desde dónde partes?</Text>
                    <TextInput
                      style={styles.inputs}
                      placeholderTextColor="#909fac"
                      underlineColorAndroid="transparent"
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect={false}
                      maxLength={100}
  
                      placeholder="Ej Santiago"
                      onChangeText={buscar => ToSearch(buscar)}
                      ref={(input) => { desdeInput = input; }}
                      onSubmitEditing={() => {                         
                        setDesde(prev => resutlSearch)
                        toggleOverlay(); }}
                      returnKeyType={"next"}
                    />
                  </View>
                </TouchableOpacity>

                {resutlSearch !== '' && !searchError && (
                    <TouchableOpacity onPress={() => {
                      setDireccion(prev => resutlSearch)
                      toggleOverlay()
                      }} style={{width:'100%', padding:10, borderBottomWidth:1, borderBottomColor:'#eaeaea'}}>
                        <Text style={{ color: '#343434', fontFamily:'Poppins_600SemiBold', fontSize: fontWidth / 30,}}>{resutlSearch}</Text>
                    </TouchableOpacity>
                )}

                {searchError && (
                  <TouchableOpacity style={{width:'100%', padding:10, borderBottomWidth:1, borderBottomColor:'#eaeaea'}}>
                    <Text style={{ color: '#343434', fontFamily:'Poppins_600SemiBold', fontSize: fontWidth / 30,}}>Hubo un error al realizar la búsqueda.</Text>
                  </TouchableOpacity>
                   
                )}







        </Animated.View>
      )}
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


{modalVisibleD && (
        <TouchableOpacity activeOpacity={1} onPress={() => { toggleModal()}} style={stylesDos.modalContainer}>
          <Animated.View style={[stylesDos.modalBackground, { opacity: opacity }]} />
          <Animated.View style={[stylesDos.modalContent, { transform: [{ translateY: translateY }] }]}>
            <Text style={{ color: '#141414', fontFamily: 'Poppins_700Bold', fontSize: 15, marginBottom:15,}}>Anexo de paises disponibles</Text>


            <TouchableOpacity  onPress={() => { setToUseFlag('+56','chile') }} 
            style={{width:'90%', height:'auto', backgroundColor:'#fff', flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10, }}>
              <View>
                <Image
                  resizeMode="contain"
                    style={{
                      width:30,
                      height:30,
                    }}
                    source={require('./assets/flags/chile.png')}
                />
              </View>
              <View>
                <Text style={{ color: '#141414', fontFamily: 'Poppins_700Bold', fontSize: 15,}}>Chile</Text>
              </View>
              <View>
                <Text style={{ color: '#141414', fontFamily: 'Poppins_700Bold', fontSize: 15,}}>+56</Text>
              </View>
            </TouchableOpacity>



            <TouchableOpacity onPress={() => { setToUseFlag('+54','argentina') }} 
             style={{width:'90%', height:'auto', backgroundColor:'#fff', flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
              <View>
                <Image
                  resizeMode="contain"
                    style={{
                      width:30,
                      height:30,
                    }}
                    source={require('./assets/flags/argentina.png')}
                />
              </View>
              <View>
                <Text style={{ color: '#141414', fontFamily: 'Poppins_700Bold', fontSize: 15,}}>Argentina</Text>
              </View>
              <View>
                <Text style={{ color: '#141414', fontFamily: 'Poppins_700Bold', fontSize: 15,}}>+54</Text>
              </View>
            </TouchableOpacity>




            {/* <TouchableOpacity onPress={toggleModal}>
              <Text style={stylesDos.closeButton}>Cerrar</Text>
            </TouchableOpacity> */}


          </Animated.View>
        </TouchableOpacity>
      )}
  
        </View>
  
      );
};

//make this component available to the app
export default DatosPersonalesScreen;
const stylesDos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    fontSize: 18,
    color: 'blue',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  closeButton: {
    marginTop: 10,
    color: 'blue',
    textAlign: 'center',
  },
});