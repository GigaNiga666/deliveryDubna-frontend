import {FC} from 'react';
import Link from "next/link";
import {DishCart} from "@/components/hooks/useCart";

interface Props {
    order : {dish : DishCart, count : number},
    update : Function
}

const OrderCard: FC<Props> = ({order, update}) => {

    return (
        <li className={"flex items-start p-5 mb-6 bg-white rounded-[5px] shadow"}>
            <img src={order.dish.image} alt={order.dish.name} className={"h-[60px] w-[90px] object-cover rounded-xl"}/>
            <div className={"flex flex-col ml-3 pl-1.5"}>
                <Link href={`/saloon/${order.dish.saloon.id}/product/${order.dish.id}`}>
                    {order.dish.name} <span className={"text-[#F8A917] font-semibold"}>{order.count}x</span>
                </Link>
                <Link href={`/saloon/${order.dish.saloon.id}`}>
                    <span className={"text-[12px] text-[#B1B1B1] font-light"}>{order.dish.saloon.name}</span>
                </Link>
            </div>
            <span className={"font-semibold block ml-auto"}>₽{order.dish.price}</span>
        </li>
    );
};

export {OrderCard};