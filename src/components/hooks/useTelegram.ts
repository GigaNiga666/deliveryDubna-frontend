// import {IWebApp} from "@/components/types/IWebApp";
// import {useEffect} from "react";
//
//
// export function useTelegram() {
//
//     let tg : IWebApp;
//
//     useEffect(() => {
//         tg = (window as any).Telegram?.WebApp as IWebApp
//     }, [])
//
//
//     return {
//         tg,
//         user: tg.initDataUnsafe.user,
//         queryId: tg.initDataUnsafe.query_id
//     }
// }