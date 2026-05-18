import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Download, Search, Check } from 'lucide-react';

const TermsAndConditions: React.FC = () => {
  const { t, language } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  // Function to handle PDF download
  const handleDownloadPDF = () => {
    // In a real implementation, this would generate and download a PDF
    // For now, we'll just show an alert
    alert('PDF download functionality would be implemented here');
  };

  // Function to handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery && contentRef.current) {
      // Simple implementation: find and scroll to the first occurrence
      const content = contentRef.current.innerHTML.toLowerCase();
      const searchIndex = content.indexOf(searchQuery.toLowerCase());
      
      if (searchIndex !== -1) {
        // Create a range to find the closest element containing the text
        const range = document.createRange();
        const textNodes = [];
        
        // Get all text nodes in the content
        const walker = document.createTreeWalker(
          contentRef.current,
          NodeFilter.SHOW_TEXT,
          null
        );
        
        let node;
        while (node = walker.nextNode()) {
          textNodes.push(node);
        }
        
        // Find the node containing the search text
        for (const textNode of textNodes) {
          if (textNode.textContent?.toLowerCase().includes(searchQuery.toLowerCase())) {
            // Scroll to the element
            textNode.parentElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Highlight the element temporarily
            const originalBackground = textNode.parentElement?.style.background;
            const originalTransition = textNode.parentElement?.style.transition;
            
            if (textNode.parentElement) {
              textNode.parentElement.style.background = 'rgba(255, 255, 0, 0.3)';
              textNode.parentElement.style.transition = 'background 0.5s';
              
              setTimeout(() => {
                if (textNode.parentElement) {
                  textNode.parentElement.style.background = originalBackground || '';
                  textNode.parentElement.style.transition = originalTransition || '';
                }
              }, 2000);
            }
            
            break;
          }
        }
      } else {
        alert('No matches found for: ' + searchQuery);
      }
    }
  };

  // Navigation sections
  const sections = [
    { id: 'general', label: language === 'hi' ? 'सामान्य प्लेटफॉर्म उपयोग' : 'General Platform Usage' },
    { id: 'borrowers', label: language === 'hi' ? 'उधारकर्ता' : 'Borrowers' },
    { id: 'lenders', label: language === 'hi' ? 'ऋणदाता' : 'Lenders' },
    { id: 'security', label: language === 'hi' ? 'सुरक्षा और अनुपालन' : 'Security & Compliance' },
    { id: 'grievance', label: language === 'hi' ? 'शिकायत और विवाद समाधान' : 'Grievance & Dispute Resolution' },
    { id: 'amendments', label: language === 'hi' ? 'संशोधन' : 'Amendments' },
    { id: 'consequences', label: language === 'hi' ? 'गैर-चुकौती के परिणाम' : 'Consequences of Non-Repayment' },
  ];

  // Scroll to section function
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card/80 backdrop-blur-lg border-b border-border/50 sticky top-16 z-10"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-bold text-foreground">
              {language === 'hi' ? 'नियम और शर्तें' : 'Terms & Conditions'}
            </h1>
            
            {/* Search Bar */}
            <div className="w-full md:w-auto flex-1 md:max-w-md">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder={language === 'hi' ? 'नियम और शर्तों में खोजें...' : 'Search in Terms & Conditions...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  variant="ghost" 
                  className="absolute right-0 top-0 h-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
            
            {/* Download Button */}
            <Button onClick={handleDownloadPDF} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              {language === 'hi' ? 'PDF डाउनलोड करें' : 'Download PDF'}
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation - Desktop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:block w-64 sticky self-start top-40"
          >
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <Button
                      key={section.id}
                      variant="ghost"
                      className="w-full justify-start text-left"
                      onClick={() => scrollToSection(section.id)}
                    >
                      {section.label}
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar Navigation - Mobile */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:hidden w-full sticky top-32 z-10 bg-background pb-4"
          >
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="w-full overflow-x-auto flex-nowrap justify-start h-auto py-2 bg-card/80 backdrop-blur-lg">
                {sections.map((section) => (
                  <TabsTrigger 
                    key={section.id} 
                    value={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="whitespace-nowrap"
                  >
                    {section.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex-1"
            ref={contentRef}
          >
            {/* Terms and Conditions Content */}
            <div className="space-y-8">
              {/* Introduction */}
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    {language === 'hi' ? 'पी2पी माइक्रो-लेंडिंग प्लेटफॉर्म के लिए नियम और शर्तें' : 'Terms and Conditions for P2P Micro-Lending Platform'}
                  </h2>
                  <p className="text-muted-foreground">
                    {language === 'hi' 
                      ? 'ये नियम RBI विनियमों, प्रमुख प्लेटफॉर्म से सफल खंडों, हाल के शोध पत्रों में उल्लिखित सर्वोत्तम प्रथाओं और व्यावहारिक 90-दिवसीय लॉन्च सुरक्षा उपायों को जोड़ते हैं।' 
                      : 'These terms combine RBI regulations, successful clauses from leading platforms, best practices noted in recent research papers, and practical 90-day launch safeguards.'}
                  </p>
                </CardContent>
              </Card>

              {/* General Platform Usage */}
              <Card id="general" className="scroll-mt-40 overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    {language === 'hi' ? 'सामान्य प्लेटफॉर्म उपयोग' : 'GENERAL PLATFORM USAGE'}
                  </h2>
                  
                  <div className="space-y-4">
                    <p>
                      {language === 'hi' 
                        ? 'ऋणदाताओं और उधारकर्ताओं दोनों को लेनदेन करने से पहले प्लेटफॉर्म KYC पूरा करना, सभी विवरणों को सत्यापित करना और RBI NBFC-P2P नियमों से सहमत होना चाहिए।' 
                        : 'Both lenders and borrowers must complete platform KYC, verify all details, and agree to RBI NBFC-P2P rules before transacting.'}
                    </p>
                    
                    <p>
                      {language === 'hi' 
                        ? 'भागीदारी सख्ती से भारतीय निवासियों तक सीमित है।' 
                        : 'Participation is strictly limited to Indian residents.'}
                    </p>
                    
                    <p>
                      {language === 'hi' 
                        ? 'आप गोपनीयता नीति से सहमत हैं और नियामक, जोखिम और मिलान उद्देश्यों के लिए अपने क्रेडिट और पहचान डेटा के उपयोग, समीक्षा और साझाकरण के लिए सहमति देते हैं।' 
                        : 'You agree to the privacy policy and consent to the use, review, and sharing of your credit and identity data for regulatory, risk, and matching purposes.'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* For Borrowers */}
              <Card id="borrowers" className="scroll-mt-40 overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    {language === 'hi' ? 'उधारकर्ताओं के लिए' : 'FOR BORROWERS'}
                  </h2>
                  
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="eligibility">
                      <AccordionTrigger className="text-lg font-semibold">
                        {language === 'hi' ? 'पात्रता और ऋण आवेदन' : 'Eligibility & Loan Application'}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <p>
                          {language === 'hi' 
                            ? '18+ होना चाहिए, भारतीय नागरिक होना चाहिए, और सत्य वित्तीय डेटा प्रदान करना चाहिए (आय, रोजगार, अनुरोध के अनुसार वैकल्पिक डेटा)।' 
                            : 'Must be 18+, Indian citizen, and provide truthful financial data (income, employment, alternate data as requested).'}
                        </p>
                        
                        <p>
                          {language === 'hi' 
                            ? 'RBI दिशानिर्देशों के अनुसार सभी P2P प्लेटफॉर्म पर अधिकतम उधार लेने योग्य राशि 10 लाख INR तक सीमित है।' 
                            : 'Maximum borrowable amount is capped at INR 10 lakh across all P2P platforms as per RBI guidelines.'}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="credit-assessment">
                      <AccordionTrigger className="text-lg font-semibold">
                        {language === 'hi' ? 'क्रेडिट मूल्यांकन और स्वीकृति' : 'Credit Assessment & Acceptance'}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <p>
                          {language === 'hi' 
                            ? 'आवेदन करके, आप ब्यूरो स्कोर और वैकल्पिक-डेटा फीड (उपयोगिता बिल, GST, बैंकिंग डेटा) का उपयोग करके क्रेडिट-चेक के लिए सहमति देते हैं।' 
                            : 'By applying, you consent to credit-checks using bureau scores and alternative-data feeds (utility bills, GST, banking data).'}
                        </p>
                        
                        <p>
                          {language === 'hi' 
                            ? 'ऋण प्रस्ताव अनुमोदन के अधीन हैं, और अंतिम दरें रियल-टाइम ऋणदाता बोलियों के साथ-साथ क्रेडिट स्कोर और जोखिम रैंकिंग द्वारा निर्धारित की जाती हैं।' 
                            : 'Loan offers are subject to approval, and final rates are determined by real-time lender bids plus credit score and risk ranking.'}
                        </p>
                        
                        <p>
                          {language === 'hi' 
                            ? 'आपको किसी भी प्रस्ताव को स्वीकार करने से पहले ऋण अवधि, दर, पुनर्भुगतान अनुसूची और प्लेटफॉर्म शुल्क की समीक्षा करनी चाहिए।' 
                            : 'You should review loan tenure, rate, repayment schedule, and platform fees before accepting any offer.'}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="repayment">
                      <AccordionTrigger className="text-lg font-semibold">
                        {language === 'hi' ? 'पुनर्भुगतान दायित्व' : 'Repayment Obligations'}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <p>
                          {language === 'hi' 
                            ? 'उधारकर्ताओं को सहमत अनुसूची (साप्ताहिक, पाक्षिक, या मासिक EMI) के अनुसार मूलधन और ब्याज का पुनर्भुगतान करना होगा।' 
                            : 'Borrowers must repay principal and interest as per the agreed schedule (weekly, fortnightly, or monthly EMIs).'}
                        </p>
                        
                        <p>
                          {language === 'hi' 
                            ? '90 दिनों से अधिक की देरी (डिफ़ॉल्ट) औपचारिक संग्रह प्रयासों, कानूनी नोटिस, क्रेडिट ब्यूरो रिपोर्टिंग को ट्रिगर करेगी, और भविष्य के उपयोग को प्रतिबंधित कर सकती है।' 
                            : 'Delays beyond 90 days (default) will trigger formal collection efforts, legal notices, credit bureau reporting, and may restrict future access.'}
                        </p>
                        
                        <p>
                          {language === 'hi' 
                            ? 'जब तक विशिष्ट ऋण शर्तों में अन्यथा न कहा गया हो, शीघ्र पुनर्भुगतान की अनुमति बिना किसी दंड के है।' 
                            : 'Early repayment is permitted with no penalty, unless stated otherwise in specific loan terms.'}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="data-communication">
                      <AccordionTrigger className="text-lg font-semibold">
                        {language === 'hi' ? 'डेटा और संचार' : 'Data and Communication'}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <p>
                          {language === 'hi' 
                            ? 'संपर्क, बैंकिंग और प्रोफ़ाइल जानकारी को हर समय अप-टू-डेट रखना आपकी जिम्मेदारी है।' 
                            : 'It is your responsibility to keep contact, banking, and profile information up to date at all times.'}
                        </p>
                        
                        <p>
                          {language === 'hi' 
                            ? 'प्लेटफॉर्म नियमों, वितरण अनुसूची या शुल्क में किसी भी परिवर्तन के मामले में आपको सूचित करेगा।' 
                            : 'Platform will notify you in case of any changes to terms, disbursement schedule, or fees.'}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* For Lenders */}
              <Card id="lenders" className="scroll-mt-40 overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    {language === 'hi' ? 'ऋणदाताओं के लिए' : 'FOR LENDERS'}
                  </h2>
                  
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="limits">
                      <AccordionTrigger className="text-lg font-semibold">
                        {language === 'hi' ? 'सीमाएँ और विविधीकरण' : 'Limits & Diversification'}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <p>
                          {language === 'hi' 
                            ? 'सभी P2P प्लेटफॉर्म पर अधिकतम कुल उधार 50 लाख INR तक सीमित है; प्रति उधारकर्ता एक्सपोजर 50,000 INR से अधिक नहीं हो सकता।' 
                            : 'Maximum total lending across all P2P platforms is capped at INR 50 lakh; per borrower exposure cannot exceed INR 50,000.'}
                        </p>
                        
                        <p>
                          {language === 'hi' 
                            ? 'आपको जोखिम कम करने के लिए कई ऋणों में विविधता लाने के लिए प्रोत्साहित किया जाता है, जिसे ऑटो-इन्वेस्ट और ऑर्डर बुक मैचिंग सुविधाओं द्वारा सुविधाजनक बनाया जाता है।' 
                            : 'You are encouraged to diversify across multiple loans to reduce risk, facilitated by auto-invest and order book matching features.'}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="fund-handling">
                      <AccordionTrigger className="text-lg font-semibold">
                        {language === 'hi' ? 'फंड हैंडलिंग और एस्क्रो' : 'Fund Handling & Escrow'}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <p>
                          {language === 'hi' 
                            ? 'सभी फंड अनुमोदित ट्रस्टियों द्वारा प्रबंधित बैंक एस्क्रो खातों में रखे जाते हैं; प्लेटफॉर्म कभी भी सीधे आपके नकद को नहीं संभालता है।' 
                            : 'All funds are held in bank escrow accounts managed by approved trustees; platform never directly handles your cash.'}
                        </p>
                        
                        <p>
                          {language === 'hi' 
                            ? 'आप उधारकर्ता अनुसूची और एस्क्रो निपटान के अनुसार पुनर्भुगतान, मूलधन और ब्याज प्राप्त करेंगे, आमतौर पर T+1 आधार पर।' 
                            : 'You will receive repayments, principal, and interest according to borrower schedule and escrow settlement, generally on a T+1 basis.'}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="default">
                      <AccordionTrigger className="text-lg font-semibold">
                        {language === 'hi' ? 'डिफ़ॉल्ट और रिकवरी' : 'Default & Recovery'}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <p>
                          {language === 'hi' 
                            ? 'RBI निर्देशों के अनुपालन में, प्लेटफॉर्म द्वारा कोई क्रेडिट गारंटी या डिफ़ॉल्ट हानि सुरक्षा प्रदान नहीं की जाती है।' 
                            : 'No credit guarantees or default loss protections are provided by the platform, in compliance with RBI directions.'}
                        </p>
                        
                        <p>
                          {language === 'hi' 
                            ? 'डिफ़ॉल्ट पर, संग्रह एजेंसियों या कानूनी विकल्पों को सक्रिय किया जा सकता है। रिकवरी की गारंटी नहीं है और जोखिम पूरी तरह से ऋणदाता द्वारा वहन किया जाता है।' 
                            : 'On default, collection agencies or legal options may be activated. Recovery is not guaranteed and the risk is fully borne by the lender.'}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="disclosures">
                      <AccordionTrigger className="text-lg font-semibold">
                        {language === 'hi' ? 'प्रकटीकरण और डेटा' : 'Disclosures and Data'}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <p>
                          {language === 'hi' 
                            ? 'आपको उधार देने से पहले संभावित उधारकर्ताओं के बारे में पूरी जानकारी (क्रेडिट स्कोर, ऋण उद्देश्य, शर्तें) प्राप्त होगी।' 
                            : 'You will receive full information about potential borrowers (credit score, loan purpose, terms) prior to lending.'}
                        </p>
                        
                        <p>
                          {language === 'hi' 
                            ? 'सभी प्लेटफॉर्म शुल्क, दरें और डिफ़ॉल्ट आंकड़े पारदर्शी रूप से प्रकाशित किए जाते हैं और त्रैमासिक रूप से अपडेट किए जाते हैं।' 
                            : 'All platform fees, rates, and default statistics are transparently published and updated quarterly.'}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="reporting">
                      <AccordionTrigger className="text-lg font-semibold">
                        {language === 'hi' ? 'रिपोर्टिंग और रिकॉर्ड' : 'Reporting & Records'}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <p>
                          {language === 'hi' 
                            ? 'लेनदेन रिकॉर्ड, बोली इतिहास और संचार ऑडिट और नियामक समीक्षा के लिए कम से कम आठ वर्षों तक बनाए रखे जाएंगे।' 
                            : 'Transaction records, bid history, and communications will be retained for at least eight years for audit and regulatory review.'}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Security & Compliance */}
              <Card id="security" className="scroll-mt-40 overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    {language === 'hi' ? 'सुरक्षा और अनुपालन' : 'SECURITY & COMPLIANCE'}
                  </h2>
                  
                  <div className="space-y-4">
                    <p>
                      {language === 'hi' 
                        ? 'प्लेटफॉर्म अनिवार्य शिकायत निवारण और RBI रिपोर्टिंग के साथ NBFC-P2P लाइसेंस के तहत संचालित होता है।' 
                        : 'The platform operates under an NBFC-P2P license with mandatory grievance redressal and RBI reporting.'}
                    </p>
                    
                    <p>
                      {language === 'hi' 
                        ? 'सभी उधार और उधार लेने की गतिविधि प्लेटफॉर्म नीति द्वारा अनुमति के अनुसार घरेलू, गैर-वाणिज्यिक और व्यक्तिगत उपयोग तक प्रतिबंधित है।' 
                        : 'All lending and borrowing activity is restricted to domestic, non-commercial, and personal use, except as permitted by platform policy.'}
                    </p>
                    
                    <p>
                      {language === 'hi' 
                        ? 'AML, KYC और धोखाधड़ी जांच सख्ती से लागू की जाती है।' 
                        : 'AML, KYC, and fraud checks are strictly enforced.'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Grievance & Dispute Resolution */}
              <Card id="grievance" className="scroll-mt-40 overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    {language === 'hi' ? 'शिकायत और विवाद समाधान' : 'GRIEVANCE & DISPUTE RESOLUTION'}
                  </h2>
                  
                  <div className="space-y-4">
                    <p>
                      {language === 'hi' 
                        ? 'सभी उपयोगकर्ताओं को 30 दिनों के भीतर समाधान के साथ शिकायतों के लिए एक औपचारिक शिकायत निवारण प्रणाली तक पहुंच है।' 
                        : 'All users have access to a formal grievance redressal system for complaints with resolution within 30 days.'}
                    </p>
                    
                    <p>
                      {language === 'hi' 
                        ? 'विवादों को भारतीय अदालतों के अधिकार क्षेत्र के तहत शासित किया जाएगा, जहां प्रासंगिक हो, नियामक वृद्धि का सहारा लिया जाएगा।' 
                        : 'Disputes will be governed under the jurisdiction of Indian courts with recourse to regulatory escalation where relevant.'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Amendments */}
              <Card id="amendments" className="scroll-mt-40 overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    {language === 'hi' ? 'संशोधन' : 'AMENDMENTS'}
                  </h2>
                  
                  <div className="space-y-4">
                    <p>
                      {language === 'hi' 
                        ? 'प्लेटफॉर्म RBI नीतियों, उद्योग कानूनों और परिचालन आवश्यकताओं के अनुसार इन नियमों को अपडेट करने का अधिकार सुरक्षित रखता है।' 
                        : 'The platform reserves the right to update these terms in line with RBI policies, industry laws, and operational requirements.'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Consequences of Non-Repayment */}
              <Card id="consequences" className="scroll-mt-40 overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    {language === 'hi' ? 'अतिरिक्त शर्तें: गैर-चुकौती के परिणाम' : 'ADDITIONAL TERMS: CONSEQUENCES OF NON-REPAYMENT'}
                  </h2>
                  
                  <div className="space-y-4">
                    <p>
                      {language === 'hi' 
                        ? 'गैर-भुगतान के परिणामों में शामिल हो सकते हैं:' 
                        : 'Consequences of non-repayment may include:'}
                    </p>
                    
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        {language === 'hi' 
                          ? 'विलंबित भुगतान शुल्क और दंड ब्याज' 
                          : 'Late payment fees and penalty interest'}
                      </li>
                      <li>
                        {language === 'hi' 
                          ? 'क्रेडिट ब्यूरो को नकारात्मक रिपोर्टिंग' 
                          : 'Negative reporting to credit bureaus'}
                      </li>
                      <li>
                        {language === 'hi' 
                          ? 'कानूनी कार्रवाई और वसूली प्रक्रियाएं' 
                          : 'Legal action and recovery procedures'}
                      </li>
                      <li>
                        {language === 'hi' 
                          ? 'प्लेटफॉर्म पर भविष्य के उपयोग पर प्रतिबंध' 
                          : 'Restrictions on future usage on the platform'}
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;