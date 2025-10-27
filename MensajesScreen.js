//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Platform, TouchableOpacity, Dimensions, Image } from 'react-native';
import { styles } from "./Style.js";
import ActivityIndi from './activityIndi.js'
import Modal from './Modal.js'
import Constants from 'expo-constants';
import { FontAwesome, FontAwesome5, FontAwesome6, Octicons, Entypo } from '@expo/vector-icons';
import TextTicker from 'react-native-text-ticker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ServidorSocket } from './ServAdressSocket.js'
import { ServidorExport } from './ServAdress.js'
import { getSocket } from './Socket';
let fontWidth = Dimensions.get('window').width;


// create a component
const MensajesScreen = ({ route, navigation }) => {
  const socket = getSocket();
  const [load, setLoad] = React.useState(true);
  const [dataSource, setDataSource] = React.useState([]);
  const [conexionErr, setConexionErr] = React.useState(false);
  const [userToken, setUserToken] = React.useState('');

  //MANEJO DEL MODAL POPUP
  const [ModalVisible, setModalVisible] = React.useState(false);
  const [ModalType, setModalType] = React.useState('');
  const [ModalTitle, setModalTitle] = React.useState('');
  const [ModalBody, setModalBody] = React.useState('');
  const [ModalFunc, setModalfunc] = React.useState()
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
  activity = () => {
    if (load == true) {
      return (
        <ActivityIndi />
      )
    }
  }
  connectScoket = async () => {
    var userToken = await AsyncStorage.getItem('Key_27');
    socket.on("RecibeMensaje", (data) => {
      fetchMensajes(userToken)
    });


  }
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      var userToken = await AsyncStorage.getItem('Key_27');
      setUserToken(prev => userToken)
      fetchMensajes(userToken)
      connectScoket()

    });


    return unsubscribe;
  }, [navigation, dataSource]);

  fetchMensajes = async (x) => {
    console.log(x)
    await fetch(`${ServidorExport}/partner/TraerChats.php`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usuario: x,
      })
    })
      .then((response) => {
        if (!response.ok || response.status != 200 || response.status != '200') {
          setConexionErr(true)
        } else {
          response.json()
            .then(responser => {
              console.log(responser)
              if (responser == "No Results Found.") {
                setDataSource(prev => []);
                setLoad(prev => false)
              } else {
                const safeData = Array.isArray(responser) ? responser : [];
                setDataSource(prev => safeData);
                setLoad(prev => false)
              }


            })
        }

      })
      .catch((error) => {
        setConexionErr(true)
        setLoad(prev => false)
      });
  }
  renderDotNewMessage = (sender, visto) => {
    if (visto == 'no') {
      return (
        <View
          style={{
            width: fontWidth / 28,
            height: fontWidth / 28,
            borderRadius: 100,
            backgroundColor: '#eb2632',
          }}
        />
      )
    }
  }
  rendMensajes = () => {
    if (load == true) {
      return (
        <ActivityIndi />
      )
    } else if (conexionErr == true) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 15, }}>
          <Image
            style={{
              width: 150,
              height: 150,
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
    } else if (Array.isArray(dataSource) && dataSource.length > 0) {
      return dataSource.map((data, i) => {
        return (
          <TouchableOpacity key={i} onPress={() => navigation.navigate('Chat', {
            IdCarga: data.idcarga,

            Sender: userToken,
            SenderN: data.partnern,
            Reciber: data.cliente,
            ReciberN: data.clienten,

          })} style={styles.containerBox}>
            <View style={{ width: '80%' }}>
              <Text style={[styles.name, { fontSize: fontWidth / 25 }]}>{data.partnern}</Text>
              <Text style={[styles.message, { fontSize: fontWidth / 32 }]}>{data.mensaje != '' ? data.mensaje : 'Envía un mensaje'}</Text>
            </View>
            <View style={{ width: '20%', alignItems: 'flex-end', justifyContent: 'flex-start', }}>
              <Text style={[styles.time, { fontSize: fontWidth / 25 }]}>{data.hora != '' ? data.hora : ''}</Text>

              {renderDotNewMessage(data.sender, data.visto)}

            </View>
          </TouchableOpacity>
        )
      })



    } else {
      return (
        <View style={styles.ctnnoparse}>
          <Image
            style={{
              alignSelf: 'center',
              width: fontWidth / 2,
              height: fontWidth / 2,
              marginBottom: 20,
              marginTop: 30,
            }}
            source={require('./assets/empty.png')}
          />

          <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: fontWidth / 25 }}>No hay mensajes</Text>
        </View>
      )
    }
  }
  return (
    <View style={styles.container}>
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
          //marginTop: Constants.statusBarHeight, //Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,,
        }} />
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='always'>
        <View style={styles.headerInside}>
          <TouchableOpacity style={{ padding: 0, marginBottom: 10, }} onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" style={styles.arrowBack} />
          </TouchableOpacity>
          <Text style={[styles.TextHeader, { marginBottom: 5, }]}>Mensajes</Text>
        </View>
        <View style={{ paddingHorizontal: 15 }}>




          {rendMensajes()}

        </View>
      </ScrollView>
    </View>
  );
};


//make this component available to the app
export default MensajesScreen;
