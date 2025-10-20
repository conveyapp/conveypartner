import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, Platform} from 'react-native';
import Constants from 'expo-constants';
import {Dimensions } from "react-native";
import { styles } from "./Style.js";
let fontWidth = Dimensions.get('window').width;

class PrimeraScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={styles.PrimerContainer}>
               <StatusBar
                    barStyle="dark-content"
                    backgroundColor="#fff"
                    translucent={true}
                />
                <View
                    style={{
                        backgroundColor: Platform.OS === 'ios' ? '#fff' : '#fff',
                        // borderBottomWidth: 1,
                        // borderBottomColor: '#fafafa',
                        height: Constants.statusBarHeight,
                        width: '100%',
                        //marginTop: Constants.statusBarHeight, //Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,,
                    }} />

              

                <Image
                    style={{
                        alignSelf: 'flex-start',
                        //marginLeft:15,
                        width: 100,
                        height: 100,
                        marginBottom: 0,
                        //marginTop: 5,
                        // position: 'absolute',
                        // bottom:-50,
                        // right:-20,
                        // zIndex:-1,
                    }}
                    source={require('./assets/logoInside.png')}

                // {uri: 'https://llavenegra.cl/formularios/app/uploads/logo.png'}
                />

                <View style={{ width: '100%', paddingLeft:15, }} >
                    <Text style={styles.megatitulo}>Convey Partner</Text>
                    <Text style={styles.megasubtitulo}>Tus cargas Convey On,</Text>
                    <Text style={styles.megasubtitulo}>más rápido y fácil</Text>
                </View>



                <View style={{ width: '100%',  flexDirection: 'row', marginTop:10 }}>
                    <View style={{ width: '50%', padding: 10, }}>
                        <TouchableOpacity style={styles.Btn} onPress={() => this.props.navigation.navigate('Ingreso')}>
                            <Text style={styles.txtBtn}>Ingresar</Text>
                        </TouchableOpacity>
                    </View>


                    <View style={{ width: '50%', padding: 10, }}>
                        <TouchableOpacity style={styles.Btn} onPress={() => this.props.navigation.navigate('RegistroTerminos')}>
                            <Text style={styles.txtBtn}>Registrarme</Text>
                        </TouchableOpacity>
                    </View>
                </View>





            </View>
        );
    }
}

export default PrimeraScreen;


