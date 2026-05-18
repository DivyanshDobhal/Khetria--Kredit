// Backend internationalization utility
const messages = {
  en: {
    // Auth messages
    'user.already.exists': 'User already exists',
    'user.registered.successfully': 'User registered successfully',
    'login.successful': 'Login successful',
    'invalid.credentials': 'Invalid credentials',
    'server.error': 'Server error',
    
    // Loan messages
    'loan.created.successfully': 'Loan request created successfully',
    'loan.not.found': 'Loan not found',
    'loan.no.longer.accepting.funding': 'Loan is no longer accepting funding',
    'maximum.funding.amount': 'Maximum funding amount is',
    'loan.funded.successfully': 'Loan funded successfully',
    
    // Validation messages
    'validation.errors': 'Validation errors',
    'amount.required': 'Amount is required',
    'amount.invalid': 'Amount must be between 1000 and 100000',
    'purpose.required': 'Purpose is required',
    'purpose.too.short': 'Purpose must be at least 5 characters',
    'purpose.too.long': 'Purpose must not exceed 500 characters',
    'repayment.term.required': 'Repayment term is required',
    'repayment.term.invalid': 'Repayment term must be between 1 and 36 months',
    'name.required': 'Name is required',
    'email.required': 'Email is required',
    'email.invalid': 'Please provide a valid email',
    'password.required': 'Password is required',
    'password.too.short': 'Password must be at least 6 characters',
    'role.required': 'Role is required',
    'role.invalid': 'Role must be either BORROWER or LENDER'
  },
  hi: {
    // Auth messages
    'user.already.exists': 'उपयोगकर्ता पहले से मौजूद है',
    'user.registered.successfully': 'उपयोगकर्ता सफलतापूर्वक पंजीकृत',
    'login.successful': 'लॉगिन सफल',
    'invalid.credentials': 'अमान्य क्रेडेंशियल्स',
    'server.error': 'सर्वर त्रुटि',
    
    // Loan messages
    'loan.created.successfully': 'ऋण अनुरोध सफलतापूर्वक बनाया गया',
    'loan.not.found': 'ऋण नहीं मिला',
    'loan.no.longer.accepting.funding': 'ऋण अब फंडिंग स्वीकार नहीं कर रहा',
    'maximum.funding.amount': 'अधिकतम फंडिंग राशि है',
    'loan.funded.successfully': 'ऋण सफलतापूर्वक फंड किया गया',
    
    // Validation messages
    'validation.errors': 'सत्यापन त्रुटियां',
    'amount.required': 'राशि आवश्यक है',
    'amount.invalid': 'राशि 1000 और 100000 के बीच होनी चाहिए',
    'purpose.required': 'उद्देश्य आवश्यक है',
    'purpose.too.short': 'उद्देश्य कम से कम 5 अक्षर का होना चाहिए',
    'purpose.too.long': 'उद्देश्य 500 अक्षर से अधिक नहीं होना चाहिए',
    'repayment.term.required': 'चुकौती अवधि आवश्यक है',
    'repayment.term.invalid': 'चुकौती अवधि 1 और 36 महीने के बीच होनी चाहिए',
    'name.required': 'नाम आवश्यक है',
    'email.required': 'ईमेल आवश्यक है',
    'email.invalid': 'कृपया एक वैध ईमेल प्रदान करें',
    'password.required': 'पासवर्ड आवश्यक है',
    'password.too.short': 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए',
    'role.required': 'भूमिका आवश्यक है',
    'role.invalid': 'भूमिका BORROWER या LENDER होनी चाहिए'
  }
};

// Get message in specified language
const getMessage = (key, lang = 'en', params = {}) => {
  const message = messages[lang]?.[key] || messages.en[key] || key;
  
  // Replace parameters in message
  return message.replace(/\{(\w+)\}/g, (match, param) => {
    return params[param] || match;
  });
};

// Get language from request headers or query
const getLanguageFromRequest = (req) => {
  // Check query parameter first
  if (req.query.lang) {
    return req.query.lang === 'hi' ? 'hi' : 'en';
  }
  
  // Check Accept-Language header
  const acceptLanguage = req.headers['accept-language'];
  if (acceptLanguage && acceptLanguage.includes('hi')) {
    return 'hi';
  }
  
  // Check custom header
  if (req.headers['x-language']) {
    return req.headers['x-language'] === 'hi' ? 'hi' : 'en';
  }
  
  // Default to English
  return 'en';
};

// Middleware to add language to request
const i18nMiddleware = (req, res, next) => {
  req.language = getLanguageFromRequest(req);
  req.t = (key, params = {}) => getMessage(key, req.language, params);
  next();
};

export { getMessage, getLanguageFromRequest, i18nMiddleware };
