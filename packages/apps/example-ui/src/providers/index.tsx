'use client';
import { ReduxProvider } from '../redux/provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ReduxProvider>{children}</ReduxProvider>;
}
