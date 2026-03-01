import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import './globals.css'

export const metadata = {
  title: {
    default: 'Dev Blog',
    template: '%s | Dev Blog',
  },
  description: 'Thoughts, tutorials & experiments',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Navbar />
        <main className="pt-14">
          {children}
        </main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#041008',
              color: '#b8d4b0',
              border: '1px solid rgba(0,255,65,0.15)',
              fontFamily: 'monospace',
            },
            success: { iconTheme: { primary: '#00ff41', secondary: '#041008' } },
            error:   { iconTheme: { primary: '#ff5f56', secondary: '#041008' } },
          }}
        />
      </body>
    </html>
  )
}