import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { CoreProvider } from '@/application/providers';
import { LiveRegionProvider } from '@/components/a11y';
import { NavigationProvider } from '@/components/navigation';
import { ResponsiveLayout } from '@/components/layouts';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Neuralift | Dual N-Back Training',
  description:
    'Elevate your cognitive performance with scientifically-backed dual n-back training. Personalized feedback powered by AI.',
  keywords: ['n-back', 'brain training', 'cognitive', 'working memory', 'neuralift'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <CoreProvider>
          <LiveRegionProvider>
            <NavigationProvider>
              <ResponsiveLayout>{children}</ResponsiveLayout>
            </NavigationProvider>
          </LiveRegionProvider>
        </CoreProvider>
      </body>
    </html>
  );
}
