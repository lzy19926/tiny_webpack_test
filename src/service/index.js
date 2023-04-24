
import axios from "axios";

const path = "http://localhost:3000"

export function getUser(params) {
    return axios.get(path + '/user')
}

