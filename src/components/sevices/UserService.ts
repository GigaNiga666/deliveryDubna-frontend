import {$api} from "@/components/http";

interface ResponseUser {
    name : string
    bonuses: number
    orders : {
        id: number
        date: string
        state: string
        price: number
    }[]
}

interface ResponseOrder {
    address: string,
    paymentType: string,
    surrender: number | null,
    telephone: string,
    price: number,
    isPaid: boolean,
    bonuses: number,
    promocode: {promo: string, value: number} | null
    dishes: {
        amount: number,
        image: string,
        name: string,
        saloon: string,
        saloonId: number,
        price: number
    }[]
}

interface ResponseBonuses {
    bonuses : number,
    factors: {
        id: number,
        factor: number
    }[]
}

class UserService {

    async getUserInfo(id : number) {
        const res = await $api.get<ResponseUser>(`users/${id}`)
        return res.data
    }

    async getUserBonuses(id : number, saloons: number[]) {
        const res = await $api.post<ResponseBonuses>(`users/bonuses/${id}`, {saloons})
        return res.data
    }

    async getOrder(id : number) {
        const res = await $api.get<ResponseOrder>(`users/order/${id}`)
        return res.data
    }

    async usePromo(promo: string, id: number) {
        const res = await $api.post<{state: string, msg : string | number}>(`promo/use`, {promo,id})
        return res.data
    }

}

export const userService = new UserService()