const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: { DEFAULT: token('brand'), strong: token('brand-strong'), soft: token('brand-soft') },
        ink: token('ink'),
        muted: token('muted'),
        line: token('line'),
        canvas: token('canvas'),
        surface: token('surface'),
        success: { DEFAULT: token('success'), soft: token('success-soft') },
        warn: { DEFAULT: token('warn'), soft: token('warn-soft') },
        danger: { DEFAULT: token('danger'), soft: token('danger-soft') },
        info: { DEFAULT: token('info'), soft: token('info-soft') },
      },
    },
  },
};
