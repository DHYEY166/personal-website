import { useState } from 'react';
import { useTheme } from '../styles/useTheme';
import { contactItems } from '../data/contactData';
import { panel, sectionStyle } from '../styles/theme';
import FloatingLabelInput from '../components/ui/FloatingLabelInput';
import ScrollReveal from '../components/ui/ScrollReveal';
import SectionHeader from '../components/ui/SectionHeader';

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

export default function ContactSection() {
  const { theme } = useTheme();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.message.trim()) errs.message = 'Message is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSending(true);
    setSendError('');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: form.name,
          email: form.email,
          message: form.message,
          subject: `Portfolio Contact from ${form.name}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setForm({ name: '', email: '', message: '' });
        }, 4000);
      } else {
        setSendError('Something went wrong. Please try again.');
      }
    } catch {
      setSendError('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" style={sectionStyle}>
      <div style={{ borderTop: theme.border.default, paddingTop: 'clamp(40px, 6vw, 64px)' }}>
        <SectionHeader id="contact-title" kicker="REACH OUT" title="Let's Connect!" />

        <ScrollReveal>
          <div className="contact-grid">
            <ul style={{ listStyle: 'none', borderTop: `2px solid ${theme.text.primary}`, alignSelf: 'start' }}>
              {contactItems.map((item) => {
                const external = !item.link.startsWith('mailto');
                return (
                  <li key={item.title} style={{ padding: '14px 0', borderBottom: theme.border.default }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: theme.text.muted,
                        marginBottom: 2,
                      }}
                    >
                      {item.title}
                    </p>
                    <a
                      href={item.link}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      className="text-link"
                      style={{ fontSize: 17, overflowWrap: 'anywhere' }}
                    >
                      {item.value}
                      {external && <span className="sr-only"> (opens in a new tab)</span>}
                    </a>
                  </li>
                );
              })}
            </ul>

            <div style={panel(theme)}>
              <h3 style={{ fontSize: 22, marginBottom: 24 }}>Send a Message</h3>

              {submitted ? (
                <div role="status" style={{ padding: '32px 0' }}>
                  <div style={{ fontSize: 40, lineHeight: 1, color: theme.accent.text, marginBottom: 12 }} aria-hidden="true">✓</div>
                  <p style={{ color: theme.text.primary, fontSize: 18, fontWeight: 600 }}>
                    Message sent successfully!
                  </p>
                  <p style={{ color: theme.text.muted, fontSize: 15, marginTop: 6 }}>
                    Thank you for reaching out.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate aria-label="Send a message">
                  <FloatingLabelInput
                    label="Name"
                    name="name"
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    error={errors.name}
                  />
                  <FloatingLabelInput
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    error={errors.email}
                  />
                  <FloatingLabelInput
                    label="Message"
                    name="message"
                    multiline
                    required
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    error={errors.message}
                  />
                  {sendError && (
                    <p role="alert" style={{ color: theme.text.error, fontSize: 15, marginBottom: 16 }}>
                      {sendError}
                    </p>
                  )}
                  <button type="submit" disabled={sending} className="btn btn--primary">
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
