import {IWebApp} from "@/components/types/IWebApp";

const tg = (window as any).Telegram?.WebApp as IWebApp

export function useTelegram() {

    return {
        tg,
        user: tg.initDataUnsafe.user,
        queryId: tg.initDataUnsafe.query_id
    }
}