import styles from "./Main.module.scss";
import {SvgSprite} from "@/components/ui/SvgSprite/SvgSprite";
import {saloonService} from "@/components/sevices/SaloonService";
import {useQuery} from "react-query";
import Link from "next/link";
import {useEffect, useState} from "react";
import {useCart} from "@/components/hooks/useCart";
import {useRouter} from "next/navigation";

const Main = () => {

    const { data, isLoading, isError, error} = useQuery("saloons", saloonService.getAll)
    const [categoryState, setCategory] = useState<string>("")
    const {cart} = useCart()
    const router = useRouter()

    if (isLoading) return <>Идёт загрузка</>

    if (!data) return <>Данные по какой-то неизвестной причине отсутствуют(</>

    function categoryClick(category: string) {
        setCategory(category)
    }

    return (
        <>
            <header className={styles.header}>
                <div className={styles.searchWrapper}>
                    <SvgSprite id={"loupe"} width={20} height={20}/>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder='Искать...'/>
                </div>
            </header>
            <nav className="mb-2">
                <ul className={styles.navList}>
                    <li>
                        <button className={`${styles.navItemAll} ${categoryState === "" ? styles.active : ""}`} type="button" onClick={() => categoryClick("")}>
                            <p>Все</p>
                        </button>
                    </li>
                    {
                        data.categories.map(category =>
                            <li key={category}>
                                <button className={`${styles.navItem} ${category === categoryState ? styles.active : ""}`} type="button" onClick={() => categoryClick(category)}>
                                    <SvgSprite id={category} width={30} height={30}/>
                                    <p>{category}</p>
                                </button>
                            </li>
                        )
                    }
                </ul>
            </nav>
            <main className={styles.main}>
                <h2 className={"font-semibold text-3xl mb-4"}>Рестораны</h2>
                <ul className="flex flex-col gap-7">
                    {
                        data.saloons.map(saloon =>

                            categoryState === saloon.category || categoryState === "" ?

                                <li className={styles.saloon} key={saloon.id + saloon.name}>
                                    <Link className={"mb-2.5 h-32"} href={`saloon/${saloon.id}`}>
                                        <img src={saloon.image} alt={saloon.name}/>
                                    </Link>
                                    <Link className="font-semibold text-xl"
                                          href={`${saloon.id}`}>{saloon.name}</Link>
                                    <div>
                                        <div className={"flex items-center mt-1"}>
                                            <SvgSprite id={"star"} width={20} height={20}
                                                       classname={"text-[#ED8A19]"}/>
                                            <p className={"ml-2 mr-5"}>{saloon.rating} ({saloon.rating_quantity})</p>
                                            <p>₽</p>
                                            <p className={saloon.price === 1 || saloon.price === 1 ? "font-light text-[#B1B1B1]" : ""}>₽</p>
                                            <p className={saloon.price <= 2 ? "font-light text-[#B1B1B1]" : ""}>₽</p>
                                        </div>
                                    </div>
                                </li>

                                : null

                        )
                    }
                </ul>
            </main>
        </>
    );
};

export {Main};