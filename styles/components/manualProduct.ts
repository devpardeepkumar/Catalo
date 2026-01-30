import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Main Modal Container
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  closeButton: {
    padding: 8,
  },

  // Scroll Content
  scrollContent: {
    paddingHorizontal: 20,
  },

  // Step Indicators
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  stepDotActive: {
    backgroundColor: '#3498DB',
  },
  stepDotInactive: {
    backgroundColor: '#BDC3C7',
  },

  // Form Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 12,
  },

  // Input Groups
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#34495E',
    marginBottom: 6,
  },
  inputLabelRequired: {
    color: '#E74C3C',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#2C3E50',
    backgroundColor: '#FFFFFF',
  },
  textInputFocused: {
    borderColor: '#3498DB',
  },
  textInputError: {
    borderColor: '#E74C3C',
  },

  // EAN Input Special Styling
  eanInput: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 2,
  },

  // Action Buttons
  searchButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 8,
  },
  searchButtonPending: {
    backgroundColor: '#BDC3C7',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Product Match Cards
  matchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ECF0F1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchCardSelected: {
    borderColor: '#3498DB',
    borderWidth: 2,
  },
  matchImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  matchBrand: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  matchManufacturer: {
    fontSize: 12,
    color: '#95A5A6',
  },

  // Product Sheet Preview
  productSheet: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  productSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  productImages: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#34495E',
    lineHeight: 20,
    marginBottom: 12,
  },
  specRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  specLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34495E',
    width: 100,
  },
  specValue: {
    fontSize: 12,
    color: '#7F8C8D',
    flex: 1,
  },

  // Loading States
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#7F8C8D',
  },

  // Error States
  errorContainer: {
    backgroundColor: '#FDEDEC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 14,
  },

  // Action Buttons (Bottom)
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
    backgroundColor: '#FFFFFF',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: '#27AE60',
  },
  secondaryButton: {
    backgroundColor: '#BDC3C7',
  },
  dangerButton: {
    backgroundColor: '#E74C3C',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#34495E',
  },
});
