import {FC} from 'react';
import Link from "next/link";
import {DishCart} from "@/components/hooks/useCart";

interface Props {
    order : {dish : DishCart, count : number},
    update : Function
}

const OrderCard: FC<Props> = ({order, update}) => {

    return (
        <li className={"flex justify-between p-5 mb-6 bg-white rounded-[5px] shadow"}>
            <div className={"flex gap-2 items-center"}>
                <img src={order.dish.image} alt={order.dish.name} className={"h-[60px] rounded-xl"}/>
                <div className={"w-[120px]"}>
                    <Link href={`/saloon/${order.dish.saloon.id}/product/${order.dish.id}`}>{order.dish.name} <span className={"text-[#F8A917] font-semibold"}>{order.count}x</span></Link>
                </div>
            </div>
            <div>
                <span className={"font-semibold"}>₽{order.dish.price}</span>
            </div>
        </li>
    );
};

export {OrderCard};