'use client'

import './globals.scss'
import {QueryClient, QueryClientProvider} from "react-query";
export default function RootLayout({children}:{ children: React.ReactNode }) {

  const queryClient = new QueryClient({
    defaultOptions : {
      queries : {
        refetchOnWindowFocus : false
      }
    }
  })

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  )
}
