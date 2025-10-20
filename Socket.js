// socket.js
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

let socket;

export const initiateSocketConnection = async () => {
    const userToken = await AsyncStorage.getItem('Key_27');
    socket = io(`https://socketconvey-b6f8fc94e39d.herokuapp.com/`, { reconnection: false });
    socket.emit("usuario", userToken);
};

export const getSocket = () => {
    return socket;
};

export const disconnectSocket = () => {
    if(socket) socket.disconnect();
};
