import styles from "./Cart.module.scss"
import {OrderCard} from "@/components/screens/Cart/components/OrderCard/OrderCard";
import {DishCart, useCart} from "@/components/hooks/useCart";
import {useState} from "react";

const Cart = () => {

    const {cart} = useCart()
    const [cartState, setCartState] = useState<{dish : DishCart, count : number}[]>(cart)

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