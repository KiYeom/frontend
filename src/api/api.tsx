import axios from 'axios'
import {AUTH} from '../constants/Auth'
const baseURL = 'http://34.125.112.144:8000/api/v1/auth/'

//인스턴스 생성하기 
const instance = axios.create({
  baseURL : baseURL,
})

