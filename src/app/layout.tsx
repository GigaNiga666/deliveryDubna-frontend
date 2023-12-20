'use client'

import './globals.scss'
import {QueryClient, QueryClientProvider} from "react-query";
import {useEffect} from "react";
import Script from "next/script";
import Head from "next/head";
export default function RootLayout({children}:{ children: React.ReactNode }) {

  const queryClient = new QueryClient({
    defaultOptions : {
      queries : {
        refetchOnWindowFocus : false
      }
    }
  })

  // const {tg} = useTelegram();
  //
  // tg.onEvent('viewportChanged', () => {
  //   if (!tg.isExpanded) tg.expand()
  // })

  useEffect(() => {
    // @ts-ignore
    // const app = window.Telegram?.WebApp
    //
    // app.ready()
    // app.expand()
  },[])

  return (
    <html lang="en">
    <Head>
      <title>DeliveryDubna</title>
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy={"beforeInteractive"}></Script>
    </Head>
    <body>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </body>
    </html>
  )
}
