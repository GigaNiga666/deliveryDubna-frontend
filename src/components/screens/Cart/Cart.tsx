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
    const [update, setUpdate] = useState<boolean>(false)
    const {data, isLoading} = useQuery("bonuses", () => userService.getUserBonuses(982163886))
    const [input, setInput] = useState<string>("0")


    const router = useRouter()
    const {tg} = useContext(TelegramContext)

    function calculatePrice() {
        let price = 0;

        for (const cartElement of cart) {
            price += cartElement.dish.price * cartElement.count
        }
         return price
    }

    useEffect(() => {

        tg?.BackButton.show()
        tg?.BackButton.onClick(() => {
            router.replace("/")
        })
        tg?.MainButton.setParams({text: "Стоимость: ₽" + calculatePrice(), color: "#FF7020"})
        tg?.MainButton.onClick(() => {
            if (calculatePrice() < 100) {
                tg?.showAlert("Минимальная сумма заказа - 100 рублей")
                return
            }
            document.querySelector("#modal")?.classList.replace("hidden", "flex")
            tg?.MainButton.hide()
        })
    }, [])

    useEffect(() => {
        if (!cart.length) {
            tg?.MainButton.hide()
        }
    },[update])

    useEffect(() => {
        if (!isLoading) {
            tg?.MainButton.show()
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
                           order.count ? <OrderCard calculatePrice={calculatePrice} key={`${order.dish}${order.count}`} update={setUpdate} order={order} addFromCart={addFromCart} removeFromCart={removeFromCart}/> : null
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
                            <p>{data}</p>
                        </div>
                    </div>
                    <Range bonuses={data > calculatePrice() ? calculatePrice() - 100 : data} input={input} setInput={setInput}/>
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