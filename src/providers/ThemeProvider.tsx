'use client';

import React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Allow any props by using a type assertion
export function ThemeProvider({
  children,
  ...props
}: { children: React.ReactNode } & any) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
