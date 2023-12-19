import {Dish} from "@/components/types/Dish";

export type DishCart = Dish & {saloon : {id : number, name : string}}

const cart : {dish : DishCart, count : number}[] = []

export function useCart() {

    function addFromCart(dish : Dish, saloonId : number, saloonName : string) {

        const currentOrder = cart.find(order => order.dish.id === dish.id)

        if (currentOrder){
            currentOrder.count++
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

        return currentOrder.count
    }

    return {
        cart,
        addFromCart,
        removeFromCart
    }
}