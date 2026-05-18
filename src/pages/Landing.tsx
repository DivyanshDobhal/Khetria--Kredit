import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/contexts/I18nContext';
import { TrendingUp, Shield, Zap, Users, ArrowRight, CheckCircle, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';
import { SpeakerButton } from '@/components/SpeakerButton';
import { TTSDemo } from '@/components/TTSDemo';

const Landing: React.FC = () => {
  const { t } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Handle video play/pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  // Handle video mute/unmute
  const toggleMute = () => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  };
  
  // Handle fullscreen
  const toggleFullscreen = () => {
    const videoContainer = document.querySelector('.aspect-video') as HTMLElement;
    if (!videoContainer) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoContainer.requestFullscreen();
    }
  };
  
  // Handle playback speed change
  const changePlaybackSpeed = (speed: string | number) => {
    if (!videoRef.current) return;
    const newSpeed = typeof speed === 'string' ? parseFloat(speed) : speed;
    videoRef.current.playbackRate = newSpeed;
    setPlaybackSpeed(newSpeed);
  };
  
  // Add event listeners to video element
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('ended', handleEnded);
    
    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, []);
  
  const features = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: t('landing.features.competitiveReturns.title'),
      description: t('landing.features.competitiveReturns.description')
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t('landing.features.trustBased.title'),
      description: t('landing.features.trustBased.description')
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t('landing.features.fastFunding.title'),
      description: t('landing.features.fastFunding.description')
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t('landing.features.communityDriven.title'),
      description: t('landing.features.communityDriven.description')
    }
  ];

  const stats = [
    { label: t('landing.stats.loansFunded'), value: "₹2Cr+" },
    { label: t('landing.stats.activeBorrowers'), value: "1,200+" },
    { label: t('landing.stats.defaultRate'), value: "<2%" },
    { label: t('landing.stats.avgFundingTime'), value: "6 hours" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/ET Financial Inclusion Summit_ Taking digital banking to rural India (1).jpeg"
            alt={t('landing.images.heroBackground')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 mb-8">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight flex-1">
                    {t('landing.hero.title')}{' '}
                    <span className="text-primary">
                      {t('landing.hero.titleHighlight')}
                    </span>
                  </h1>
                  <SpeakerButton 
                    text={`${t('landing.hero.title')} ${t('landing.hero.titleHighlight')}`}
                    size="lg"
                    variant="ghost"
                    className="text-white hover:text-white/80"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-xl lg:text-2xl text-white/90 font-medium max-w-2xl mx-auto">
                {t('landing.hero.subtitle')}<br />
                {t('landing.hero.subtitle2')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-4 h-auto">
                <Link to="/register?role=borrower">
                  {t('landing.hero.needLoan')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-secondary text-lg px-8 py-4 h-auto">
                <Link to="/register?role=lender">
                  {t('landing.hero.wantInvest')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-white/80"
            >
              <p className="text-lg font-medium">
                ₹2Cr+ <span className="text-white">{t('landing.hero.connectionsMade')}</span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
              {t('landing.features.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-gradient-card border-border/50 hover:shadow-elevated transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                      <div className="text-white">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground flex-1">
                        {feature.title}
                      </h3>
                      <SpeakerButton 
                        text={`${feature.title}. ${feature.description}`}
                        size="sm"
                        variant="ghost"
                        className="flex-shrink-0"
                      />
                    </div>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
              {t('landing.howItWorks.title')}
            </h2>
          </motion.div>

          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg">
              <div className="flex flex-col space-y-4">
                <div className="relative aspect-video bg-black">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    preload="metadata"
                    onClick={togglePlay}
                  >
                    <source src="/videos/hero-background.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-center justify-between transition-opacity duration-300 opacity-70 hover:opacity-100">
                    <div className="flex items-center space-x-3">
                      <button
                        className="text-white hover:text-primary transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay();
                        }}
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? (
                          <Pause className="h-8 w-8" />
                        ) : (
                          <Play className="h-8 w-8" />
                        )}
                      </button>
                      
                      <button
                        className="text-white hover:text-primary transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMute();
                        }}
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? (
                          <VolumeX className="h-6 w-6" />
                        ) : (
                          <Volume2 className="h-6 w-6" />
                        )}
                      </button>
                    </div>
                    
                    <button
                      className="text-white hover:text-primary transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFullscreen();
                      }}
                      aria-label="Toggle fullscreen"
                    >
                      <Maximize className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                
                {/* Playback Speed Control */}
                <div className="flex justify-end">
                  <div className="relative inline-block">
                    <select
                      value={playbackSpeed}
                      onChange={(e) => changePlaybackSpeed(e.target.value)}
                      className="appearance-none bg-gray-800 text-white px-4 py-2 pr-8 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                      aria-label="Select playback speed"
                     >
                      <option value="0.5">0.5x</option>
                      <option value="1">1x</option>
                      <option value="1.5">1.5x</option>
                      <option value="2">2x</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Playback Speed Control */}
              <div className="bg-card p-4 border-t border-border">
                <div className="flex items-center justify-end space-x-2">
                  <span className="text-sm text-muted-foreground">Playback Speed:</span>
                  <select
                    id="playbackSpeed"
                    className="bg-background text-foreground text-sm rounded-md border border-border px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                    onChange={(e) => {
                      const video = document.getElementById('howItWorksVideo') as HTMLVideoElement;
                      video.playbackRate = parseFloat(e.target.value);
                    }}
                    defaultValue="1"
                  >
                    <option value="0.5">0.5x</option>
                    <option value="1">1x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* For Borrowers */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-secondary mb-6">{t('landing.howItWorks.borrowers.title')}</h3>
                
                {t('landing.howItWorks.borrowers.steps', { returnObjects: true }).map((step: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-muted-foreground text-lg">{step}</p>
                  </div>
                ))}

                <Button asChild size="lg" className="mt-6 bg-secondary hover:bg-secondary/90">
                  <Link to="/register?role=borrower">
                    {t('landing.howItWorks.borrowers.cta')}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* For Lenders */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-accent mb-6">{t('landing.howItWorks.lenders.title')}</h3>
                
                {t('landing.howItWorks.lenders.steps', { returnObjects: true }).map((step: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-muted-foreground text-lg">{step}</p>
                  </div>
                ))}

                <Button asChild size="lg" className="mt-6 bg-accent hover:bg-accent/90">
                  <Link to="/register?role=lender">
                    {t('landing.howItWorks.lenders.cta')}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* TTS Demo Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
              Accessibility Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience our text-to-speech functionality. Click the speaker buttons to hear content in your preferred language.
            </p>
          </motion.div>
          
          <TTSDemo />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-white">
              {t('landing.cta.title')}
            </h2>
            <p className="text-xl text-white/90">
              {t('landing.cta.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-white text-secondary hover:bg-white/90 text-lg px-8 py-4 h-auto">
                <Link to="/register">
                  {t('landing.cta.button')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
