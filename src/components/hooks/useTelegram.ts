import {IWebApp} from "@/components/types/IWebApp";
import {useEffect, useState} from "react";


export function useTelegram() {

    const [tg, setTg] = useState<IWebApp>((window as any).Telegram?.WebApp as IWebApp)


    return {
        tg,
        user: tg.initDataUnsafe.user,
        queryId: tg.initDataUnsafe.query_id
    }
}