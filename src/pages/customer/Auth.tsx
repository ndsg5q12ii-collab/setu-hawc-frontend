import React, { useState, useEffect } from 'react';
import { useRouter } from '../../lib/router';
import { useAppState } from '../../state/AppState';
import { MobileLayout } from '../../layouts/MobileLayout';
import { Button, Input, OTPInput, Badge, cx, useToast } from '../../components/ui';
import {
  Wrench,
  ShieldCheck,
  Video,
  ArrowRight,
  Phone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from '../../components/icons';

export const SplashScreen: React.FC = () => {
  const { navigate } = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 2400);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <MobileLayout showBottomNav={false}>
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-primary-soft/40 via-surface to-background animate-fade-up">
        <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-white shadow-raised mb-6 relative">
          <Wrench className="w-10 h-10 stroke-[2.2]" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-success flex items-center justify-center border-2 border-white shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-white stroke-[3]" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">SETU</h1>
        <p className="text-sm font-semibold text-primary mt-1">Verified Technical Support</p>
        <p className="text-xs text-text-muted mt-3 max-w-xs leading-relaxed">
          Fast remote video diagnosis & doorstep repair for laptops, phones and electronics across Delhi NCR.
        </p>

        <div className="mt-12 flex flex-col items-center gap-3 w-full max-w-xs">
          <Button
            size="lg"
            className="w-full"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/welcome')}
          >
            Get Started
          </Button>
          <span className="text-[11px] text-text-muted">Direct prototype launch</span>
        </div>
      </div>
    </MobileLayout>
  );
};

export const WelcomeScreen: React.FC = () => {
  const { navigate } = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      icon: Video,
      title: 'Fix Devices in Minutes Over Video Call',
      description: 'Why carry your laptop to a repair market? Connect with a verified technician who guides you step-by-step.',
      tag: 'Remote First',
    },
    {
      icon: ShieldCheck,
      title: 'Verified Technicians You Can Trust',
      description: 'Every expert is personally vetted with Aadhaar ID, police verification, and proven hardware experience.',
      tag: '100% Vetted',
    },
    {
      icon: Wrench,
      title: 'Doorstep Home Visit If Not Solved',
      description: 'If the issue requires physical parts or soldering, the same technician comes to your home in Delhi NCR.',
      tag: 'Guaranteed Resolution',
    },
  ];

  return (
    <MobileLayout showBottomNav={false}>
      <div className="flex-1 flex flex-col justify-between p-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span className="font-extrabold text-sm tracking-tight text-primary">SETU</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-semibold text-text-secondary hover:text-primary transition-colors"
          >
            Skip to Login
          </button>
        </div>

        {/* Carousel Slide */}
        <div className="flex flex-col items-center text-center my-auto py-8 animate-fade-up">
          <div className="w-24 h-24 rounded-3xl bg-primary-soft flex items-center justify-center text-primary mb-6 shadow-soft">
            {React.createElement(slides[activeSlide].icon, { className: 'w-12 h-12 stroke-[1.8]' })}
          </div>

          <Badge variant="primary" size="md" className="mb-3">
            {slides[activeSlide].tag}
          </Badge>

          <h2 className="text-xl font-extrabold text-text-primary px-4 leading-snug">
            {slides[activeSlide].title}
          </h2>

          <p className="text-xs text-text-secondary mt-3 px-6 leading-relaxed">
            {slides[activeSlide].description}
          </p>

          {/* Dots Indicator */}
          <div className="flex gap-2 mt-8">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={cx(
                  'h-2 rounded-full transition-all duration-300',
                  activeSlide === i ? 'w-6 bg-primary' : 'w-2 bg-border-strong hover:bg-text-muted'
                )}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pb-2">
          {activeSlide < slides.length - 1 ? (
            <Button
              size="lg"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => setActiveSlide((p) => p + 1)}
            >
              Next
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate('/login')}
            >
              Continue with Phone Number
            </Button>
          )}

          <div className="text-center">
            <span className="text-[11px] text-text-muted">
              By continuing, you agree to Setu Terms & Privacy Policy
            </span>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export const LoginScreen: React.FC = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [otpValue, setOtpValue] = useState('123456');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(30);

  // Profile setup fields for new users
  const [name, setName] = useState('Niladri Das');
  const [address, setAddress] = useState('B-42, Greater Kailash 1, South Delhi');

  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      addToast({ title: 'Invalid Phone Number', message: 'Please enter a 10-digit mobile number.', type: 'error' });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp');
      setTimer(30);
      addToast({ title: 'OTP Sent', message: `Verification code sent to +91 ${phoneNumber}. Use 123456 to test.`, type: 'info' });
    }, 600);
  };

  const handleVerifyOTP = (codeToVerify = otpValue) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (codeToVerify === '123456' || codeToVerify.length === 6) {
        addToast({ title: 'Verified Successfully', message: 'Welcome back to Setu!', type: 'success' });
        navigate('/home');
      } else {
        addToast({ title: 'Invalid OTP', message: 'Please enter 123456 or try resending.', type: 'error' });
      }
    }, 700);
  };

  return (
    <MobileLayout showBottomNav={false} showBackButton={step !== 'phone'} onBack={() => setStep('phone')}>
      <div className="flex-1 flex flex-col justify-between p-6">
        <div>
          {step === 'phone' ? (
            <div className="space-y-6 pt-4 animate-fade-up">
              <div>
                <h2 className="text-2xl font-bold text-text-primary tracking-tight">Enter your phone</h2>
                <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                  We'll send a 6-digit verification code to connect with your verified account.
                </p>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="w-full">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                    Mobile Number
                  </label>
                  <div className="flex gap-2">
                    <div className="h-11 px-3 bg-sunken border border-border rounded-md flex items-center font-mono font-bold text-xs text-text-primary shrink-0">
                      🇮🇳 +91
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="98765 43210"
                      className="flex-1 h-11 px-3.5 bg-surface border border-border rounded-md font-mono text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-4"
                  isLoading={isSubmitting}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Send OTP Code
                </Button>
              </form>

              {/* Prototype helper chip */}
              <div className="p-3 bg-primary-soft/60 border border-primary/20 rounded-md text-xs text-primary flex items-start gap-2">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Default test number pre-filled. Tap 'Send OTP Code' to continue.</span>
              </div>
            </div>
          ) : step === 'otp' ? (
            <div className="space-y-6 pt-4 animate-fade-up">
              <div>
                <h2 className="text-2xl font-bold text-text-primary tracking-tight">Enter 6-digit code</h2>
                <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                  Sent to <span className="font-mono font-bold text-text-primary">+91 {phoneNumber}</span>
                </p>
              </div>

              <div className="my-6">
                <OTPInput
                  length={6}
                  value={otpValue}
                  onChange={setOtpValue}
                  onComplete={handleVerifyOTP}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">
                  {timer > 0 ? `Resend code in ${timer}s` : "Didn't receive code?"}
                </span>
                <button
                  disabled={timer > 0}
                  onClick={() => {
                    setTimer(30);
                    addToast({ title: 'New Code Sent', message: 'Use 123456 to verify.', type: 'info' });
                  }}
                  className="font-bold text-primary disabled:opacity-40 disabled:pointer-events-none hover:underline"
                >
                  Resend OTP
                </button>
              </div>

              <Button
                size="lg"
                className="w-full mt-4"
                isLoading={isSubmitting}
                onClick={() => handleVerifyOTP()}
              >
                Verify & Continue
              </Button>

              <div className="p-3 bg-sunken rounded-md text-xs text-text-muted text-center font-mono">
                Prototype Hint: Verification code is 123456
              </div>
            </div>
          ) : (
            <div className="space-y-5 pt-4 animate-fade-up">
              <div>
                <h2 className="text-2xl font-bold text-text-primary tracking-tight">Complete your profile</h2>
                <p className="text-xs text-text-secondary mt-1">
                  Required for in-person technician dispatch in Delhi NCR.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
                <Input
                  label="Delivery Address (Delhi NCR)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat/House no., locality, pin code"
                />
              </div>

              <Button
                size="lg"
                className="w-full mt-6"
                onClick={() => {
                  addToast({ title: 'Profile Saved', type: 'success' });
                  navigate('/home');
                }}
              >
                Complete Setup
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-border/60">
          <p className="text-[11px] text-text-muted">
            Delhi NCR Technical Support Marketplace
          </p>
        </div>
      </div>
    </MobileLayout>
  );
};
