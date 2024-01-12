import {useContext, useEffect} from "react";
import {TelegramContext} from "@/components/providers/TelegramProvider";
import {SvgSprite} from "@/components/ui/SvgSprite/SvgSprite";
import {useQuery} from "react-query";
import {userService} from "@/components/sevices/UserService";
import {Loader} from "@/components/ui/Loader/Loader";
import Link from "next/link";
import {useRouter} from "next/navigation";

const Profile = () => {

    const {tg} = useContext(TelegramContext)
    const { data, isLoading, isError } = useQuery("user", () =>  userService.getUserInfo(tg?.initDataUnsafe.user?.id as number))
    const router = useRouter()

    useEffect(() => {
        tg?.BackButton.show()
        tg?.BackButton.onClick(() => {
            router.replace("/")
        })
    },[])

    if (isLoading) return (
        <Loader/>
    )

    if (!data) return (
        <>
            Данные по неизвестной причине отсутствуют
        </>
    )

    return (
        <main className={"p-4"}>
            <h2 className={"text-[40px] mb-8"}>Профиль</h2>
            <header className={"flex gap-10 mb-8"}>
                <img className={"rounded-[50%] h-24"}
                     src={"https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.1412446893.1704931200&semt=ais"}
                     alt=""/>
                <div>
                    <h4 className={"text-[24px] mb-3"}>{tg?.initDataUnsafe.user?.first_name}</h4>
                    <div className={"flex gap-2"}>
                        <SvgSprite id={"bonus"} width={24} height={24}/>
                        <p>300</p>
                    </div>
                </div>
            </header>
            <div>
                <h4 className={"text-[20px] font-light mb-6"}>История заказов</h4>
                <ul>
                    {
                        data.orders.length ? data.orders.map(order =>
                            <li key={order.id} className={"text-[12px] flex justify-between bg-white p-5 rounded-[10px] items-center mb-6"}>
                                <Link style={{color: "blue"}} className={"hover:underline"} href={`profile/order/${order.id}`}>#{order.id}</Link>
                                <div className={"text-center"}>
                                    <p>{order.date}</p>
                                </div>
                                <p>{order.state}</p>
                                <p>₽{order.price}</p>
                            </li>
                        ) : "Заказов нет"
                    }
                </ul>
            </div>
        </main>
    );
};

export {Profile};