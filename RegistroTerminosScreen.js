import React, { Component } from 'react';
import {
  Dimensions, Text, View, Image, ScrollView, TouchableWithoutFeedback, Platform, Keyboard,
  KeyboardAvoidingView, TouchableOpacity, StatusBar
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Modal from './Modal.js';
import ActivityIndi from './activityIndi.js';
import { styles } from "./Style.js";
import SignatureCapture from "react-native-signature-canvas";
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import * as FileSystem from "expo-file-system";

let fontWidth = Dimensions.get('window').width;

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const RegistroTerminosScreen = ({ route, navigation }) => {
  const [signatureURI, setSignatureURI] = React.useState(null);
  const [aceptTerm, setAceptTerm] = React.useState(false);

  // Modal state
  const [ModalVisible, setModalVisible] = React.useState(false);
  const [ModalType, setModalType] = React.useState('');
  const [ModalTitle, setModalTitle] = React.useState('');
  const [ModalBody, setModalBody] = React.useState('');
  const [ModalFunc, setModalfunc] = React.useState();

  const ModalOptions = (type, title, body, func) => {
    setModalVisible(true);
    setModalType(type);
    setModalTitle(title);
    setModalBody(body);
    if (func === 'close') {
      setModalfunc('close');
    } else {
      setModalfunc(() => func);
    }
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  React.useEffect(() => {
    ModalOptions(
      'AlertaInfo',
      'Atención',
      'Tu firma debe coincidir con la cédula de identidad o DNI que vas a registrar',
      'close'
    );
  }, []);

  const signatureRef = React.useRef();

  const clear = async () => {
    signatureRef.current.clearSignature();
  };

  const handleSave = async () => {
    if (!aceptTerm) {
      ModalOptions(
        'Error',
        'Acepta los términos',
        'Para seguir debes aceptar los términos y condiciones',
        'close'
      );
    } else {
      const signature = await signatureRef.current.readSignature();
      if (!signature) {
        ModalOptions(
          'Error',
          'Firma',
          'Para seguir debes ingresar tu firma',
          'close'
        );
      }
    }
  };

  const ok = async (signatureURI) => {
    console.log('URI de la firma:', signatureURI);
    const path = FileSystem.cacheDirectory + "sign.png";
    FileSystem.writeAsStringAsync(
      path,
      signatureURI.replace("data:image/png;base64,", ""),
      { encoding: FileSystem.EncodingType.Base64 }
    )
      .then(() => FileSystem.getInfoAsync(path))
      .then(e => {
        const toSendSign = e.uri;
        navigation.navigate('RegistroUno', { FirmaUri: toSendSign });
      })
      .catch(console.error);
  };

  const rendCanva = () => {
    return (
      <SignatureCapture
        ref={signatureRef}
        androidLayerType="hardware"
        nestedScrollEnabled={true}
        onOK={ok}
        onClear={() => console.log('Signature cleared')}
        style={{ width: '100%', height: '100%', borderColor: '#000', borderWidth: 1 }}
      />
    );
  };

  const handlePress = () => {
    Linking.openURL('https://www.convey.cl/terminos.html');
  };

  return (
    <View style={{ flex: 1 }}>
      <DismissKeyboard style={{ flex: 1 }}>
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

          <View style={{
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#fafafa',
            height: Constants.statusBarHeight,
            width: '100%',
          }} />

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
            behavior={Platform.OS === 'ios' ? "padding" : null}
          >
            <ScrollView keyboardShouldPersistTaps="always">
              <View style={styles.header}>
                <TouchableOpacity style={{ padding: 0, marginBottom: 10 }} onPress={() => navigation.goBack()}>
                  <FontAwesome name="arrow-left" style={styles.arrowBack} />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.TextHeader}>Términos y condiciones</Text>
                </View>

                <Text style={styles.TextHeaderSubTitulo}>Convey Partner</Text>
              </View>

              <TouchableOpacity onPress={handlePress} style={{ padding: 10, borderRadius: 5 }}>
                <Text style={{ fontSize: fontWidth / 26, color: '#565656', fontFamily: 'Poppins_700Bold' }}>
                  Ir a términos y condiciones
                </Text>
              </TouchableOpacity>

              <View style={{ paddingHorizontal: 15 }}>
                <TouchableOpacity activeOpacity={1} onPress={() => setAceptTerm(prev => !prev)} style={{ flexDirection: 'row', marginTop: 15 }}>
                  <View style={{
                    width: fontWidth / 20,
                    height: fontWidth / 20,
                    borderRadius: 100,
                    borderWidth: 2,
                    padding: 2,
                    borderColor: '#C3FE70',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <View style={{
                      width: fontWidth / 29,
                      height: fontWidth / 29,
                      backgroundColor: aceptTerm ? '#C3FE70' : 'transparent',
                      borderRadius: 100,
                    }} />
                  </View>
                  <Text style={{
                    fontSize: fontWidth / 26,
                    color: '#565656',
                    fontFamily: 'Poppins_700Bold',
                    marginLeft: 15
                  }}>
                    He leído y acepto los términos y condiciones de Convey on
                  </Text>
                </TouchableOpacity>

                <View style={{ width: '100%', height: 350, justifyContent: 'center', marginTop: 10, marginBottom: 10 }}>
                  {rendCanva()}

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                    <View style={{ width: 20 }} />
                    <Text style={[styles.TextHeaderSubTitulo, { marginBottom: 0, paddingTop: 10 }]}>Firma</Text>
                    <TouchableOpacity style={{ justifyContent: 'flex-end', alignItems: 'flex-end', paddingTop: 10 }} onPress={clear}>
                      <FontAwesome name="refresh" size={fontWidth / 20} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>

                {signatureURI && (
                  <View style={styles.previewContainer}>
                    <Text>Firma guardada:</Text>
                    <Image source={{ uri: signatureURI }} style={styles.previewImage} />
                  </View>
                )}

                <LinearGradient
                  style={{ width: '100%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}
                  colors={['#E6F14B', '#E6F14B', '#C3FE70']}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 0 }}
                >
                  <TouchableOpacity
                    style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                    activeOpacity={1}
                    onPress={handleSave}
                  >
                    <Text style={styles.txtBtn}>Registrarme</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </DismissKeyboard>

      <Image
        style={{
          position: 'absolute',
          bottom: 0,
          alignSelf: 'flex-start',
          width: '100%',
          marginBottom: 0,
        }}
        source={require('./assets/registroAdorno.png')}
      />

      <Modal
        visible={ModalVisible}
        type={ModalType}
        title={ModalTitle}
        body={ModalBody}
        options={{ type: 'slide', from: 'bottom' }}
        duration={250}
        onClose={handleClose}
        func={ModalFunc}
      />
    </View>
  );
};

export default RegistroTerminosScreen;
