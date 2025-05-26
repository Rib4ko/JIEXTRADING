
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from || '/products';
  
  // Redirect authenticated users away from login page
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User authenticated with role:', user.role);
      // Redirect based on user role
      if (user.role === 'admin') {
        console.log('Redirecting admin to admin dashboard');
        navigate('/admin-dashboard', { replace: true });
      } else if (user.role === 'seller') {
        console.log('Redirecting seller to seller dashboard');
        navigate('/seller-dashboard', { replace: true });
      } else if (user.role === 'client') {
        console.log('Redirecting client to products page');
        navigate('/products', { replace: true });
      } else {
        console.log('Unknown role, redirecting to products page');
        navigate('/products', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const success = await login(email, password);
    
    if (success) {
      // The redirect will be handled by the useEffect hook above
      console.log('Login successful, waiting for redirect...');
    } else {
      setError('Invalid email or password');
    }
  };

  // Only render the login form if not authenticated
  // Show loading indicator while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  // Only show login page if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <div className="w-full max-w-md">
          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-heading text-center">Login</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link 
                      to="/forgot-password" 
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <p className="text-sm text-center text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  // This will not be rendered since the useEffect will redirect
  return null;
};

export default LoginPage;
