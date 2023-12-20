'use client'

import './globals.scss'
import {QueryClient, QueryClientProvider} from "react-query";
import {useEffect} from "react";
import Head from "next/head";
import {IWebApp} from "@/components/types/IWebApp";

export default function RootLayout({children}: { children: React.ReactNode }) {

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false
            }
        }
    })

    useEffect(() => {
        const app = (window as any).Telegram?.WebApp as IWebApp

        app.ready()
        app.expand()

        app.onEvent('viewportChanged', () => {
            if (!app.isExpanded) app.expand()
        })
    }, [])


    return (
        <html lang="en">
        <Head>
            <title>DeliveryDubna</title>
            <script src="https://telegram.org/js/telegram-web-app.js"></script>
        </Head>
            <body>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </body>
        </html>
    )
}
