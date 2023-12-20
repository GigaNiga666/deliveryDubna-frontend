import {createContext, FC, PropsWithChildren, useEffect, useMemo, useState} from "react";
import {IWebApp, WebAppUser} from "@/components/types/IWebApp";

interface TelegramContext {
    tg? : IWebApp,
    user? : WebAppUser
}

export const TelegramContext = createContext<TelegramContext>({});

const TelegramProvider : FC<PropsWithChildren> = ({children}) => {

    const [webApp, setWebApp] = useState<IWebApp | null>(null);


    useEffect(() => {

        const app = (window as any).Telegram?.WebApp as IWebApp

        if (app) {
            app.ready()
            setWebApp(app)
        }

    }, [])

    const value = useMemo(() => {
        return webApp ? {
            tg : webApp,
            user : webApp.initDataUnsafe.user
        } : {}
    }, [webApp]);

    return (
        <TelegramContext.Provider value={value}>
            {children}
        </TelegramContext.Provider>
    );
};

export {TelegramProvider};