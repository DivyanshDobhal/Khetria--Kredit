import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SpeakerButton, useTextToSpeech } from './SpeakerButton';
import { useI18n } from '@/contexts/I18nContext';
import { Volume2, Play, Pause } from 'lucide-react';

export const TTSDemo: React.FC = () => {
  const { t, language } = useI18n();
  const { speak, stop } = useTextToSpeech();

  const demoTexts = {
    en: {
      welcome: "Welcome to Kshetra Kredit! Your trusted peer-to-peer lending platform.",
      features: "Our platform offers competitive returns, trust-based lending, fast funding, and community-driven growth.",
      instructions: "Click the speaker buttons to hear the text read aloud in your selected language."
    },
    hi: {
      welcome: "क्षेत्र क्रेडिट में आपका स्वागत है! आपका विश्वसनीय पीयर-टू-पीयर लेंडिंग प्लेटफॉर्म।",
      features: "हमारा प्लेटफॉर्म प्रतिस्पर्धी रिटर्न, विश्वास-आधारित उधार, तेज़ फंडिंग और समुदाय-संचालित विकास प्रदान करता है।",
      instructions: "टेक्स्ट को जोर से सुनने के लिए स्पीकर बटन पर क्लिक करें।"
    }
  };

  const currentTexts = demoTexts[language as keyof typeof demoTexts] || demoTexts.en;

  const handlePlayAll = async () => {
    const fullText = `${currentTexts.welcome} ${currentTexts.features} ${currentTexts.instructions}`;
    await speak(fullText);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Text-to-Speech Demo
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={handlePlayAll} variant="outline" size="sm">
              <Play className="h-4 w-4 mr-2" />
              Play All
            </Button>
            <Button onClick={stop} variant="outline" size="sm">
              <Pause className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Welcome Message */}
        <div className="flex items-start justify-between gap-4 p-4 bg-muted rounded-lg">
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Welcome Message</h3>
            <p className="text-sm text-muted-foreground">{currentTexts.welcome}</p>
          </div>
          <SpeakerButton 
            text={currentTexts.welcome}
            size="md"
            variant="outline"
          />
        </div>

        {/* Features */}
        <div className="flex items-start justify-between gap-4 p-4 bg-muted rounded-lg">
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Features</h3>
            <p className="text-sm text-muted-foreground">{currentTexts.features}</p>
          </div>
          <SpeakerButton 
            text={currentTexts.features}
            size="md"
            variant="outline"
          />
        </div>

        {/* Instructions */}
        <div className="flex items-start justify-between gap-4 p-4 bg-muted rounded-lg">
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Instructions</h3>
            <p className="text-sm text-muted-foreground">{currentTexts.instructions}</p>
          </div>
          <SpeakerButton 
            text={currentTexts.instructions}
            size="md"
            variant="outline"
          />
        </div>

        {/* Language Info */}
        <div className="text-center text-sm text-muted-foreground">
          Current Language: <span className="font-semibold">{language === 'hi' ? 'हिन्दी' : 'English'}</span>
        </div>
      </CardContent>
    </Card>
  );
};
