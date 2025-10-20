import * as React from 'react';
import { View, ActivityIndicator, StyleSheet, Text, StatusBar } from 'react-native';
import react from 'react';
import { AuthContext } from './utils'
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from "./Style.js";
import { ServidorExport } from './ServAdress.js'
import ActivityIndi from './activityIndi.js'

const LoadScreen = ({ navigation }) => {
    const { signOut } = React.useContext(AuthContext);
   

    react.useEffect(() => {
        
        async function logger (){
            console.log('1111')
            var userToken = await AsyncStorage.getItem('Key_27');
            var passToken = await AsyncStorage.getItem('Key_28');
            fetch(`${ServidorExport}/partner/login.php`, {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    correo: userToken,
                    clave: passToken,
                })
            })
            .then((response) => {
                if (!response.ok || response.status != 200 || response.status != '200') {
                    navigation.navigate('Inicio');
                    console.log('1')
                } else { 
                    response.json()
                    .then(responser => {
                        console.log(responser)
                        if(responser === 'Ingreso exitoso'){
                            console.log('2')
                            navigation.replace('Inicio',{UserToken :userToken});
                            //fetcher(userToken, passToken)
                        } else if(responser === 'Este usuario no existe'){
                            navigation.replace('TroubleLogin',{value:'1'});
                        }
                        else if(responser === 'Debes Verificar tu cuenta'){
                            navigation.replace('TroubleLogin',{value:'2'});
                        }
                        else if(responser === 'Usuario o clave erroneos'){
                            navigation.replace('TroubleLogin',{value:'3'});
                        }
                        else{
                            navigation.replace('TroubleLogin',{value:'4'});
                        }
                    })
                    .catch((error) => {
                        navigation.replace('TroubleLogin',{value:'4'});
                    });
                }

            })
            .catch((error) => {
                navigation.replace('TroubleLogin',{value:'4'});
            });

        }
      


        logger()
       //fetcher()
    });

    async function fetcher(u, p){
        
        fetch(`${ServidorExport}/GoApp/cliente/WebPayCheck.php`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            correo: u,
        })
    })
            .then((response) => {
                if (!response.ok || response.status != 200 || response.status != '200') {
                    navigation.replace('Inicio');
                } else {
                    response.json() 
                    .then(responser => {
                        console.log(responser);
                        if(responser === 'Ya tienes un pedido esperando pago'){
                            console.log('tienes un pedido esperando pago')
                            navigation.replace('Webpay',{DondeVieneWebpay:'2',Usr:u, data:''});
                            //this.props.navigation.navigate('Webpay', {DondeVieneWebpay:'2', usuario:userToken});
                        } else{
                            // navigation.navigate('Home');
                            //navigation.replace('Inicio');
                            navigation.replace('Inicio',{UserToken: u});
                        }
                    })
                }
            })
            .catch((error) => {
                console.log(error)
                // this.setState({
                // hola: '0',
                // });
            });

    }




    return (
      <View style={styles.container}>
            <ActivityIndi/>
       
      </View>
    );
  }
export default LoadScreen
