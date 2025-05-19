import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEvents } from '../context/EventContext';
import { toast } from 'sonner-native';

export default function ProfileScreen() {
  const { upcomingEvents, pastEvents } = useEvents();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  
  // User details
  const user = {
    name: 'G.Yuva Kishore Reddy',
    email: 'g.yuvakishorereddy@gmail.com',
    phone: '+91 9581440276',
    image: 'https://img.etimg.com/thumb/msid-104233524,width-640,height-480,imgsize-43518,resizemode-4/dhonis-head-turning-hairstyle.jpg'
  };

  const menuItems = [
    {
      icon: 'calendar',
      title: 'My Events',
      description: 'View all your past and upcoming events',
      count: upcomingEvents.length + pastEvents.length,
      action: () => toast.info('Viewing all events')
    },
    {
      icon: 'card',
      title: 'Payment Methods',
      description: 'Manage your payment options',
      action: () => toast.info('Managing payment methods')
    },
    {
      icon: 'notifications',
      title: 'Notifications',
      description: 'Configure your notification preferences',
      action: () => toast.info('Configuring notifications')
    },
    {
      icon: 'help-circle',
      title: 'Help & Support',
      description: 'Get assistance and find answers',
      action: () => toast.info('Getting help and support')
    },
    {
      icon: 'share-social',
      title: 'Invite Friends',
      description: 'Share the app with your friends',
      action: () => toast.info('Inviting friends')
    },
    {
      icon: 'settings',
      title: 'Settings',
      description: 'App settings and preferences',
      action: () => toast.info('Adjusting settings')
    }
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: () => toast.success('Logged out successfully'),
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => toast.info('Edit profile')}
        >
          <Ionicons name="create-outline" size={20} color="#FF4A87" />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Image source={{ uri: user.image }} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <Text style={styles.profilePhone}>{user.phone}</Text>
          </View>
        </View>
        
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{upcomingEvents.length}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{pastEvents.length}</Text>
            <Text style={styles.statLabel}>Past</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Packages</Text>
          </View>
        </View>
        
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem}
              onPress={item.action}
            >
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon} size={24} color="#FF4A87" />
              </View>
              <View style={styles.menuContent}>
                <View style={styles.menuHeader}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  {item.count && (
                    <View style={styles.menuBadge}>
                      <Text style={styles.menuBadgeText}>{item.count}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.preferencesSection}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceContent}>
              <View style={[styles.menuIcon, {backgroundColor: '#FFE0E9'}]}>
                <Ionicons name="notifications" size={24} color="#FF4A87" />
              </View>
              <View>
                <Text style={styles.preferenceTitle}>Push Notifications</Text>
                <Text style={styles.preferenceDescription}>Reminders and updates</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#E0E0E0', true: '#FFB6C1' }}
              thumbColor={notifications ? '#FF4A87' : '#FFFFFF'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceContent}>
              <View style={[styles.menuIcon, {backgroundColor: '#E0F4FF'}]}>
                <Ionicons name="mail" size={24} color="#4A90FF" />
              </View>
              <View>
                <Text style={styles.preferenceTitle}>Email Updates</Text>
                <Text style={styles.preferenceDescription}>Newsletters and offers</Text>
              </View>
            </View>
            <Switch
              value={emailUpdates}
              onValueChange={setEmailUpdates}
              trackColor={{ false: '#E0E0E0', true: '#B6D0FF' }}
              thumbColor={emailUpdates ? '#4A90FF' : '#FFFFFF'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF4A87" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
  },
  editButton: {
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 14,
    color: '#666666',
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  menuBadge: {
    backgroundColor: '#FF4A87',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  menuBadgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  menuDescription: {
    fontSize: 14,
    color: '#666666',
  },
  preferencesSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  preferenceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  preferenceDescription: {
    fontSize: 14,
    color: '#666666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF4A87',
    marginLeft: 8,
  },
  versionInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  versionText: {
    fontSize: 14,
    color: '#999999',
  },
});