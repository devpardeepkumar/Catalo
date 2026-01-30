import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from '@/styles/components/EditStoreProfileModal';
import { BusinessHours, HolidayDate } from '@/types/componentsType';

interface StoreHoursStepProps {
  // State
  businessHours: BusinessHours[];
  holidayDates: HolidayDate[];
  showDatePicker: boolean;
  selectedHolidayDate: Date;
  holidayReason: string;

  // Handlers
  updateBusinessHour: (dayIndex: number, field: keyof BusinessHours, value: string | boolean) => void;
  setShowDatePicker: (show: boolean) => void;
  setSelectedHolidayDate: (date: Date) => void;
  setHolidayReason: (reason: string) => void;
  addHoliday: () => void;
  removeHoliday: (id: string) => void;
}

export const StoreHoursStep: React.FC<StoreHoursStepProps> = ({
  businessHours,
  holidayDates,
  showDatePicker,
  selectedHolidayDate,
  holidayReason,
  updateBusinessHour,
  setShowDatePicker,
  setSelectedHolidayDate,
  setHolidayReason,
  addHoliday,
  removeHoliday,
}) => {
  return (
    <>
      {/* Business Hours */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Hours</Text>
        {businessHours.map((hour, index) => (
          <View key={hour.day} style={styles.hourRow}>
            <Text style={styles.dayText}>{hour.day}</Text>
            <TouchableOpacity
              onPress={() => updateBusinessHour(index, 'isClosed', !hour.isClosed)}
              style={styles.checkbox}
            >
              <Ionicons
                name={hour.isClosed ? "checkbox" : "square-outline"}
                size={Platform.OS === "ios" ? 20 : 16}
                color="#34495E"
              />
              <Text style={styles.checkboxText}>Closed</Text>
            </TouchableOpacity>
            {!hour.isClosed && (
              <>
                <TextInput
                  style={styles.timeInput}
                  value={hour.openTime}
                  onChangeText={(value) => updateBusinessHour(index, 'openTime', value)}
                  placeholder="09:00"
                />
                <Text style={styles.toText}>to</Text>
                <TextInput
                  style={styles.timeInput}
                  value={hour.closeTime}
                  onChangeText={(value) => updateBusinessHour(index, 'closeTime', value)}
                  placeholder="18:00"
                />
              </>
            )}
          </View>
        ))}
      </View>

      {/* Holiday Dates */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Holiday & Closing Dates</Text>

        <View style={styles.addHolidayContainer}>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            <Ionicons name="calendar" size={Platform.OS === "ios" ? 20 : 16} color="#34495E" />
            <Text style={styles.dateButtonText}>
              {selectedHolidayDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          <TextInput
            style={styles.reasonInput}
            value={holidayReason}
            onChangeText={setHolidayReason}
            placeholder="Reason for closure"
          />

          <TouchableOpacity onPress={addHoliday} style={styles.addButton}>
            <Ionicons name="add" size={Platform.OS === "ios" ? 20 : 16} color="#fff" />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedHolidayDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) setSelectedHolidayDate(date);
            }}
            minimumDate={new Date()}
          />
        )}

        <View style={styles.holidaysList}>
          {holidayDates.map((holiday) => (
            <View key={holiday.id} style={styles.holidayItem}>
              <View style={styles.holidayInfo}>
                <Text style={styles.holidayDate}>
                  {holiday.date.toLocaleDateString()}
                </Text>
                <Text style={styles.holidayReason}>{holiday.reason}</Text>
              </View>
              <TouchableOpacity
                onPress={() => removeHoliday(holiday.id)}
                style={styles.removeButton}
              >
                <Ionicons name="trash" size={16} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </>
  );
};
