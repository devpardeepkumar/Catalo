import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
   // paddingBottom: 30,
  // paddingHorizontal:10,
    paddingVertical: 20
  },
  container: { flex: 1, backgroundColor: '#F4F7FC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#34495E',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
 
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabsWrapper: {
   // paddingHorizontal: 15,
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
});
