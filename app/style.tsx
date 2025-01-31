import { StyleSheet, Dimensions } from 'react-native';
import Colors from './../constant/Colors';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  textLogin: {
    color: Colors.WHITE, 
    fontSize: width * 0.04, 
    alignSelf: "center", 
    fontFamily: 'outfit',
    marginBottom: 10

  },

  containerDescription: {
    padding: width * 0.06,
    marginTop: height * 0.1,
    backgroundColor: Colors.PRIMARY,
    height: '100%',
    borderTopLeftRadius: width * 0.1,
    borderTopRightRadius: width * 0.1,
  },
  
  button: {
    padding: width * 0.04,
    backgroundColor: Colors.WHITE,
    borderRadius: width * 0.02,
    marginTop: height * 0.08,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: width * 0.045,
    fontFamily: 'outfit-bold',
  },
  imageLogo: {
    height: height * 0.25,
    width: height * 0.25,
    backgroundColor: Colors.TRANSPARENT,
    marginTop: height * 0.03,
    alignSelf: 'center'
  },
  textTitle: {
    fontFamily: 'outfit-bold',
    fontSize: width * 0.09,
    textAlign: 'center',
    color: Colors.PRIMARY,
    marginTop: height * 0.1,
  },
  TextDescription: {
    fontFamily: 'outfit',
    fontSize: width * 0.06,
    textAlign: 'center',
    color: Colors.WHITE,
    marginTop: height * 0.05,
    width: '80%',
    alignSelf: 'center'
  },
  footer: {
    height: height * 0.03,
    width: "100%",
    backgroundColor: Colors.SECONDARY,
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontFamily: 'outfit',
    color: Colors.WHITE,
    fontSize: width * 0.04,
  },
  touchableLogin: {
    marginTop: 10,
  },
  
});

export default styles;
