import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList, Image, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Shared app data
const appData = [
  { label: 'Ziidi', icon: require('../assets/ziidi.png') },
  { label: 'Mali', icon: require('../assets/Mali.png') },
  { label: 'M-Shwari', icon: require('../assets/mshwari.png') },
  { label: 'KCB M-PESA', icon: require('../assets/kcb.png') },
  { label: 'Business', icon: require('../assets/business.jpg') },
  { label: 'Insurance', icon: require('../assets/insurance.jpg') },
  { label: 'Loans', icon: require('../assets/loan.png') },
  { label: 'Savings', icon: require('../assets/savings.jpg') },
];

// Sample transaction data
const sampleTransactions = [
  { id: '1', name: 'CHICKEN STORE', date: '24 May, 07:44 PM', amount: '- KSH. 170.00', initials: 'CS' },
  { id: '2', name: 'MINISO', date: '24 May, 05:15 PM', amount: '- KSH. 450.00', initials: 'MI' },
];

// Reusable App Grid Component
const AppGridSection = ({ title, apps, showViewAll = true }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {showViewAll && (
        <TouchableOpacity onPress={() => Alert.alert('View all', 'This feature is coming soon.')}>
          <Text style={styles.seeAll}>View all</Text>
        </TouchableOpacity>
      )}
    </View>
    <View style={styles.appsRow}>
      {apps.map((app, index) => (
        <TouchableOpacity 
          key={`${app.label}-${index}`} 
          style={styles.appIconContainer}
          onPress={() => Alert.alert(app.label, 'This service is coming soon.')}
        >
          <Image source={app.icon} style={styles.appIcon} />
          <Text style={styles.appLabel}>{app.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// Balance Section Component
export const BalanceSection = ({ balance = 0.0, fuliza = 0.0 }) => {
  const [hidden, setHidden] = useState(false);

  return (
    <View style={styles.balanceCard}>
      <Text style={styles.balanceLabel}>Balance</Text>
      <View style={styles.balanceRow}>
        <Text style={styles.currency}>Ksh. </Text>
        <Text style={styles.amount}>
          {hidden ? '•••••' : balance.toFixed(2)}
        </Text>
        <TouchableOpacity
          onPress={() => setHidden(!hidden)}
          style={styles.eyeButton}
        >
          <MaterialIcons
            name={hidden ? 'visibility-off' : 'visibility'}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.fuliza}>
        Available FULIZA: Ksh {fuliza.toFixed(2)}
      </Text>
    </View>
  );
};

// Quick Actions Component
export const QuickActions = () => {
  const actions = [
    { icon: 'sync-alt', label: 'Send and Request' },
    { icon: 'payment', label: 'Pay' },
    { icon: 'arrow-downward', label: 'Withdraw' },
    { icon: 'smartphone', label: 'Airtime' },
  ];

  const handleAction = (label) => {
    Alert.alert(label, 'This feature is coming soon.');
  };

  return (
    <View style={styles.actionsRow}>
      {actions.map(({ icon, label }) => (
        <TouchableOpacity
          key={label}
          style={styles.action}
          onPress={() => handleAction(label)}
        >
          <MaterialIcons name={icon} size={28} color="#00acee" />
          <Text style={styles.actionLabel}>{label.toUpperCase()}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Transactions Section Component
export const TransactionsSection = ({ transactions = sampleTransactions }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>M-PESA STATEMENTS</Text>
      <TouchableOpacity onPress={() => Alert.alert('See All', 'This feature is coming soon.')}>
        <Text style={styles.seeAll}>SEE ALL</Text>
      </TouchableOpacity>
    </View>
    {transactions.map((transaction) => (
      <TouchableOpacity
        key={transaction.id}
        style={styles.transactionRow}
        onPress={() => Alert.alert(transaction.name, 'Transaction details coming soon.')}
      >
        <View style={styles.transactionLeft}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{transaction.initials}</Text>
          </View>
          <View>
            <Text style={styles.storeName}>{transaction.name}</Text>
            <Text style={styles.transactionDate}>{transaction.date}</Text>
          </View>
        </View>
        <Text style={styles.transactionAmount}>{transaction.amount}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

// Ad Carousel Component
export const AdCarousel = () => (
  <FlatList
    horizontal
    showsHorizontalScrollIndicator={false}
    data={[1, 2, 3, 4]}
    keyExtractor={(item) => item.toString()}
    renderItem={({ item }) => (
      <TouchableOpacity 
        style={styles.adCard}
        onPress={() => Alert.alert(`Ad ${item}`, 'This promotion is coming soon.')}
      >
        <Text style={styles.adText}>Promotion {item}</Text>
        <Text style={styles.adSubtext}>Tap to learn more</Text>
      </TouchableOpacity>
    )}
    contentContainerStyle={styles.adSlider}
  />
);

// Bottom Navigation Component
export const BottomNavigator = ({ active = 'HOME', onNavigate = () => {} }) => {
  const items = [
    { icon: 'home', label: 'HOME' },
    { icon: 'sync-alt', label: 'TRANSACT' },
    { icon: 'apps', label: 'SERVICES' },
    { icon: 'bar-chart', label: 'GROW' },
  ];

  return (
    <View style={styles.bottomNav}>
      {items.map(({ icon, label }) => (
        <TouchableOpacity
          key={label}
          style={styles.navItem}
          onPress={() => onNavigate(label)}
        >
          <MaterialIcons
            name={icon}
            size={24}
            color={active === label ? '#00cc66' : '#ccc'}
          />
          <Text
            style={[
              styles.navLabel,
              { color: active === label ? '#00cc66' : '#ccc' },
            ]}
          >
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Main Screen Component
export const MainScreen = ({ 
  balance = 1250.50, 
  fuliza = 500.00, 
  activeTab = 'HOME',
  onNavigate = () => {} 
}) => {
  // Group apps into rows of 4
  const groupedApps = [];
  for (let i = 0; i < appData.length; i += 4) {
    groupedApps.push(appData.slice(i, i + 4));
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollWrapper} contentContainerStyle={styles.scrollContent}>
        {/* Balance Section */}
        <BalanceSection balance={balance} fuliza={fuliza} />
        
        {/* Quick Actions */}
        <QuickActions />
        
        {/* Transactions */}
        <TransactionsSection />
        
        {/* Ad Carousel */}
        <AdCarousel />
        
        {/* App Grid Sections */}
        {groupedApps.map((apps, index) => (
          <AppGridSection
            key={index}
            title={index === 0 ? 'Financial Services' : 'More Services'}
            apps={apps}
          />
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigator active={activeTab} onNavigate={onNavigate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollWrapper: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  // Balance Section Styles
  balanceCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  balanceLabel: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currency: {
    color: '#fff',
    fontSize: 24,
  },
  amount: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  eyeButton: {
    marginLeft: 8,
  },
  fuliza: {
    color: '#4da6ff',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  // Quick Actions Styles
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  action: {
    alignItems: 'center',
  },
  actionLabel: {
    color: '#fff',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  // Section Styles
  sectionContainer: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: '600',
  },
  seeAll: {
    color: '#00cc66',
    fontWeight: '500',
  },
  // Transaction Styles
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    backgroundColor: '#ccc',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#000',
    fontWeight: 'bold',
  },
  storeName: {
    color: '#fff',
    fontWeight: '500',
  },
  transactionDate: {
    color: '#aaa',
    fontSize: 12,
  },
  transactionAmount: {
    color: '#fff',
    fontWeight: '600',
  },
  // Ad Carousel Styles
  adSlider: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  adCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    width: 280,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    padding: 16,
  },
  adText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  adSubtext: {
    color: '#aaa',
    fontSize: 12,
  },
  // App Grid Styles
  appsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  appIconContainer: {
    alignItems: 'center',
    width: 64,
  },
  appIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 6,
  },
  appLabel: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  // Bottom Navigation Styles
  bottomNav: {
    height: 60,
    backgroundColor: '#1e1e1e',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopColor: '#333',
    borderTopWidth: 1,
  },
  navItem: {
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 10,
    marginTop: 2,
  },
});