import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Mandala Design */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/download.jpeg')" }}></div>
        <div className="">
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
                Kshetra Kredit
              </h1>
              
              <p className="text-xl text-yellow-200 mb-8 leading-relaxed">
                Empowering communities through peer-to-peer lending
              </p>
              
              <div className="space-y-4 text-yellow-100">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <span>Trust-based lending system</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <span>Secure and transparent</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <span>Community-driven growth</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-card border-border/50 shadow-elevated">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">K</span>
                </div>
                
                <CardTitle className="text-2xl font-bold text-foreground">
                  Welcome Back
                </CardTitle>
                
                <p className="text-muted-foreground">
                  Sign in to your Kshetra Kredit account
                </p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        placeholder="Enter your password"
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

                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <div className="mt-6 space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/50" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-card px-2 text-muted-foreground">
                        Demo Accounts
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEmail('borrower@demo.com');
                        setPassword('demo123');
                      }}
                      className="text-sm"
                    >
                      Demo Borrower
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEmail('lender@demo.com');
                        setPassword('demo123');
                      }}
                      className="text-sm"
                    >
                      Demo Lender
                    </Button>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link 
                      to="/register" 
                      className="text-primary hover:underline font-medium"
                    >
                      Sign up here
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

export default Login;