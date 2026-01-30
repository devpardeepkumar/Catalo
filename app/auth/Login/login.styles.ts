import { Platform, StyleSheet } from 'react-native';

export default StyleSheet.create({
  rootContainer: { flex: 1, backgroundColor: '#fff' },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 26,
    // padding: 20
   },
   header: {
    backgroundColor: "#34495E",
    paddingTop: 68,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  subtitle1: {
    marginTop: 6,
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
  },
  logo: {
    width: 160,
    height: 90,
    // resizeMode: "contain",
    // marginBottom: 10,
  },
   container:{
    padding: 20,
   },
   mainContainer:{
    backgroundColor: "#7A818A",
     paddingTop: Platform.OS === "ios" ? 68 : 40, 
     paddingVertical: 20,
     paddingHorizontal: 10,
     paddingBottom: 20,
     //flexDirection: "row",
     //alignItems: "center",
     //justifyContent: "space-between",
     borderBottomLeftRadius: 20,
     borderBottomRightRadius: 20,
   },
   title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 , color:'white'},
   registerContainer: {
     flexDirection: 'row',
     justifyContent: 'center',
     alignItems: 'center',
     marginTop: 20,
     marginBottom: 10,
   },
   registerText: {
     fontSize: 16,
     color: '#666',
   },
   registerLink: {
     fontSize: 14,
     color: '#34495E',
     fontWeight: '600',
     textDecorationLine: 'underline',
   },
   forgotPasswordContainer: {
     alignItems: 'flex-end',
     marginBottom: 15,
   },
   forgotPasswordText: {
     fontSize: 14,
     color: '#34495E',
     fontWeight: '500',
   },
   errorContainer: {
     backgroundColor: '#ffebee',
     borderColor: '#d32f2f',
     borderWidth: 1,
     borderRadius: 8,
     padding: 12,
     marginBottom: 16,
   },
   errorText: { color: '#d32f2f', fontSize: 14, marginTop: 4 },

 });