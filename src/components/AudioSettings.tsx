import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/contexts/I18nContext';
import { Volume2, VolumeX, Settings, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

interface AudioSettingsProps {
  onSettingsChange?: (settings: AudioSettings) => void;
  className?: string;
}

export interface AudioSettings {
  enabled: boolean;
  rate: number;
  pitch: number;
  volume: number;
  voice: string;
  autoPlay: boolean;
}

export const AudioSettings: React.FC<AudioSettingsProps> = ({
  onSettingsChange,
  className = ''
}) => {
  const { language } = useI18n();
  const [settings, setSettings] = useState<AudioSettings>({
    enabled: true,
    rate: 0.9,
    pitch: 1,
    volume: 0.8,
    voice: 'default',
    autoPlay: false
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [testText, setTestText] = useState('');

  const voices = typeof window !== 'undefined' && 'speechSynthesis' in window 
    ? speechSynthesis.getVoices() 
    : [];

  const updateSettings = (newSettings: Partial<AudioSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    onSettingsChange?.(updatedSettings);
  };

  const testAudio = () => {
    if (!testText.trim()) {
      setTestText(language === 'hi' ? 'यह एक परीक्षण संदेश है' : 'This is a test message');
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.log('Speech synthesis not available');
      return;
    }

    speechSynthesis.cancel();
    setIsPlaying(true);

    const utterance = new SpeechSynthesisUtterance(testText || (language === 'hi' ? 'यह एक परीक्षण संदेश है' : 'This is a test message'));
    
    // Set voice
    if (settings.voice !== 'default') {
      const selectedVoice = voices.find(v => v.name === settings.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    // Set properties
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const getTitle = () => {
    return language === 'hi' ? 'ऑडियो सेटिंग्स' : 'Audio Settings';
  };

  const getDescription = () => {
    return language === 'hi' 
      ? 'वॉयस और ऑडियो विकल्पों को कस्टमाइज़ करें'
      : 'Customize voice and audio options';
  };

  return (
    <Card className={`bg-gradient-card border-border/50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>{getTitle()}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {getDescription()}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Audio */}
        <div className="flex items-center justify-between">
          <Label htmlFor="audio-enabled" className="text-sm font-medium">
            {language === 'hi' ? 'ऑडियो सक्षम करें' : 'Enable Audio'}
          </Label>
          <Switch
            id="audio-enabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => updateSettings({ enabled: checked })}
          />
        </div>

        {/* Voice Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {language === 'hi' ? 'आवाज़ चुनें' : 'Select Voice'}
          </Label>
          <Select 
            value={settings.voice} 
            onValueChange={(value) => updateSettings({ voice: value })}
            disabled={!settings.enabled}
          >
            <SelectTrigger>
              <SelectValue placeholder={language === 'hi' ? 'आवाज़ चुनें' : 'Select voice'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">
                {language === 'hi' ? 'डिफ़ॉल्ट आवाज़' : 'Default Voice'}
              </SelectItem>
              {voices.map((voice, index) => (
                <SelectItem key={index} value={voice.name}>
                  {voice.name} ({voice.lang})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Speech Rate */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {language === 'hi' ? 'बोलने की गति' : 'Speech Rate'} ({settings.rate.toFixed(1)})
          </Label>
          <Slider
            value={[settings.rate]}
            onValueChange={([value]) => updateSettings({ rate: value })}
            min={0.5}
            max={2}
            step={0.1}
            disabled={!settings.enabled}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{language === 'hi' ? 'धीमा' : 'Slow'}</span>
            <span>{language === 'hi' ? 'तेज़' : 'Fast'}</span>
          </div>
        </div>

        {/* Pitch */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {language === 'hi' ? 'आवाज़ की पिच' : 'Pitch'} ({settings.pitch.toFixed(1)})
          </Label>
          <Slider
            value={[settings.pitch]}
            onValueChange={([value]) => updateSettings({ pitch: value })}
            min={0.5}
            max={2}
            step={0.1}
            disabled={!settings.enabled}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{language === 'hi' ? 'कम' : 'Low'}</span>
            <span>{language === 'hi' ? 'उच्च' : 'High'}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {language === 'hi' ? 'आवाज़ की मात्रा' : 'Volume'} ({Math.round(settings.volume * 100)}%)
          </Label>
          <Slider
            value={[settings.volume]}
            onValueChange={([value]) => updateSettings({ volume: value })}
            min={0}
            max={1}
            step={0.1}
            disabled={!settings.enabled}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{language === 'hi' ? 'शांत' : 'Quiet'}</span>
            <span>{language === 'hi' ? 'ज़ोरदार' : 'Loud'}</span>
          </div>
        </div>

        {/* Auto Play */}
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-play" className="text-sm font-medium">
            {language === 'hi' ? 'स्वचालित प्ले' : 'Auto Play'}
          </Label>
          <Switch
            id="auto-play"
            checked={settings.autoPlay}
            onCheckedChange={(checked) => updateSettings({ autoPlay: checked })}
            disabled={!settings.enabled}
          />
        </div>

        {/* Test Audio */}
        <div className="space-y-3 pt-4 border-t border-border/50">
          <Label className="text-sm font-medium">
            {language === 'hi' ? 'ऑडियो परीक्षण' : 'Test Audio'}
          </Label>
          <div className="space-y-2">
            <input
              type="text"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder={language === 'hi' ? 'परीक्षण पाठ दर्ज करें' : 'Enter test text'}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              disabled={!settings.enabled}
            />
            <div className="flex space-x-2">
              <Button
                onClick={isPlaying ? stopAudio : testAudio}
                disabled={!settings.enabled}
                size="sm"
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
        </div>
      </CardContent>
    </Card>
  );
};
