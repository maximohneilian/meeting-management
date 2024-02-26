import axios, { AxiosInstance } from 'axios'

export const api : AxiosInstance = axios.create({
    baseURL:'https://cannabees-cloud.propulsion-learn.ch/api',
    // baseURL:'http://127.0.0.1:8000/api',
})