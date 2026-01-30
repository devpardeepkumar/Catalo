import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    View
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import CustomInput from "@/components/common/CustomInput";
import { styles } from "@/styles/components/EditStoreProfileModal";


const MAX_DISTANCE_METERS = 100;

interface AdvancedLocationStepProps {
  // State
  address: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
  errors: Record<string, string>;

  // Handlers
  setAddress: (value: string) => void;
  setCity: (value: string) => void;
  setpostalCode: (value: string) => void;
  setState: (value: string) => void;
  setCountry: (value: string) => void;
  setLatitude?: (value: number) => void;
  setLongitude?: (value: number) => void;

  // Initial coordinates if available
  initialLatitude?: number;
  initialLongitude?: number;
}

export const AdvancedLocationStep: React.FC<AdvancedLocationStepProps> = ({
  address,
  city,
  postalCode,
  state,
  country,
  errors,
  setAddress,
  setCity,
  setpostalCode,
  setState,
  setCountry,
  setLatitude,
  setLongitude,
  initialLatitude,
  initialLongitude,
}) => {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  const [mapRegion, setMapRegion] = useState({
    latitude: initialLatitude || 45.4642,
    longitude: initialLongitude || 9.1900,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [markerPosition, setMarkerPosition] = useState({
    latitude: initialLatitude || 45.4642,
    longitude: initialLongitude || 9.1900,
  });

  const geocodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Permission
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Info", "Location permission denied. You can still use the map manually.");
      }
    })();
  }, []);

  // Reverse geocoding: pin moved → fill fields
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    try {
      const addresses = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (addresses.length > 0) {
        const a = addresses[0];
        const street = [a.street, a.streetNumber].filter(Boolean).join(" ");
        setAddress(street.trim());
        setCity(a.city || a.subregion || "");
        setpostalCode(a.postalCode || "");
        setState(a.region || "Italy");
        setCountry(a.country || "Italy");
      }
    } catch (error) {
      console.log("Reverse geocoding failed", error);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  const handleMapInteraction = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });
    setMapRegion({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });
    reverseGeocode(latitude, longitude);
  };

  // Forward geocoding: typing → move marker
  const forwardGeocode = async (address: string, city: string, postalCode: string, state: string, country: string) => {
    if (!address || !city || !postalCode) return;

    setIsGeocoding(true);
    try {
      const full = `${address}, ${city}, ${postalCode}, ${state}, ${country}`;
      const results = await Location.geocodeAsync(full);
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        setMarkerPosition({ latitude, longitude });
        setMapRegion({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });
      }
    } catch (error) {
      console.log("Forward geocoding failed:", error);
    } finally {
      setIsGeocoding(false);
    }
  };

  useEffect(() => {
    const sub = () => {
      if (geocodeTimeoutRef.current) clearTimeout(geocodeTimeoutRef.current);
      if (address && city && postalCode) {
        geocodeTimeoutRef.current = setTimeout(() => forwardGeocode(address, city, postalCode, state, country), 800) as any;
      }
    };
    sub();
    return () => {
      if (geocodeTimeoutRef.current) clearTimeout(geocodeTimeoutRef.current);
    };
  }, [address, city, postalCode, state, country]);

  // Load saved data
  useEffect(() => {
    const load = async () => {
      try {
        const str = await AsyncStorage.getItem("onboardingData");
        if (str) {
          const data = JSON.parse(str);
          if (data.location && data.location.latitude && data.location.longitude) {
            const { latitude, longitude } = data.location;
            setMarkerPosition({ latitude, longitude });
            setMapRegion({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });
          }
        }
      } catch (e) {
        console.error("Load failed:", e);
      }
    };
    load();
  }, []);

  // Update parent state when marker moves
  useEffect(() => {
    if (setLatitude) setLatitude(markerPosition.latitude);
    if (setLongitude) setLongitude(markerPosition.longitude);
  }, [markerPosition, setLatitude, setLongitude]);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Location</Text>

      {/* Address Input */}
      <CustomInput
        label="Address *"
        placeholder="Via Monte Napoleone 10"
        value={address}
        onChangeText={setAddress}
        error={errors.address}
      />

      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.flex1]}>
          <CustomInput
            label="City *"
            placeholder="Milano"
            value={city}
            onChangeText={setCity}
            error={errors.city}
          />
        </View>

        <View style={[styles.inputContainer, styles.flex1]}>
          <CustomInput
            label="CAP *"
            placeholder="20121"
            keyboardType="numeric"
            value={postalCode}
            onChangeText={setpostalCode}
            error={errors.postalCode}
          />
        </View>
      </View>

      <CustomInput
        label="State"
        placeholder="Italy"
        value={state}
        onChangeText={setState}
        error={errors.state}
      />

      <CustomInput
        label="Country *"
        placeholder="Italy"
        value={country}
        onChangeText={setCountry}
        error={errors.country}
      />

      {/* Map Section */}
      <View style={styles.inputContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 15, color: '#34495E', fontWeight: '500' }}>Tap or drag pin to set location</Text>
          {(isGeocoding || isReverseGeocoding) && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <ActivityIndicator size="small" color="#34495E" />
              <Text style={{ fontSize: 12, color: '#34495E' }}>
                {isReverseGeocoding ? "Getting address..." : "Searching..."}
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 200, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#E0E6ED' }}>
          <MapView
            style={{ width: '100%', height: '100%' }}
            region={mapRegion}
            onPress={handleMapInteraction}
          >
            <Marker
              coordinate={markerPosition}
              draggable
              onDragEnd={handleMapInteraction}
            />
          </MapView>
        </View>

        <Text style={{ marginTop: 10, fontSize: 13, color: "#7F8C8D", textAlign: "center" }}>
          Fields auto-fill when you move the pin • Make sure pin and address match!
        </Text>
      </View>
    </View>
  );
};
