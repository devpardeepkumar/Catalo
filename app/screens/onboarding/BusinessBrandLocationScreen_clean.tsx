// // src/screens/onboarding/BusinessBrandLocationScreen.tsx
// import { yupResolver } from "@hookform/resolvers/yup";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as Location from "expo-location";
// import { router } from "expo-router";
// import React, { useEffect, useRef, useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import {
//     ActivityIndicator,
//     Alert,
//     ScrollView,
//     StatusBar,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import MapView, { Marker } from "react-native-maps";

// import CustomInput from "@/components/common/CustomInput";
// import { locationSchema } from "@/validation/validationListSchemas";
// import onboardingStyles from "./onboarding.styles";

// // Distance threshold in meters (100m = reasonable match)
// const MAX_DISTANCE_METERS = 100;

// export default function BusinessBrandLocationScreen() {
//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     watch,
//     setValue,
//     setError,
//     clearErrors,
//   } = useForm({
//     resolver: yupResolver(locationSchema),
//     defaultValues: {
//       address: "",
//       city: "",
//       cap: "",
//       state: "Italy",
//     },
//   });

//   const [isLoading, setIsLoading] = useState(false);
//   const [isGeocoding, setIsGeocoding] = useState(false);
//   const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

//   const [mapRegion, setMapRegion] = useState({
//     latitude: 45.4642,
//     longitude: 9.1900,
//     latitudeDelta: 0.01,
//     longitudeDelta: 0.01,
//   });

//   const [markerPosition, setMarkerPosition] = useState({
//     latitude: 45.4642,
//     longitude: 9.1900,
//   });

//   const geocodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   // Permission
//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert("Info", "Location permission denied. You can still use the map manually.");
//       }
//     })();
//   }, []);

//   // Reverse geocoding: pin moved → fill fields
//   const reverseGeocode = async (lat: number, lng: number) => {
//     setIsReverseGeocoding(true);
//     try {
//       const addresses = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
//       if (addresses.length > 0) {
//         const a = addresses[0];
//         const street = [a.street, a.streetNumber].filter(Boolean).join(" ");
//         setValue("address", street.trim());
//         setValue("city", a.city || a.subregion || "");
//         setValue("cap", a.postalCode || "");
//         setValue("state", a.region || "Italy");
//         // Clear any existing validation errors
//       }
//     } catch (error) {
//       console.log("Reverse geocoding failed", error);
//     } finally {
//       setIsReverseGeocoding(false);
//     }
//   };

//   const handleMapInteraction = (e: any) => {
//     const { latitude, longitude } = e.nativeEvent.coordinate;
//     setMarkerPosition({ latitude, longitude });
//     setMapRegion({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });
//     reverseGeocode(latitude, longitude);
//   };

//   // Forward geocoding: typing → move marker
//   const forwardGeocode = async (address: string, city: string, cap: string, state: string) => {
//     if (!address || !city || !cap) return;

//     setIsGeocoding(true);
//     try {
//       const full = `${address}, ${city}, ${cap}, ${state}, Italy`;
//       const results = await Location.geocodeAsync(full);
//       if (results.length > 0) {
//         const { latitude, longitude } = results[0];
//         setMarkerPosition({ latitude, longitude });
//         setMapRegion({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });
//         // Clear any existing validation errors
//       }
//     } catch (error) {
//       console.log("Forward geocoding failed:", error);
//     } finally {
//       setIsGeocoding(false);
//     }
//   };

//   useEffect(() => {
//     const sub = watch((value: any) => {
//       if (geocodeTimeoutRef.current) clearTimeout(geocodeTimeoutRef.current);
//       const { address, city, cap, state } = value;
//       if (address && city && cap) {
//         geocodeTimeoutRef.current = setTimeout(() => forwardGeocode(address, city, cap, state), 800) as any;
//       }
//     });
//     return () => {
//       sub.unsubscribe();
//       if (geocodeTimeoutRef.current) clearTimeout(geocodeTimeoutRef.current);
//     };
//   }, [watch]);

//   // Load saved data
//   useEffect(() => {
//     const load = async () => {
//       try {
//         const str = await AsyncStorage.getItem("onboardingData");
//         if (str) {
//           const data = JSON.parse(str);
//           if (data.location) {
//             const { address, city, cap, state, latitude, longitude } = data.location;
//             reset({ address, city, cap, state });
//             if (latitude && longitude) {
//               setMarkerPosition({ latitude, longitude });
//               setMapRegion({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });
//             }
//           }
//         }
//       } catch (e) {
//         console.error("Load failed:", e);
//       }
//     };
//     load();
//   }, [reset]);

//   // Final validation before saving
//   const onSubmit = async (data: any) => {
//     setIsLoading(true);

//     try {
//       // Perform forward geocoding to compare with current marker
//       const fullAddress = `${data.address}, ${data.city}, ${data.cap}, ${data.state}, Italy`;
//       const geocoded = await Location.geocodeAsync(fullAddress);

//       if (geocoded.length > 0) {
//         const typedCoord = geocoded[0];
//         const distance = getDistance(
//           typedCoord.latitude,
//           typedCoord.longitude,
//           markerPosition.latitude,
//           markerPosition.longitude
//         );

//         if (distance > MAX_DISTANCE_METERS) {
//           setIsLoading(false);
//           return Alert.alert(
//             "Location Mismatch ⚠️",
//             `The address you typed is about ${Math.round(distance)} meters away from the pin on the map.\n\nPlease make sure they match, or move the pin to your exact location.`,
//             [
//               { text: "Cancel", style: "cancel" },
//               {
//                 text: "Continue Anyway",
//                 style: "destructive",
//                 onPress: () => saveLocation(data),
//               },
//             ]
//           );
//         }
//       }

//       // If no mismatch or user confirms → save
//       await saveLocation(data);
//     } catch (error) {
//       console.error("Validation error:", error);
//       Alert.alert("Error", "Could not verify location. Please try again.");
//       setIsLoading(false);
//     }
//   };

//   // Save function (extracted for reuse)
//   const saveLocation = async (data: any) => {
//     try {
//       const existingStr = await AsyncStorage.getItem("onboardingData");
//       const existing = existingStr ? JSON.parse(existingStr) : {};

//       const updated = {
//         ...existing,
//         location: {
//           ...data,
//           latitude: markerPosition.latitude,
//           longitude: markerPosition.longitude,
//         },
//         step: 2,
//       };

//       await AsyncStorage.setItem("onboardingData", JSON.stringify(updated));
//       Alert.alert("Success", "Location saved successfully!", [{ text: "OK" }]);
//       router.push("/screens/onboarding/BusinessBrandTimeScreen");
//     } catch (e) {
//       Alert.alert("Error", "Failed to save.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Haversine formula to calculate distance in meters
//   const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
//     const R = 6371000; // Earth radius in meters
//     const dLat = (lat2 - lat1) * (Math.PI / 180);
//     const dLon = (lon2 - lon1) * (Math.PI / 180);
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(lat1 * (Math.PI / 180)) *
//         Math.cos(lat2 * (Math.PI / 180)) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   };

//   const handleJump = async () => {
//     try {
//       const existingStr = await AsyncStorage.getItem("onboardingData");
//       const existing = existingStr ? JSON.parse(existingStr) : {};
//       await AsyncStorage.setItem(
//         "onboardingData",
//         JSON.stringify({
//           ...existing,
//           location: { address: "", city: "", cap: "", state: "Italy", latitude: null, longitude: null },
//           step: 2,
//           locationSkipped: true,
//         })
//       );
//       router.push("/screens/onboarding/BusinessBrandTimeScreen");
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   return (
//     <View style={onboardingStyles.container}>
//       <StatusBar barStyle="light-content" />

//       <View style={onboardingStyles.header}>
//         <Text style={onboardingStyles.headerTitle}>Your Store</Text>
//       </View>

//       <View style={onboardingStyles.progressContainer}>
//         <Text style={onboardingStyles.progressText}>Complete your store details! 2/3</Text>
//       </View>

//       <ScrollView contentContainerStyle={onboardingStyles.contentContainer}>
//         <Text style={onboardingStyles.sectionTitle}>Location Settings</Text>

//         {/* Inputs */}
//         <Controller
//           control={control}
//           name="address"
//           render={({ field: { onChange, onBlur, value } }) => (
//             <CustomInput
//               label="Address *"
//               placeholder="Via Monte Napoleone 10"
//               value={value}
//               onChangeText={onChange}
//               onBlur={onBlur}
//               error={errors.address?.message}
//             />
//           )}
//         />

//         <Controller
//           control={control}
//           name="city"
//           render={({ field: { onChange, onBlur, value } }) => (
//             <CustomInput
//               label="City *"
//               placeholder="Milano"
//               value={value}
//               onChangeText={onChange}
//               onBlur={onBlur}
//               error={errors.city?.message}
//             />
//           )}
//         />

//         <Controller
//           control={control}
//           name="cap"
//           render={({ field: { onChange, onBlur, value } }) => (
//             <CustomInput
//               label="CAP (ZIP Code) *"
//               placeholder="20121"
//               keyboardType="numeric"
//               value={value}
//               onChangeText={onChange}
//               onBlur={onBlur}
//               error={errors.cap?.message}
//             />
//           )}
//         />

//         <Controller
//           control={control}
//           name="state"
//           render={({ field: { onChange, onBlur, value } }) => (
//             <CustomInput
//               label="State"
//               placeholder="Italy"
//               value={value}
//               onChangeText={onChange}
//               onBlur={onBlur}
//               error={errors.state?.message}
//             />
//           )}
//         />

//         {/* Map */}
//         <View style={onboardingStyles.mapSection}>
//           <View style={onboardingStyles.mapLabelContainer}>
//             <Text style={onboardingStyles.mapLabel}>Tap or drag pin to set location</Text>
//             {(isGeocoding || isReverseGeocoding) && (
//               <View style={onboardingStyles.geocodingIndicator}>
//                 <ActivityIndicator size="small" color="#34495E" />
//                 <Text style={onboardingStyles.geocodingText}>
//                   {isReverseGeocoding ? "Getting address..." : "Searching..."}
//                 </Text>
//               </View>
//             )}
//           </View>

//           <View style={onboardingStyles.mapContainer}>
//             <MapView
//               style={onboardingStyles.map}
//               region={mapRegion}
//               onPress={handleMapInteraction}
//             >
//               <Marker
//                 coordinate={markerPosition}
//                 draggable
//                 onDragEnd={handleMapInteraction}
//               />
//             </MapView>
//           </View>

//           <Text style={{ marginTop: 10, fontSize: 13, color: "#7F8C8D", textAlign: "center" }}>
//             Fields auto-fill when you move the pin • Make sure pin and address match!
//           </Text>
//         </View>
//       </ScrollView>

//       <View style={onboardingStyles.buttonContainer}>
//         <TouchableOpacity style={onboardingStyles.jumpButton} onPress={handleJump}>
//           <Text style={onboardingStyles.buttonText}>JUMP</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={onboardingStyles.sendButton}
//           onPress={handleSubmit(onSubmit)}
//           disabled={isLoading}
//         >
//           <Text style={onboardingStyles.buttonText}>
//             {isLoading ? "SAVING..." : "NEXT"}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

import FloatingLabelInput from '@/components/common/FloatingLabelInput';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function BusinessBrandLocationScreenClean() {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Floating Label Input Demo</Text>
        <Text style={styles.subtitle}>Modern mobile-first input fields</Text>

        <View style={styles.inputSection}>
          <FloatingLabelInput
            label="Street Address"
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your street address"
            autoCapitalize="words"
          />

          <FloatingLabelInput
            label="City"
            value={city}
            onChangeText={setCity}
            placeholder="Enter your city"
            autoCapitalize="words"
          />

          <FloatingLabelInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <FloatingLabelInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            autoCapitalize="none"
          />

          <FloatingLabelInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />

          <FloatingLabelInput
            label="Address with Error"
            value=""
            onChangeText={() => {}}
            placeholder="This field has an error"
            error="This field is required"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 32,
  },
  inputSection: {
    gap: 4,
  },
});