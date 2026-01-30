import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#34495E",
    alignItems: "center",
    paddingHorizontal: 35,
    paddingTop: Platform.OS === "ios" ? 100 : 40,
  },
  logo: {
    height: 140,
    width: 100
  },
  title: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    lineHeight: 20
  },
  password: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 18,
    marginTop: 8
  },
  subText: {
    color: "#E5E5E5",
    textAlign: "center",
    marginBottom: 28,
    marginTop:18,
    fontWeight:700
  },
  input: {
    width: "100%",
    height: 45,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#C6C6C6",
    paddingHorizontal: 15,
    marginBottom: 28,
    color: "#000",
  },
  infoText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 26,
  },
  bold: {
    fontWeight: "bold",
    marginTop:18
  },
  resendText: {
    color: '#fff',
    fontSize: 14,
    borderBottomWidth: 1,
    fontWeight:600,
    borderBottomColor: '#ccc',
    paddingBottom: 2,
  },
  resendBtn: {
    marginTop: 20,
    paddingVertical: 5,
  },
});

export default styles;
