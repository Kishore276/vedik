import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useEvents } from '../context/EventContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { toast } from 'sonner-native';

export default function PlannerScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { addEvent } = useEvents();
  
  // Initialize with any date passed through route
  const initialDate = route.params?.reminderDate 
    ? new Date(route.params.reminderDate) 
    : new Date();
  
  // Form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('Birthday');
  const [guestCount, setGuestCount] = useState('');
  
  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Event types
  const eventTypes = [
    'Birthday', 'Wedding', 'Anniversary', 'Corporate', 
    'Holiday', 'Baby Shower', 'Graduation', 'Other'
  ];

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const validateFirstStep = () => {
    if (!title.trim()) {
      toast.error('Please enter an event title');
      return false;
    }
    return true;
  };

  const validateFinalStep = () => {
    if (!location.trim()) {
      toast.error('Please enter an event location');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateFirstStep()) return;
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateEvent = () => {
    if (!validateFinalStep()) return;
    
    setLoading(true);
    
    // Format date and time
    const formattedDate = format(date, 'yyyy-MM-dd');
    const formattedTime = format(time, 'h:mm a');
    
    // Create new event
    const newEvent = {
      title,
      date: formattedDate,
      time: formattedTime,
      location,
      description,
      type: eventType,
      image: `https://api.a0.dev/assets/image?text=₹{encodeURIComponent(eventType)}%20₹{encodeURIComponent(title)}&aspect=16:9`,
      status: 'Planning',
      guests: parseInt(guestCount) || 0
    };
    
    // Simulate API call
    setTimeout(() => {
      addEvent(newEvent);
      setLoading(false);
      toast.success('Event created successfully!');
      
      // Reset form
      setTitle('');
      setDate(new Date());
      setTime(new Date());
      setLocation('');
      setDescription('');
      setEventType('Birthday');
      setGuestCount('');
      setCurrentStep(1);
      
      // Navigate to home
      navigation.navigate('HomeTab');
    }, 1500);
  };

  // Render step indicators
  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicator}>
        {[1, 2, 3].map((step) => (
          <View key={step} style={styles.stepContainer}>
            <View 
              style={[
                styles.stepCircle, 
                currentStep === step && styles.activeStepCircle,
                currentStep > step && styles.completedStepCircle
              ]}
            >
              {currentStep > step ? (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              ) : (
                <Text 
                  style={[
                    styles.stepNumber, 
                    currentStep === step && styles.activeStepNumber
                  ]}
                >
                  {step}
                </Text>
              )}
            </View>
            {step < 3 && (
              <View 
                style={[
                  styles.stepLine, 
                  currentStep > step && styles.completedStepLine
                ]} 
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  // Render step 1 - Basic details
  const renderStep1 = () => {
    return (
      <>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Event Title</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter event title"
            value={title}
            onChangeText={setTitle}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Event Type</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.eventTypeContainer}
          >
            {eventTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.eventTypeButton,
                  eventType === type && styles.selectedEventType
                ]}
                onPress={() => setEventType(type)}
              >
                <Text 
                  style={[
                    styles.eventTypeText,
                    eventType === type && styles.selectedEventTypeText
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Date</Text>
          <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{format(date, 'PPP')}</Text>
            <Ionicons name="calendar" size={20} color="#666666" />
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Time</Text>
          <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text>{format(time, 'h:mm a')}</Text>
            <Ionicons name="time" size={20} color="#666666" />
          </TouchableOpacity>
          
          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </View>
      </>
    );
  };

  // Render step 2 - Location and description
  const renderStep2 = () => {
    return (
      <>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Location</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter event location"
            value={location}
            onChangeText={setLocation}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Number of Guests</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Estimated number of guests"
            value={guestCount}
            onChangeText={setGuestCount}
            keyboardType="number-pad"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Description</Text>
          <TextInput
            style={[styles.formInput, styles.textArea]}
            placeholder="Describe your event..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </>
    );
  };

  // Render step 3 - Summary
  const renderStep3 = () => {
    return (
      <View style={styles.summaryContainer}>
        <Image 
          source={{ 
            uri: `https://api.a0.dev/assets/image?text=₹{encodeURIComponent(eventType)}%20₹{encodeURIComponent(title)}&aspect=16:9`
          }} 
          style={styles.summaryImage}
        />
        
        <Text style={styles.summaryTitle}>{title}</Text>
        
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Ionicons name="calendar" size={20} color="#FF4A87" />
            <Text style={styles.summaryItemText}>{format(date, 'PPP')}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Ionicons name="time" size={20} color="#FF4A87" />
            <Text style={styles.summaryItemText}>{format(time, 'h:mm a')}</Text>
          </View>
        </View>
        
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Ionicons name="location" size={20} color="#FF4A87" />
            <Text style={styles.summaryItemText}>{location || 'No location set'}</Text>
          </View>
        </View>
        
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <MaterialIcons name="category" size={20} color="#FF4A87" />
            <Text style={styles.summaryItemText}>{eventType}</Text>
          </View>
          
          {guestCount && (
            <View style={styles.summaryItem}>
              <Ionicons name="people" size={20} color="#FF4A87" />
              <Text style={styles.summaryItemText}>{guestCount} Guests</Text>
            </View>
          )}
        </View>
        
        {description && (
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionLabel}>Description:</Text>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New Event</Text>
          <View style={{ width: 40 }} />
        </View>
        
        {renderStepIndicator()}
        
        <ScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </ScrollView>
        
        <View style={styles.buttonContainer}>
          {currentStep > 1 && (
            <TouchableOpacity 
              style={styles.backStepButton}
              onPress={handlePreviousStep}
            >
              <Text style={styles.backStepButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          {currentStep < 3 ? (
            <TouchableOpacity 
              style={styles.nextStepButton}
              onPress={handleNextStep}
            >
              <Text style={styles.nextStepButtonText}>
                {currentStep === 2 ? 'Review' : 'Next'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.createButton, loading && styles.loadingButton]}
              onPress={handleCreateEvent}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.createButtonText}>Creating...</Text>
              ) : (
                <Text style={styles.createButtonText}>Create Event</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeStepCircle: {
    backgroundColor: '#FF4A87',
    borderColor: '#FF4A87',
  },
  completedStepCircle: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666666',
  },
  activeStepNumber: {
    color: '#FFFFFF',
  },
  stepLine: {
    width: 50,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  completedStepLine: {
    backgroundColor: '#4CAF50',
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  eventTypeContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  eventTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedEventType: {
    backgroundColor: '#FF4A87',
    borderColor: '#FF4A87',
  },
  eventTypeText: {
    color: '#666666',
    fontWeight: '500',
  },
  selectedEventTypeText: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  backStepButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#FF4A87',
    marginRight: 12,
  },
  backStepButtonText: {
    color: '#FF4A87',
    fontWeight: 'bold',
    fontSize: 16,
  },
  nextStepButton: {
    flex: 1,
    backgroundColor: '#FF4A87',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
  },
  nextStepButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  createButton: {
    flex: 1,
    backgroundColor: '#FF4A87',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
  },
  loadingButton: {
    backgroundColor: '#FFACCA',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryImage: {
    width: '100%',
    height: 160,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    padding: 16,
    paddingBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItemText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666666',
  },
  descriptionBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 0,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});