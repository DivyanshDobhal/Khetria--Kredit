// Mock AI responses for demo purposes
// In production, replace with actual OpenAI API calls

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatbotResponse {
  message: string;
  suggestions?: string[];
}

// Mock responses in both English and Hindi
const mockResponses: Record<string, Record<string, ChatbotResponse>> = {
  en: {
    'how do i create a loan request': {
      message: 'To create a loan request, follow these steps:\n\n1. Log in to your account\n2. Go to the Dashboard\n3. Click "Create New Loan Request"\n4. Fill in the loan details (amount, purpose, repayment term)\n5. Submit your request\n\nYour loan will be visible to potential lenders in the marketplace.',
      suggestions: [
        'What information do I need to provide?',
        'How long does approval take?',
        'What are the interest rates?'
      ]
    },
    'how do i check my repayment schedule': {
      message: 'To check your repayment schedule:\n\n1. Go to your Dashboard\n2. Find your active loans section\n3. Click on "View Details" for any loan\n4. You\'ll see your monthly payment amount and due dates\n\nYou can also set up payment reminders in your account settings.',
      suggestions: [
        'How do I make a payment?',
        'What if I miss a payment?',
        'Can I pay early?'
      ]
    },
    'how do i view my loan statistics': {
      message: 'To view your loan statistics:\n\n1. Go to your Dashboard\n2. Scroll down to the "Statistics" section\n3. You\'ll see:\n   - Total loans taken\n   - Amount borrowed\n   - Payment history\n   - Trust score\n\nFor lenders, you\'ll see investment statistics instead.',
      suggestions: [
        'What is a trust score?',
        'How can I improve my trust score?',
        'What are the benefits of a high trust score?'
      ]
    },
    'how do i invest money in loans': {
      message: 'To invest money in loans:\n\n1. Go to the Marketplace\n2. Browse available loan requests\n3. Review borrower details and trust scores\n4. Click "Fund This Loan" on loans you want to invest in\n5. Enter your investment amount\n6. Confirm your investment\n\nYou\'ll start earning returns as the borrower makes payments.',
      suggestions: [
        'What is the minimum investment?',
        'How do I choose which loans to fund?',
        'What are the risks?'
      ]
    },
    'default': {
      message: 'I\'m here to help you with questions about loans, investments, and using our platform. You can ask me about:\n\n• Creating loan requests\n• Checking repayment schedules\n• Viewing loan statistics\n• Investing in loans\n• Understanding trust scores\n• Platform features\n\nWhat would you like to know?',
      suggestions: [
        'How do I create a loan request?',
        'How do I check my repayment schedule?',
        'How do I view my loan statistics?',
        'How do I invest money in loans?'
      ]
    }
  },
  hi: {
    'how do i create a loan request': {
      message: 'लोन अनुरोध बनाने के लिए इन चरणों का पालन करें:\n\n1. अपने खाते में लॉग इन करें\n2. डैशबोर्ड पर जाएं\n3. "नया लोन अनुरोध बनाएं" पर क्लिक करें\n4. लोन विवरण भरें (राशि, उद्देश्य, चुकौती अवधि)\n5. अपना अनुरोध जमा करें\n\nआपका लोन मार्केटप्लेस में संभावित उधारदाताओं को दिखाई देगा।',
      suggestions: [
        'मुझे क्या जानकारी देनी होगी?',
        'अनुमोदन में कितना समय लगता है?',
        'ब्याज दरें क्या हैं?'
      ]
    },
    'how do i check my repayment schedule': {
      message: 'अपना चुकौती कार्यक्रम देखने के लिए:\n\n1. अपने डैशबोर्ड पर जाएं\n2. अपने सक्रिय लोन अनुभाग को खोजें\n3. किसी भी लोन के लिए "विवरण देखें" पर क्लिक करें\n4. आपको अपनी मासिक भुगतान राशि और देय तिथियां दिखाई देंगी\n\nआप अपने खाता सेटिंग्स में भुगतान अनुस्मारक भी सेट कर सकते हैं।',
      suggestions: [
        'मैं भुगतान कैसे करूं?',
        'अगर मैं भुगतान चूक जाऊं तो क्या होगा?',
        'क्या मैं जल्दी भुगतान कर सकता हूं?'
      ]
    },
    'how do i view my loan statistics': {
      message: 'अपने लोन आंकड़े देखने के लिए:\n\n1. अपने डैशबोर्ड पर जाएं\n2. "आंकड़े" अनुभाग पर स्क्रॉल करें\n3. आपको दिखाई देगा:\n   - कुल लिए गए लोन\n   - उधार ली गई राशि\n   - भुगतान इतिहास\n   - ट्रस्ट स्कोर\n\nउधारदाताओं के लिए, आपको निवेश आंकड़े दिखाई देंगे।',
      suggestions: [
        'ट्रस्ट स्कोर क्या है?',
        'मैं अपना ट्रस्ट स्कोर कैसे बेहतर बना सकता हूं?',
        'उच्च ट्रस्ट स्कोर के क्या फायदे हैं?'
      ]
    },
    'how do i invest money in loans': {
      message: 'लोन में पैसा निवेश करने के लिए:\n\n1. मार्केटप्लेस पर जाएं\n2. उपलब्ध लोन अनुरोधों को ब्राउज़ करें\n3. उधारकर्ता विवरण और ट्रस्ट स्कोर की समीक्षा करें\n4. जिन लोनों में निवेश करना चाहते हैं, उन पर "इस लोन को फंड करें" पर क्लिक करें\n5. अपनी निवेश राशि दर्ज करें\n6. अपना निवेश पुष्टि करें\n\nजैसे-जैसे उधारकर्ता भुगतान करेगा, आपको रिटर्न मिलना शुरू हो जाएगा।',
      suggestions: [
        'न्यूनतम निवेश क्या है?',
        'मैं कैसे चुनूं कि किन लोनों में निवेश करूं?',
        'जोखिम क्या हैं?'
      ]
    },
    'default': {
      message: 'मैं यहां आपकी लोन, निवेश और हमारे प्लेटफॉर्म के उपयोग के बारे में सवालों में मदद करने के लिए हूं। आप मुझसे पूछ सकते हैं:\n\n• लोन अनुरोध बनाने के बारे में\n• चुकौती कार्यक्रम देखने के बारे में\n• लोन आंकड़े देखने के बारे में\n• लोन में निवेश के बारे में\n• ट्रस्ट स्कोर समझने के बारे में\n• प्लेटफॉर्म सुविधाओं के बारे में\n\nआप क्या जानना चाहते हैं?',
      suggestions: [
        'मैं लोन अनुरोध कैसे बना सकता हूं?',
        'मैं अपना चुकौती कार्यक्रम कैसे देख सकता हूं?',
        'मैं अपने लोन आंकड़े कैसे देख सकता हूं?',
        'मैं लोन में पैसा कैसे निवेश कर सकता हूं?'
      ]
    }
  }
};

export const getChatbotResponse = async (
  message: string,
  language: string = 'en'
): Promise<ChatbotResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

  const normalizedMessage = message.toLowerCase().trim();
  const lang = language === 'hi' ? 'hi' : 'en';
  
  // Find matching response
  for (const [key, response] of Object.entries(mockResponses[lang])) {
    if (normalizedMessage.includes(key) || key === 'default') {
      return response;
    }
  }

  // Fallback to default response
  return mockResponses[lang].default;
};

// Real OpenAI API integration (for production)
export const getOpenAIResponse = async (
  message: string,
  language: string = 'en',
  apiKey: string
): Promise<ChatbotResponse> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant for a peer-to-peer lending platform. Respond in ${language === 'hi' ? 'Hindi' : 'English'}. Help users with questions about loans, investments, and platform features. Keep responses concise and helpful.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      return {
        message: data.choices[0].message.content,
        suggestions: []
      };
    }

    throw new Error('No response from OpenAI');
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback to mock response
    return getChatbotResponse(message, language);
  }
};
