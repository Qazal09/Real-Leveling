import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { toast } from 'sonner-native';

const AdminScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [mockUsers, setMockUsers] = useState([
    { id: 1, name: 'Hunter_A', email: 'hunter_a@example.com', role: 'player', status: 'active' },
    { id: 2, name: 'Hunter_B', email: 'hunter_b@example.com', role: 'player', status: 'active' },
    { id: 3, name: 'Admin_User', email: 'donebro50@gmail.com', role: 'admin', status: 'active' },
    { id: 4, name: 'Banned_User', email: 'banned@example.com', role: 'player', status: 'banned' },
  ]);

  const [mockQuests, setMockQuests] = useState([
    { id: 1, title: 'Daily Training', status: 'active', reward: 100 },
    { id: 2, title: 'Arena Champion', status: 'active', reward: 150 },
    { id: 3, title: 'New Quest', status: 'pending', reward: 200 },
  ]);

  const [mockShopItems, setMockShopItems] = useState([
    { id: 1, name: 'Health Potion', price: 100, stock: 50 },
    { id: 2, name: 'Steel Sword', price: 500, stock: 10 },
    { id: 3, name: 'Magic Tome', price: 800, stock: 5 },
  ]);

  const [appSettings, setAppSettings] = useState({
    maintenanceMode: false,
    newRegistrations: true,
    pvpEnabled: true,
  });

  const [notificationMessage, setNotificationMessage] = useState('');
  const [mockLogs, setMockLogs] = useState([
    { id: 1, type: 'Activity', message: 'Admin_User logged in', timestamp: '2025-06-16 10:00' },
    { id: 2, type: 'Error', message: 'Failed to load asset', timestamp: '2025-06-16 09:30' },
    { id: 3, type: 'Activity', message: 'Hunter_A completed quest', timestamp: '2025-06-16 08:45' },
  ]);

  const [mockTickets, setMockTickets] = useState([
    { id: 1, subject: 'Cannot log in', status: 'open' },
    { id: 2, subject: 'Bug report: Quest not completing', status: 'closed' },
  ]);

  useEffect(() => {
    if (isFocused && !global.isAdmin) {
      toast.error('Unauthorized access. Please log in as an admin.');
      navigation.navigate('Login');
    }
  }, [isFocused, global.isAdmin, navigation]);

  if (!global.isAdmin) {
    return null; // Don't render anything if not admin, effect will redirect
  }

  const handleUserAction = (action: string, user: any) => {
    toast.info(`Performing ${action} on ${user.name}`);
    // In a real app, this would call an API to update user status
    if (action === 'ban' || action === 'unban') {
      setMockUsers(prevUsers =>
        prevUsers.map(u =>
          u.id === user.id ? { ...u, status: u.status === 'banned' ? 'active' : 'banned' } : u
        )
      );
      toast.success(`${user.name} status updated!`);
    } else {
      toast.info(`Feature for ${action} ${user.name} is not fully implemented yet.`);
    }
  };

  const handleContentAction = (type: string, action: string, item: any) => {
    toast.info(`Performing ${action} on ${item.title || item.name} in ${type}`);
    // In a real app, this would call an API to update content
  };

  const handleSettingToggle = (setting: keyof typeof appSettings) => {
    setAppSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
    toast.success(`${setting} toggled!`);
  };

  const sendNotification = () => {
    if (notificationMessage.trim() === '') {
      toast.error('Notification message cannot be empty.');
      return;
    }
    toast.success(`Notification sent: "${notificationMessage}"`);
    setNotificationMessage('');
    // In a real app, this would trigger a push notification service
  };

  const handleSecurityAction = (action: string) => {
    toast.info(`Security action: ${action} triggered! (Mocked)`);
  };

  const handleSupportAction = (action: string, ticket?: any) => {
    toast.info(`Support action: ${action} on ticket ${ticket?.id || 'N/A'} (Mocked)`);
  };

  return (
    <LinearGradient colors={['#1a1a2e', '16213e']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#8A2BE2" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.title}>Admin Panel</Text>

        {/* User Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Management</Text>
          <Pressable style={styles.adminButton} onPress={() => toast.info('Displaying user list...')}>
            <MaterialCommunityIcons name="account-group" size={24} color="#fff" />
            <Text style={styles.adminButtonText}>View/Manage Users</Text>
          </Pressable>
          {mockUsers.map(user => (
            <View key={user.id} style={styles.userItem}>
              <Text style={styles.userItemText}>{user.name} ({user.email}) - {user.status}</Text>
              <View style={styles.userActions}>
                <Pressable onPress={() => handleUserAction('edit', user)} style={styles.actionButton}>
                  <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
                </Pressable>
                <Pressable onPress={() => handleUserAction('delete', user)} style={styles.actionButton}>
                  <MaterialCommunityIcons name="delete" size={20} color="#fff" />
                </Pressable>
                <Pressable 
                  onPress={() => handleUserAction(user.status === 'banned' ? 'unban' : 'ban', user)}
                  style={[styles.actionButton, user.status === 'banned' ? styles.unbanButton : styles.banButton]}
                >
                  <MaterialCommunityIcons 
                    name={user.status === 'banned' ? 'check-circle' : 'cancel'} 
                    size={20} 
                    color="#fff" 
                  />
                </Pressable>
              </View>
            </View>
          ))}

          <Pressable style={styles.adminButton} onPress={() => toast.info('User Role Control Coming Soon!')}>
            <MaterialCommunityIcons name="account-key" size={24} color="#fff" />
            <Text style={styles.adminButtonText}>User Role & Permissions</Text>
          </Pressable>
        </View>

        {/* Content Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Management</Text>
          <Pressable style={styles.adminButton} onPress={() => toast.info('Displaying quests...')}>
            <MaterialCommunityIcons name="clipboard-list" size={24} color="#fff" />
            <Text style={styles.adminButtonText}>Manage Quests</Text>
          </Pressable>
          {mockQuests.map(quest => (
            <View key={quest.id} style={styles.contentItem}>
              <Text style={styles.contentItemText}>{quest.title} (Reward: {quest.reward}) - {quest.status}</Text>
              <View style={styles.contentActions}>
                <Pressable onPress={() => handleContentAction('quest', 'edit', quest)} style={styles.actionButton}>
                  <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
                </Pressable>
                <Pressable onPress={() => handleContentAction('quest', 'delete', quest)} style={styles.actionButton}>
                  <MaterialCommunityIcons name="delete" size={20} color="#fff" />
                </Pressable>
              </View>
            </View>
          ))}
          <Pressable style={styles.adminButton} onPress={() => toast.info('Manage Shop Items Coming Soon!')}>
            <MaterialCommunityIcons name="cart" size={24} color="#fff" />
            <Text style={styles.adminButtonText}>Manage Shop Items</Text>
          </Pressable>
          {mockShopItems.map(item => (
            <View key={item.id} style={styles.contentItem}>
              <Text style={styles.contentItemText}>{item.name} (Price: {item.price}, Stock: {item.stock})</Text>
              <View style={styles.contentActions}>
                <Pressable onPress={() => handleContentAction('shop', 'edit', item)} style={styles.actionButton}>
                  <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
                </Pressable>
                <Pressable onPress={() => handleContentAction('shop', 'delete', item)} style={styles.actionButton}>
                  <MaterialCommunityIcons name="delete" size={20} color="#fff" />
                </Pressable>
              </View>
            </View>
          ))}

          <Pressable style={styles.adminButton} onPress={() => toast.info('Media Manager Coming Soon!')}>
            <MaterialCommunityIcons name="image-multiple" size={24} color="#fff" />
            <Text style={styles.adminButtonText}>Media File Manager</Text>
          </Pressable>
        </View>

        {/* Analytics Dashboard Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analytics Dashboard</Text>
          <View style={styles.analyticsItem}>
            <MaterialCommunityIcons name="account-multiple" size={20} color="#fff" />
            <Text style={styles.analyticsText}>Total Users: {mockUsers.length}</Text>
          </View>
          <View style={styles.analyticsItem}>
            <MaterialCommunityIcons name="chart-bar" size={20} color="#fff" />
            <Text style={styles.analyticsText}>Active Quests: {mockQuests.filter(q => q.status === 'active').length}</Text>
          </View>
          <View style={styles.analyticsItem}>
            <MaterialCommunityIcons name="currency-usd" size={20} color="#fff" />
            <Text style={styles.analyticsText}>Total Shop Items: {mockShopItems.length}</Text>
          </View>
          <Pressable style={styles.adminButton} onPress={() => toast.info('User Growth Metrics Coming Soon!')}> 
            <MaterialCommunityIcons name="chart-line" size={24} color="#fff" />
            <Text style={styles.adminButtonText}>User Growth & Retention</Text>
          </Pressable>
          <Pressable style={styles.adminButton} onPress={() => toast.info('Engagement Stats Coming Soon!')}>
            <MaterialCommunityIcons name="chart-areaspline" size={24} color="#fff" />
            <Text style={styles.adminButtonText}>Engagement Stats</Text>
          </Pressable>
        </View>

        {/* Notifications Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications Management</Text>
          <TextInput
            style={styles.notificationInput}
            placeholder="Enter notification message"
            placeholderTextColor="#666"
            value={notificationMessage}
            onChangeText={setNotificationMessage}
            multiline
          />
          <Pressable style={styles.adminButton} onPress={sendNotification}>
            <MaterialCommunityIcons name="bell-ring" size={24} color="#fff" />
            <Text style={styles.adminButtonText}>Send Notifications</Text>
          </Pressable>
          <Pressable style={styles.adminButton} onPress={() => toast.info('Notification Templates Coming Soon!')}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="#fff" />
            <Text style={styles.adminButtonText}>Manage Templates</Text>
          </Pressable>
        </View>

        {/* Moderation Tools Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Moderation Tools</Text>
          <Pressable style={styles.adminButton} onPress={() => toast.info('Flagged Content Review Coming Soon!')}> 
            <MaterialCommunityIcons name="flag" size={24} color="#fff" />
            <Text style={styles.adminButtonText}>Flagged Content Review</Text>
          </Pressable>
          <Pressable style={styles.adminButton} onPress={() => toast.info('Reported User Review Coming Soon!')}>
            <MaterialCommunityIcons name="alert-circle" size={24} color="#fff" />
            <Text style={styles.adminButtonText}>Reported User/Content</Text>
          </Pressable>
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <Pressable style={styles.adminButton} onPress={() => handleSettingToggle('maintenanceMode')}>
            <MaterialCommunityIcons 
              name={appSettings.maintenanceMode ? 'toggle-switch' : 'toggle-switch-off'} 
              size={24} 
              color="#fff" 
            />
            <Text style={styles.adminButtonText}>Maintenance Mode: {appSettings.maintenanceMode ? 'On' : 'Off'}</Text>
          </Pressable>
          <Pressable style={styles.adminButton} onPress={() => handleSettingToggle('newRegistrations')}>
            <MaterialCommunityIcons 
              name={appSettings.newRegistrations ? 'toggle-switch' : 'toggle-switch-off'} 
              size={24} 
              color="#fff" 
            />
            <Text style={styles.adminButtonText}>New Registrations: {appSettings.newRegistrations ? 'Open' : 'Closed'}</Text>
          </Pressable>
          <Pressable style={styles.adminButton} onPress={() => handleSettingToggle('pvpEnabled')}>
            <MaterialCommunityIcons 
              name={appSettings.pvpEnabled ? 'toggle-switch' : 'toggle-switch-off'} 
              size={24} 
              color="#fff" 
            />
            <Text style={styles.adminButtonText}>PvP Enabled: {appSettings.pvpEnabled ? 'Yes' : 'No'}</Text>
          </Pressable>
          <Pressable style={styles.adminButton} onPress={() => toast.info('General Settings Coming Soon!')}> 
            <MaterialCommunityIcons name="cog" size={24} color="#fff" />
            <Text style={styles.adminButtonText}>General Settings</Text>
          </Pressable>
        </View>

        {/* Logs & Audit Trail Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Logs & Audit Trail</Text>
          {mockLogs.map(log => (
            <View key={log.id} style={styles.logItem}>
              <Text style={styles.logItemText}>[{log.timestamp}] {log.type}: {log.message}</Text>
            </View>
          ))}
          <Pressable style={styles.adminButton} onPress={() => toast.info('Activity Logs Coming Soon!')}> 
            <MaterialCommunityIcons name="history" size={24} color="#fff" />
            <Text style={styles.adminButtonText}>Activity Logs</Text>
          </Pressable>
          <Pressable style={styles.adminButton} onPress={() => toast.info('Error Logs Coming Soon!')}>
            <MaterialCommunityIcons name="bug" size={24} color="#fff" />
            <Text style={styles.adminButtonText}>Error Logs</Text>
          </Pressable>
        </View>

        {/* Support Tools Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support Tools</Text>
          {mockTickets.map(ticket => (
            <View key={ticket.id} style={styles.ticketItem}>
              <Text style={styles.ticketItemText}>Ticket #{ticket.id}: {ticket.subject} - {ticket.status}</Text>
              <View style={styles.ticketActions}>
                <Pressable onPress={() => handleSupportAction('view', ticket)} style={styles.actionButton}>
                  <MaterialCommunityIcons name="eye" size={20} color="#fff" />
                </Pressable>
                <Pressable onPress={() => handleSupportAction('close', ticket)} style={styles.actionButton}>
                  <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
                </Pressable>
              </View>
            </View>
          ))}
          <Pressable style={styles.adminButton} onPress={() => toast.info('Support Ticketing Coming Soon!')}> 
            <MaterialCommunityIcons name="lifebuoy" size={24} color="#fff" />
            <Text style={styles.adminButtonText}>Support Ticketing</Text>
          </Pressable>
          <Pressable style={styles.adminButton} onPress={() => toast.info('FAQ Editor Coming Soon!')}>
            <MaterialCommunityIcons name="help-circle" size={24} color="#fff" />
            <Text style={styles.adminButtonText}>FAQ & Help Center</Text>
          </Pressable>
        </View>

        {/* Security Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Settings</Text>
          <Pressable style={styles.adminButton} onPress={() => handleSecurityAction('2FA')}> 
            <MaterialCommunityIcons name="shield-lock" size={24} color="#fff" />
            <Text style={styles.adminButtonText}>Two-Factor Auth</Text>
          </Pressable>
          <Pressable style={styles.adminButton} onPress={() => handleSecurityAction('IP Whitelisting')}> 
            <MaterialCommunityIcons name="ip-network" size={24} color="#fff" />
            <Text style={styles.adminButtonText}>IP Whitelisting/Blacklisting</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20, // Add padding to the bottom of the scroll view
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginTop: 30,
  },
  backText: {
    color: '#8A2BE2',
    fontSize: 16,
    marginLeft: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8A2BE2',
    textAlign: 'center',
    marginVertical: 20,
    textShadowColor: 'rgba(138, 43, 226, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  section: {
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(138, 43, 226, 0.3)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  userItemText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  userActions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  actionButton: {
    padding: 5,
    marginLeft: 5,
    borderRadius: 5,
    backgroundColor: '#8A2BE2',
  },
  banButton: {
    backgroundColor: '#dc3545', // Red for ban
  },
  unbanButton: {
    backgroundColor: '#28a745', // Green for unban
  },
  contentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  contentItemText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  contentActions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  analyticsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  analyticsText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 10,
  },
  notificationInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#8A2BE2',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  logItem: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#555',
  },
  logItemText: {
    color: '#ccc',
    fontSize: 12,
  },
  ticketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  ticketItemText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  ticketActions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
});

export default AdminScreen;