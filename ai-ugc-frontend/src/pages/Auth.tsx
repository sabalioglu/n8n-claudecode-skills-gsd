import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input, Card } from '../components/ui';
import { toast } from 'sonner';
import { Sparkles, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

export function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();

  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors = { email: '', password: '', fullName: '' };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (isSignUp && !formData.fullName) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, formData.fullName);
        toast.success('Account created! Please check your email to verify your account.');
      } else {
        await signIn(formData.email, formData.password);
        toast.success('Welcome back!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">AI UGC</span>
        </Link>

        <Card className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-[#94a3b8]">
              {isSignUp
                ? 'Start creating AI-powered UGC videos'
                : 'Sign in to continue to your dashboard'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                <Input
                  type="text"
                  name="fullName"
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  className="pl-12"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
              <Input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                className="pl-12"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                className="pl-12"
              />
            </div>

            {!isSignUp && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              {loading ? (
                <Loader2 className="w-5 h-5 spinner" />
              ) : isSignUp ? (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#94a3b8]">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Sign up
                </button>
              </>
            )}
          </div>

          {isSignUp && (
            <p className="mt-6 text-center text-xs text-[#64748b]">
              By signing up, you agree to our{' '}
              <a href="#" className="text-indigo-400 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-indigo-400 hover:underline">
                Privacy Policy
              </a>
            </p>
          )}
        </Card>

        {isSignUp && (
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-4 text-sm text-[#64748b]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                10 free credits
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                No credit card
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
