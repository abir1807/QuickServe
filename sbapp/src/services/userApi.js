import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8086"
});

export const userSignup = (data) =>
    API.post("/user/register", data);

export const userLogin = (data) =>
    API.post("/user/login", data);