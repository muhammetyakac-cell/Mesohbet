import './globals.css';

export const metadata = {
  title: 'Arkeoloji Chat - Anonim Sohbet',
  description: 'Arkeoloji öğrencileri için anonim chat uygulaması',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head />
      <body>{children}</body>
    </html>
  );
}
