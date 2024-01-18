import {useContext, useState} from "react";
import {TelegramContext} from "@/components/providers/TelegramProvider";
import {useRouter} from "next/navigation";
import Link from "next/link";
import styles from "./styles.module.scss"
import {useQuery} from "react-query";
import {userService} from "@/components/sevices/UserService";
import {Loader} from "@/components/ui/Loader/Loader";

const AdminOrders = () => {
    const {tg} = useContext(TelegramContext)
    const {data, isLoading} = useQuery("orders", () => userService.getOrders())
    const [search, setSearch] = useState<string>("")
    const [id, setId] = useState<boolean>(false)
    const [date, setDate] = useState<boolean>(false)
    const [state, setState] = useState<boolean>(false)
    const [price, setPrice] = useState<boolean>(false)

    const router = useRouter()

    if (isLoading) return <Loader/>

    if (!data) return <>Данные отсутствуют по неизвестной причине(</>

    const orders = data.orders.filter(order => {

        if (!search) return true

        let idBool = false;
        let dateBool = false;
        let stateBool = false;
        let priceBool = false;

        if (id) {
            idBool = order.id.toString().includes(search)
        }
        if (date) {
            dateBool = order.date.includes(search)
        }

        if (state) {
            stateBool = order.state.includes(search)
        }

        if (price) {
            priceBool = order.price.toString().includes(search)
        }

        return idBool || dateBool || stateBool || priceBool
    })

    return (
        <main className={"p-4"}>
            <h2 className={"text-[40px] mb-8"}>Заказы пользователей</h2>
            <header className={"mb-7 p-2 rounded-[5px]"}>
                <input type="text" placeholder={"Поиск..."} value={search} onInput={(event) => setSearch(event.currentTarget.value)}/>
            </header>
            <div>
                <ul>
                    <div className={styles.orderHeader}>
                        <label className={"flex gap-1"}>
                            <input type="checkbox" onInput={(e) => setId(e.currentTarget.checked)}/>
                            <p>Id</p>
                        </label>
                        <label className={"flex gap-1"}>
                            <input type="checkbox" onInput={(e) => setDate(e.currentTarget.checked)}/>
                            <p>Дата заказа</p>
                        </label>
                        <label className={"flex gap-1"}>
                            <input type="checkbox" onInput={(e) => setState(e.currentTarget.checked)}/>
                            <p>Статус</p>
                        </label>
                        <label className={"flex gap-1"}>
                            <input type="checkbox" onInput={(e) => setPrice(e.currentTarget.checked)}/>
                            <p>Цена</p>
                        </label>
                    </div>
                    {
                        orders.map(order =>
                            <li key={order.id} className={styles.orderItem}>
                                <Link style={{color: "blue"}} className={"hover:underline"}
                                      href={`/profile/order/${order.id}`}>#{order.id}</Link>
                                <div className={"text-center"}>
                                    <p>{order.date}</p>
                                </div>
                                <select className={"text-center"} defaultValue={order.state} onInput={(e) => {
                                    userService.updateOrder(e.currentTarget.value, order.id)
                                    order.state = e.currentTarget.value
                                }}>
                                    {
                                        data.states.map(state =>
                                            <option value={state}>{state}</option>
                                        )
                                    }
                                </select>
                                <p>₽{order.price}</p>
                            </li>
                        )
                    }
                </ul>
            </div>
        </main>
    );
};

export {AdminOrders};