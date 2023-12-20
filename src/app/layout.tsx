'use client'

import './globals.scss'
import {QueryClient, QueryClientProvider} from "react-query";
import {useEffect} from "react";
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


  return (
    <html lang="en">
    <Head>
      <title>DeliveryDubna</title>
      <script src="https://telegram.org/js/telegram-web-app.js"></script>
    </Head>
    <body>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </body>
    </html>
  )
}
