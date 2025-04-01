'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9"></div>; // Placeholder to avoid layout shift
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex items-center gap-2 bg-blue-100 dark:bg-gray-800 hover:bg-blue-200 dark:hover:bg-gray-700 rounded-md px-3 py-2 text-sm transition-colors shadow-sm"
    >
      {theme === 'dark' ? (
        <>
          <Sun size={16} className="text-yellow-500" />
          <span className="text-gray-800 dark:text-gray-200">Light Mode</span>
        </>
      ) : (
        <>
          <Moon size={16} className="text-blue-700" />
          <span className="text-gray-800 dark:text-gray-200">Dark Mode</span>
        </>
      )}
    </button>
  );
}
