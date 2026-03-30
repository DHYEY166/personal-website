import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useTheme } from '../../context/ThemeContext';

export default function ParticleBackground() {
  const { theme } = useTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <Particles
      id="tsparticles"
      options={{
        fullScreen: false,
        background: { color: 'transparent' },
        fpsLimit: 60,
        particles: {
          number: { value: 50, density: { enable: true, area: 800 } },
          color: { value: theme.accent.primary },
          links: {
            enable: true,
            distance: 150,
            color: theme.accent.primary,
            opacity: 0.15,
            width: 1,
          },
          move: {
            enable: true,
            speed: 0.8,
            direction: 'none',
            outModes: 'bounce',
          },
          opacity: { value: { min: 0.1, max: 0.3 } },
          size: { value: { min: 1, max: 2.5 } },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: 'grab' },
          },
          modes: {
            grab: { distance: 140, links: { opacity: 0.3 } },
          },
        },
        detectRetina: true,
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
