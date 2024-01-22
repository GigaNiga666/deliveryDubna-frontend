import {createContext, FC, PropsWithChildren, useEffect, useMemo, useState} from "react";
import {IWebApp, WebAppUser} from "@/components/types/IWebApp";
import {useRouter} from "next/navigation";

interface TelegramContext {
    tg? : IWebApp,
    user? : WebAppUser
}

export const TelegramContext = createContext<TelegramContext>({});

const TelegramProvider : FC<PropsWithChildren> = ({children}) => {

    const [webApp, setWebApp] = useState<IWebApp | null>(null);
    const router = useRouter()


    useEffect(() => {

        const app = (window as any).Telegram?.WebApp as IWebApp

        function click() {
            router.replace("/cart")
            app.MainButton.offClick(click)
        }

        if (app) {
            app.ready()
            setWebApp(app)
            if (localStorage.getItem("cart")) {
                app.MainButton.setParams({text: "Корзина", color: "#FF7020"})
                app.MainButton.show()
            }
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