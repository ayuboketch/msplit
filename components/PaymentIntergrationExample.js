export const PaymentIntegrationExample = () => {
  // Payment Menu state
  const [showPaymentMenu, setShowPaymentMenu] = useState(false);
  
  // Merchant selection flow state
  const [showMerchantSelection, setShowMerchantSelection] = useState(false);
  const [paymentType, setPaymentType] = useState('');
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [splitDetails, setSplitDetails] = useState(null);
  const [finalDetails, setFinalDetails] = useState(null);
  const [currentModal, setCurrentModal] = useState('');

  // Handle payment type selection from PaymentMenu
  const handleSelectPayment = (type) => {
    setPaymentType(type);
    setShowPaymentMenu(false); // Close payment menu
    setShowMerchantSelection(true); // Show merchant selection
  };

  const handleMerchantSelect = (merchant) => {
    setSelectedMerchant(merchant);
    setShowMerchantSelection(false);
    setCurrentModal('billSplit');
  };

  const handleBillSplitConfirm = (details) => {
    setPaymentDetails(details);
    if (details.splitBill) {
      setCurrentModal('contactSelection');
    } else {
      // Handle single payment - integrate your M-Pesa SDK here
      alert('Processing single payment...');
      closeAllModals();
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
    // Integrate your M-Pesa SDK here
    closeAllModals();
  };

  const closeAllModals = () => {
    setShowPaymentMenu(false);
    setShowMerchantSelection(false);
    setCurrentModal('');
    setSelectedMerchant(null);
    setPaymentDetails(null);
    setSplitDetails(null);
    setFinalDetails(null);
  };

  // Your existing PaymentMenu component with updated handlePaymentOption
  const PaymentMenuComponent = ({ visible, onClose, onSelectPayment }) => {
    const paymentOptions = [
      { icon: 'receipt', label: 'PAY BILL', type: 'paybill' },
      { icon: 'shopping-cart', label: 'BUY GOODS', type: 'buygoods' },
      { icon: 'smartphone', label: 'POCHI LA BIASHARA' },
      { icon: 'credit-card', label: 'GLOBAL PAY' },
      { icon: 'qr-code-scanner', label: 'SCAN QR' },
    ];

    const handlePaymentOption = (option) => {
      if (option.type === 'paybill' || option.type === 'buygoods') {
        onSelectPayment(option.type); // Pass the payment type
      } else {
        onClose();
        alert(option.label + ' - This payment option is coming soon.');
      }
    };

    if (!visible) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40 p-4">
        <div className="bg-gray-800 rounded-2xl w-full max-w-sm p-6">
          <div className="w-8 h-1 bg-gray-600 rounded-full mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-semibold text-center mb-6">PAY</h2>
          <div className="space-y-3">
            {paymentOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handlePaymentOption(option)}
                className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">📱</span>
                </div>
                <span className="text-white font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          M-Pesa Payment & Bill Split
        </h1>
        
        <button
          onClick={() => setShowPaymentMenu(true)}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl"
        >
          Open Payment Menu
        </button>

        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-700 mb-2">Integration Guide:</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>1. Import the components:</strong></p>
            <code className="block bg-gray-100 p-2 rounded text-xs">
              import &#123; MerchantSelectionModal &#125; from './MerchantSelectionModal';
            </code>
            
            <p><strong>2. Update your PaymentMenu:</strong></p>
            <code className="block bg-gray-100 p-2 rounded text-xs">
              onSelectPayment(option.type) // Pass 'paybill' or 'buygoods'
            </code>
            
            <p><strong>3. Add state management in parent component</strong></p>
          </div>
        </div>
      </div>

      {/* Payment Menu */}
      <PaymentMenuComponent
        visible={showPaymentMenu}
        onClose={() => setShowPaymentMenu(false)}
        onSelectPayment={handleSelectPayment}
      />

      {/* Merchant Selection Flow */}
      <MerchantSelectionModal
        visible={showMerchantSelection}
        onClose={closeAllModals}
        paymentType={paymentType}
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

export default PaymentIntegrationExample;