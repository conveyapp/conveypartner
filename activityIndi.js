import React from 'react';
import { Text, View , ActivityIndicator} from 'react-native';

const ActivityIndi = ({}) => (
    <View style={{
                    position: 'absolute',
                    zIndex: 5,
                    width: '100%',
                    height: '100%',
                    flex: 1,
                    //backgroundColor: 'rgba(0,0,0,0.90)', 
                    justifyContent: 'center',
                    alignItems: 'center',
                    elevation: 25,
                }}>
        <ActivityIndicator size="large" color="#68C151" />
    </View>
);

export default ActivityIndi;
