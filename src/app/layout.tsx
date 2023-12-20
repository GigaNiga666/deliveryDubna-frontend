'use client'

import './globals.scss'
import {QueryClient, QueryClientProvider} from "react-query";
import {useEffect} from "react";
import Head from "next/head";
import {IWebApp} from "@/components/types/IWebApp";
import {useTelegram} from "@/components/hooks/useTelegram"

export default function RootLayout({children}: { children: React.ReactNode }) {

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false
            }
        }
    })

    const {tg} = useTelegram()

    useEffect(() => {

        tg.ready()
        tg.expand()

        tg.onEvent('viewportChanged', () => {
            if (!tg.isExpanded) tg.expand()
        })
    }, [])


    return (
        <html lang="en">
        <Head>
            <title>DeliveryDubna</title>
        </Head>
        <body>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </body>
        </html>
    )
}
