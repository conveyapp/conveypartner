import React from 'react';
import { StyleSheet, Dimensions, Text, View, ScrollView, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { LineChart } from 'react-native-chart-kit';
import { styles } from "./Style.js";

let fontWidth = Dimensions.get('window').width;

const GananciasScreen = ({rote, navigation}) => {
    // Datos mensuales
    const monthlyData = [
        { label: 'Ene', value: 120 },
        { label: 'Feb', value: 90 },
        { label: 'Mar', value: 150 },
        { label: 'Abr', value: 200 },
        { label: 'May', value: 170 },
        { label: 'Jun', value: 80 },
        { label: 'Jul', value: 130 },
        { label: 'Ago', value: 140 },
        { label: 'Sep', value: 160 },
        { label: 'Oct', value: 120 },
        { label: 'Nov', value: 150 },
        { label: 'Dic', value: 190 }
    ];

    const monthlyLabels = monthlyData.map(item => item.label);
    const monthlyValues = monthlyData.map(item => item.value);

    // Datos semanales
    const weeklyData = [
        { label: 'Lun', value: 75 },
        { label: 'Mar', value: 85 },
        { label: 'Mié', value: 65 },
        { label: 'Jue', value: 90 },
        { label: 'Vie', value: 100 },
        { label: 'Sáb', value: 55 },
        { label: 'Dom', value: 70 }
    ];

    const weeklyLabels = weeklyData.map(item => item.label);
    const weeklyValues = weeklyData.map(item => item.value);

    // Datos anuales (últimos 7 años)
    const yearlyData = [
        { label: '2018', value: 1200 },
        { label: '2019', value: 1500 },
        { label: '2020', value: 1350 },
        { label: '2021', value: 1600 },
        { label: '2022', value: 1400 },
        { label: '2023', value: 1700 },
        { label: '2024', value: 1550 }
    ];

    const yearlyLabels = yearlyData.map(item => item.label);
    const yearlyValues = yearlyData.map(item => item.value);

    const screenWidth = Dimensions.get('window').width;
    const paddingHorizontal = 15;
    const chartWidth = screenWidth - paddingHorizontal * 2;

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.containerAdornos}>
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
                    }}
                />
                <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='always'>
                    <View style={styles.header}>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={{ padding: 0, marginBottom: 10 }} onPress={() => navigation.goBack()}>
                                <FontAwesome name="arrow-left" style={styles.arrowBack} />
                            </TouchableOpacity>

                            <TouchableOpacity style={{ padding: 0, marginBottom: 10, }} onPress={() => navigation.navigate('Cotizador')}>
                                <FontAwesome name="calculator" style={styles.arrowBack} />
                            </TouchableOpacity>

                        </View>
                        <Text style={styles.TextHeader}>Mis ganancias</Text>
                    </View>

                    <View style={{ flex: 1, width: '100%', marginTop: 2, paddingHorizontal, backgroundColor: 'transparent' }}>
                        {/* Gráfico Mensual */}
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 28 }}>Ganancias Mensuales</Text>
                            <ScrollView horizontal>
                                <LineChart
                                    data={{
                                        labels: monthlyLabels,
                                        datasets: [{ data: monthlyValues }]
                                    }}
                                    width={chartWidth * 1.5}  // Más ancho para permitir desplazamiento
                                    height={220}
                                    yAxisLabel="$"
                                    yAxisSuffix="k"
                                    chartConfig={{
                                        backgroundColor: '#e26a00',
                                        backgroundGradientFrom: '#fb8c00',
                                        backgroundGradientTo: '#ffa726',
                                        decimalPlaces: 2,
                                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        style: { borderRadius: 5 },
                                        propsForLabels: { fontSize: 10 },  // Tamaño de fuente de labels
                                        propsForDots: {
                                            r: '6',
                                            strokeWidth: '2',
                                            stroke: '#ffa726',
                                        }
                                    }}
                                    style={{
                                        marginVertical: 8,
                                        borderRadius: 5,
                                    }}
                                />
                            </ScrollView>
                        </View>

                        {/* Gráfico Semanal */}
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                            <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 28 }}>Ganancias Semanales</Text>
                            <LineChart
                                data={{
                                    labels: weeklyLabels,
                                    datasets: [{ data: weeklyValues }]
                                }}
                                width={chartWidth}  // Ajustado para respetar el paddingHorizontal
                                height={220}
                                yAxisLabel="$"
                                yAxisSuffix="k"
                                chartConfig={{
                                    backgroundColor: '#0066e2',
                                    backgroundGradientFrom: '#0066e2',
                                    backgroundGradientTo: '#80bfff',
                                    decimalPlaces: 2,
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    style: { borderRadius: 5 },
                                    propsForLabels: { fontSize: 10 },  // Tamaño de fuente de labels
                                    propsForDots: {
                                        r: '6',
                                        strokeWidth: '2',
                                        stroke: '#80bfff',
                                    }
                                }}
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 5,
                                }}
                            />
                        </View>

                        {/* Gráfico Anual */}
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                            <Text style={{ color: '#262626', fontFamily: 'Poppins_700Bold', fontSize: fontWidth / 28 }}>Ganancias Anuales</Text>
                            <LineChart
                                data={{
                                    labels: yearlyLabels,
                                    datasets: [{ data: yearlyValues }]
                                }}
                                width={chartWidth}  // Ajustado para respetar el paddingHorizontal
                                height={220}
                                yAxisLabel="$"
                                yAxisSuffix="k"
                                chartConfig={{
                                    backgroundColor: '#a300cc',
                                    backgroundGradientFrom: '#a300cc',
                                    backgroundGradientTo: '#cc66ff',
                                    decimalPlaces: 2,
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    style: { borderRadius: 5 },
                                    propsForLabels: { fontSize: 10 },  // Tamaño de fuente de labels
                                    propsForDots: {
                                            r: '6',
                                            strokeWidth: '2',
                                            stroke: '#cc66ff',
                                        }
                                    }}
                                    style={{
                                        marginVertical: 8,
                                        borderRadius: 5,
                                    }}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    };

export default GananciasScreen;
