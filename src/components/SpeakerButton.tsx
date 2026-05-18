import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useI18n } from '@/contexts/I18nContext';

interface SpeakerButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  disabled?: boolean;
}

export const SpeakerButton: React.FC<SpeakerButtonProps> = ({
  text,
  className = '',
  size = 'sm',
  variant = 'ghost',
  disabled = false
}) => {
  const { language } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speech, setSpeech] = useState<SpeechSynthesisUtterance | null>(null);

  // Get appropriate voice for the current language
  const getVoice = () => {
    const voices = speechSynthesis.getVoices();
    const targetLang = language === 'hi' ? 'hi-IN' : 'en-US';
    
    // Try to find exact language match first
    let voice = voices.find(v => v.lang === targetLang);
    
    // Fallback to any Hindi voice for Hindi
    if (!voice && language === 'hi') {
      voice = voices.find(v => v.lang.startsWith('hi'));
    }
    
    // Fallback to any English voice for English
    if (!voice && language === 'en') {
      voice = voices.find(v => v.lang.startsWith('en'));
    }
    
    // Final fallback to default voice
    if (!voice) {
      voice = voices.find(v => v.default) || voices[0];
    }
    
    return voice;
  };

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Load voices when they become available
      const loadVoices = () => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          console.log('Voices loaded:', voices.length);
        }
      };

      // Some browsers load voices asynchronously
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener('voiceschanged', loadVoices);
        return () => speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      } else {
        loadVoices();
      }
    }
  }, []);

  const speak = () => {
    if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.log('Speech synthesis not available');
      return;
    }

    // Stop any current speech
    speechSynthesis.cancel();

    setIsLoading(true);

    // Wait for voices to load if they're not available yet
    const waitForVoices = () => {
      return new Promise<void>((resolve) => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          resolve();
        } else {
          const onVoicesChanged = () => {
            speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
            resolve();
          };
          speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
        }
      });
    };

    waitForVoices().then(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = getVoice();
      
      console.log('Selected voice:', voice?.name, voice?.lang);
      
      if (voice) {
        utterance.voice = voice;
      }

      // Set speech properties
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';

      // Event handlers
      utterance.onstart = () => {
        console.log('Speech started');
        setIsPlaying(true);
        setIsLoading(false);
      };

      utterance.onend = () => {
        console.log('Speech ended');
        setIsPlaying(false);
        setSpeech(null);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
        setIsLoading(false);
        setSpeech(null);
      };

      utterance.onpause = () => {
        setIsPlaying(false);
      };

      utterance.onresume = () => {
        setIsPlaying(true);
      };

      setSpeech(utterance);
      speechSynthesis.speak(utterance);
    });
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsLoading(false);
    setSpeech(null);
  };

  const handleClick = () => {
    if (isPlaying) {
      stop();
    } else {
      speak();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  // Stop speech when component unmounts or text changes
  useEffect(() => {
    return () => {
      if (speech) {
        speechSynthesis.cancel();
      }
    };
  }, [text]);

  const getTooltipText = () => {
    return language === 'hi' ? 'जोर से पढ़ें' : 'Read aloud';
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8';
      case 'md': return 'h-10 w-10';
      case 'lg': return 'h-12 w-12';
      default: return 'h-8 w-8';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'md': return 'h-5 w-5';
      case 'lg': return 'h-6 w-6';
      default: return 'h-4 w-4';
    }
  };

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null; // Don't render if TTS is not supported
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleClick}
            disabled={disabled || !text.trim()}
            variant={variant}
            size="icon"
            className={`${getButtonSize()} ${className} transition-all duration-200 hover:scale-105`}
            aria-label={getTooltipText()}
          >
            {isLoading ? (
              <Loader2 className={`${getIconSize()} animate-spin`} />
            ) : isPlaying ? (
              <VolumeX className={getIconSize()} />
            ) : (
              <Volume2 className={getIconSize()} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Hook for easy TTS usage
export const useTextToSpeech = () => {
  const { language } = useI18n();

  const speak = (text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
  }) => {
    if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const voices = speechSynthesis.getVoices();
      const targetLang = language === 'hi' ? 'hi-IN' : 'en-US';
      
      let voice = voices.find(v => v.lang === targetLang);
      if (!voice && language === 'hi') {
        voice = voices.find(v => v.lang.startsWith('hi'));
      }
      if (!voice && language === 'en') {
        voice = voices.find(v => v.lang.startsWith('en'));
      }
      if (!voice) {
        voice = voices.find(v => v.default) || voices[0];
      }

      if (voice) {
        utterance.voice = voice;
      }

      utterance.rate = options?.rate || 0.9;
      utterance.pitch = options?.pitch || 1;
      utterance.volume = options?.volume || 0.8;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(event);

      speechSynthesis.speak(utterance);
    });
  };

  const stop = () => {
    speechSynthesis.cancel();
  };

  return { speak, stop };
};
