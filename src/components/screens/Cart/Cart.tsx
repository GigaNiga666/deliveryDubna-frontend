import styles from "./Cart.module.scss"
import {OrderCard} from "@/components/screens/Cart/components/OrderCard/OrderCard";
import {DishCart, useCart} from "@/components/hooks/useCart";
import {useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {TelegramContext} from "@/components/providers/TelegramProvider";

const Cart = () => {

    const {cart} = useCart()
    const [cartState, setCartState] = useState<{dish : DishCart, count : number}[]>(cart)

    const router = useRouter()
    const {tg} = useContext(TelegramContext)

    function calculatePrice() {
        let price = 0;

        for (const cartElement of cart) {
            price += cartElement.dish.price * cartElement.count
        }

        tg?.MainButton.setParams({text: "Стоимость: ₽"+price, color: "#FF7020"})
    }

    useEffect(() => {

        tg?.BackButton.show()
        tg?.BackButton.onClick(() => {
            router.replace("/")
        })
        calculatePrice()
        tg?.MainButton.show()
        tg?.MainButton.onClick(() => {
            router.replace("/form")
        })
    },[])

    return (
        <div className={styles.cart}>
            <div className={styles.wrapper}>
                <h2 className={styles.title}>Корзина</h2>
                <ul className={"px-3"}>
                    {
                        !cart.length ? <>Ваша корзина пустая :(</> :
                            cartState.map(order =>
                                <OrderCard order={order} update={setCartState}/>
                            )
                    }
                </ul>
            </div>
        </div>
    );
};

export {Cart};