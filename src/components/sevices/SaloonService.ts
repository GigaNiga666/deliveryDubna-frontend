import {$api} from "@/components/http";
import {Dish} from "@/components/types/Dish";

interface GetAllRes {
    saloons : {
        id:number;
        name: string;
        image: string;
        price: number;
        rating: number;
        rating_quantity: number;
        info: string;
        categories:string[];
    }[]
    categories : {
        name : string,
        image : string
    }[]
}

interface Saloon {
    name: string;
    image: string;
    price: number;
    rating: number;
    rating_quantity: number;
    info: string;
}

interface GetOneRes {
    saloon : Saloon
    dishes : Dish[]
    categories : {
        name : string,
        image : string
    }[]
}

interface PaymentData {
    name : string
    telephone : string
    address : string
    url : string
}


class SaloonService {

    async getAll() {
        const res = await $api.get<GetAllRes>("saloons")
        return res.data
    }

    async getOne(id : string) {
        const res = await $api.get<GetOneRes>("saloons/"+id)
        return res.data
    }

    async getPaymentData(id : number) {
        const res = await $api.post<PaymentData>(`users/paymentData/${id}`)
        return res.data
    }
}

export const saloonService = new SaloonService()