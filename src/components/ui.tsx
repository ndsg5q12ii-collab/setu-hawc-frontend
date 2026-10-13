import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Star, Check, AlertCircle, AlertTriangle, Info, X, ShieldCheck, Loader2 } from './icons';

export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ================= Toast System =================
interface Toast {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cx(
              'pointer-events-auto flex items-start gap-3 p-3.5 rounded-md shadow-raised text-sm transition-all duration-300 animate-fade-up bg-surface border',
              toast.type === 'success' && 'border-success/30 text-text-primary',
              toast.type === 'error' && 'border-error/30 text-text-primary',
              toast.type === 'warning' && 'border-warning/30 text-text-primary',
              (!toast.type || toast.type === 'info') && 'border-border text-text-primary'
            )}
          >
            {toast.type === 'success' && <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />}
            {(!toast.type || toast.type === 'info') && <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-text-primary">{toast.title}</div>
              {toast.message && <div className="text-text-secondary text-xs mt-0.5">{toast.message}</div>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-text-muted hover:text-text-primary p-0.5 transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      addToast: () => {},
      removeToast: () => {},
      toasts: [],
    };
  }
  return context;
};

// ================= Button =================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cx(
          'inline-flex items-center justify-center font-semibold rounded-md transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none',
          // Variants
          variant === 'primary' && 'bg-primary text-white hover:bg-primary-hover active:bg-primary-pressed shadow-soft',
          variant === 'secondary' && 'bg-primary-soft text-primary hover:bg-primary-soft/80 active:bg-primary/20',
          variant === 'outline' && 'border border-border text-text-primary bg-surface hover:bg-sunken active:bg-border',
          variant === 'ghost' && 'text-text-secondary hover:text-text-primary hover:bg-sunken active:bg-border/60',
          variant === 'danger' && 'bg-error text-white hover:bg-red-700 active:bg-red-800 shadow-soft',
          // Sizes
          size === 'sm' && 'h-8 px-3 text-xs gap-1.5',
          size === 'md' && 'h-11 px-4 text-sm gap-2',
          size === 'lg' && 'h-13 px-6 text-base gap-2.5 rounded-lg',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';

// ================= IconButton =================
export const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon: React.ReactNode;
  'aria-label': string;
}> = ({ className, variant = 'ghost', size = 'md', icon, ...props }) => {
  return (
    <button
      className={cx(
        'inline-flex items-center justify-center rounded-md transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variant === 'primary' && 'bg-primary text-white hover:bg-primary-hover shadow-soft',
        variant === 'secondary' && 'bg-primary-soft text-primary hover:bg-primary-soft/80',
        variant === 'outline' && 'border border-border text-text-primary bg-surface hover:bg-sunken',
        variant === 'ghost' && 'text-text-secondary hover:text-text-primary hover:bg-sunken',
        variant === 'danger' && 'bg-error text-white hover:bg-red-700',
        size === 'sm' && 'w-8 h-8 text-xs',
        size === 'md' && 'w-10 h-10 text-sm',
        size === 'lg' && 'w-12 h-12 text-base rounded-lg',
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
};

// ================= Input & Textarea =================
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}>(({ label, error, hint, leftAddon, rightAddon, className, id, ...props }, ref) => {
  const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={generatedId} className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftAddon && <div className="absolute left-3 text-text-muted flex items-center pointer-events-none">{leftAddon}</div>}
        <input
          id={generatedId}
          ref={ref}
          className={cx(
            'w-full h-11 px-3.5 bg-surface border rounded-md text-sm text-text-primary placeholder:text-text-muted transition-all duration-150',
            'focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white',
            error ? 'border-error focus:border-error focus:ring-error' : 'border-border hover:border-border-strong',
            leftAddon && 'pl-10',
            rightAddon && 'pr-10',
            className
          )}
          {...props}
        />
        {rightAddon && <div className="absolute right-3 text-text-muted flex items-center">{rightAddon}</div>}
      </div>
      {error && <span className="text-xs text-error font-medium">{error}</span>}
      {hint && !error && <span className="text-xs text-text-muted">{hint}</span>}
    </div>
  );
});
Input.displayName = 'Input';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  hint?: string;
}>(({ label, error, hint, className, id, ...props }, ref) => {
  const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={generatedId} className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        id={generatedId}
        ref={ref}
        className={cx(
          'w-full p-3 bg-surface border rounded-md text-sm text-text-primary placeholder:text-text-muted transition-all duration-150',
          'focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white resize-none min-h-[96px]',
          error ? 'border-error focus:border-error focus:ring-error' : 'border-border hover:border-border-strong',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-error font-medium">{error}</span>}
      {hint && !error && <span className="text-xs text-text-muted">{hint}</span>}
    </div>
  );
});
Textarea.displayName = 'Textarea';

// ================= OTP Input =================
export const OTPInput: React.FC<{
  length?: number;
  value: string;
  onChange: (val: string) => void;
  onComplete?: (val: string) => void;
}> = ({ length = 6, value, onChange, onComplete }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, char: string) => {
    if (!/^\d*$/.test(char)) return;
    const chars = value.split('');
    chars[index] = char.slice(-1);
    const newVal = chars.join('');
    onChange(newVal);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (newVal.length === length && onComplete) {
      onComplete(newVal);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().slice(0, length);
    if (/^\d+$/.test(pasted)) {
      onChange(pasted);
      if (pasted.length === length && onComplete) {
        onComplete(pasted);
      }
    }
  };

  return (
    <div className="flex gap-2.5 justify-center" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-12 h-14 text-center font-mono text-xl font-bold rounded-md border border-border bg-surface text-text-primary focus:border-primary focus:ring-2 focus:ring-primary-soft outline-none transition-all"
        />
      ))}
    </div>
  );
};

// ================= Avatar =================
export const Avatar: React.FC<{
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  verified?: boolean;
  className?: string;
}> = ({ src, name, size = 'md', verified, className }) => {
  const [imageError, setImageError] = useState(false);
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  }[size];

  return (
    <div className={cx('relative inline-block shrink-0', className)}>
      <div
        className={cx(
          'rounded-full flex items-center justify-center font-bold overflow-hidden select-none border border-border/80 shadow-soft',
          sizeClasses,
          src && !imageError ? 'bg-sunken' : 'bg-primary-soft text-primary'
        )}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {verified && (
        <div className="absolute -bottom-0.5 -right-0.5 bg-success text-white rounded-full p-0.5 border-2 border-surface shadow-sm">
          <Check className="w-2.5 h-2.5 stroke-[3]" />
        </div>
      )}
    </div>
  );
};

// ================= Badge =================
export const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'verified';
  size?: 'sm' | 'md';
  className?: string;
}> = ({ children, variant = 'neutral', size = 'sm', className }) => {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 font-semibold rounded-full select-none',
        size === 'sm' && 'px-2 py-0.5 text-[11px]',
        size === 'md' && 'px-2.5 py-1 text-xs',
        variant === 'primary' && 'bg-primary-soft text-primary',
        variant === 'success' && 'bg-success-soft text-success',
        variant === 'warning' && 'bg-warning-soft text-warning',
        variant === 'error' && 'bg-error-soft text-error',
        variant === 'info' && 'bg-info-soft text-info',
        variant === 'neutral' && 'bg-sunken text-text-secondary border border-border',
        variant === 'verified' && 'bg-blue-50 text-primary border border-primary/20',
        className
      )}
    >
      {variant === 'verified' && <ShieldCheck className="w-3 h-3 text-primary inline" />}
      {children}
    </span>
  );
};

// ================= Rating =================
export const Rating: React.FC<{
  value: number;
  count?: number;
  interactive?: boolean;
  onChange?: (val: number) => void;
  size?: 'sm' | 'md' | 'lg';
}> = ({ value, count, interactive, onChange, size = 'md' }) => {
  const [hoverVal, setHoverVal] = useState<number | null>(null);

  const starSize = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  }[size];

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = (hoverVal ?? value) >= star;
          return (
            <button
              type="button"
              key={star}
              disabled={!interactive}
              onClick={() => interactive && onChange?.(star)}
              onMouseEnter={() => interactive && setHoverVal(star)}
              onMouseLeave={() => interactive && setHoverVal(null)}
              className={cx(
                'transition-transform',
                interactive ? 'cursor-pointer hover:scale-125 focus:outline-none' : 'cursor-default'
              )}
            >
              <Star
                className={cx(
                  starSize,
                  filled ? 'fill-amber-400 text-amber-400' : 'text-border-strong fill-transparent'
                )}
              />
            </button>
          );
        })}
      </div>
      {count !== undefined ? (
        <span className="text-xs text-text-muted font-medium">({count})</span>
      ) : (
        <span className="text-xs font-semibold text-text-primary ml-0.5">{value.toFixed(1)}</span>
      )}
    </div>
  );
};

// ================= Card =================
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
  sunken?: boolean;
}> = ({ className, hover, sunken, children, ...props }) => {
  return (
    <div
      className={cx(
        'rounded-md p-4 transition-all duration-150',
        sunken ? 'bg-sunken border border-border/60' : 'bg-surface border border-border shadow-soft',
        hover && 'hover:shadow-raised hover:border-border-strong cursor-pointer active:scale-[0.99]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// ================= Modal / Dialog =================
export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, description, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fade-up">
      <div className="relative w-full max-w-md bg-surface rounded-lg border border-border shadow-floating overflow-hidden p-6 max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary p-1 rounded-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
        {title && <h3 className="text-lg font-bold text-text-primary pr-8">{title}</h3>}
        {description && <p className="text-xs text-text-secondary mt-1 mb-4">{description}</p>}
        <div className="mt-2 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

// ================= Loading / Skeleton =================
export const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cx('flex items-center justify-center p-6 text-primary', className)}>
    <Loader2 className="w-8 h-8 animate-spin" />
  </div>
);

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cx('bg-sunken rounded animate-pulse', className)} />
);

// ================= EmptyState =================
export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center text-center p-8 bg-surface rounded-md border border-dashed border-border-strong my-4">
    {icon && <div className="text-text-muted mb-3 p-3 bg-sunken rounded-full">{icon}</div>}
    <h4 className="font-semibold text-text-primary text-base">{title}</h4>
    <p className="text-xs text-text-secondary mt-1 max-w-xs">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);
