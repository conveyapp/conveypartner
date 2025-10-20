import React, { useEffect, useRef, useState, useLayoutEffect, useContext } from 'react'
import { Text, StyleSheet, TouchableOpacity, View, Dimensions, Animated, Easing, Image } from 'react-native'
let fontWidth = Dimensions.get('window').width;
import Constants from 'expo-constants';
import { NavigationContext } from "@react-navigation/native";

export default function Modal({ visible, type, title, body, options, duration, onClose, content, func }) {
  const { height } = Dimensions.get('screen');
  const startPointY = options?.from === 'top' ? -height : height;
  const transY = useRef(new Animated.Value(startPointY));
  const [typex, setTypex] = useState('')

  const navigationTres = useContext(NavigationContext);
  // useLayoutEffect(() => {
  //   if (visible) {
  //     navigationTres.getParent().setOptions({
  //       tabBarStyle:{
  //         backgroundColor:'blue',
  //         display:'none',
  //       }
  //     });
  //   }

  // }, [])



  useEffect(() => {
    setTypex(type)
    if (visible) {
      navigationTres.getParent().setOptions({
        tabBarStyle: {
          backgroundColor: '#fff',
          display: 'none',
        }
      });
      startAnimation(0);
    } else {
      navigationTres.getParent().setOptions({
        tabBarStyle: {
          backgroundColor: '#fff',
          display: 'flex',
        }
      });
      startAnimation(startPointY);
    }
  });

  const startAnimation = (toValue) => {
    Animated.timing(transY.current, {
      toValue,
      duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true
    }).start();
  }


  const onPress = () => {
    console.log(func);
    if (func == 'close') {
      startAnimation(startPointY);
      onClose();

    } else {
      navigationTres.getParent().setOptions({
        tabBarStyle: {
          backgroundColor: '#fff',
          display: 'flex',
        }
      });

      startAnimation(startPointY);
      onClose();


      func()

    }

  }

  const closeAlert = () => {

    startAnimation(startPointY);
    onClose();

  }

  const generateBackgroundOpacity = () => {
    if (startPointY >= 0) {
      return transY.current.interpolate({
        inputRange: [0, startPointY],
        outputRange: [0.6, 0],
        extrapolate: 'clamp'
      })
    } else {
      return transY.current.interpolate({
        inputRange: [startPointY, 0],
        outputRange: [0, 0.8],
        extrapolate: 'clamp'
      })
    }
  }
  const renderIMage = () => {
    if (typex == 'Exito') {
      return (
        <Image
          style={{
            width: fontWidth / 5,
            height: fontWidth / 5,
            marginBottom: 15,
          }}
          source={require('./assets/modalExito.png')}
        />
      )
    } else if (typex == 'Error') {
      return (
        <Image
          style={{
            width: fontWidth / 5,
            height: fontWidth / 5,
            marginBottom: 15,
          }}
          source={require('./assets/modalError.png')}
        />
      )
    } else if (typex == 'Alerta') {
      return (
        <Image
          style={{
            width: fontWidth / 5,
            height: fontWidth / 5,
            marginBottom: 15,
          }}
          source={require('./assets/modalCuidado.png')}
        />
      )
    } else if (typex == 'AlertaInfo') {
      return (
        <Image
          style={{
            width: fontWidth / 5,
            height: fontWidth / 5,
            marginBottom: 15,
          }}
          source={require('./assets/modalCuidado.png')}
        />
      )
    }

  }
  const renderBtn = () => {
    if (typex == 'Exito') {
      return (
        <TouchableOpacity style={styles.btnModalExito} onPress={onPress}>
          <Text style={styles.txtBtnModal}>Ok!</Text>
        </TouchableOpacity>
      )
    } else if (typex == 'Error') {
      return (
        <TouchableOpacity style={styles.btnModalError} onPress={onPress}>
          <Text style={styles.txtBtnModal}>Ok!</Text>
        </TouchableOpacity>
      )
    }
    else if (typex == 'Alerta') {
      return (
        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={styles.btnModalAlerta} onPress={onPress}>
            <Text style={styles.txtBtnModal}>Ok!</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnModalClose} onPress={closeAlert}>
            <Text style={styles.txtBtnClose}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )
    }
    else if (typex == 'AlertaInfo') {
      return (
        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={styles.btnModalAlerta} onPress={onPress}>
            <Text style={styles.txtBtnModal}>Ok!</Text>
          </TouchableOpacity>
        </View>
      )
    }

  }
  return (
    <>

      <Animated.View pointerEvents='none' style={[styles.outerContainer, { opacity: generateBackgroundOpacity() }]} />
      <Animated.View style={[styles.container, { transform: [{ translateY: transY.current }] }]}>
        <View style={styles.innerContainer}>
          {renderIMage()}
          <Text style={{ fontSize: fontWidth / 20, marginBottom: -5, color: '#3d3d3d', fontFamily: 'Poppins_700Bold', }}>{title}</Text>
          <Text style={{ fontSize: fontWidth / 25, marginBottom: 10, color: '#696969', fontFamily: 'Poppins_500Medium', }}>{body}</Text>

          {renderBtn()}
        </View>
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '70%',
    height: 'auto',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    padding: 15,
  },
  btnModal: {
    width: '85%',
    borderRadius: 10,
    backgroundColor: '#1F4AA2',
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtBtnModal: {
    color: '#fff',
    fontFamily: 'Poppins_500Medium',
    fontSize: fontWidth / 20,
  },
  txtBtnClose: {
    color: '#9D2222',
    fontFamily: 'Poppins_500Medium',
    fontSize: fontWidth / 20,
  },
  btnModalExito: {
    width: '85%',
    borderRadius: 10,
    backgroundColor: '#60D309',
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnModalError: {
    width: '85%',
    borderRadius: 10,
    backgroundColor: '#9D2222',
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnModalAlerta: {
    width: '85%',
    borderRadius: 10,
    backgroundColor: '#D4BE15',
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnModalClose: {
    marginTop: 10,
    width: '85%',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center'
  }
})