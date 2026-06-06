import { useContext } from 'react';
import { ThemeContext } from '@/src/providers/ThemeProvider';

export const useAppTheme = () => {
  return useContext(ThemeContext);
};
