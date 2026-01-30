import { MultiStepModal, StepConfig } from '@/components/common/MultiStepModal';
import { styles } from '@/styles/components/EditStoreProfileModal';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

const UserRegistrationExample: React.FC = () => {
  const [visible, setVisible] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation functions
  const validatePersonalInfo = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAccountInfo = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step configurations
  const steps: StepConfig[] = [
    {
      id: 'personal',
      title: 'Personal Information',
      content: (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tell us about yourself</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>First Name *</Text>
            <TextInput
              style={[styles.input, errors.firstName && styles.inputError]}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
            />
            {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Last Name *</Text>
            <TextInput
              style={[styles.input, errors.lastName && styles.inputError]}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
            />
            {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
          </View>
        </View>
      ),
      validation: validatePersonalInfo,
    },
    {
      id: 'account',
      title: 'Account Setup',
      content: (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Create your account</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password *</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password *</Text>
            <TextInput
              style={[styles.input, errors.confirmPassword && styles.inputError]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
            />
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>
        </View>
      ),
      validation: validateAccountInfo,
    },
  ];

  const handleSave = async () => {
    const userData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password,
    };

    // Simulate API call
    Alert.alert('Success', 'User registered successfully!', [
      { text: 'OK', onPress: () => setVisible(false) }
    ]);
  };

  const handleReset = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{ padding: 20, backgroundColor: '#3498db', borderRadius: 8 }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Open User Registration</Text>
      </TouchableOpacity>

      <MultiStepModal
        visible={visible}
        onClose={() => setVisible(false)}
        onSave={handleSave}
        steps={steps}
        title="Create Account"
        saveButtonText="Create Account"
        onReset={handleReset}
      />
    </View>
  );
};

// Example 2: Product Setup Form
const ProductSetupExample: React.FC = () => {
  const [visible, setVisible] = useState(false);

  // Form state
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [inStock, setInStock] = useState('');
  const [sku, setSku] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation functions
  const validateBasicInfo = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};
    if (!productName.trim()) newErrors.productName = 'Product name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!price.trim()) newErrors.price = 'Price is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateInventory = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};
    if (!category.trim()) newErrors.category = 'Category is required';
    if (!inStock.trim()) newErrors.inStock = 'Stock quantity is required';
    if (!sku.trim()) newErrors.sku = 'SKU is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step configurations
  const steps: StepConfig[] = [
    {
      id: 'basic',
      title: 'Basic Information',
      content: (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Details</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Product Name *</Text>
            <TextInput
              style={[styles.input, errors.productName && styles.inputError]}
              value={productName}
              onChangeText={setProductName}
              placeholder="Enter product name"
            />
            {errors.productName && <Text style={styles.errorText}>{errors.productName}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.textArea, errors.description && styles.inputError]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your product..."
              multiline
              numberOfLines={3}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Price *</Text>
            <TextInput
              style={[styles.input, errors.price && styles.inputError]}
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
            {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
          </View>
        </View>
      ),
      validation: validateBasicInfo,
    },
    {
      id: 'inventory',
      title: 'Inventory & Category',
      content: (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stock & Organization</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Category *</Text>
            <TextInput
              style={[styles.input, errors.category && styles.inputError]}
              value={category}
              onChangeText={setCategory}
              placeholder="e.g., Electronics, Clothing, Home"
            />
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Stock Quantity *</Text>
            <TextInput
              style={[styles.input, errors.inStock && styles.inputError]}
              value={inStock}
              onChangeText={setInStock}
              placeholder="Number of items in stock"
              keyboardType="numeric"
            />
            {errors.inStock && <Text style={styles.errorText}>{errors.inStock}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>SKU *</Text>
            <TextInput
              style={[styles.input, errors.sku && styles.inputError]}
              value={sku}
              onChangeText={setSku}
              placeholder="Unique product identifier"
            />
            {errors.sku && <Text style={styles.errorText}>{errors.sku}</Text>}
          </View>
        </View>
      ),
      validation: validateInventory,
    },
  ];

  const handleSave = async () => {
    const productData = {
      productName: productName.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category: category.trim(),
      inStock: parseInt(inStock),
      sku: sku.trim(),
    };

    // Simulate API call
    Alert.alert('Success', 'Product created successfully!', [
      { text: 'OK', onPress: () => setVisible(false) }
    ]);
  };

  const handleReset = () => {
    setProductName('');
    setDescription('');
    setPrice('');
    setCategory('');
    setInStock('');
    setSku('');
    setErrors({});
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{ padding: 20, backgroundColor: '#2ecc71', borderRadius: 8 }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Open Product Setup</Text>
      </TouchableOpacity>

      <MultiStepModal
        visible={visible}
        onClose={() => setVisible(false)}
        onSave={handleSave}
        steps={steps}
        title="Add New Product"
        saveButtonText="Create Product"
        onReset={handleReset}
      />
    </View>
  );
};

// Example 3: Simple Survey Form
const SurveyExample: React.FC = () => {
  const [visible, setVisible] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation functions
  const validatePersonal = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!age.trim()) newErrors.age = 'Age is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFeedback = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};
    if (!feedback.trim()) newErrors.feedback = 'Feedback is required';
    if (!rating.trim()) newErrors.rating = 'Rating is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step configurations
  const steps: StepConfig[] = [
    {
      id: 'personal',
      title: 'About You',
      content: (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Age *</Text>
            <TextInput
              style={[styles.input, errors.age && styles.inputError]}
              value={age}
              onChangeText={setAge}
              placeholder="Your age"
              keyboardType="numeric"
            />
            {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
          </View>
        </View>
      ),
      validation: validatePersonal,
    },
    {
      id: 'feedback',
      title: 'Your Feedback',
      content: (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Share Your Thoughts</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Feedback *</Text>
            <TextInput
              style={[styles.textArea, errors.feedback && styles.inputError]}
              value={feedback}
              onChangeText={setFeedback}
              placeholder="Tell us what you think..."
              multiline
              numberOfLines={4}
            />
            {errors.feedback && <Text style={styles.errorText}>{errors.feedback}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Rating (1-5) *</Text>
            <TextInput
              style={[styles.input, errors.rating && styles.inputError]}
              value={rating}
              onChangeText={setRating}
              placeholder="Rate your experience (1-5)"
              keyboardType="numeric"
            />
            {errors.rating && <Text style={styles.errorText}>{errors.rating}</Text>}
          </View>
        </View>
      ),
      validation: validateFeedback,
    },
  ];

  const handleSave = async () => {
    const surveyData = {
      name: name.trim(),
      age: parseInt(age),
      feedback: feedback.trim(),
      rating: parseInt(rating),
    };

    // Simulate API call
    Alert.alert('Thank you!', 'Your feedback has been submitted.', [
      { text: 'OK', onPress: () => setVisible(false) }
    ]);
  };

  const handleReset = () => {
    setName('');
    setAge('');
    setFeedback('');
    setRating('');
    setErrors({});
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{ padding: 20, backgroundColor: '#e67e22', borderRadius: 8 }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Open Survey</Text>
      </TouchableOpacity>

      <MultiStepModal
        visible={visible}
        onClose={() => setVisible(false)}
        onSave={handleSave}
        steps={steps}
        title="Customer Survey"
        saveButtonText="Submit Survey"
        onReset={handleReset}
      />
    </View>
  );
};

// Main example component showing all three different forms
export const MultiStepModalExamples: React.FC = () => {
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 }}>
        MultiStepModal Examples
      </Text>
      <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 30, color: '#666' }}>
        The same MultiStepModal component used for different form types with identical UI and behavior.
      </Text>

      <View style={{ flex: 1, justifyContent: 'space-around' }}>
        <UserRegistrationExample />
        <ProductSetupExample />
        <SurveyExample />
      </View>
    </View>
  );
};
