import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    
    //backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
  },
  buttonsRow: {
    paddingHorizontal: Platform.OS === 'ios' ? 20 : 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent:'flex-end' ,
    gap:6,
   // alignItems: 'center',
    flexWrap: 'wrap',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34495E', 
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    minWidth: 80,
    marginHorizontal: 2,
    marginVertical: 2,
  },
  buttonText: {
    fontSize: Platform.OS === 'ios' ? 14 : 12,
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
  },
  iconOnlyButton: {
    paddingHorizontal: 16,
    minWidth: 50,
  },
});
