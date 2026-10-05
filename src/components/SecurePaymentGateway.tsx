import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Smartphone, 
  Building2,
  KeyRound,
  RotateCw,
  Fingerprint
} from 'lucide-react';
import { CustomerDetails, PaymentDetails, PaymentMethod } from '../types';

export const SecurePaymentGateway: React.FC = () => {
  const { 
    cart, 
    cartTotal, 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    processOrder 
  } = useShop();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 3DS2 Simulation State
  const [show3DSChallenge, setShow3DSChallenge] = useState(false);
  const [otpCode, setOtpCode] = useState('849201');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Customer Form
  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: 'Alexander Wright',
    email: 'alex.wright@athletics.org',
    phone: '+1 (555) 234-8901',
    address: '420 Olympic Parkway, Suite 12',
    city: 'Seattle',
    state: 'WA',
    postalCode: '98101',
    country: 'United States'
  });

  // Card Form
  const [card, setCard] = useState<PaymentDetails>({
    cardNumber: '4242 4242 4242 4242',
    cardHolder: 'ALEXANDER WRIGHT',
    expiryDate: '12/28',
    cvv: '849',
    brand: 'visa'
  });

  // Calculate live financial summary
  const subtotal = cartTotal;
  const tax = Number((subtotal * 0.0825).toFixed(2));
  const shipping = subtotal > 150 ? 0 : 12.00;
  const total = Number((subtotal + tax + shipping).toFixed(2));

  // Dynamic Card Brand Detection
  const detectBrand = (number: string): 'visa' | 'mastercard' | 'amex' | 'generic' => {
    const clean = number.replace(/\D/g, '');
    if (clean.startsWith('4')) return 'visa';
    if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'mastercard';
    if (/^3[47]/.test(clean)) return 'amex';
    return 'generic';
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '').slice(0, 16);
    const parts = input.match(/[\s\S]{1,4}/g) || [];
    const formatted = parts.join(' ');
    const brand = detectBrand(formatted);
    setCard((prev: PaymentDetails) => ({
      ...prev,
      cardNumber: formatted,
      brand
    }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (input.length > 2) {
      input = `${input.slice(0, 2)}/${input.slice(2)}`;
    }
    setCard((prev: PaymentDetails) => ({ ...prev, expiryDate: input }));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxLen = card.brand === 'amex' ? 4 : 3;
    const input = e.target.value.replace(/\D/g, '').slice(0, maxLen);
    setCard((prev: PaymentDetails) => ({ ...prev, cvv: input }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!customer.fullName || !customer.email || !customer.address) {
      setErrorMessage('Please complete all contact and shipping fields.');
      return;
    }

    if (paymentMethod === 'card') {
      const cleanNum = card.cardNumber.replace(/\s+/g, '');
      if (cleanNum.length < 15) {
        setErrorMessage('Please enter a valid 15 or 16-digit card number.');
        return;
      }
      if (card.expiryDate.length < 5) {
        setErrorMessage('Please enter a valid expiration date (MM/YY).');
        return;
      }
      if (card.cvv.length < 3) {
        setErrorMessage('Please enter a valid CVV security code.');
        return;
      }

      // Launch 3DS2 Challenge for high-value or card security verification
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setShow3DSChallenge(true);
      }, 700);
      return;
    }

    // Direct submission for Wallet / PayPal / Escrow
    executePayment();
  };

  const executePayment = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await processOrder(customer, card, paymentMethod);
      if (!res.success) {
        setErrorMessage(res.error || 'Payment gateway declined transaction.');
        setIsProcessing(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment processing error.');
      setIsProcessing(false);
    }
  };

  const handleVerify3DS = () => {
    setIsVerifyingOtp(true);
    setTimeout(async () => {
      setIsVerifyingOtp(false);
      setShow3DSChallenge(false);
      await executePayment();
    }, 1000);
  };

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold font-display tracking-wide flex items-center gap-2">
                <span>VANGUARD SECURE GATEWAY</span>
                <span className="text-[10px] font-mono-numbers bg-slate-800 text-emerald-300 px-1.5 py-0.5 rounded border border-slate-700">
                  PCI-DSS 4.0 VERIFIED
                </span>
              </div>
              <div className="text-xs text-slate-400">
                End-to-End Encrypted Session · 256-Bit SSL Handshake
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3DS2 Challenge Modal Overlay */}
        {show3DSChallenge && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-300">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                    3DS
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {card.brand.toUpperCase()} Identity Check
                    </h4>
                    <p className="text-[11px] text-slate-500">Strong Customer Authentication (SCA)</p>
                  </div>
                </div>
                <Lock className="w-4 h-4 text-emerald-600" />
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                To confirm this payment of <strong className="text-slate-900 font-mono-numbers">${total.toFixed(2)}</strong>, please enter the security authorization passcode sent to your registered mobile phone ending in <strong>··8901</strong>.
              </p>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4 flex items-center justify-between text-xs">
                <span className="text-slate-500">Demo Verification Code:</span>
                <button
                  type="button"
                  onClick={() => setEnteredOtp(otpCode)}
                  className="font-mono-numbers font-bold text-blue-600 hover:text-blue-800 underline"
                >
                  Use {otpCode}
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  6-Digit SMS Security Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full text-center tracking-widest text-lg font-mono-numbers font-bold py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShow3DSChallenge(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleVerify3DS}
                  disabled={enteredOtp.length < 6 || isVerifyingOtp}
                  className="flex-1 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  {isVerifyingOtp ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Confirm & Charge</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          
          {/* Left: Customer & Payment Form (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
            
            {/* Error banner if any */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step 1: Customer Details */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-mono-numbers">1</span>
                  <span>Recipient & Delivery Address</span>
                </h3>
                <span className="text-xs text-slate-600">Standard Express</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Email (for Instant Receipt)</label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Shipping Street Address</label>
                  <input
                    type="text"
                    required
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">State / Prov</label>
                    <input
                      type="text"
                      required
                      value={customer.state}
                      onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={customer.postalCode}
                      onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none font-mono-numbers"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-mono-numbers">2</span>
                  <span>Payment Gateway</span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                  <Lock className="w-3 h-3" />
                  <span>Tokenized SSL</span>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-lg border flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Credit / Debit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-2.5 rounded-lg border flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Apple / Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_wire')}
                  className={`p-2.5 rounded-lg border flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'bank_wire'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Bank Wire / ACH</span>
                </button>
              </div>

              {/* Credit Card Fields with Interactive Card Preview */}
              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  {/* Interactive Card Graphic */}
                  <div className="p-4 rounded-xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 text-white shadow-md border border-slate-700 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-6 bg-amber-400/80 rounded-sm flex items-center justify-center text-[10px] text-slate-900 font-bold border border-amber-300">
                          CHIP
                        </div>
                        <span className="text-[10px] font-mono-numbers text-slate-400">CONTACTLESS</span>
                      </div>
                      <span className="font-bold text-sm tracking-wider uppercase font-display text-emerald-400">
                        {card.brand.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-lg sm:text-xl font-mono-numbers tracking-widest font-semibold mb-4 text-slate-100">
                      {card.cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    <div className="flex items-end justify-between text-xs">
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-400">Cardholder</div>
                        <div className="font-semibold tracking-wide uppercase truncate max-w-[160px]">
                          {card.cardHolder || 'FULL NAME'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-400">Expires</div>
                        <div className="font-mono-numbers font-semibold">
                          {card.expiryDate || 'MM/YY'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Form Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-medium mb-1 flex items-center justify-between">
                        <span>Card Number</span>
                        <span className="text-slate-600 font-mono-numbers">
                          Live Token: tok_sec_{card.cardNumber.slice(0, 4) || '••••'}
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={card.cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4242 4242 4242 4242"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none font-mono-numbers"
                        />
                        <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        value={card.cardHolder}
                        onChange={(e) => setCard({ ...card, cardHolder: e.target.value.toUpperCase() })}
                        placeholder="ALEXANDER WRIGHT"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none uppercase"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-700 font-medium mb-1">Expires (MM/YY)</label>
                        <input
                          type="text"
                          required
                          value={card.expiryDate}
                          onChange={handleExpiryChange}
                          placeholder="12/28"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none font-mono-numbers"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-medium mb-1 flex items-center justify-between">
                          <span>CVV</span>
                          <Lock className="w-3 h-3 text-slate-400" />
                        </label>
                        <input
                          type="password"
                          required
                          value={card.cvv}
                          onChange={handleCvvChange}
                          placeholder="849"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none font-mono-numbers"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Digital Wallet Option */}
              {paymentMethod === 'apple_pay' && (
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-3">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto">
                    <Fingerprint className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Instant Biometric Express Checkout
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Biometric fingerprint or Face ID authentication enabled through system wallet tokenization.
                  </p>
                </div>
              )}

              {/* Bank Wire Option */}
              {paymentMethod === 'bank_wire' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-600">
                  <div className="font-semibold text-slate-900">Direct Bank Wire / Escrow Instructions:</div>
                  <div className="flex justify-between font-mono-numbers">
                    <span>Beneficiary:</span>
                    <span className="font-bold text-slate-900">Vanguard Athletics Escrow LLC</span>
                  </div>
                  <div className="flex justify-between font-mono-numbers">
                    <span>Routing (ABA):</span>
                    <span className="font-bold text-slate-900">121000358</span>
                  </div>
                  <div className="flex justify-between font-mono-numbers">
                    <span>Escrow Account:</span>
                    <span className="font-bold text-slate-900">984210084192</span>
                  </div>
                  <p className="text-[11px] text-slate-600 pt-1">
                    Goods will be reserved immediately and dispatched upon SWIFT/Fedwire confirmation.
                  </p>
                </div>
              )}

            </div>

          </div>

          {/* Right: Order Summary & Real-Time Stock Lock (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs text-slate-500 font-mono-numbers">{cart.length} item{cart.length === 1 ? '' : 's'}</span>
              </h3>

              {/* Itemized Mini List */}
              <div className="divide-y divide-slate-200/80 max-h-56 overflow-y-auto mb-4 pr-1">
                {cart.map(item => (
                  <div key={`${item.product.id}-${item.selectedSize}`} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.product.image}
                        alt=""
                        className="w-10 h-10 object-cover rounded bg-white border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-semibold text-slate-900 line-clamp-1">{item.product.name}</div>
                        <div className="text-[11px] text-slate-600 font-mono-numbers">
                          Qty: {item.quantity} {item.selectedSize ? `· Size ${item.selectedSize}` : ''}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold font-mono-numbers text-slate-900 shrink-0">
                      ${(item.product.retailPrice * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculation Breakdown */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono-numbers font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Sales Tax (8.25%)</span>
                  <span className="font-mono-numbers">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping & Handling</span>
                  <span className="font-mono-numbers">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span className="font-mono-numbers text-base text-slate-900">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Inventory Guarantee Warning */}
              <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 space-y-1">
                <div className="font-semibold flex items-center gap-1 text-emerald-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Real-Time Inventory Hold Active</span>
                </div>
                <p>
                  Inventory units are reserved in real-time. On payment approval, stock will be immediately decremented from the warehouse ledger.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-6 border-t border-slate-200 mt-6">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Authorizing Gateway & Holding Stock...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>Pay ${total.toFixed(2)} Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 text-[10px] text-slate-600 mt-3 font-mono-numbers">
                <span>AES-256</span>
                <span>·</span>
                <span>TLS 1.3</span>
                <span>·</span>
                <span>3D SECURE 2.0</span>
                <span>·</span>
                <span>PCI-DSS CERTIFIED</span>
              </div>
            </div>

          </div>

        </form>
      </div>
    </div>
  );
};
