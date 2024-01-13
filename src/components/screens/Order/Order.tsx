import {useParams, useRouter} from "next/navigation";
import styles from "./Order.module.scss"
import Link from "next/link";
import {useQuery} from "react-query";
import {userService} from "@/components/sevices/UserService";
import {Loader} from "@/components/ui/Loader/Loader";
import {useContext, useEffect} from "react";
import {TelegramContext} from "@/components/providers/TelegramProvider";

const Order = () => {

    const id = useParams().id
    const {data, isLoading, isError} = useQuery(`order${id}`, () => userService.getOrder(+id))
    const {tg} = useContext(TelegramContext)
    const router = useRouter()

    useEffect(() => {
        tg?.BackButton.show()
        tg?.BackButton.onClick(() => {
            router.replace("/profile")
        })
    },[])

    if (isLoading) return <Loader/>

    if (!data) return <>Данные отсутствуют по неизвестной причине(</>

    return (
        <main className={"p-5"}>
            <h2 className={"text-[40px] mb-6"}>Заказ #{id}</h2>
            <ul className={"flex flex-col gap-[10px] mb-8"}>
                <li>
                    <h4 className={styles.infoName}>Адрес</h4>
                    <p className={styles.infoContent}>{data.address || "Отсутствует"}</p>
                </li>
                <li>
                    <h4 className={styles.infoName}>Оплата</h4>
                    <p className={styles.infoContent}>
                        {
                            data.paymentType ?
                                `${data.paymentType} ${data.surrender ? data.surrender : ""}` :
                                data.isPaid ?
                                    "Онлайн" :
                                    "Отсутствует"
                        }
                    </p>
                </li>
                <li>
                    <h4 className={styles.infoName}>Телефон</h4>
                    <p className={styles.infoContent}>{data.telephone || "Отсутствует"}</p>
                </li>
            </ul>
            <div>
                <h4 className={"text-[24px] font-semibold mb-6"}>Блюда</h4>
                <ul className={"flex flex-col"}>
                    {
                        data.dishes.map(dish =>
                            <li className={"flex items-start p-5 mb-6 bg-white rounded-[5px] shadow"}>
                                <img
                                    src={dish.image}
                                    alt={dish.name}
                                    className={"h-[60px] w-[90px] object-contain rounded-xl"}/>
                                <div className={"flex flex-col ml-3 pl-1.5"}>
                                    <p>
                                        {dish.name} <span className={"text-[#F8A917] font-semibold"}>{dish.amount}x</span>
                                    </p>
                                    <Link href={`/saloon/${dish.saloonId}`}>
                                        <span className={"text-[12px] text-[#B1B1B1] font-light"}>{dish.saloon}</span>
                                    </Link>
                                </div>
                                <div className={"ml-auto"}>
                                    <span className={"font-semibold text-center block"}>₽{dish.price}</span>
                                </div>
                            </li>
                        )
                    }
                </ul>
            </div>
            <div className={"flex items-end flex-col"}>
                <span className={"font-semibold"}>{data.isPaid ? "Оплачен" : "Не оплачен"}</span>
                <span>₽{data.price}</span>
            </div>
        </main>
    );
};

export {Order};