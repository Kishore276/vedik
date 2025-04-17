import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useEvents } from '../context/EventContext';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { toast } from 'sonner-native';

export default function RemindersScreen() {
  const { reminders, addEvent } = useEvents();
  const navigation = useNavigation();
  const [filter, setFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  
  // New reminder state
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const filteredReminders = reminders
    .filter(reminder => {
      if (searchText) {
        return reminder.title.toLowerCase().includes(searchText.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getDateStatus = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const date = new Date(dateStr);
    const timeDiff = date.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysLeft < 0) return 'past';
    if (daysLeft === 0) return 'today';
    if (daysLeft <= 7) return 'upcoming';
    return 'future';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calculateTimeLeft = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const date = new Date(dateStr);
    const timeDiff = date.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysLeft < 0) return `₹{Math.abs(daysLeft)} days ago`;
    if (daysLeft === 0) return 'Today';
    if (daysLeft === 1) return 'Tomorrow';
    return `₹{daysLeft} days left`;
  };

  const handleAddReminder = () => {
    if (!newTitle.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const formattedDate = format(newDate, 'yyyy-MM-dd');
    
    addEvent({
      title: newTitle,
      date: formattedDate,
      type: 'Reminder',
      image: `https://api.a0.dev/assets/image?text=₹{encodeURIComponent(newTitle)}%20reminder&aspect=1:1`
    });
    
    toast.success('Reminder added successfully');
    setIsAddModalVisible(false);
    setNewTitle('');
    setNewDate(new Date());
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setNewDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reminders</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Ionicons name="add-circle" size={24} color="#FF4A87" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reminders..."
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#999999" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, filter === 'today' && styles.activeFilter]}
            onPress={() => setFilter('today')}
          >
            <Text style={[styles.filterText, filter === 'today' && styles.activeFilterText]}>
              Today
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, filter === 'upcoming' && styles.activeFilter]}
            onPress={() => setFilter('upcoming')}
          >
            <Text style={[styles.filterText, filter === 'upcoming' && styles.activeFilterText]}>
              This Week
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, filter === 'future' && styles.activeFilter]}
            onPress={() => setFilter('future')}
          >
            <Text style={[styles.filterText, filter === 'future' && styles.activeFilterText]}>
              Future
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, filter === 'past' && styles.activeFilter]}
            onPress={() => setFilter('past')}
          >
            <Text style={[styles.filterText, filter === 'past' && styles.activeFilterText]}>
              Past
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      {filteredReminders.length > 0 ? (
        <FlatList
          data={filteredReminders.filter(reminder => 
            filter === 'all' || getDateStatus(reminder.date) === filter
          )}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.reminderCard}
              onPress={() => {
                // Handle reminder tap
                toast.info(`Planning for ₹{item.title}`);
              }}
            >
              <Image source={{ uri: item.image }} style={styles.reminderImage} />
              <View style={styles.reminderContent}>
                <Text style={styles.reminderTitle}>{item.title}</Text>
                <Text style={styles.reminderDate}>{formatDate(item.date)}</Text>
                <View style={styles.reminderFooter}>
                  <Text 
                    style={[
                      styles.reminderDaysLeft,
                      getDateStatus(item.date) === 'past' && styles.pastDate,
                      getDateStatus(item.date) === 'today' && styles.todayDate,
                      getDateStatus(item.date) === 'upcoming' && styles.upcomingDate,
                    ]}
                  >
                    {calculateTimeLeft(item.date)}
                  </Text>
                  
                  <TouchableOpacity 
                    style={styles.planButton}
                    onPress={() => navigation.navigate('PlannerTab', { reminderDate: item.date })}
                  >
                    <Text style={styles.planButtonText}>Plan Event</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.remindersList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar" size={64} color="#E0E0E0" />
          <Text style={styles.emptyText}>No reminders found</Text>
          <Text style={styles.emptySubText}>
            Add reminders for birthdays, anniversaries, and other special occasions
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => setIsAddModalVisible(true)}
          >
            <Text style={styles.emptyButtonText}>Add Reminder</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Add Reminder Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Reminder</Text>
              <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Title</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter reminder title"
                value={newTitle}
                onChangeText={setNewTitle}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Date</Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text>{format(newDate, 'PPP')}</Text>
                <Ionicons name="calendar" size={20} color="#666666" />
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  value={newDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleAddReminder}
            >
              <Text style={styles.saveButtonText}>Save Reminder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  addButton: {
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
  searchContainer: {
    padding: 16,
    paddingTop: 0,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeFilter: {
    backgroundColor: '#FF4A87',
  },
  filterText: {
    color: '#666666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  remindersList: {
    padding: 16,
    paddingTop: 0,
  },
  reminderCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reminderImage: {
    width: 80,
    height: 80,
  },
  reminderContent: {
    flex: 1,
    padding: 12,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  reminderDate: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  reminderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderDaysLeft: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  pastDate: {
    color: '#999999',
  },
  todayDate: {
    color: '#FF9800',
  },
  upcomingDate: {
    color: '#4CAF50',
  },
  planButton: {
    backgroundColor: '#FF4A87',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  planButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#FF4A87',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
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
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
  },
  saveButton: {
    backgroundColor: '#FF4A87',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});