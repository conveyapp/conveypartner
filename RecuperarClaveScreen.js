// import React, { Component } from 'react';
// import { View, Dimensions, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard, ActivityIndicator, StatusBar } from 'react-native';
// import { FontAwesome } from '@expo/vector-icons';
// import Constants from 'expo-constants';
// import ActivityIndi from './activityIndi.js'
// import { ServidorExport } from './ServAdress.js'
// import { styles } from "./Style.js";

// let fontWidth = Dimensions.get('window').width;




// const DismissKeyboard = ({ children }) => (
//   <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
//     {children}
//   </TouchableWithoutFeedback>
// )

// class RecuperarClaveScreen extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       correo: '',
//     };
//   }

//   activity = () => {
//     if (this.state.hola == '1') {
//       return (
//         <ActivityIndi/>
//       )
//     } 
//   }

//   popupback = () =>{
//     this.props.navigation.navigate('Ingreso')
//   }




//   recuperarClave() {
//     Keyboard.dismiss()
//     console.log(this.state.correo);
//     if (this.state.correo == '') {
//       //Alert.alert('Debes ingresar un Correo')
//       Popup.show({
//         type: 'Warning',
//         title: 'No se envió el correo',
//         button: true,
//         textBody: 'Debes ingresar un correo para poder enviarte el link de recuperación',
//         buttontext: 'Ok',
//         callback: () => Popup.hide()
//       })

//     } else {
//       //console.log(this.state.correo)
//       this.setState({
//         hola: '1',
//       });

//       fetch(`${ServidorExport}/GoApp/cliente/CambiarClave.php`, {
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           correo: this.state.correo,
//         })

//       })

//     .then( response =>{


//       if (!response.ok || response.status != 200 || response.status != '200') {
//         // Alert.alert('error de conexión! intenta otra vez');
//         Popup.show({
//           type: 'Warning',
//           title: 'Error de conexión',
//           button: true,
//           textBody: 'Algo falló, intenta nuevamente',
//           buttontext: 'Ok',
//           callback: () => Popup.hide()
//         });
//         this.setState({
//           //reload: true,
//           hola: '0',
//         })
//       } else {
//         response.json()
//         .then(responser => {
//             // If server response message same as Data Matched
//             if (responser === 'Correo Enviado') {
//               this.setState({
//                 hola: '0',
//               });

//               //Alert.alert(responseJson);
//               Popup.show({
//                 type: 'Success',
//                 title: 'Correo Enviado',
//                 button: true,
//                 textBody: 'Te enviamos un correo de recuperación de clave!',
//                 buttontext: 'Ok',
//                 callback: () => this.popupback()
//               })



//             } else if (responser === 'Este correo no existe'){
//               this.setState({
//                 hola: '0',
//               });

//               //Alert.alert(responseJson);
//               Popup.show({
//                 type: 'Danger',
//                 title: 'Ooops!',
//                 button: true,
//                 textBody: 'Este correo no existe, revisa que hayas escrito bien el correo',
//                 buttontext: 'Ok',
//                 callback: () => Popup.hide()
//               })



//             } else {
//               console.log(responser)
//               //Alert.alert(responseJson);
//               Popup.show({
//                 type: 'Danger',
//                 title: 'Error',
//                 button: true,
//                 textBody: 'Error, intenta otra vez',
//                 buttontext: 'Ok',
//                 callback: () => Popup.hide()
//               })
//               this.setState({
//                 hola: '0',
//               });
//             }




//         })
//       }
//     })














//         .catch((error) => {
//               console.log(error)
//               Popup.show({
//                 type: 'Warning',
//                 title: 'Error de conexión',
//                 button: true,
//                 textBody: 'Algo falló, intenta nuevamente',
//                 buttontext: 'Ok',
//                 callback: () => Popup.hide()
//               })

//               this.setState({
//                 hola: '0',
//               });
//         });
//     }

//   }

//   render() {
//     return (
//       <View style={{flex:1}}>
//       <DismissKeyboard style={{flex:1}}>


//         <View style={styles.container}>
//         <StatusBar
//           barStyle="dark-content"
//           backgroundColor="#fff"
//           translucent={true}
//         />
//          {this.activity()}
//         <View
//           style={{
//             backgroundColor: Platform.OS === 'ios' ? '#fff' : '#fff',
//             borderBottomWidth: 1,
//             borderBottomColor: '#fafafa',
//             height: Constants.statusBarHeight,
//             width: '100%',
//            // marginTop: Constants.statusBarHeight, //Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,,
//           }} />

//          <View style={styles.header}>

// <TouchableOpacity style={{ padding: 0, marginBottom: 10, }} onPress={() => this.props.navigation.goBack()}>
//     <FontAwesome name="arrow-left" style={styles.arrowBack} />
// </TouchableOpacity>

// <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//   <Text style={styles.TextHeader}>Recuperar Clave</Text>

// </View>





// </View>






//           <View style={{flex:1, width:'100%',alignItems:'center', marginTop:10, paddingHorizontal:15,}}>


//             <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { this.recu.focus(); }}>
//               <Text style={styles.labels}>Correo</Text>
//               <TextInput
//                 style={styles.inputs}
//                 placeholderTextColor="#909fac"
//                 underlineColorAndroid="transparent"
//                 autoCapitalize="none"
//                 autoComplete="off"
//                 autoCorrect={false}
//                 maxLength={100}

//                 placeholder="Correo"
//                 onChangeText={correo => this.setState({ correo: correo })}
//                 ref={(input) => { this.recu = input; }}
//                 returnKeyType={"next"}
//                 onSubmitEditing={() =>  this.recuperarClave() }
//               />
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.Btn} onPress={() => this.recuperarClave()}>
//               <Text style={styles.txtBtn}>Recuperar</Text>
//             </TouchableOpacity>
//             {/* <Image
//               style={{
//                 alignSelf: 'center',
//                 // width: 150,
//                 // height: 150 ,
//                 marginBottom: 20,
//                 marginTop: 30,
//               }}
//               source={require('./assets/stop.png')}

//             // {uri: 'https://llavenegra.cl/formularios/app/uploads/logo.png'}
//             /> */}
//           </View>
//         </View>
//       </DismissKeyboard>
//       </View>
//     );
//   }
// }

// export default RecuperarClaveScreen;


import React, { Component } from 'react';
import { View, Dimensions, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert, TouchableWithoutFeedback, Platform, Keyboard, ActivityIndicator, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
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

const RecuperarClaveScreen = ({ navigation, route }) => {
  const [load, setLoad] = React.useState(false);
  const [correo, setcorreo] = React.useState('');
  //MANEJO DEL MODAL POPUP
  const [ModalVisible, setModalVisible] = React.useState(false);
  const [ModalType, setModalType] = React.useState('');
  const [ModalTitle, setModalTitle] = React.useState('');
  const [ModalBody, setModalBody] = React.useState('');
  const [ModalFunc, setModalfunc] = React.useState()
  const recu = React.useRef(null);
  const ModalOptions = (type, title, body, func) => {
    setModalVisible(true);
    setModalType(type);
    setModalTitle(title);
    setModalBody(body);

    if (func == 'close') {
      setModalfunc('close')
    } else {
      setModalfunc(() => func)
    }


  }
  const handleClose = () => {
    setModalVisible(false)
  }
  //MANEJO DEL MODAL POPUP




  const activity = () => {
    if (load == true) {
      return (
        <ActivityIndi />
      )
    }
  }
  const registroExito = () => {
    navigation.navigate('Primera');
  }
  const recuperarClave = () => {
    Keyboard.dismiss()
    if (correo == '') {
      ModalOptions('Error', 'Correo inválido', 'Debes ingresar un correo', 'close');
      setLoad(false)
    } else {
      setLoad(true)


      fetch(`${ServidorExport}/partner/CambiarClave.php`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: correo,
        })

      })

        .then(response => {


          if (!response.ok || response.status != 200 || response.status != '200') {
            setLoad(false)
            ModalOptions('Error', 'Error de conexión 1', 'Algo falló, intenta nuevamente', 'close');
          } else {
            response.json()
              .then(responser => {
                if (responser === 'Correo Enviado') {

                  setLoad(false)
                  ModalOptions('Exito', 'Recuperar clave', 'Te enviamos un correo para que recuperes tu contraseña. Revisa tu bandeja de entrada o spam.', registroExito);


                } else if (responser === 'Este correo no existe') {


                  setLoad(false)
                  ModalOptions('Error', 'No existe', 'Este correo no esta en nuestra base de datos.', 'close');

                } else {
                  setLoad(false)
                  ModalOptions('Error', 'Error de conexión 1', 'Algo falló, intenta nuevamente', 'close');
                }




              })
          }
        })
        .catch((error) => {
          setLoad(false)
          ModalOptions('Error', 'Error de conexión 1', 'Algo falló, intenta nuevamente', 'close');
        });
    }

  }
  return (
    <View style={{ flex: 1 }}>
      <DismissKeyboard style={{ flex: 1 }}>


        <View style={styles.container}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="#fff"
            translucent={true}
          />
          {activity()}
          <View
            style={{
              backgroundColor: Platform.OS === 'ios' ? '#fff' : '#fff',
              borderBottomWidth: 1,
              borderBottomColor: '#fafafa',
              height: Constants.statusBarHeight,
              width: '100%',
              // marginTop: Constants.statusBarHeight, //Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,,
            }} />

          <View style={styles.header}>

            <TouchableOpacity style={{ padding: 0, marginBottom: 10, }} onPress={() => navigation.goBack()}>
              <FontAwesome name="arrow-left" style={styles.arrowBack} />
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.TextHeader}>Recuperar Clave</Text>

            </View>





          </View>






          <View style={{ flex: 1, width: '100%', alignItems: 'center', marginTop: 10, paddingHorizontal: 15, }}>


            <TouchableOpacity activeOpacity={1} style={styles.ctninputs} onPress={() => { recu.current && recu.current.focus(); }}>
              {/* <Text style={styles.labels}>Correo</Text> */}
              <TextInput
                style={styles.inputs}
                placeholderTextColor="#909fac"
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                maxLength={100}

                placeholder="Correo"
                onChangeText={correo => setcorreo(correo)}
                ref={recu}
                returnKeyType={"next"}
                onSubmitEditing={() => recuperarClave()}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.Btn} onPress={() => recuperarClave()}>
              <Text style={styles.txtBtn}>Recuperar</Text>
            </TouchableOpacity>
            {/* <Image
              style={{
                alignSelf: 'center',
                // width: 150,
                // height: 150 ,
                marginBottom: 20,
                marginTop: 30,
              }}
              source={require('./assets/stop.png')}

            // {uri: 'https://llavenegra.cl/formularios/app/uploads/logo.png'}
            /> */}
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
  )
};

export default RecuperarClaveScreen;

