import {IWebApp} from "@/components/types/IWebApp";
import {useEffect} from "react";


export function useTelegram() {

    const tg = (window as any).Telegram?.WebApp as IWebApp


    return {
        tg,
        user: tg.initDataUnsafe.user,
        queryId: tg.initDataUnsafe.query_id
    }
}