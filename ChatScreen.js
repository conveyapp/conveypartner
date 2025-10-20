//import liraries
import React, { Component } from 'react';
import {
    View,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
    Text,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Image,
    StyleSheet,
    Dimensions,

  } from 'react-native';
  import { FontAwesome, Ionicons, Entypo } from '@expo/vector-icons';
  import { ServidorExport } from './ServAdress.js';
  import Constants from 'expo-constants';
  import { styles } from "./Style.js";
  import { ServidorSocket } from './ServAdressSocket.js'
  import io from "socket.io-client";
  import { getSocket } from './Socket';
  import ActivityIndi from './activityIndi.js'
const currentUser = { 
   correo: "celera.chile@gmail.com", 
};

let fontWidth = Dimensions.get('window').width;

const ChatScreen = ({ route, navigation }) => {
  const socket = getSocket();
    const scrollViewRef = React.useRef(null);

    const [load, setLoad] = React.useState(true);

    const [idCarga, setIdCarga] = React.useState(route.params.IdCarga);

    const [sender, setSender] = React.useState(route.params.Sender);
    const [senderN, setSenderN] = React.useState(route.params.SenderN);

    const [NombreRecibe, setNombreReciber] = React.useState(route.params.ReciberN);
    const [reciber, setReciber] = React.useState(route.params.Reciber);


    const [messages, setMessages] = React.useState([]);
    const [message, setMessage] = React.useState('');





    connectScoket = async () =>{
      // socket = io(`${ServidorSocket}`, { reconnection: false }); // mac
      // socket.emit("usuario", sender);
  
      socket.on("RecibeMensaje", (data) => {
        console.log('llega mensaje');
        console.log(data);
        const newMessage = {
          idmensaje: data.idmensaje,
          idcarga: data.idcarga,
          sender: data.sender,
          sendern: data.sendern,
          mensaje: data.mensaje,
          fecha: data.fecha,
          hora: data.hora,
        };
        
        // Usa la función de actualización de estado para asegurar que usas el estado más reciente
        setMessages(prevMessages => [...prevMessages, newMessage]);
      });

    }

    // React.useEffect(() => {
    //   connectScoket()
    //   const fetchMessages = async () => {
    //     try {
    //         const response = await fetch('https://convey.cl/partner/MensajeGet.php', {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ idcarga: idCarga }),
    //         });
    //         const data = await response.json();
    //         if (Array.isArray(data) && data.length > 0) {
    //             setMessages(data);
    //         } else {
    //             console.log('No hay mensajes para mostrar');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching messages:', error);
    //     }
    //   };
  
    //   fetchMessages();
    // }, []);


    React.useEffect(() => {
      const unsubscribe = navigation.addListener('focus', async () => {
        console.log('focus')
          connectScoket()
          const fetchMessages = async () => {
            try {
                const response = await fetch(`${ServidorExport}/cliente/MensajeGet.php`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ idcarga: idCarga }),
                });
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    setLoad(false)
                    setMessages(data);
                } else {
                    setLoad(false)
                    console.log('No hay mensajes para mostrar');
                }
            } catch (error) {
                setLoad(false)
                console.error('Error fetching messages:', error);
            }
          };
          const mensajesVistos = async () => {
            try {
                const response = await fetch('https://convey.cl/partner/MensajeVisto.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ idcarga: idCarga, usuario:sender }),
                });
                const data = await response.json();
                console.log('vistos')
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
      
          fetchMessages();
          mensajesVistos();


          
      });
    
  
      return unsubscribe;
    }, [navigation]);


      function generateRandomString(length = 15) {
          const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
          const charactersLength = characters.length;
          let randomString = '';
      
          try {
              for (let i = 0; i < length; i++) {
                  // console.log("Inside loop. Current index: " + i); // Agrega esto para depurar
                  randomString += characters.charAt(Math.floor(Math.random() * charactersLength));
              }
          } catch (e) {
              console.error('Error: ' + e.message);
          }
      
          return randomString;
      }
      function getFormattedDate() {
        const today = new Date();

        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-indexados
        const year = today.getFullYear();

        return `${day}-${month}-${year}`;
      }
      function getFormattedTime() {
        const now = new Date();

        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        return `${hours}:${minutes}`;
      }
  
      React.useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]); // Ejecuta el scroll cuando messages cambie
 
    const handleSend = () => {
      if (message.trim()) {
        const newMessage = {
          idmensaje: generateRandomString(),
          idcarga: idCarga,
          
          sender: sender,
          sendern: senderN,
          
          mensaje: message,
          fecha: getFormattedDate(),
          hora:getFormattedTime(),


        };
        setMessages((prev) => [...messages, newMessage]);
        setMessage('');
      }

      fetch(`${ServidorExport}/partner/MensajeSend.php`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            idmensaje: generateRandomString(),
            idcarga: idCarga,
            
            sender: sender,
            sendern: senderN,

            reciber: reciber,
            
            mensaje: message.trim(),
            fecha: getFormattedDate(),
            hora:getFormattedTime(),
        })

      })
 
        .then((response) => {


          if (!response.ok || response.status != 200 || response.status != '200') {

            
          } else {
            response.json()
              .then(responser => {
                //console.log(reciber)

                try { 
                    socket.emit("SendMensaje", {
                        para: reciber,
                        idmensaje: generateRandomString(),
                        idcarga: idCarga,
                        sender: sender,
                        sendern: senderN,
                        mensaje: message.trim(),
                        fecha: getFormattedDate(),
                        hora: getFormattedTime(),
                    });
                } catch (error) {
                    console.error("Error sending message:", error);
                }

 


              })
          }

        })
        .catch((error) => {

         
        });
    };

    const renderItem = ( item ) => {
      if (load == true) {
        return (
            <View style={{ height: 100 }}>
                <ActivityIndi />
            </View>
        );
    } else if (messages && messages.length > 0) {
        return (
            <>
                {messages.map((item) => (
                    <View
                        key={item.idmensaje}
                        style={[
                            styles.messageContainer,
                            item.sender === sender ? styles.myMessage : styles.otherMessage
                        ]}
                    >
                        <Text style={styles.userName}>{item.sendern}</Text>
                        <Text style={styles.messageText}>{item.mensaje}</Text>
                    </View>
                ))}
            </>
        );
    } else {
        return (
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ padding: 10, backgroundColor: '#f0f0f0', borderRadius: 10, marginTop: 15 }}>
                    <Text style={{ fontSize: fontWidth / 28, color: '#4a4a4a', fontFamily: 'Poppins_700Bold' }}>
                        No hay mensajes aún
                    </Text>
                </View>
            </View>
        );
    }
        //   {messages && messages.length > 0 ? (
        //     messages.map((item) => (
        //         <View
        //             key={item.idmensaje}
        //             style={[
        //                 styles.messageContainer,
        //                 item.sender === sender ? styles.myMessage : styles.otherMessage
        //             ]}
        //         >
        //             <Text style={styles.userName}>{item.sendern}</Text>
        //             <Text style={styles.messageText}>{item.mensaje}</Text>
        //         </View>
        //     ))
        // ) : (
        //     <View style={{width:'100%', justifyContent:'center', alignItems:'center'}}>
        //         <View style={{padding:10, backgroundColor:'#f0f0f0', borderRadius:10, marginTop:15,}}>
        //             <Text style={{    fontSize: fontWidth / 28,
        //     color: '#4a4a4a',
        //     fontFamily:'Poppins_700Bold',}}>No hay mensajes aún</Text>
        //         </View>
        //     </View>
        // )}
    };
    return (
    <View style={{flex:1}}>
        <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
              <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent={true}
              />
              <View
                style={{
                  backgroundColor: Platform.OS === 'ios' ? '#fff' : '#fff',
                  height: Constants.statusBarHeight,
                  width: '100%',
                  //marginTop: Constants.statusBarHeight, //Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,,
                }} 
              />
              <View style={[styles.header,{borderBottomWidth:1, borderBlockColor:'#eeeeee'}]}>
  
                <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between'}}>

                <TouchableOpacity style={{ padding: 0, marginBottom: 10, }} onPress={() => navigation.goBack()}>
                  <FontAwesome name="arrow-left" style={styles.arrowBack} />
                </TouchableOpacity>



                </View>


   
              <Text style={styles.TextHeader}>{NombreRecibe}</Text>



            </View>


            <Image 
                  source={require('./assets/patternChat.png')} 
                  style={{    ...StyleSheet.absoluteFillObject, // Asegura que la imagen cubra toda el área
                    resizeMode: 'cover', // Asegura que la imagen cubra toda la pantalla
                    zIndex: -1,}}
                />
            <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    ref={scrollViewRef}
                    style={{position:'relative', paddingHorizontal:10,}}
                    onContentSizeChange={() => {
                      if (scrollViewRef.current) {
                        scrollViewRef.current.scrollToEnd({ animated: true });
                      }
                    }}
                >
                    {renderItem(messages)}
                </ScrollView>
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.idmensaje}
            style={styles.chatList}
            onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
            contentContainerStyle={styles.chatListContent}
          />
        </TouchableWithoutFeedback> */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            multiline
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <SafeAreaView style={styles.safeArea}/>
      </View>
    );
};

export default ChatScreen;
