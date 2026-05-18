import React, { useState, useEffect } from 'react';
import { VideoBackground } from '@/components/VideoBackground';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, UserCheck, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'BORROWER' | 'LENDER'>('BORROWER');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'borrower') {
      setRole('BORROWER');
    } else if (roleParam === 'lender') {
      setRole('LENDER');
    }
  }, [searchParams]);

  // Navigate when user is set after successful registration
  useEffect(() => {
    if (registrationSuccess && user) {
      const targetPath = user.role === 'BORROWER' ? '/dashboard' : '/marketplace';
      console.log('Navigating to:', targetPath, 'User:', user);
      // Use setTimeout to ensure navigation happens after state is fully updated
      const timer = setTimeout(() => {
        navigate(targetPath, { replace: true });
        setRegistrationSuccess(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [user, registrationSuccess, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    if (!name || !email || !password || !confirmPassword) {
      console.error('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      console.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting registration...', { name, email, role });
      await register(name, email, password, role);
      setRegistrationSuccess(true);
      console.log('Registration successful, preparing navigation...');
      
      // Wait a moment for state to update, then navigate
      setTimeout(() => {
        const storedUser = localStorage.getItem('user_data');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            const targetPath = userData.role === 'BORROWER' ? '/dashboard' : '/marketplace';
            console.log('Navigating to:', targetPath, 'User data:', userData);
            navigate(targetPath, { replace: true });
          } catch (e) {
            console.error('Error parsing user data:', e);
            // Fallback navigation based on role
            const targetPath = role === 'BORROWER' ? '/dashboard' : '/marketplace';
            console.log('Fallback navigation to:', targetPath);
            navigate(targetPath, { replace: true });
          }
        } else {
          // Fallback navigation based on role
          const targetPath = role === 'BORROWER' ? '/dashboard' : '/marketplace';
          console.log('No user data found, fallback navigation to:', targetPath);
          navigate(targetPath, { replace: true });
        }
      }, 300);
    } catch (error: any) {
      console.error('Registration failed:', error);
      setIsLoading(false);
      setRegistrationSuccess(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Mandala Design */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <VideoBackground
          videoSrc="/videos/hero-background.mp4"
          className="absolute inset-0"
          overlay={false}
          fallbackGradient="bg-black"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/60 via-yellow-800/60 to-amber-900/60 backdrop-blur-sm">
          {/* Mandala Pattern Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -left-32 -top-32 w-96 h-96">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 opacity-30">
                <div className="absolute inset-4 rounded-full border-4 border-yellow-300 opacity-50"></div>
                <div className="absolute inset-8 rounded-full border-2 border-yellow-200 opacity-40"></div>
                <div className="absolute inset-12 rounded-full border border-yellow-100 opacity-30"></div>
              </div>
            </div>
            <div className="absolute -right-32 -bottom-32 w-96 h-96">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 opacity-30">
                <div className="absolute inset-4 rounded-full border-4 border-yellow-300 opacity-50"></div>
                <div className="absolute inset-8 rounded-full border-2 border-yellow-200 opacity-40"></div>
                <div className="absolute inset-12 rounded-full border border-yellow-100 opacity-30"></div>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300 to-amber-400 opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-gradient-to-br from-amber-300 to-yellow-400 opacity-25 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-200 to-amber-300 opacity-30 animate-pulse delay-500"></div>
          
          {/* Content Overlay */}
          <div className="relative z-10 flex flex-col justify-center items-center h-full p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-md"
            >
              <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-3xl font-bold text-amber-900">K</span>
              </div>
              
              <h1 className="text-4xl font-bold text-yellow-100 mb-4">
                Join Kshetra Kredit
              </h1>
              
              <p className="text-xl text-yellow-200 mb-8 leading-relaxed">
                Start your journey in peer-to-peer lending today
              </p>
              
              <div className="space-y-4 text-yellow-100">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <span>Create your account in minutes</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <span>Choose your role: Borrower or Lender</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <span>Connect with your community</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-card border-border/50 shadow-elevated">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              
              <CardTitle className="text-2xl font-bold text-foreground">
                Join Kshetra Kredit
              </CardTitle>
              
              <p className="text-muted-foreground">
                Create your account and start your financial journey
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-3">
                  <Label>I want to</Label>
                  <RadioGroup
                    value={role}
                    onValueChange={(value) => setRole(value as 'BORROWER' | 'LENDER')}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div>
                      <RadioGroupItem value="BORROWER" id="borrower" className="peer sr-only" />
                      <Label
                        htmlFor="borrower"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                      >
                        <UserCheck className="mb-2 h-6 w-6" />
                        <span className="font-medium">Borrow</span>
                        <span className="text-xs text-muted-foreground">Get funding</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="LENDER" id="lender" className="peer sr-only" />
                      <Label
                        htmlFor="lender"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                      >
                        <TrendingUp className="mb-2 h-6 w-6" />
                        <span className="font-medium">Invest</span>
                        <span className="text-xs text-muted-foreground">Earn returns</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password && confirmPassword && password !== confirmPassword && (
                    <p className="text-sm text-destructive">Passwords do not match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  size="lg"
                  disabled={isLoading || !name || !email || !password || !confirmPassword || password !== confirmPassword || password.length < 6}
                >
                  {isLoading ? 'Creating Account...' : `Create ${role === 'BORROWER' ? 'Borrower' : 'Investor'} Account`}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 text-center"
          >
            <Link 
              to="/" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
