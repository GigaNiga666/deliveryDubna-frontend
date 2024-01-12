import {$api} from "@/components/http";

interface ResponseUser {
    name : string
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
    dishes: {
        amount: number,
        image: string,
        name: string,
        saloon: string,
        saloonId: number,
        price: number
    }[]
}

class UserService {

    async getUserInfo(id : number) {
        const res = await $api.get<ResponseUser>(`users/982163886`)
        return res.data
    }

    async getOrder(id : number) {
        const res = await $api.get<ResponseOrder>(`users/order/${id}`)
        return res.data
    }

}

export const userService = new UserService()