import axios from "axios";

const API_URL = process.env.API_URL

console.log(API_URL)

export const $api = axios.create({
    baseURL: API_URL
})

