import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/contexts/I18nContext';
import { Volume2, Play, Pause } from 'lucide-react';

export const AudioTest: React.FC = () => {
  const { language } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);

  const testText = language === 'hi' 
    ? 'नमस्ते! यह एक परीक्षण संदेश है। आवाज़ सही तरीके से काम कर रही है।'
    : 'Hello! This is a test message. The voice is working correctly.';

  const speak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.log('Speech synthesis not available');
      return;
    }

    speechSynthesis.cancel();
    setIsPlaying(true);

    const utterance = new SpeechSynthesisUtterance(testText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Volume2 className="w-5 h-5" />
          <span>{language === 'hi' ? 'ऑडियो परीक्षण' : 'Audio Test'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {language === 'hi' 
              ? 'स्पीकर बटन काम कर रहा है या नहीं, इसकी जांच करें'
              : 'Test if the speaker button is working correctly'
            }
          </p>
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {language === 'hi' ? 'परीक्षण पाठ:' : 'Test Text:'}
            </p>
            <p className="text-sm bg-muted/30 p-3 rounded-lg">
              {testText}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={isPlaying ? stop : speak}
              className="flex-1"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  {language === 'hi' ? 'रोकें' : 'Stop'}
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {language === 'hi' ? 'प्ले करें' : 'Play'}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
