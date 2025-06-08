import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  TextInput,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Sample contacts data
const sampleContacts = [
  { id: '1', name: 'John Doe', phone: '+254712345678', initials: 'JD' },
  { id: '2', name: 'Jane Smith', phone: '+254723456789', initials: 'JS' },
  { id: '3', name: 'Mike Johnson', phone: '+254734567890', initials: 'MJ' },
  { id: '4', name: 'Sarah Wilson', phone: '+254745678901', initials: 'SW' },
  { id: '5', name: 'David Brown', phone: '+254756789012', initials: 'DB' },
  { id: '6', name: 'Lisa Davis', phone: '+254767890123', initials: 'LD' },
  { id: '7', name: 'John Doe', phone: '+254712345678', initials: 'JD' },
  { id: '8', name: 'Jane Smith', phone: '+254723456789', initials: 'JS' },
  { id: '9', name: 'Mike Johnson', phone: '+254734567890', initials: 'MJ' },
  { id: '10', name: 'Sarah Wilson', phone: '+254745678901', initials: 'SW' },
  { id: '11', name: 'David Brown', phone: '+254756789012', initials: 'DB' },
  { id: '12', name: 'Lisa Davis', phone: '+254767890123', initials: 'LD' },
];

// Updated PaymentMenu Component
export const PaymentMenu = ({ visible, onClose }) => {
  const [currentStep, setCurrentStep] = useState('menu'); // menu, tillEntry, splitOption, contactSelection, amountAdjustment, confirmation
  const [paymentType, setPaymentType] = useState('');
  const [tillNumber, setTillNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [splitBill, setSplitBill] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [paymentSplits, setPaymentSplits] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(''); // 'individual' or 'consolidate'

  const paymentOptions = [
    { icon: 'receipt', label: 'PAY BILL', type: 'paybill' },
    { icon: 'shopping-cart', label: 'BUY GOODS', type: 'buygoods' },
    { icon: 'smartphone', label: 'POCHI LA BIASHARA' },
    { icon: 'credit-card', label: 'GLOBAL PAY' },
    { icon: 'qr-code-scanner', label: 'SCAN QR' },
  ];

  const resetState = () => {
    setCurrentStep('menu');
    setPaymentType('');
    setTillNumber('');
    setBusinessName('');
    setTotalAmount('');
    setSplitBill(false);
    setSelectedContacts([]);
    setPaymentSplits([]);
    setPaymentMethod('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handlePaymentOption = (option) => {
    if (option.type === 'paybill' || option.type === 'buygoods') {
      setPaymentType(option.type);
      setCurrentStep('tillEntry');
    } else {
      handleClose();
      Alert.alert(option.label, 'This payment option is coming soon.');
    }
  };

  const handleTillSubmit = () => {
    if (!tillNumber.trim()) {
      Alert.alert('Error', 'Please enter till/paybill number');
      return;
    }
    if (!totalAmount.trim()) {
      Alert.alert('Error', 'Please enter amount');
      return;
    }
    
    // Simulate fetching business name
    setBusinessName(paymentType === 'paybill' ? 'KENYA POWER' : 'CHICKEN STORE');
    setCurrentStep('splitOption');
  };

  const handleSplitOption = (split) => {
    setSplitBill(split);
    if (split) {
      setCurrentStep('contactSelection');
    } else {
      // Direct payment without splitting
      setCurrentStep('confirmation');
    }
  };

  const toggleContactSelection = (contact) => {
    const isSelected = selectedContacts.find(c => c.id === contact.id);
    if (isSelected) {
      setSelectedContacts(selectedContacts.filter(c => c.id !== contact.id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const handleContactSelectionNext = () => {
    if (selectedContacts.length === 0) {
      Alert.alert('Error', 'Please select at least one contact');
      return;
    }
    
    // Initialize payment splits with equal amounts
    const amount = parseFloat(totalAmount);
    const splitAmount = (amount / (selectedContacts.length + 1)).toFixed(2); // +1 for current user
    
    const splits = [
      { id: 'me', name: 'You', amount: splitAmount, isMe: true },
      ...selectedContacts.map(contact => ({
        ...contact,
        amount: splitAmount,
        isMe: false,
      }))
    ];
    
    setPaymentSplits(splits);
    setCurrentStep('amountAdjustment');
  };

  const updateSplitAmount = (id, newAmount) => {
    setPaymentSplits(paymentSplits.map(split => 
      split.id === id ? { ...split, amount: newAmount } : split
    ));
  };

  const getTotalSplitAmount = () => {
    return paymentSplits.reduce((total, split) => total + parseFloat(split.amount || 0), 0).toFixed(2);
  };

  const handleAmountAdjustmentNext = () => {
    const totalSplit = parseFloat(getTotalSplitAmount());
    const originalAmount = parseFloat(totalAmount);
    
    if (Math.abs(totalSplit - originalAmount) > 0.01) {
      Alert.alert('Error', `Total split amount (${totalSplit}) doesn't match original amount (${originalAmount})`);
      return;
    }
    
    setCurrentStep('paymentMethod');
  };

  const handlePaymentMethodSelection = (method) => {
    setPaymentMethod(method);
    setCurrentStep('confirmation');
  };

  const handleFinalConfirmation = () => {
    // Here you would integrate with M-Pesa SDK
    Alert.alert(
      'Payment Initiated',
      `Payment request sent to ${splitBill ? selectedContacts.length + ' contacts' : 'you'}`,
      [
        {
          text: 'OK',
          onPress: handleClose,
        }
      ]
    );
  };

  const renderPaymentMenu = () => (
    <View style={styles.modalContent}>
      <View style={styles.indicator} />
      <Text style={styles.title}>PAY</Text>
      <View style={styles.optionsContainer}>
        {paymentOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.paymentOption}
            onPress={() => handlePaymentOption(option)}>
            <View style={styles.iconContainer}>
              <MaterialIcons name={option.icon} size={24} color="white" />
            </View>
            <Text style={styles.optionLabel}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderTillEntry = () => (
    <View style={styles.modalContent}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentStep('menu')}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{paymentType === 'paybill' ? 'PAY BILL' : 'BUY GOODS'}</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          {paymentType === 'paybill' ? 'Business Number' : 'Till Number'}
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder={paymentType === 'paybill' ? 'Enter paybill number' : 'Enter till number'}
          placeholderTextColor="#666"
          value={tillNumber}
          onChangeText={setTillNumber}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Amount (KSH)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter amount"
          placeholderTextColor="#666"
          value={totalAmount}
          onChangeText={setTotalAmount}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleTillSubmit}>
        <Text style={styles.nextButtonText}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSplitOption = () => (
    <View style={styles.modalContent}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentStep('tillEntry')}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Payment Option</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.businessInfo}>
        <Text style={styles.businessName}>{businessName}</Text>
        <Text style={styles.amount}>KSH {totalAmount}</Text>
      </View>

      <Text style={styles.sectionTitle}>How would you like to pay?</Text>

      <TouchableOpacity 
        style={styles.splitOptionButton} 
        onPress={() => handleSplitOption(false)}>
        <MaterialIcons name="person" size={24} color="#00acee" />
        <View style={styles.splitOptionText}>
          <Text style={styles.splitOptionTitle}>Pay Alone</Text>
          <Text style={styles.splitOptionSubtitle}>Pay the full amount yourself</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#666" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.splitOptionButton} 
        onPress={() => handleSplitOption(true)}>
        <MaterialIcons name="group" size={24} color="#00acee" />
        <View style={styles.splitOptionText}>
          <Text style={styles.splitOptionTitle}>Split Bill</Text>
          <Text style={styles.splitOptionSubtitle}>Share payment with contacts</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );

  const renderContactSelection = () => (
    <View style={styles.modalContent}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentStep('splitOption')}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Select Contacts</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.sectionSubtitle}>
        Selected: {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''}
      </Text>

      <ScrollView style={styles.contactsList}>
        {sampleContacts.map((contact) => {
          const isSelected = selectedContacts.find(c => c.id === contact.id);
          return (
            <TouchableOpacity
              key={contact.id}
              style={[styles.contactItem, isSelected && styles.contactItemSelected]}
              onPress={() => toggleContactSelection(contact)}>
              <View style={styles.contactAvatar}>
                <Text style={styles.contactInitials}>{contact.initials}</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
              </View>
              {isSelected && (
                <MaterialIcons name="check-circle" size={24} color="#00cc66" />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.nextButton} onPress={handleContactSelectionNext}>
        <Text style={styles.nextButtonText}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAmountAdjustment = () => (
    <View style={styles.modalContent}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentStep('contactSelection')}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Adjust Amounts</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.totalSection}>
        <Text style={styles.totalLabel}>Total: KSH {totalAmount}</Text>
        <Text style={styles.splitTotal}>Split Total: KSH {getTotalSplitAmount()}</Text>
      </View>

      <ScrollView style={styles.splitsList}>
        {paymentSplits.map((split) => (
          <View key={split.id} style={styles.splitItem}>
            <View style={styles.splitLeft}>
              <View style={styles.contactAvatar}>
                <Text style={styles.contactInitials}>
                  {split.isMe ? 'ME' : split.initials}
                </Text>
              </View>
              <Text style={styles.splitName}>{split.name}</Text>
            </View>
            <TextInput
              style={styles.amountInput}
              value={split.amount}
              onChangeText={(text) => updateSplitAmount(split.id, text)}
              keyboardType="numeric"
            />
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.nextButton} onPress={handleAmountAdjustmentNext}>
        <Text style={styles.nextButtonText}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPaymentMethod = () => (
    <View style={styles.modalContent}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentStep('amountAdjustment')}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Payment Method</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.sectionTitle}>How should contacts pay?</Text>

      <TouchableOpacity 
        style={styles.splitOptionButton} 
        onPress={() => handlePaymentMethodSelection('consolidate')}>
        <MaterialIcons name="account-balance" size={24} color="#00acee" />
        <View style={styles.splitOptionText}>
          <Text style={styles.splitOptionTitle}>Send to You</Text>
          <Text style={styles.splitOptionSubtitle}>You pay business, others pay you</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#666" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.splitOptionButton} 
        onPress={() => handlePaymentMethodSelection('individual')}>
        <MaterialIcons name="business" size={24} color="#00acee" />
        <View style={styles.splitOptionText}>
          <Text style={styles.splitOptionTitle}>Pay Directly</Text>
          <Text style={styles.splitOptionSubtitle}>Each person pays business directly</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );

  const renderConfirmation = () => (
    <View style={styles.modalContent}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentStep(splitBill ? 'paymentMethod' : 'splitOption')}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Confirm Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.confirmationDetails}>
        <Text style={styles.businessName}>{businessName}</Text>
        <Text style={styles.tillNumberText}>{paymentType === 'paybill' ? 'Paybill' : 'Till'}: {tillNumber}</Text>
        <Text style={styles.amount}>Total: KSH {totalAmount}</Text>
        
        {splitBill && (
          <View style={styles.splitSummary}>
            <Text style={styles.splitSummaryTitle}>Split Summary:</Text>
            {paymentSplits.map((split) => (
              <Text key={split.id} style={styles.splitSummaryItem}>
                {split.name}: KSH {split.amount}
              </Text>
            ))}
            <Text style={styles.paymentMethodText}>
              Payment: {paymentMethod === 'consolidate' ? 'Via You' : 'Direct to Business'}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleFinalConfirmation}>
        <Text style={styles.confirmButtonText}>CONFIRM & PAY</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'menu':
        return renderPaymentMenu();
      case 'tillEntry':
        return renderTillEntry();
      case 'splitOption':
        return renderSplitOption();
      case 'contactSelection':
        return renderContactSelection();
      case 'amountAdjustment':
        return renderAmountAdjustment();
      case 'paymentMethod':
        return renderPaymentMethod();
      case 'confirmation':
        return renderConfirmation();
      default:
        return renderPaymentMenu();
    }
  };

  const handleOverlayPress = () => {
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={handleOverlayPress}>
        <TouchableOpacity
          style={styles.modalWrapper}
          activeOpacity={1}
          onPress={() => {}}>
          {renderCurrentStep()}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalWrapper: {
    width: width * 0.9,
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    maxHeight: height * 0.8,
  },
  indicator: {
    width: 30,
    height: 3,
    backgroundColor: '#666',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 12,
  },
  iconContainer: {
    backgroundColor: '#00acee',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: 'white',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    color: 'white',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#00acee',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  businessInfo: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
    borderRadius: 12,
    backgroundColor: '#2a2a2a',
  },
  businessName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  amount: {
    color: '#00cc66',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionSubtitle: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  splitOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  splitOptionText: {
    flex: 1,
    marginLeft: 12,
  },
  splitOptionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  splitOptionSubtitle: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 2,
  },
  contactsList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  contactItemSelected: {
    backgroundColor: '#0a4a2a',
    borderWidth: 1,
    borderColor: '#00cc66',
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00acee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInitials: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  contactPhone: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 2,
  },
  totalSection: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  totalLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  splitTotal: {
    color: '#00cc66',
    fontSize: 14,
    marginTop: 5,
  },
  splitsList: {
    maxHeight: 250,
    marginBottom: 20,
  },
  splitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  splitLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  splitName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  amountInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 10,
    color: 'white',
    textAlign: 'center',
    minWidth: 80,
    fontSize: 14,
  },
  confirmationDetails: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  tillNumberText: {
    color: '#ccc',
    fontSize: 14,
    marginVertical: 5,
  },
  splitSummary: {
    marginTop: 15,
    width: '100%',
  },
  splitSummaryTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  splitSummaryItem: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 4,
  },
  paymentMethodText: {
    color: '#00acee',
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  confirmButton: {
    backgroundColor: '#00cc66',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});