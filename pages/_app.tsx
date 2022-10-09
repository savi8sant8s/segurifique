import '@/layout/globals.scss'
import type { AppProps } from 'next/app'
import { Footer, Header } from '@/layout/index'


export default function Segurifique({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  )
}