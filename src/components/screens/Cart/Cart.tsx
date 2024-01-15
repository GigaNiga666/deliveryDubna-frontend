import styles from "./Cart.module.scss"
import {OrderCard} from "@/components/screens/Cart/components/OrderCard/OrderCard";
import {useCart} from "@/components/hooks/useCart";
import {useContext, useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {TelegramContext} from "@/components/providers/TelegramProvider";
import {SvgSprite} from "@/components/ui/SvgSprite/SvgSprite";
import {Range} from "@/components/screens/Cart/ui/Range/Range";
import {useQuery} from "react-query";
import {userService} from "@/components/sevices/UserService";
import {Loader} from "@/components/ui/Loader/Loader";
import {text} from "node:stream/consumers";
import {relativizeURL} from "next/dist/shared/lib/router/utils/relativize-url";

const Cart = () => {

    const {cart, setBonuses, addFromCart, removeFromCart, clear} = useCart()
    const com = useRef<HTMLTextAreaElement>(null);
    const {data, isLoading} = useQuery("bonuses",
        () => userService.getUserBonuses(982163886, cart.map(dish => dish.dish.saloon.id))
    )
    const [input, setInput] = useState<string>("0")
    const [bonusesAwarded, setBonusesAwarded] = useState<number>(0)

    const router = useRouter()
    const {tg} = useContext(TelegramContext)

    function clickWithBonuses() {
        if (calculatePrice() < 100) {
            tg?.showAlert("Минимальная сумма заказа - 100 рублей")
            return
        }
        tg?.showAlert("Test")
        tg?.MainButton.hide()
        document.querySelector("#modal")?.classList.replace("hidden", "flex")
    }

    function clickWithoutBonuses() {
        tg?.MainButton.hide()
        localStorage.setItem("comment", com.current?.value as string)
        setBonuses(+input)
        router.replace("/form")
    }

    function calculatePrice() {
        let price = 0;

        for (const cartElement of cart) {
            price += cartElement.dish.price * cartElement.count
        }
         return price
    }

    function calculateBonuses() {
        if (data) {
            const {factors} = data
            let bonusesAwardedTemp = 0
            for (const cartEl of cart) {
                const factor = factors.find(factor => factor.id === cartEl.dish.saloon.id)
                bonusesAwardedTemp += cartEl.dish.price * cartEl.count * (factor?.factor as number / 100)
            }
            setBonusesAwarded(Math.ceil(bonusesAwardedTemp))
        }
    }

    useEffect(() => {

        tg?.BackButton.show()
        tg?.BackButton.onClick(() => {
            router.replace("/")
        })
        tg?.MainButton.hide()
        tg?.MainButton.setParams({text: "Стоимость: ₽" + calculatePrice(), color: "#FF7020"})

        return () => {
            tg?.MainButton.offClick(clickWithBonuses)
            tg?.MainButton.offClick(clickWithoutBonuses)
        }
    }, [])

    useEffect(() => {
        if (!isLoading) {

            calculateBonuses()

            tg?.MainButton.show()
            if (data != undefined && data.bonuses > 0) tg?.MainButton.onClick(clickWithBonuses)
            else tg?.MainButton.onClick(clickWithoutBonuses)
        }
    }, [isLoading])

    if (isLoading) return (
        <Loader/>
    )

    if (data === undefined) return (
        <>Данные отсутствуют</>
    )

    if (!cart.length) return (
        <div className={"flex flex-col justify-center items-center h-full gap-3"}>
            <SvgSprite id={"cart"} width={70} height={70}/>
            <p className={"text-2xl"}>Ваша корзина <span className={"text-[#FF7020]"}>пустая</span> :(</p>
        </div>
    )

    const {bonuses} = data

    return (
        <div className={styles.cart}>
            <div className={styles.wrapper}>
                <div className={"mb-10 flex justify-between items-center px-5"}>
                    <h2 className={"text-[40px]"}>Корзина</h2>
                    <button className={""} onClick={() => {
                        clear()
                        setInput('0')
                    }}><SvgSprite id={"trash"} width={36} height={36}/></button>
                </div>
                <ul className={"px-3"}>
                    {
                        cart.map(order =>
                            order.count ? <OrderCard calculateBonuses={calculateBonuses} calculatePrice={calculatePrice} key={`${order.dish}${order.count}`}
                                                     order={order} addFromCart={addFromCart}
                                                     removeFromCart={removeFromCart}/> : null
                        )
                    }
                </ul>
                <textarea placeholder='Комментарий к заказу...' ref={com} className={styles.textArea}></textarea>
            </div>
            <div id={'modal'} className={"absolute hidden justify-center items-center inset-0 bg-black bg-opacity-50"}>
                <div className={"bg-white relative w-[90%] rounded-xl p-8 pt-12"}>
                    <button
                        className={"absolute right-[8px] top-[8px] transform hover:scale-110"}
                        onClick={() => {
                            if (data != undefined && data.bonuses > 0) tg?.MainButton.onClick(clickWithBonuses)
                            else tg?.MainButton.onClick(clickWithoutBonuses)
                            tg?.MainButton.show()
                            document.querySelector("#modal")?.classList.replace("flex", "hidden")
                        }}
                    >
                        <SvgSprite id={"cross"} width={24} height={24}/>
                    </button>
                    <div className={"flex justify-between mb-8"}>
                        <h4 className={"text-[20px] font-semibold"}>Оплата бонусами</h4>
                        <div className={"flex items-center"}>
                            <SvgSprite id={"bonus"} width={24} height={24}/>
                            <p>{bonuses}</p>
                        </div>
                    </div>
                    <Range bonuses={bonuses > calculatePrice() ? calculatePrice() - 100 : bonuses} input={input}
                           setInput={setInput}/>
                    <p className={"font-semibold mb-3"}>Начислится бонусов: {bonusesAwarded}</p>
                    <button
                        className={"flex font-semibold justify-center w-full bg-[#FF7020] text-white py-1.5 rounded-xl"}
                        onClick={() => {
                            router.replace("/form")
                            localStorage.setItem("comment", com.current?.value as string)
                            setBonuses(+input)
                        }}
                    >
                        Оплатить {calculatePrice() - +input}₽
                    </button>
                </div>
            </div>
        </div>
    );
};

export {Cart};