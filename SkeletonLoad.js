import React from 'react';
import { Animated, Text, View, StyleSheet, Dimensions } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient'

const Skeleton = ({width, height, style }) => {
    const widthScreen = Dimensions.get("window").width ;
    const skeWidth = widthScreen - 32;
     const translatex = React.useRef(new Animated.Value(-widthScreen)).current;
     React.useEffect(() =>{
      Animated.loop(
        Animated.timing(translatex, {
            toValue: widthScreen,
            useNativeDriver: true,
            duration:1000

        })
      ).start()
     }, [widthScreen])
    return(
        
           <View style={StyleSheet.flatten([
               {width: width, height:height, backgroundColor:'rgba(0, 0, 0, 0.12)', overflow:'hidden'},
               style,
           ])}>




               <Animated.View style={{width:'100%', height:'100%', transform:[{translateX: translatex}]}}>
                    <LinearGradient
                    style={{width:'100%', height:'100%'}}
                    colors={['transparent', 'rgba(0, 0, 0, 0.05)', 'transparent' ] }
                    start={{x:1, y:1}}
                    />
               </Animated.View>






           </View>
       
    )
};

export default Skeleton;
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
        alignItems:'center',
        justifyContent:'center',
    },
    card:{
        width:'90%',
        height:'30%',
        backgroundColor:'#fff',
        padding: 10,
        elevation:3,
        shadowColor:'black',
        shadowOffset:{
            width:0,
            height:3,
        },
        shadowOpacity:0.24,
        shadowRadius:4,
        borderRadius:8,
    }
})
