import '../styles/globals.scss'
import type { AppProps } from 'next/app'

export default function SSUPE({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}