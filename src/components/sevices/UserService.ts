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

class UserService {

    async getUserInfo(id : number) {
        const res = await $api.get<ResponseUser>(`users/${id}`)
        return res.data
    }

}

export const userService = new UserService()