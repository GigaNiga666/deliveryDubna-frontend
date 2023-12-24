import {Dish} from "@/components/types/Dish";
import {useState} from "react";

export type DishCart = Dish & {saloon : {id : number, name : string}}

let local = null

if (typeof window !== 'undefined') {
    local = localStorage?.getItem("cart")
}

const cart : {dish : DishCart, count : number}[] = local ? JSON.parse(local) : []

export function useCart() {

    const [com, setCom] = useState<string>("")

    function addFromCart(dish : Dish, saloonId : number, saloonName : string) {

        const currentOrder = cart.find(order => order.dish.id === dish.id)

        if (currentOrder){
            currentOrder.count++
            localStorage?.setItem("cart", JSON.stringify(cart))
            return currentOrder.count
        }
        else {
            cart.push({
                dish : {
                    ...dish,
                    saloon : {
                        id : saloonId,
                        name : saloonName
                    }
                },
                count: 1
            })
            localStorage?.setItem("cart", JSON.stringify(cart))
            return 1
        }
    }

    function removeFromCart(dish : Dish) {
        const currentOrder = cart.find(order => order.dish.id === dish.id)

        if (currentOrder) currentOrder.count--
        else return

        if (currentOrder.count === 0) {
            cart.splice(cart.indexOf(currentOrder), 1)
            return 0;
        }

        localStorage?.setItem("cart", JSON.stringify(cart))
        return currentOrder.count
    }

    return {
        com,
        setCom,
        cart,
        addFromCart,
        removeFromCart
    }
}