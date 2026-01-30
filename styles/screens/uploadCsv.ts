import { StyleSheet } from 'react-native';

// export const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#F8F9FA',
//   },
//   headerButton: {
//     marginHorizontal: 16,
//     padding: 8,
//   },
//   // Header styles matching inventory screen
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#34495E',
//     padding: 20,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     marginBottom: 20,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   // Content container
//   contentContainer: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#2C3E50',
//     textAlign: 'center',
//     marginBottom: 40,
//   },
 
//   filePickerArea: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#BDC3C7',
//     borderStyle: 'dashed',
//     padding: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   filePickerContent: {
//     alignItems: 'center',
//   },
//   filePickerTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: '#34495E',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   filePickerSubtitle: {
//     fontSize: 14,
//     color: '#7F8C8D',
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   selectedFileInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#D4EDDA',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#C3E6CB',
//   },
//   selectedFileText: {
//     fontSize: 16,
//     color: '#155724',
//     marginLeft: 8,
//     fontWeight: '500',
//   },
//   toggleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   checkbox: {
//     width: 24,
//     height: 24,
//     borderWidth: 2,
//     borderColor: '#BDC3C7',
//     borderRadius: 4,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//     backgroundColor: '#fff',
//   },
//   checkboxChecked: {
//     backgroundColor: '#3498DB',
//     borderColor: '#3498DB',
//   },
//   toggleText: {
//     fontSize: 16,
//     color: '#34495E',
//     flex: 1,
//   },
//   nextButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#27AE60',
//     borderRadius: 8,
//     paddingVertical: 16,
//     paddingHorizontal: 24,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 3,
//   },
//   nextButtonDisabled: {
//     backgroundColor: '#ECF0F1',
//   },
//   nextButtonText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//     marginRight: 8,
//   },
//   nextButtonTextDisabled: {
//     color: '#BDC3C7',
//   },
// });


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fb',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  uploadBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#cfd8dc',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  chooseFile: {
    fontSize: 16,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    color: '#7a7a7a',
    marginTop: 5,
    textAlign: 'center',
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  removeText: {
    color: '#d32f2f',
    fontSize: 13,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  cancelBtn: {
    backgroundColor: '#b0bec5',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 6,
  },
  cancelText: {
    color: '#fff',
    fontWeight: '600',
  },
  nextBtn: {
    backgroundColor: '#90a4ae',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 6,
  },
  nextText: {
    color: '#fff',
    fontWeight: '600',
  },
});
