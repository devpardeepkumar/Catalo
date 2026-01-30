import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as yup from "yup";

import CustomInput from "@/components/common/CustomInput";
import { onboardingHoursApi } from "@/services/api/onboardingApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dropdown } from "react-native-element-dropdown";
import { router } from "expo-router";
// @ts-ignore - AsyncStorage types may not be available immediately after install

const timeSchema = yup.object().shape({
  holidayMessage: yup.string(),
  closingDays: yup.string(),
});

interface DayTime {
  day: string;
  openTime: string;
  closeTime: string;
}

export default function BusinessBrandTimeScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(timeSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [enableTimes, setEnableTimes] = useState(false);
  const [enableVacationMode, setEnableVacationMode] = useState(false);
  const [closingDays, setClosingDays] = useState("Monday");
  
  const [daysTimes, setDaysTimes] = useState<DayTime[]>([
    { day: "Tuesday", openTime: "09:00", closeTime: "19:00" },
    { day: "Wednesday", openTime: "09:00", closeTime: "19:00" },
    { day: "Thursday", openTime: "09:00", closeTime: "19:00" },
    { day: "Friday", openTime: "09:00", closeTime: "19:00" },
    { day: "Saturday", openTime: "09:00", closeTime: "19:00" },
    { day: "Sunday", openTime: "09:00", closeTime: "19:00" },
  ]);

  const dayOptions = [
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
    { label: "Sunday", value: "Sunday" },
  ];

  // Load saved time data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedDataStr = await AsyncStorage.getItem("businessBrandData");
        console.log("BusinessBrandTimeScreen: Retrieved savedDataStr:", savedDataStr);
        if (savedDataStr) {
          const savedData = JSON.parse(savedDataStr);
          console.log("BusinessBrandTimeScreen: Parsed savedData:", savedData);
          if (savedData.timeSettings) {
      
            reset({
              holidayMessage: savedData.timeSettings.holidayMessage || "",
              closingDays: savedData.timeSettings.closingDays || "Monday",
            });
            if (savedData.timeSettings.enableTimes !== undefined) {
              // Handle both array (old format) and boolean (new format)
              const enableTimesValue = Array.isArray(savedData.timeSettings.enableTimes)
                ? savedData.timeSettings.enableTimes.some((val: boolean) => val)
                : savedData.timeSettings.enableTimes;
              setEnableTimes(enableTimesValue);
              console.log("BusinessBrandTimeScreen: Set enableTimes to:", enableTimesValue);
            }
            if (savedData.timeSettings.enableVacationMode !== undefined) {
              // Handle both array (old format) and boolean (new format)
              const enableVacationModeValue = Array.isArray(savedData.timeSettings.enableVacationMode)
                ? savedData.timeSettings.enableVacationMode.some((val: boolean) => val)
                : savedData.timeSettings.enableVacationMode;
              setEnableVacationMode(enableVacationModeValue);
              console.log("BusinessBrandTimeScreen: Set enableVacationMode to:", enableVacationModeValue);
            }
            if (savedData.timeSettings.closingDays) {
              setClosingDays(savedData.timeSettings.closingDays);
              console.log("BusinessBrandTimeScreen: Set closingDays to:", savedData.timeSettings.closingDays);
            }
            if (savedData.timeSettings.daysTimes) {
              setDaysTimes(savedData.timeSettings.daysTimes);
              console.log("BusinessBrandTimeScreen: Set daysTimes to:", savedData.timeSettings.daysTimes);
            }
          }
        } else {
          console.log("BusinessBrandTimeScreen: No saved data found");
        }
      } catch (error) {
        console.error("BusinessBrandTimeScreen: Error loading saved time data:", error);
      }
    };

    loadSavedData();
  }, [reset]);

  const updateDayTime = (index: number, field: "openTime" | "closeTime", value: string) => {
    console.log("BusinessBrandTimeScreen: Updating day time", { index, field, value });
    const updated = [...daysTimes];
    updated[index] = { ...updated[index], [field]: value };
    setDaysTimes(updated);
    console.log("BusinessBrandTimeScreen: Updated daysTimes:", updated);
  };

  const convertToApiFormat = () => {
    console.log("BusinessBrandTimeScreen: Current state:", { enableVacationMode, enableTimes, daysTimes });

    // Map day names to dayOfWeek numbers (Monday = 1, Tuesday = 2, ..., Sunday = 0)
    const dayMapping: { [key: string]: number } = {
      'Monday': 1,
      'Tuesday': 2,
      'Wednesday': 3,
      'Thursday': 4,
      'Friday': 5,
      'Saturday': 6,
      'Sunday': 0
    };
    console.log("BusinessBrandTimeScreen: Day mapping:", dayMapping);

    // Create hours array for all 7 days
    const hours = [];
    for (let i = 0; i < 7; i++) {
      const dayName = Object.keys(dayMapping).find(key => dayMapping[key] === i);
      const dayData = daysTimes.find(dt => dt.day === dayName);
      console.log(`BusinessBrandTimeScreen: Processing day ${i} (${dayName}):`, dayData);

      if (dayData) {
        const isClosed = !dayData.openTime || !dayData.closeTime;
        const hourData = {
          dayOfWeek: i,
          openTime: isClosed ? null : dayData.openTime,
          closeTime: isClosed ? null : dayData.closeTime,
          isClosed
        };
        hours.push(hourData);
        console.log(`BusinessBrandTimeScreen: Added hour data for day ${i}:`, hourData);
      } else {
        // Default closed for missing days
        const hourData = {
          dayOfWeek: i,
          openTime: null,
          closeTime: null,
          isClosed: true
        };
        hours.push(hourData);
        console.log(`BusinessBrandTimeScreen: Added default closed data for day ${i}:`, hourData);
      }
    }

    const apiData = {
      vacationMode: enableVacationMode,
      enableReservations: true, // Default to true as per API example
      enableOpeningHours: enableTimes,
      hours
    };
    console.log("BusinessBrandTimeScreen: Final API data:", apiData);
    return apiData;
  };

  const onSubmit = async (data: any) => {
    console.log("BusinessBrandTimeScreen: onSubmit called with data:", data);
    setIsLoading(true);
    try {
      // Prepare data for API call
      const apiData = convertToApiFormat();
      console.log("BusinessBrandTimeScreen: API data prepared:", apiData);

      console.log("BusinessBrandTimeScreen: Calling onboardingHoursApi.submitHours");
      // Call the hours API
      const apiResponse = await onboardingHoursApi.submitHours(apiData);
      console.log("BusinessBrandTimeScreen: API response received:", apiResponse);

      console.log("BusinessBrandTimeScreen: Saving to local storage for backup");
      // Save to local storage for backup
      const existingDataStr = await AsyncStorage.getItem("onboardingData");
      console.log("BusinessBrandTimeScreen: Retrieved existing data from AsyncStorage:", existingDataStr);
      const existingData = existingDataStr ? JSON.parse(existingDataStr) : {};
      console.log("BusinessBrandTimeScreen: Parsed existing data:", existingData);

      const timeData = {
        ...existingData,
        timeSettings: {
          enableTimes,
          enableVacationMode,
          holidayMessage: data.holidayMessage || "",
          closingDays: data.closingDays || closingDays,
          daysTimes,
        },
        step: 3,
        timeCompletedAt: new Date().toISOString(),
        onboardingCompleted: true,
      };
      console.log("BusinessBrandTimeScreen: Time data to save:", timeData);

      await AsyncStorage.setItem("onboardingData", JSON.stringify(timeData));
      console.log("BusinessBrandTimeScreen: Data saved to AsyncStorage successfully");

      setIsLoading(false);
      console.log("BusinessBrandTimeScreen: Set loading to false");
      Alert.alert("Success", "Brand setup completed!");
      console.log("BusinessBrandTimeScreen: Success alert shown");
           router.replace('/screens/onboarding/ReadyToCompleteScreen');
    } catch (error) {
      console.log("BusinessBrandTimeScreen: Error occurred:", error);
      setIsLoading(false);
      console.log("BusinessBrandTimeScreen: Set loading to false due to error");
      Alert.alert("Error", "Failed to save time settings. Please try again.");
      console.error("BusinessBrandTimeScreen: Time settings save error:", error);
    }
  };

  const handleJump = async () => {
    console.log("BusinessBrandTimeScreen: handleJump called - skipping time settings");
    try {
      console.log("BusinessBrandTimeScreen: Fetching existing businessBrandData");
      const existingDataStr = await AsyncStorage.getItem("businessBrandData");
      console.log("BusinessBrandTimeScreen: Retrieved existing data:", existingDataStr);
      const existingData = existingDataStr ? JSON.parse(existingDataStr) : {};
      console.log("BusinessBrandTimeScreen: Parsed existing data:", existingData);

      const timeData = {
        ...existingData,
        timeSettings: {
          enableTimes: false,
          enableVacationMode: false,
          holidayMessage: "",
          closingDays: "Monday",
          daysTimes: daysTimes,
        },
        step: 3,
        timeSkipped: true,
        setupCompleted: true,
      };
      console.log("BusinessBrandTimeScreen: Time data to save for skip:", timeData);

      await AsyncStorage.setItem("businessBrandData", JSON.stringify(timeData));
      console.log("BusinessBrandTimeScreen: Skip data saved successfully");
           router.push('/(tabs)');
    } catch (error) {
      console.error("BusinessBrandTimeScreen: Error saving skip:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your brand</Text>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Complete your brand details! 3/3</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Section Title */}
        <Text style={styles.sectionTitle}>Time Settings</Text>

        {/* Enable Times Section */}
        <View style={styles.toggleSection}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleSectionTitle}>Enable times</Text>
            <Switch
              value={enableTimes}
              onValueChange={setEnableTimes}
              trackColor={{ false: "#BDC3C7", true: "#2C5F8D" }}
              thumbColor={enableTimes ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Enable Vacation Mode Section */}
        <View style={styles.toggleSection}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleSectionTitle}>Enable Vacation Mode</Text>
            <Switch
              value={enableVacationMode}
              onValueChange={setEnableVacationMode}
              trackColor={{ false: "#BDC3C7", true: "#2C5F8D" }}
              thumbColor={enableVacationMode ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Holiday Mode Message */}
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Holiday Mode Message</Text>
          <View style={styles.fieldInput}>
            <Controller
              control={control}
              name="holidayMessage"
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomInput
                  placeholder="Enter holiday message..."
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </View>
        </View>

        {/* Closing Days */}
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Closing days</Text>
          <View style={styles.fieldInput}>
            <Dropdown
              style={styles.dropdown}
              data={dayOptions}
              labelField="label"
              valueField="value"
              placeholder="Select closing day"
              value={closingDays}
              onChange={(item) => {
                setClosingDays(item.value);
              }}
            />
          </View>
        </View>

        {/* Opening and Closing Times */}
        <View style={styles.timesSection}>
          <Text style={styles.timesSectionTitle}>Opening and closing times</Text>
          {daysTimes.map((dayTime, index) => (
            <View key={index} style={styles.dayTimeRow}>
              <Text style={styles.dayLabel}>{dayTime.day}</Text>
              <View style={styles.timeInputs}>
                <CustomInput
                  placeholder="09:00"
                  value={dayTime.openTime}
                  onChangeText={(value) => updateDayTime(index, "openTime", value)}
                />
                <Text style={styles.timeSeparator}>-</Text>
                <CustomInput
                  placeholder="19:00"
                  value={dayTime.closeTime}
                  onChangeText={(value) => updateDayTime(index, "closeTime", value)}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.jumpButton} onPress={handleJump}>
          <Text style={styles.buttonText}>JUMP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>SEND</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECF0F1",
  },
  header: {
    backgroundColor: "#34495E",
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  progressContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#ECF0F1",
  },
  progressText: {
    fontSize: 14,
    color: "#7F8C8D",
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 24,
  },
  toggleSection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#BDC3C7",
  },
  toggleSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  toggleLabel: {
    fontSize: 15,
    color: "#2C3E50",
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  fieldLabel: {
    width: 120,
    fontSize: 15,
    color: "#2C3E50",
    fontWeight: "500",
  },
  fieldInput: {
    flex: 1,
  },
  dropdown: {
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#BDC3C7",
  },
  timesSection: {
    marginTop: 8,
  },
  timesSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 12,
  },
  dayTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    //backgroundColor: "#fff",
    padding: 8,
   // borderRadius: 8,
   // borderWidth: 1,
   // borderColor: "#BDC3C7",
  },
  dayLabel: {
    width: 100,
    fontSize: 15,
    color: "#2C3E50",
    fontWeight: "500",
  },
  timeInputs: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeSeparator: {
    fontSize: 16,
    color: "#2C3E50",
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ECF0F1",
    borderTopWidth: 1,
    borderTopColor: "#BDC3C7",
    gap: 12,
  },
  jumpButton: {
    flex: 1,
    backgroundColor: "#34495E",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButton: {
    flex: 1,
    backgroundColor: "#34495E",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});

