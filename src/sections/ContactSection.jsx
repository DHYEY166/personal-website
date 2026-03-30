import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { contactItems } from '../data/contactData';
import { glassCard, gradientText } from '../styles/theme';
import FloatingLabelInput from '../components/ui/FloatingLabelInput';
import ScrollReveal from '../components/ui/ScrollReveal';

export default function ContactSection() {
  const { theme } = useTheme();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.message.trim()) errs.message = 'Message is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <section
      id="contact"
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: 'clamp(60px, 10vw, 100px) clamp(16px, 4vw, 24px)',
      }}
    >
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{
            fontSize: '0.85rem',
            color: theme.text.muted,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: 12,
          }}>
            REACH OUT
          </p>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            ...gradientText(theme.accent.textGradient),
            marginBottom: 0,
          }}>
            Let's Connect!
          </h2>
        </div>
      </ScrollReveal>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 24,
        maxWidth: 900,
        margin: '0 auto 60px',
      }}>
        {contactItems.map((item, i) => (
          <motion.a
            key={i}
            href={item.link}
            target={item.link.startsWith('mailto') ? undefined : '_blank'}
            rel={item.link.startsWith('mailto') ? undefined : 'noopener noreferrer'}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{
              y: -8,
              boxShadow: theme.glass.shadowHover,
              borderColor: 'rgba(102,126,234,0.2)',
            }}
            style={{
              ...glassCard(theme),
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: `${item.color}20`,
              border: `1px solid ${item.color}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: item.color,
              fontWeight: 800,
              fontSize: '1.1rem',
            }}>
              {item.icon}
            </div>
            <div>
              <p style={{
                fontSize: '0.8rem',
                color: theme.text.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 4,
              }}>
                {item.title}
              </p>
              <p style={{ fontSize: '1rem', color: theme.text.primary, fontWeight: 500 }}>
                {item.value}
              </p>
            </div>
          </motion.a>
        ))}
      </div>

      <ScrollReveal delay={0.2}>
        <div style={{ ...glassCard(theme), maxWidth: 600, margin: '0 auto' }}>
          <h3 style={{
            fontSize: '1.3rem',
            fontWeight: 700,
            color: theme.text.heading,
            marginBottom: 32,
            textAlign: 'center',
          }}>
            Send a Message
          </h3>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '40px 0' }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
              <p style={{ color: theme.accent.primary, fontSize: '1.1rem', fontWeight: 600 }}>
                Message sent successfully!
              </p>
              <p style={{ color: theme.text.muted, fontSize: '0.9rem', marginTop: 8 }}>
                Thank you for reaching out.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <FloatingLabelInput
                label="Name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                error={errors.name}
              />
              <FloatingLabelInput
                label="Email"
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                error={errors.email}
              />
              <FloatingLabelInput
                label="Message"
                multiline
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                error={errors.message}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '14px 32px',
                  borderRadius: 12,
                  background: theme.accent.gradient,
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: theme.accent.glow,
                }}
              >
                Send Message
              </motion.button>
            </form>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
}
