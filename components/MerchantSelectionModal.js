import React, { useState } from 'react';
// import { Search, X, Grid3X3, QrCode, User, Phone, ShoppingCart, Receipt } from 'lucide-react';

// Mock merchant data
import { Search, X, Grid3X3, QrCode, User, Phone, ShoppingCart, Receipt, ArrowLeft } from 'lucide-react';

// Mock merchant data
const mockMerchants = [
  { id: 'FG', name: "Fridahs new Grace", category: 'Restaurant', color: 'bg-pink-500' },
  { id: 'AK', name: "Afi Muthiga street kit", category: 'Store', color: 'bg-cyan-500' },
  { id: 'AS', name: "ASA LIQUOR SHOP", category: 'Liquor', color: 'bg-green-500' },
  { id: 'CP', name: "Chips place", category: 'Restaurant', color: 'bg-blue-500' },
  { id: 'FC', name: "Fridah Muthiga Chevda", category: 'Restaurant', color: 'bg-purple-500' },
  { id: 'KE', name: "KLINTON ENTERTAINMENT", category: 'Entertainment', color: 'bg-indigo-500' },
];

// Mock frequent contacts
const mockFrequents = [
  { id: 'MK', name: "MARY KINYANJUI", number: "9848011", color: 'bg-cyan-500' },
  { id: 'VG', name: "VIRGINIA GACHUKIA", number: "4561908", color: 'bg-pink-500' },
  { id: 'AS', name: "ASA LIQUOR SHOP", number: "8037955", color: 'bg-green-500' },
  { id: 'CS', name: "CHICKEN HUB AND CEREALS STORE", number: "4520102", color: 'bg-emerald-500' },
  { id: 'JN', name: "JOHN NGANGA NGURU", number: "9055619", color: 'bg-gray-500' },
];

// Mock contacts for bill splitting
const mockContacts = [
  { id: '1', name: "Alice Johnson", phone: "+254712345678", avatar: 'AJ' },
  { id: '2', name: "Bob Smith", phone: "+254723456789", avatar: 'BS' },
  { id: '3', name: "Carol Williams", phone: "+254734567890", avatar: 'CW' },
  { id: '4', name: "David Brown", phone: "+254745678901", avatar: 'DB' },
  { id: '5', name: "Emma Davis", phone: "+254756789012", avatar: 'ED' },
  { id: '6', name: "Frank Wilson", phone: "+254767890123", avatar: 'FW' },
];

// Shared modal wrapper component with PaymentMenu styling
const ModalWrapper = ({ visible, onClose, children, title, showBackButton = false, onBack }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-5 py-5">
      <div 
        className="bg-zinc-900 rounded-3xl w-full max-w-sm shadow-2xl border border-zinc-800 max-h-[90vh] overflow-hidden"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Indicator */}
        <div className="w-8 h-1 bg-zinc-600 rounded-full mx-auto mt-4 mb-2"></div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          {showBackButton ? (
            <button onClick={onBack} className="p-1 hover:bg-zinc-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          ) : (
            <div className="w-7" />
          )}
          <h2 className="text-white font-bold text-lg tracking-wide">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-zinc-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {children}
      </div>
    </div>
  );
};

export const MerchantSelectionModal = ({ visible, onClose, paymentType, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showTillInput, setShowTillInput] = useState(false);
  const [tillNumber, setTillNumber] = useState('');
  const [amount, setAmount] = useState('');

  const filteredMerchants = mockMerchants.filter(merchant =>
    merchant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFrequents = mockFrequents.filter(frequent =>
    frequent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTillSubmit = () => {
    if (tillNumber.trim() && amount.trim()) {
      onSelect({ 
        type: 'till', 
        number: tillNumber, 
        name: `Till ${tillNumber}`,
        paymentType 
      }, amount);
      setTillNumber('');
      setAmount('');
      setShowTillInput(false);
    }
  };

  const handleMerchantSelect = (merchant) => {
    if (amount.trim()) {
      onSelect({
        ...merchant,
        paymentType,
        type: 'merchant'
      }, amount);
    }
  };

  return (
    <ModalWrapper 
      visible={visible} 
      onClose={onClose} 
      title={paymentType === 'buygoods' ? 'BUY GOODS' : 'PAY BILL'}
    >
      <div className="flex-1 overflow-y-auto">
        {/* Amount Input */}
        <div className="px-5 pb-4">
          <input
            type="number"
            placeholder="Enter amount (KES)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-zinc-800 text-white px-4 py-3 rounded-2xl border border-zinc-700 focus:border-blue-500 focus:outline-none text-lg placeholder-zinc-400"
          />
        </div>

        {/* Search */}
        <div className="px-5 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search Merchants"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-800 text-white pl-10 pr-4 py-3 rounded-2xl border border-zinc-700 focus:border-blue-500 focus:outline-none placeholder-zinc-400"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-5 pb-4">
          <div className="grid grid-cols-3 gap-3">
            {filteredMerchants.slice(0, 6).map((merchant) => (
              <button
                key={merchant.id}
                onClick={() => handleMerchantSelect(merchant)}
                disabled={!amount.trim()}
                className="flex flex-col items-center p-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className={`w-10 h-10 ${merchant.color} rounded-full flex items-center justify-center mb-2`}>
                  <span className="text-white font-semibold text-sm">{merchant.id}</span>
                </div>
                <span className="text-white text-xs text-center leading-tight">
                  {merchant.name.split(' ').slice(0, 2).join(' ')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Till Input Option */}
        <div className="px-5 pb-4">
          {!showTillInput ? (
            <button
              onClick={() => setShowTillInput(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-2xl flex items-center justify-center space-x-2 font-semibold transition-colors"
            >
              <Grid3X3 className="w-5 h-5" />
              <span>ENTER TILL NUMBER</span>
            </button>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter till number"
                value={tillNumber}
                onChange={(e) => setTillNumber(e.target.value)}
                className="w-full bg-zinc-800 text-white px-4 py-3 rounded-2xl border border-zinc-700 focus:border-blue-500 focus:outline-none placeholder-zinc-400"
                autoFocus
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowTillInput(false)}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-4 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTillSubmit}
                  disabled={!tillNumber.trim() || !amount.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Scan QR Option */}
        <div className="px-5 pb-4">
          <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-2xl flex items-center justify-center space-x-2 font-semibold transition-colors">
            <QrCode className="w-5 h-5" />
            <span>SCAN QR CODE</span>
          </button>
        </div>

        {/* Frequents */}
        <div className="px-5 pb-6">
          <h3 className="text-zinc-400 font-semibold text-sm mb-3 tracking-wide">FREQUENTS</h3>
          <div className="space-y-2">
            {filteredFrequents.map((frequent) => (
              <button
                key={frequent.id}
                onClick={() => handleMerchantSelect({
                  ...frequent,
                  type: 'frequent'
                })}
                disabled={!amount.trim()}
                className="w-full flex items-center space-x-3 p-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className={`w-10 h-10 ${frequent.color} rounded-full flex items-center justify-center`}>
                  <span className="text-white font-semibold text-sm">{frequent.id}</span>
                </div>
                <div className="flex-1 text-left">
                  <div className="text-white font-medium">{frequent.name}</div>
                  <div className="text-zinc-400 text-sm">{frequent.number}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export const BillSplitModal = ({ visible, onClose, onDecision }) => {
  const [wantToSplit, setWantToSplit] = useState(null);

  const handleContinue = () => {
    if (wantToSplit !== null) {
      onDecision(wantToSplit);
    }
  };

  return (
    <ModalWrapper 
      visible={visible} 
      onClose={onClose} 
      title="SPLIT BILL"
      showBackButton={true}
      onBack={onClose}
    >
      <div className="px-5 pb-6">
        <div className="text-center mb-8">
          <p className="text-zinc-400 text-lg">Do you want to split this bill with friends?</p>
        </div>

        <div className="space-y-4 mb-8">
          <button
            onClick={() => setWantToSplit(true)}
            className={`w-full p-4 rounded-2xl border-2 transition-all flex flex-col items-center space-y-2 ${
              wantToSplit === true
                ? 'border-green-500 bg-green-500 bg-opacity-20 shadow-lg shadow-green-500/20'
                : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600 hover:bg-zinc-700'
            }`}
          >
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-semibold">Yes, Split Bill</span>
            <span className="text-zinc-400 text-sm text-center">Share the cost with friends</span>
          </button>

          <button
            onClick={() => setWantToSplit(false)}
            className={`w-full p-4 rounded-2xl border-2 transition-all flex flex-col items-center space-y-2 ${
              wantToSplit === false
                ? 'border-blue-500 bg-blue-500 bg-opacity-20 shadow-lg shadow-blue-500/20'
                : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600 hover:bg-zinc-700'
            }`}
          >
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-semibold">No, Pay Alone</span>
            <span className="text-zinc-400 text-sm text-center">I'll handle the full amount</span>
          </button>
        </div>

        <button
          onClick={handleContinue}
          disabled={wantToSplit === null}
          className="w-full py-4 px-6 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          CONTINUE
        </button>
      </div>
    </ModalWrapper>
  );
};

export const ContactSelectionModal = ({ visible, onClose, onConfirmContacts }) => {
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleContact = (contact) => {
    setSelectedContacts(prev => {
      const exists = prev.find(c => c.id === contact.id);
      if (exists) {
        return prev.filter(c => c.id !== contact.id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const handleConfirm = () => {
    if (selectedContacts.length > 0) {
      onConfirmContacts(selectedContacts);
    }
  };

  return (
    <ModalWrapper 
      visible={visible} 
      onClose={onClose} 
      title="SELECT CONTACTS"
      showBackButton={true}
      onBack={onClose}
    >
      <div className="flex-1 overflow-y-auto">
        {/* Search */}
        <div className="px-5 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search contacts"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-800 text-white pl-10 pr-4 py-3 rounded-2xl border border-zinc-700 focus:border-blue-500 focus:outline-none placeholder-zinc-400"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="px-5 pb-4">
          <div className="space-y-2">
            {filteredContacts.map((contact) => {
              const isSelected = selectedContacts.find(c => c.id === contact.id);
              return (
                <button
                  key={contact.id}
                  onClick={() => toggleContact(contact)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-2xl transition-all ${
                    isSelected 
                      ? 'bg-blue-600 bg-opacity-20 border border-blue-500 shadow-lg shadow-blue-500/20' 
                      : 'bg-zinc-800 hover:bg-zinc-700'
                  }`}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{contact.avatar}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-white font-medium">{contact.name}</div>
                    <div className="text-zinc-400 text-sm">{contact.phone}</div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 transition-all ${
                    isSelected ? 'bg-blue-500 border-blue-500' : 'border-zinc-500'
                  }`}>
                    {isSelected && (
                      <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Continue Button */}
        <div className="px-5 pb-6 border-t border-zinc-800 pt-4">
          <button
            onClick={handleConfirm}
            disabled={selectedContacts.length === 0}
            className="w-full py-4 px-6 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            CONTINUE ({selectedContacts.length})
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export const PaymentMethodModal = ({ visible, onClose, onSelectMethod }) => {
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleConfirm = () => {
    if (paymentMethod) {
      onSelectMethod(paymentMethod);
    }
  };

  return (
    <ModalWrapper 
      visible={visible} 
      onClose={onClose} 
      title="PAYMENT METHOD"
      showBackButton={true}
      onBack={onClose}
    >
      <div className="px-5 pb-6">
        <div className="text-center mb-8">
          <p className="text-zinc-400 text-lg">How should your friends pay their share?</p>
        </div>

        <div className="space-y-4 mb-8">
          <button
            onClick={() => setPaymentMethod('send_to_me')}
            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center space-x-4 ${
              paymentMethod === 'send_to_me'
                ? 'border-green-500 bg-green-500 bg-opacity-20 shadow-lg shadow-green-500/20'
                : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600 hover:bg-zinc-700'
            }`}
          >
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="text-left flex-1">
              <span className="text-white font-semibold block">Send Money to Me</span>
              <span className="text-zinc-400 text-sm">
                Friends send money to your account, then you pay the merchant
              </span>
            </div>
          </button>

          <button
            onClick={() => setPaymentMethod('send_to_merchant')}
            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center space-x-4 ${
              paymentMethod === 'send_to_merchant'
                ? 'border-blue-500 bg-blue-500 bg-opacity-20 shadow-lg shadow-blue-500/20'
                : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600 hover:bg-zinc-700'
            }`}
          >
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div className="text-left flex-1">
              <span className="text-white font-semibold block">Send Directly to Merchant</span>
              <span className="text-zinc-400 text-sm">
                Each friend pays the merchant directly
              </span>
            </div>
          </button>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!paymentMethod}
          className="w-full py-4 px-6 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          CONTINUE
        </button>
      </div>
    </ModalWrapper>
  );
};

export const FinalConfirmationModal = ({ visible, onClose, details, onConfirm }) => {
  const handleConfirm = () => {
    onConfirm();
  };

  if (!visible) return null;

  return (
    <ModalWrapper 
      visible={visible} 
      onClose={onClose} 
      title="CONFIRM PAYMENT"
      showBackButton={true}
      onBack={onClose}
    >
      <div className="px-5 pb-6">
        <div className="space-y-4 mb-8">
          {/* Payment Summary */}
          <div className="bg-zinc-800 rounded-2xl p-4">
            <h3 className="text-white font-semibold mb-3 text-center">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Merchant:</span>
                <span className="text-white font-medium">{details?.merchant?.name || 'Till Number'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Total Amount:</span>
                <span className="text-white font-bold text-lg">KES {details?.amount || '0'}</span>
              </div>
              {details?.isSplitBill && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Your Share:</span>
                    <span className="text-green-400 font-semibold">
                      KES {details?.contacts ? (parseFloat(details.amount) / (details.contacts.length + 1)).toFixed(2) : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Split With:</span>
                    <span className="text-white">{details?.contacts?.length || 0} friends</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-zinc-800 rounded-2xl p-4">
            <h3 className="text-white font-semibold mb-2">Payment Method</h3>
            <p className="text-zinc-400 text-sm">
              {details?.method === 'send_to_me' 
                ? 'Friends will send money to you, then you pay the merchant'
                : 'Each friend will pay the merchant directly'
              }
            </p>
          </div>

          {/* Participants (if split bill) */}
          {details?.isSplitBill && details?.contacts?.length > 0 && (
            <div className="bg-zinc-800 rounded-2xl p-4">
              <h3 className="text-white font-semibold mb-3">Participants</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {details.contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">{contact.avatar || contact.name.slice(0, 2)}</span>
                    </div>
                    <span className="text-zinc-400 text-sm flex-1">{contact.name}</span>
                    <span className="text-white text-sm font-medium">
                      KES {(parseFloat(details.amount) / (details.contacts.length + 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleConfirm}
          className="w-full py-4 px-6 rounded-2xl bg-green-600 text-white font-bold hover:bg-green-700 transition-colors text-lg"
        >
          SEND PAYMENT REQUEST
        </button>
      </div>
    </ModalWrapper>
  );
};

// Main Demo Component
export const MerchantSelectionDemo = () => {
  const [currentModal, setCurrentModal] = useState('');
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [splitDetails, setSplitDetails] = useState(null);
  const [finalDetails, setFinalDetails] = useState(null);

  const handlePaymentTypeSelect = (type) => {
    setCurrentModal('merchant');
    // In your real app, this would come from the PaymentMenu component
  };

  const handleMerchantSelect = (merchant) => {
    setSelectedMerchant(merchant);
    setCurrentModal('billSplit');
  };

  const handleBillSplitConfirm = (details) => {
    setPaymentDetails(details);
    if (details.splitBill) {
      setCurrentModal('contactSelection');
    } else {
      // Handle single payment
      alert('Processing single payment...');
      setCurrentModal('');
    }
  };

  const handleContactSelectionConfirm = (details) => {
    setSplitDetails(details);
    setCurrentModal('paymentMethod');
  };

  const handlePaymentMethodConfirm = (details) => {
    setFinalDetails(details);
    setCurrentModal('finalConfirmation');
  };

  const handleFinalConfirm = (details) => {
    console.log('Final payment details:', details);
    setCurrentModal('');
    // Reset all state
    setSelectedMerchant(null);
    setPaymentDetails(null);
    setSplitDetails(null);
    setFinalDetails(null);
  };

  const closeAllModals = () => {
    setCurrentModal('');
    setSelectedMerchant(null);
    setPaymentDetails(null);
    setSplitDetails(null);
    setFinalDetails(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          M-Pesa Payment & Bill Split Demo
        </h1>
        
        <div className="space-y-4">
          <button
            onClick={() => handlePaymentTypeSelect('buygoods')}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Buy Goods</span>
          </button>
          
          <button
            onClick={() => handlePaymentTypeSelect('paybill')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl flex items-center justify-center space-x-2"
          >
            <Receipt className="w-5 h-5" />
            <span>Pay Bill</span>
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-700 mb-2">Demo Flow:</h3>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. Select payment type (Buy Goods/Pay Bill)</li>
            <li>2. Choose merchant or enter till number</li>
            <li>3. Enter amount and choose to split or not</li>
            <li>4. If splitting: Select contacts to split with</li>
            <li>5. Choose payment method (send to you or merchant)</li>
            <li>6. Confirm and send M-Pesa requests</li>
          </ol>
        </div>
      </div>

      {/* All Modals */}
      <MerchantSelectionModal
        visible={currentModal === 'merchant'}
        onClose={closeAllModals}
        paymentType={selectedMerchant?.paymentType || 'buygoods'}
        onSelectMerchant={handleMerchantSelect}
      />

      <BillSplitModal
        visible={currentModal === 'billSplit'}
        onClose={closeAllModals}
        selectedMerchant={selectedMerchant}
        onConfirm={handleBillSplitConfirm}
      />

      <ContactSelectionModal
        visible={currentModal === 'contactSelection'}
        onClose={closeAllModals}
        paymentDetails={paymentDetails}
        onConfirm={handleContactSelectionConfirm}
      />

      <PaymentMethodModal
        visible={currentModal === 'paymentMethod'}
        onClose={closeAllModals}
        splitDetails={splitDetails}
        onConfirm={handlePaymentMethodConfirm}
      />

      <FinalConfirmationModal
        visible={currentModal === 'finalConfirmation'}
        onClose={closeAllModals}
        finalDetails={finalDetails}
        onConfirm={handleFinalConfirm}
      />
    </div>
  );
};

export default MerchantSelectionDemo;