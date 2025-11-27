import Navbar from '@/components/LandingPage/Navbar';
import './globals.css'; 
import {
  ClerkProvider 
} from '@clerk/nextjs'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Navbar/>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}