import React, { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { BrandMark } from '@/components/layout/PublicHeader';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/i18n/I18nContext';
import { sanitizeRedirectPath } from '@/lib/security';
import type { Locale } from '@/types';

const AuthSplitShell: React.FC<{
  title: string;
  subtitle: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => {
  const { t } = useI18n();

  return (
    <div className="container-page min-h-screen flex items-center justify-center py-8 md:py-12">
      <div className="w-full max-w-5xl space-y-5">
        <Link
          to="/"
          className="font-mono-tech inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.08em] font-semibold text-[#6e6a62] hover:text-[#1c5b48] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{t.auth.backToSite}</span>
        </Link>

        <div className="swiss-surface overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-[0_24px_60px_-24px_rgba(23,28,25,0.16)]">
          {/* Form Column */}
          <div className="lg:col-span-7 p-6 sm:p-10">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-8 w-fit hover:opacity-90">
              <BrandMark />
              <span className="font-serif-display text-[21px] font-medium tracking-[-0.02em] text-[#141312] dark:text-[#f6f3ec]">
                {t.brand.name}
              </span>
            </Link>

            <h1 className="text-h2 text-[#141312] dark:text-[#f6f3ec]">{title}</h1>
            <p className="text-body text-[#6e6a62] mt-1.5 mb-7">{subtitle}</p>
            {children}
          </div>

          {/* Desktop Deep Forest Green Benefit Column */}
          <div className="hidden lg:flex lg:col-span-5 bg-[#1c5b48] text-[#f6f3ec] p-10 flex-col justify-between">
            <div className="space-y-5">
              <span className="font-mono-tech inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.12em] text-white/75">
                <span className="h-1.5 w-1.5 rounded-full bg-[#A7E8CE]" aria-hidden="true" />
                <span>IDENTITY ACCESS</span>
              </span>
              <h2 className="font-serif-display text-[28px] font-medium text-white leading-tight">
                {t.auth.splitBenefitTitle}
              </h2>
              <p className="text-[14px] text-white/80 leading-relaxed">
                {t.auth.splitBenefitDesc}
              </p>
            </div>

            <ul className="space-y-3.5 pt-8 border-t border-white/15">
              {[t.auth.splitPoint1, t.auth.splitPoint2, t.auth.splitPoint3].map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-[14px] text-white/95">
                  <CheckCircle2 className="h-4 w-4 text-[#A7E8CE] mt-0.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LoginPage: React.FC = () => {
  const { t } = useI18n();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const intendedTo = sanitizeRedirectPath(
    (location.state as { from?: string } | null)?.from || searchParams.get('redirect'),
  );

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!identifier.trim()) {
      setError('Please enter your email or phone number.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await login({ identifier, password, rememberMe });
      navigate(intendedTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitShell title={t.auth.loginTitle} subtitle={t.auth.loginSubtitle}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <Alert tone="error">{error}</Alert>}

        <Input
          label={t.auth.emailOrPhone}
          placeholder={t.auth.emailOrPhonePlaceholder}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          autoComplete="username"
        />

        <Input
          label={t.auth.password}
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          rightAddon={
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label="Toggle password visibility"
              className="p-1 text-[#6e6a62] hover:text-[#141312] cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <div className="flex items-center justify-between gap-2 text-[13px]">
          <label className="inline-flex items-center gap-2 text-[#6e6a62] cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="accent-[#1c5b48]"
            />
            <span>{t.auth.rememberMe}</span>
          </label>
          <Link to="/forgot-password" className="font-semibold text-[#141312] dark:text-[#f6f3ec] hover:text-[#1c5b48]">
            {t.auth.forgotPasswordLink}
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={loading}
          rightIcon={<ArrowUpRight className="h-4 w-4" />}
        >
          {t.auth.signInBtn}
        </Button>

        <p className="text-[14px] text-[#6e6a62] text-center pt-2">
          {t.auth.noAccount}{' '}
          <Link
            to="/register"
            state={{ from: intendedTo }}
            className="font-bold text-[#1c5b48] dark:text-[#7CD4B5] underline underline-offset-4"
          >
            {t.nav.signUp}
          </Link>
        </p>
      </form>
    </AuthSplitShell>
  );
};

export const RegisterPage: React.FC = () => {
  const { t, locale, setLocale } = useI18n();
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const intendedTo = sanitizeRedirectPath((location.state as { from?: string } | null)?.from);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<Locale>(locale);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const hasMinLen = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!hasMinLen || !hasLetter || !hasNumber) {
      setError('Please meet all password requirements.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!acceptTerms) {
      setError('Please accept the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName,
        email,
        phone,
        password,
        preferredLanguage,
      });
      setLocale(preferredLanguage);
      navigate(intendedTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitShell title={t.auth.registerTitle} subtitle={t.auth.registerSubtitle}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <Alert tone="error">{error}</Alert>}

        <Input
          label={t.auth.fullName}
          placeholder={t.auth.fullNamePlaceholder}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t.auth.email}
            type="email"
            placeholder={t.auth.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            label={t.auth.phone}
            type="tel"
            placeholder={t.auth.phonePlaceholder}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t.auth.password}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            rightAddon={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label="Toggle password visibility"
                className="p-1 text-[#6e6a62] hover:text-[#141312] cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          <Input
            label={t.auth.confirmPassword}
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            error={
              confirmPassword && confirmPassword !== password ? 'Passwords do not match' : undefined
            }
          />
        </div>

        {/* Password requirements checklist */}
        <div className="p-3.5 rounded-xl bg-[#e5dfd2]/75 dark:bg-[#181E1B] border border-[#ded8ca] dark:border-[#2A332E] space-y-1">
          <p className="font-mono-tech text-[11px] uppercase tracking-[0.06em] font-semibold text-[#141312] dark:text-[#f6f3ec]">
            {t.auth.passwordReqTitle}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
            <span className={hasMinLen ? 'text-[#1c5b48] dark:text-[#7CD4B5] font-semibold' : 'text-[#6e6a62]'}>
              ✓ {t.auth.reqLength}
            </span>
            <span className={hasLetter ? 'text-[#1c5b48] dark:text-[#7CD4B5] font-semibold' : 'text-[#6e6a62]'}>
              ✓ {t.auth.reqLetter}
            </span>
            <span className={hasNumber ? 'text-[#1c5b48] dark:text-[#7CD4B5] font-semibold' : 'text-[#6e6a62]'}>
              ✓ {t.auth.reqNumber}
            </span>
          </div>
        </div>

        <Dropdown
          label={t.auth.preferredLanguage}
          fullWidth
          size="lg"
          value={preferredLanguage}
          onChange={(next) => setPreferredLanguage(next as Locale)}
          options={[
            { value: 'en', label: `${t.common.english} (EN)` },
            { value: 'km', label: `${t.common.khmer} (ខ្មែរ)` },
          ]}
        />

        <label className="flex items-start gap-2.5 text-[13px] text-[#6e6a62] cursor-pointer">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-0.5 accent-[#1c5b48]"
          />
          <span>
            {t.auth.acceptTermsPrefix}{' '}
            <Link to="/terms" className="font-semibold text-[#141312] dark:text-[#f6f3ec] underline">
              {t.auth.termsLink}
            </Link>{' '}
            {t.auth.andWord}{' '}
            <Link to="/privacy" className="font-semibold text-[#141312] dark:text-[#f6f3ec] underline">
              {t.auth.privacyLink}
            </Link>
            .
          </span>
        </label>

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={loading}
          rightIcon={<ArrowUpRight className="h-4 w-4" />}
        >
          {t.auth.createAccountBtn}
        </Button>

        <p className="text-[14px] text-[#6e6a62] text-center pt-2">
          {t.auth.haveAccount}{' '}
          <Link
            to="/login"
            className="font-bold text-[#1c5b48] dark:text-[#7CD4B5] underline underline-offset-4"
          >
            {t.nav.login}
          </Link>
        </p>
      </form>
    </AuthSplitShell>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 250));
    setLoading(false);
    setSent(true);
  };

  return (
    <AuthSplitShell title={t.auth.forgotTitle} subtitle={t.auth.forgotSubtitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert tone="error">{error}</Alert>}
        {sent && (
          <Alert tone="success">
            <p>{t.auth.resetSentSuccess}</p>
            <Link
              to="/reset-password?token=demo-token"
              className="inline-block mt-2 font-semibold underline"
            >
              {t.auth.openResetDemo}
            </Link>
          </Alert>
        )}

        <Input
          label={t.auth.email}
          type="email"
          placeholder={t.auth.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={loading}
          rightIcon={<ArrowUpRight className="h-4 w-4" />}
        >
          {t.auth.sendResetLinkBtn}
        </Button>

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="text-[14px] font-semibold text-[#1c5b48] dark:text-[#7CD4B5] underline"
          >
            {t.auth.backToLogin}
          </Link>
        </div>
      </form>
    </AuthSplitShell>
  );
};

export const ResetPasswordPage: React.FC = () => {
  const { t } = useI18n();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 250));
    setLoading(false);
    setDone(true);
  };

  return (
    <AuthSplitShell title={t.auth.resetTitle} subtitle={t.auth.resetSubtitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert tone="error">{error}</Alert>}
        {done && (
          <Alert tone="success">
            <p>{t.auth.resetDoneSuccess}</p>
            <Link to="/login" className="inline-block mt-2 font-semibold underline">
              {t.nav.login}
            </Link>
          </Alert>
        )}

        <Input
          label={t.auth.password}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label={t.auth.confirmPassword}
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={loading}
          rightIcon={<ArrowUpRight className="h-4 w-4" />}
        >
          {t.auth.updatePasswordBtn}
        </Button>
      </form>
    </AuthSplitShell>
  );
};
