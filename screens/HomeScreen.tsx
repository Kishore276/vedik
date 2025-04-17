import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ImageBackground,
  FlatList,
  Image,
  Dimensions,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/EventCard';
import UpcomingEventCard from '../components/UpcomingEventCard';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const { upcomingEvents, popularPackages } = useEvents();
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // In a real app, you would fetch new data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.name}>Kishore</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color="#FF4A87" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ImageBackground
          source={{ uri: 'https://api.a0.dev/assets/image?text=professional%20event%20planning%20celebration%20elegant&aspect=16:9' }}
          style={styles.heroBanner}
          imageStyle={styles.heroBannerImage}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
            style={styles.heroGradient}
          >
            <Text style={styles.heroTitle}>Turn Special Moments into Memories</Text>
            <Text style={styles.heroSubtitle}>Professional Event Planning Services</Text>
            <TouchableOpacity 
              style={styles.heroButton} 
              onPress={() => navigation.navigate('PlannerTab')}
            >
              <Text style={styles.heroButtonText}>Plan an Event</Text>
            </TouchableOpacity>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('RemindersTab')}
            >
              <View style={[styles.actionIcon, {backgroundColor: '#FFE0E9'}]}>
                <Ionicons name="calendar" size={24} color="#FF4A87" />
              </View>
              <Text style={styles.actionText}>Reminders</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('PlannerTab')}
            >
              <View style={[styles.actionIcon, {backgroundColor: '#E0F4FF'}]}>
                <Ionicons name="add-circle" size={24} color="#4A90FF" />
              </View>
              <Text style={styles.actionText}>New Event</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('VendorsTab')}
            >
              <View style={[styles.actionIcon, {backgroundColor: '#E6F8E6'}]}>
                <Ionicons name="business" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.actionText}>Vendors</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, {backgroundColor: '#FFF5E0'}]}>
                <MaterialIcons name="support-agent" size={24} color="#FF9800" />
              </View>
              <Text style={styles.actionText}>Support</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.upcomingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity onPress={() => navigation.navigate('RemindersTab')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {upcomingEvents.length > 0 ? (
            <FlatList
              data={upcomingEvents}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <UpcomingEventCard event={item} />
              )}
              contentContainerStyle={styles.upcomingList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#CCCCCC" />
              <Text style={styles.emptyStateText}>No upcoming events</Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => navigation.navigate('PlannerTab')}
              >
                <Text style={styles.emptyStateButtonText}>Create an Event</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.packagesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Packages</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {popularPackages.map((pkg) => (
            <EventCard key={pkg.id} event={pkg} />
          ))}
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  greeting: {
    fontSize: 16,
    color: '#666666',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
  },
  notificationButton: {
    position: 'relative',
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
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF4A87',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationCount: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  heroBanner: {
    height: 180,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  heroBannerImage: {
    borderRadius: 16,
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 12,
    opacity: 0.8,
  },
  heroButton: {
    backgroundColor: '#FF4A87',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  quickActions: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    width: (width - 32) / 4 - 8,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#333333',
    textAlign: 'center',
  },
  upcomingSection: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#FF4A87',
    fontWeight: '600',
  },
  upcomingList: {
    paddingRight: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 8,
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: '#FF4A87',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  packagesSection: {
    padding: 16,
    paddingTop: 0,
  },
});