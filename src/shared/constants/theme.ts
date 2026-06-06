export const lightColors = {
  primary: '#4f46e5',
  primaryLight: '#818cf8',
  primaryDark: '#3730a3',
  primaryBg: '#e0e7ff',

  background: '#f8fafc',
  surface: '#ffffff',
  
  text: '#0f172a',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',

  border: '#e2e8f0',

  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  
  design: '#0ea5e9',
  coding: '#f59e0b',
  business: '#10b981',
  finance: '#8b5cf6',
};

export const darkColors = {
  primary: '#6366f1',
  primaryLight: '#818cf8',
  primaryDark: '#4338ca',
  primaryBg: '#312e81',

  background: '#0f172a',
  surface: '#1e293b',
  
  text: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',

  border: '#334155',

  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  
  design: '#0ea5e9',
  coding: '#f59e0b',
  business: '#10b981',
  finance: '#8b5cf6',
};

export type AppColors = typeof lightColors;

// Default export for backward compatibility during refactor, will be removed if all refactored.
export const COLORS = lightColors;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const SHADOWS = {
  sm: {
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  md: {
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  lg: {
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 9999,
};
