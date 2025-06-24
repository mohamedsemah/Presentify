export const themes = {
  default: {
    name: 'Default',
    background: '#ffffff',
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    textColor: '#1f2937',
    accentColor: '#10b981',
    fontFamily: 'Inter, sans-serif'
  },
  dark: {
    name: 'Dark',
    background: '#1f2937',
    primaryColor: '#60a5fa',
    secondaryColor: '#9ca3af',
    textColor: '#f9fafb',
    accentColor: '#34d399',
    fontFamily: 'Inter, sans-serif'
  },
  minimal: {
    name: 'Minimal',
    background: '#fafafa',
    primaryColor: '#000000',
    secondaryColor: '#666666',
    textColor: '#333333',
    accentColor: '#ff6b6b',
    fontFamily: 'Helvetica, Arial, sans-serif'
  },
  colorful: {
    name: 'Colorful',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    primaryColor: '#ffffff',
    secondaryColor: '#f1f5f9',
    textColor: '#ffffff',
    accentColor: '#fbbf24',
    fontFamily: 'Poppins, sans-serif'
  },
  academic: {
    name: 'Academic',
    background: '#f8fafc',
    primaryColor: '#1e40af',
    secondaryColor: '#475569',
    textColor: '#0f172a',
    accentColor: '#dc2626',
    fontFamily: 'Georgia, serif'
  }
};

export const getThemeCSS = (theme) => {
  const themeConfig = themes[theme] || themes.default;
  return {
    '--theme-background': themeConfig.background,
    '--theme-primary': themeConfig.primaryColor,
    '--theme-secondary': themeConfig.secondaryColor,
    '--theme-text': themeConfig.textColor,
    '--theme-accent': themeConfig.accentColor,
    '--theme-font': themeConfig.fontFamily
  };
};