import styles from "./Saloon.module.scss";
import {SvgSprite} from "@/components/ui/SvgSprite/SvgSprite";
import {useQuery} from "react-query";
import {useParams, useRouter} from "next/navigation";
import {saloonService} from "@/components/sevices/SaloonService";
import Link from "next/link";
import {useCart} from "@/components/hooks/useCart";
import {Dish} from "@/components/types/Dish";
import {useContext, useEffect} from "react";
import {TelegramContext} from "@/components/providers/TelegramProvider";

const Saloon = () => {

    const saloonId = useParams().saloon
    const {data, isError, error, isLoading} = useQuery("saloon"+saloonId, () => saloonService.getOne(saloonId as string))

    const {cart, addFromCart, removeFromCart} = useCart()

    const router = useRouter()
    const {tg} = useContext(TelegramContext)

    const backBtnClick = () => {
        router.push("/cart")
        tg?.BackButton.offClick(backBtnClick)
    }

    useEffect(() => {

        tg?.BackButton.show()
        tg?.BackButton.onClick(() => {
            router.back()
        })
        tg?.MainButton.setParams({text: "Корзина"})
        tg?.MainButton.onClick(() => {
            backBtnClick()
        })

        if (cart.length) tg?.MainButton.show()


    },[])

    if (isLoading) return <>Идёт загрузка</>

    if (!data) return <>Данные по какой-то неизвестной причине отсутствуют(</>

    function clickButton(category : string) {
        document.querySelector(`#${category}`)?.scrollIntoView({block: "start", behavior: "smooth"})
    }

    function addDishToCart(target : EventTarget & HTMLButtonElement, dish : Dish) {
        const counter = target.closest("li")?.querySelector("[data-counter]");

        if (!counter) return

        if (!tg?.MainButton.isVisible) tg?.MainButton.show()

        target.parentElement?.classList.add(styles.btnWrapper)
        counter.classList.replace("hidden",styles.counter)
        counter.textContent = String(addFromCart(dish, +saloonId, data?.saloon.name as string))
    }

    function removeDishFromCart(target : EventTarget & HTMLButtonElement, dish : Dish) {
        const counter = target.closest("li")?.querySelector("[data-counter]");

        if (!counter) return

        const count = String(removeFromCart(dish))

        if (+count === 0) {
            target.parentElement?.classList.remove(styles.btnWrapper)
            counter.classList.replace(styles.counter,"hidden")
        }

        if (!cart.length) tg?.MainButton.hide()

        counter.textContent = count
    }

    return (
        <>
            <header className={"h-[250px] mb-9 relative"}>
                <img className={styles.headerImg} src={data.saloon.image} alt={data.saloon.name}/>
                <div className={"absolute top-[25%] pl-6"}>
                    <h2 className={"text-white font-bold text-4xl"}>{data.saloon.name}</h2>
                    <div className={"flex gap-4 mt-6"}>
                        <div className={"flex gap-2 bg-white rounded-xl p-2 bg-opacity-80"}>
                            <SvgSprite id={"star"} width={24} height={24}/>
                            <div className={"text-[12px] text-center"}>
                                <p>{data.saloon.rating}</p>
                                <p>{data.saloon.rating_quantity}</p>
                            </div>
                        </div>
                        <button className={"px-3 py-2 bg-white bg-opacity-80 rounded-xl"}>
                            <SvgSprite id={"info"} width={24} height={24}/>
                        </button>
                    </div>
                </div>
            </header>
            <nav className="mb-2">
                <ul className={styles.navList}>
                    {
                        data.categories.map(category =>
                            <li className={styles.navItem} key={category} onClick={() => clickButton(category)}>
                                <SvgSprite id={category} width={30} height={30}/>
                                <p>{category}</p>
                            </li>
                        )
                    }
                </ul>
            </nav>
            <main className={styles.main}>
                {
                    data.categories.map(category =>
                        <div id={category} key={category+"products"}>
                            <h2 className={"font-semibold text-3xl mb-4"}>{category}</h2>
                            <ul className={styles.productList}>
                                {
                                    data.dishes.map(dish =>
                                        dish.category === category ?
                                        <li className={styles.product} key={dish.id}>
                                            <div className={`${cart.find(o => o.dish.id === dish.id) ? styles.counter : "hidden"}`} data-counter>
                                                {
                                                    cart.find(o => o.dish.id === dish.id)?.count
                                                }
                                            </div>
                                            <Link href={`${saloonId}/product/${dish.id}`}>
                                                <img className={"w-full object-cover"} src={dish.image} alt={dish.name}/>
                                            </Link>
                                            <p className={"mb-1 font-semibold"}>
                                                <span>{dish.price}</span>
                                                <span>₽</span>
                                            </p>
                                            <h3 className={"text-[12px] mb-4"}>{dish.name}</h3>
                                            <p className={"text-[12px] text-[#B1B1B1] mb-2"}>{dish.weight}г</p>

                                            <div className={`relative h-[32px] ${cart.find(o => o.dish.id === dish.id) ? styles.btnWrapper : ""}`}>
                                                <button className={styles.productBtnDefault} onClick={(event) =>
                                                    addDishToCart(event.currentTarget, dish)}></button>
                                                <button className={styles.productBtnMinus} onClick={(event) =>
                                                    removeDishFromCart(event.currentTarget, dish)}>-</button>
                                            </div>
                                        </li>
                                            : null
                                    )
                                }
                            </ul>
                        </div>
                    )
                }
            </main>
        </>
    );
};

export {Saloon};