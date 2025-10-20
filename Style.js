import { StyleSheet, Dimensions } from 'react-native';
let fontWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  //490b97 morado
  //a8b2bf morado oscuro
  //07E607 verde fluor
  //154734 verde militar
  //FE5000 naranjo fluor

  principal: {
    color: '#07E607'
  },
  actIndicator: {
    color: '#07E607'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerAdornos: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  containerTroubleScreen: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  PrimerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    height: 'auto',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 5,

  },
  headerAdorno: {
    height: 'auto',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: 'transparent',
    paddingTop: 15,
    paddingBottom: 5,
  },
  headerInside: {
    height: 'auto',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 5,
  },
  TextHeader: {
    color: '#262626',
    fontFamily: 'Poppins_700Bold',
    fontSize: fontWidth / 15.5,
  },
  NewTextHeader: {
    color: '#262626',
    fontFamily: 'Poppins_700Bold',
    fontSize: fontWidth / 17.5,
    alignSelf: 'flex-start',
  },
  TextHeaderSubTitulo: {
    color: '#262626',
    fontFamily: 'Poppins_700Bold',
    fontSize: fontWidth / 25.5,
  },
  arrowBack: {
    color: '#93CC49',
    fontSize: fontWidth / 12,
  },
  iconsBesideArrow: {
    color: '#93CC49',
    fontSize: fontWidth / 17,
  },
  ctnnoparse: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  Btn: {
    width: '100%',
    height: 55,
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: '#07E607',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtBtn: {
    color: '#000',
    fontFamily: 'Poppins_700Bold',
  },
  txtBtnBigAdd: {
    fontFamily: 'Poppins_700Bold',
    fontSize: fontWidth / 18,
  },
  BtnCarrito: {
    width: '100%',
    height: 55,
    borderRadius: 5,
    marginBottom: 5,
    paddingHorizontal: 15,
    backgroundColor: '#07E607',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txtBtnCarrito: {
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
  },
  btnNoBg: {
    width: '100%',
    height: 35,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  btnNoBgRigth: {
    width: '100%',
    height: 35,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  btnNoBgText: {
    color: '#717171',
    fontFamily: 'Poppins_700Bold',
    fontSize: fontWidth / 25,
  },
  btnselect: {
    width: 60,
    height: 60,
    borderRadius: 0,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  ctninputs: {
    width: '100%',
    height: 'auto',
    backgroundColor: '#F7FFED',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCFFAF',




    padding: 7,
    marginBottom: 20,
  },
  ctntelefono: {
    width: '100%',
    height: 'auto',
    //alignSelf: 'center',
    backgroundColor: '#F7FFED',
    borderRadius: 10,
    padding: 7,
    paddingLeft: 5,
    marginBottom: 20,

    borderWidth: 1,
    borderColor: '#DCFFAF',

    // shadowColor: "#000",
    // shadowOffset: {
    //     width: 0,
    //     height: 3,
    // },
    // shadowOpacity: 0.14,
    // shadowRadius: 5.51,

    // elevation: 15,
  },
  labels: {
    color: '#797979',
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    marginBottom: 0,
    marginTop: 5,
  },
  inputs: {
    width: '100%',
    height: 48,
    backgroundColor: '#F7FFED',
    marginBottom: 12,
    color: '#141414',
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    marginBottom: 0,
  },
  inputsReclamo: {
    width: '100%',
    height: 'auto',
    backgroundColor: '#fff',
    marginBottom: 12,
    color: '#141414',
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    marginBottom: 5,
  },
  inputsFecha: {
    width: 60,
    height: 'auto',
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    color: '#141414',
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
  },
  prevPhono: {
    color: '#07E607',
    fontWeight: 'bold',
    fontSize: 15,
  },
  inputsfono: {
    width: '100%',
    minHeight: 30,
    height: 'auto',
    //backgroundColor:'red',
    marginBottom: 12,
    color: '#141414',
    fontWeight: 'bold',
    fontSize: fontWidth / 25,
    marginBottom: 5,
  },
  placeHolderStyle: {
    fontFamily: 'Poppins_700Bold',
    color: '#909fac',
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
    //borderRadius:15,
  },
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%',
    // backgroundColor:'purple'
  },
  marker: {
    height: 48,
    width: 48,
  },
  catsButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#07E607',
    borderRadius: 8,
    marginRight: 10,
  },
  shareButton: {
    width: '100%',
    backgroundColor: '#5F40FF',
    padding: 15, borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contactButton: {
    marginTop: 15,
    width: '100%',
    backgroundColor: 'rgba(95,64,255,0.42)',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  pinAdressInicio: {
    fontSize: fontWidth / 18,
    color: '#5F40FF',
  },
  ctnproducto: {
    marginTop: 15,
    width: '100%',
    flexDirection: 'row',
    // alignSelf: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#E4E4E4',

  },
  ctnimg: {
    width: 80,
    height: 80,
    //backgroundColor: 'yellow',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',


  },

  imageView: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    alignSelf: 'center',
    // borderTopLeftRadius: 10,
    // borderBottomLeftRadius: 10,

  },







  megatitulo: {
    fontSize: fontWidth / 12.25,
    fontWeight: 'bold',
    //marginTop: 5,
  },
  megasubtitulo: {
    fontSize: fontWidth / 22.5,
    fontWeight: 'bold',
    color: '#4a4a4a'
  },
  txtRenderElements: {
    alignSelf: 'center',
    fontFamily: 'Poppins_700Bold',
    fontSize: fontWidth / 25,
    marginBottom: 15,
  },
  tituloRendError: {
    alignSelf: 'center',
    fontFamily: 'Poppins_700Bold',
    fontSize: fontWidth / 25,
    marginBottom: 25
  },
  subtituloRendError: {
    alignSelf: 'center',
    fontFamily: 'Poppins_500Medium',
    fontSize: fontWidth / 25,
    marginBottom: 25
  },



  tituloRendStatus: {
    alignSelf: 'center',
    fontFamily: 'Poppins_700Bold',
    fontSize: fontWidth / 18,
    marginBottom: 5
  },
  subtituloRendStatus: {
    alignSelf: 'center',
    fontFamily: 'Poppins_500Medium',
    fontSize: fontWidth / 25,
    marginBottom: 25
  },

  // PEDIDO

  dotPedidoColor: {
    width: fontWidth / 10,
    height: fontWidth / 10,
    backgroundColor: '#07E607',
    borderRadius: 100,
  },
  dotPedidoNoColor: {
    width: fontWidth / 10,
    height: fontWidth / 10,
    backgroundColor: '#D8D8D8',
    borderRadius: 100,
  },
  txtVerDetalleProd: {
    color: '#07E607',
    fontFamily: 'Poppins_500Medium',
    fontSize: fontWidth / 23,
    marginTop: 35,
    alignSelf: 'center'
  },

  //NOTIFICACIONES
  NotificIconBall: {
    width: fontWidth / 10,
    height: fontWidth / 10,
    backgroundColor: '#07E607',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  TextCuerpoNoti: {
    color: '#323232',
    fontFamily: 'Poppins_500Medium',
    fontSize: fontWidth / 19,
  },


  //AJUSTES
  txtItemAjustes: {
    fontFamily: 'Poppins_700Bold',
    marginLeft: 15,
    fontSize: fontWidth / 28
  },


  //TROUBLE LOGIN
  titulo: {
    fontSize: fontWidth / 9,
    // fontSize: 37,
    marginBottom: 15,
    color: '#000',
    fontFamily: 'Poppins_700Bold',
    alignSelf: 'flex-start'
  },
  subtitulo: {
    fontSize: fontWidth / 20,
    marginBottom: 5,
    color: '#393939',
    fontFamily: 'Poppins_500Medium',
    alignSelf: 'flex-start'

  },
  contenido: {
    fontSize: fontWidth / 28,
    // marginBottom: 20,
    color: '#4a4a4a',
    fontFamily: 'Poppins_300Light',
    alignSelf: 'flex-start'
  },


  //DETALLE PEDIDO
  iconCircle: {
    backgroundColor: '#5F40FF',
    width: fontWidth / 16,
    height: fontWidth / 16,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  IconsFor: {
    fontSize: fontWidth / 25,
    color: '#fff',
  },

  ctninputsNoMarginBottom: {
    width: '100%',
    height: 'auto',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 0,
    borderColor: '#fff',
    padding: 7,
    paddingLeft: 15,
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.14,
    shadowRadius: 5.51,

    elevation: 15,
  },


  //CAMERA OPTIONS
  button: {
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    //width: '60%',
    //height: '80%',
  },
  cameraPerfil: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    //width: '60%',
    //height: '80%',
  },
  overlayPerfil: {
    position: 'absolute',
    borderWidth: 5,
    borderColor: '#07E607', // Cambia el color del borde según tus preferencias
    width: '90%',
    height: '90%',
    alignSelf: 'center',
    borderRadius: 200,
    opacity: 0.7,
  },
  overlay: {
    position: 'absolute',
    borderWidth: 5,
    borderColor: '#07E607', // Cambia el color del borde según tus preferencias
    width: '98%',
    height: '98%',
    //top: '20%',
    alignSelf: 'center',
    borderRadius: 10,
    opacity: 0.7,
  },
  captureButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'white',
    borderRadius: 50,
    width: 70,
    height: 70,
    alignSelf: 'center',
  },

  //NEW SIDEMENU
  toggleButton: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuItem: {
    fontSize: 18,
    marginVertical: 10,
  },

  //CHATS SCREEN
  containerBox: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontFamily: 'Poppins_700Bold',
    color: '#333',
  },
  message: {
    fontFamily: 'Poppins_400Regular',
    color: '#666',
  },
  time: {
    fontFamily: 'Poppins_400Regular',
    color: '#999',
  },
  // CHAT
  safeArea: {
    backgroundColor: '#f0f0f0',
  },

  chatList: {
    //flex: 1,
  },
  chatListContent: {
    padding: 10,
  },
  messageContainer: {
    backgroundColor: '#e1ffc7',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e1ffc7',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#d1e7ff',
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 10,
  },
  sendButton: {
    height: 40,
    width: 40,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  bankName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardNumberContainer: {
    marginBottom: 20,
  },
  cardNumber: {
    color: 'white',
    fontSize: 22,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginBottom: 5,
  },
  cardHolder: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  expiryDate: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },



});

export { styles }