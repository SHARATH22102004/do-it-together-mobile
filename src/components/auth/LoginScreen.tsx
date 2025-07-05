import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Chrome, Github, Facebook, Apple } from 'lucide-react';

const LoginScreen = () => {
  const { login, isLoading } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleLogin = async (provider: 'google' | 'github' | 'facebook' | 'apple') => {
    setLoadingProvider(provider);
    await login(provider);
    setLoadingProvider(null);
  };

  const providers = [
    { id: 'google' as const, name: 'Google', icon: Chrome, color: 'bg-red-500 hover:bg-red-600' },
    { id: 'github' as const, name: 'GitHub', icon: Github, color: 'bg-gray-800 hover:bg-gray-900' },
    { id: 'facebook' as const, name: 'Facebook', icon: Facebook, color: 'bg-blue-600 hover:bg-blue-700' },
    { id: 'apple' as const, name: 'Apple', icon: Apple, color: 'bg-black hover:bg-gray-800' },
  ];

  return (
    <div className="mobile-container flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="gradient-hero w-16 h-16 rounded-2xl mx-auto flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gradient-primary">TaskFlow</h1>
            <p className="text-muted-foreground">Organize your life, one task at a time</p>
          </div>
        </div>

        {/* Login Options */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            <CardDescription>Choose your preferred sign-in method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {providers.map((provider) => {
              const Icon = provider.icon;
              const isProviderLoading = loadingProvider === provider.id;
              
              return (
                <Button
                  key={provider.id}
                  onClick={() => handleLogin(provider.id)}
                  disabled={isLoading}
                  className={`w-full h-12 text-white ${provider.color} transition-all duration-200`}
                  variant="default"
                >
                  {isProviderLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5 mr-3" />
                  )}
                  {isProviderLoading ? 'Signing in...' : `Continue with ${provider.name}`}
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-4">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <span>Secure</span>
            <div className="w-1 h-1 bg-muted-foreground rounded-full" />
            <span>Private</span>
            <div className="w-1 h-1 bg-muted-foreground rounded-full" />
            <span>Fast</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;