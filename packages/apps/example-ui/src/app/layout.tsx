import './global.css';

import { Roboto } from 'next/font/google';
import { StyledComponentsRegistry } from './registry';
import { Providers } from '../providers';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700'],
});

export const metadata = {
  title: 'Example UI',
  description: 'Example UI',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
