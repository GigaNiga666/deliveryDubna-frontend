'use client'

import './globals.scss'
import {QueryClient, QueryClientProvider} from "react-query";
import {useEffect} from "react";
import {useTelegram} from "@/components/hooks/useTelegram";
export default function RootLayout({children}:{ children: React.ReactNode }) {

  const queryClient = new QueryClient({
    defaultOptions : {
      queries : {
        refetchOnWindowFocus : false
      }
    }
  })

  const {tg} = useTelegram();

  tg.onEvent('viewportChanged', () => {
    if (!tg.isExpanded) tg.expand()
  })

  useEffect(() => {
    tg.ready()
    tg.expand()
  },[])

  return (
    <html lang="en">
    <head>
      <script src="https://telegram.org/js/telegram-web-app.js"></script>
      <title>DeliveryDubna</title>
    </head>
    <body>
    <QueryClientProvider client={queryClient}>
    {children}
        </QueryClientProvider>
      </body>
    </html>
  )
}
