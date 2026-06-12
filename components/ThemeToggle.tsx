'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative w-11 h-11 rounded-full flex items-center justify-center border border-base bg-base-secondary hover:scale-105 active:scale-95 transition-transform"
    >
      {theme === 'light' ? (
        <Moon size={20} className="text-secondary" />
      ) : (
        <Sun size={20} className="text-yellow-400" />
      )}
    </button>
  );
}
