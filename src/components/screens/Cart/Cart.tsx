import styles from "./Cart.module.scss"
import {OrderCard} from "@/components/screens/Cart/components/OrderCard/OrderCard";
import {useCart} from "@/components/hooks/useCart";
import {useContext, useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {TelegramContext} from "@/components/providers/TelegramProvider";
import {SvgSprite} from "@/components/ui/SvgSprite/SvgSprite";

const Cart = () => {

    const {cart, addFromCart, removeFromCart, clear} = useCart()
    const com = useRef<HTMLTextAreaElement>(null);
    const [update, setUpdate] = useState<boolean>(false)

    const router = useRouter()
    const {tg} = useContext(TelegramContext)

    function calculatePrice() {
        let price = 0;

        for (const cartElement of cart) {
            price += cartElement.dish.price * cartElement.count
        }

        tg?.MainButton.setParams({text: "Стоимость: ₽" + price, color: "#FF7020"})
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
            localStorage.setItem("comment", com.current?.value as string)
        })
    }, [])

    useEffect(() => {
        if (!cart.length) {
            tg?.MainButton.hide()
        }
    },[update])

    if (!cart.length) return (
        <div className={"flex flex-col justify-center items-center h-full gap-3"}>
            <SvgSprite id={"cart"} width={70} height={70}/>
            <p className={"text-2xl"}>Ваша корзина <span className={"text-[#FF7020]"}>пустая</span> :(</p>
        </div>
    )


    return (
        <div className={styles.cart}>
            <div className={styles.wrapper}>
                <div className={"mb-10 flex justify-between items-center px-5"}>
                    <h2 className={"text-[40px]"}>Корзина</h2>
                    <button className={""} onClick={() => {
                        clear()
                        setUpdate(prevState => !prevState)
                    }}><SvgSprite id={"trash"} width={36} height={36}/></button>
                </div>
                <ul className={"px-3"}>
                    {
                        cart.map(order =>
                           order.count ? <OrderCard key={`${order.dish}${order.count}`} update={setUpdate} order={order} addFromCart={addFromCart} removeFromCart={removeFromCart}/> : null
                        )
                    }
                </ul>
                <textarea placeholder='Комментарий к заказу...' ref={com} className={styles.textArea}></textarea>
            </div>
        </div>
    );
};

export {Cart};