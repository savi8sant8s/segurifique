import '@/layout/globals.scss'
import type { AppProps } from 'next/app'
import { Footer, Header } from '@/layout/index'
import { GoogleOAuthProvider } from '@react-oauth/google'

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string

export default function Segurifique({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </GoogleOAuthProvider>
  )
}
