import {createContext, FC, PropsWithChildren, useEffect, useMemo, useState} from "react";
import {IWebApp} from "@/components/types/IWebApp";

export const TelegramContext = createContext<IWebApp | null>(null);

const TelegramProvider : FC<PropsWithChildren> = ({children}) => {

    const [webApp, setWebApp] = useState<IWebApp | null>(null);


    useEffect(() => {

        const app = (window as any).Telegram?.WebApp as IWebApp

        if (app) {
            app.ready()
            app.expand()

            app.onEvent('viewportChanged', () => {
                if (!app.isExpanded) app.expand()
            })
            setWebApp(app)
        }

    }, [])

    const value = useMemo(() => {
        return webApp
    }, [webApp]);

    return (
        <TelegramContext.Provider value={value}>
            {children}
        </TelegramContext.Provider>
    );
};

export {TelegramProvider};