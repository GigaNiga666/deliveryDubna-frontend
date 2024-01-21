'use client'
import {useCallback, useContext, useEffect, useState} from "react";
import {TelegramContext} from "@/components/providers/TelegramProvider";
import {userService} from "@/components/sevices/UserService";

const CMMPage = () => {

    const {tg} = useContext(TelegramContext)

    const [msg, setMsg] = useState<string>("")

    const click = useCallback(async () => {
        tg?.MainButton.showProgress(true)
        const res  = await userService.distribution(msg, tg?.initDataUnsafe.user?.id as number)
        tg?.MainButton.showProgress(false)
        tg?.showAlert(res)
    }, [msg])

    useEffect(() => {
        tg?.MainButton.onClick(click)
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