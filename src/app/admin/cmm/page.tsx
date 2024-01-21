'use client'
import {useCallback, useContext, useEffect, useState} from "react";
import {TelegramContext} from "@/components/providers/TelegramProvider";
import {userService} from "@/components/sevices/UserService";
import {useRouter} from "next/navigation";

const CMMPage = () => {

    const {tg} = useContext(TelegramContext)

    const [msg, setMsg] = useState<string>("")
    const router = useRouter()

    const click = useCallback(async () => {
        tg?.MainButton.showProgress(true)
        const res  = await userService.distribution(msg, tg?.initDataUnsafe.user?.id as number)
        tg?.MainButton.showProgress(false)
        tg?.showAlert(res)
    }, [msg])

    const backClick = useCallback(() => {
        router.back()
        tg?.BackButton.offClick(backClick)
    }, [])

    useEffect(() => {
        tg?.MainButton.onClick(click)
        tg?.BackButton.onClick(backClick)

        return () => {
            tg?.MainButton.offClick(click)
        }
    }, [])

    return (
        <main className={"p-4"}>
            <h2 className={"text-[40px] mb-8"}>Рассылка</h2>
            <textarea className={"bg-white w-full p-3 rounded-[12px] focus-visible:outline-none"}
                      placeholder={"Ваше сообщение..."} value={msg} onInput={(e) => setMsg(e.currentTarget.value)}/>
        </main>
    )
}

export default CMMPage