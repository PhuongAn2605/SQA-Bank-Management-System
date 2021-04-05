import request from 'request';
import { authentication } from '../controller/authentication';

it('Return a 201 on successful signup', async () => {
    return request(authentication)
    .post('/sign_up')
    .send({
        "cardNo": "12334354365",
        "username": "Phuongzz",
        "password": "12345678",
        "address": "HD",
        "dob": "2000-26-05",
        "phone": "09843642",
        "email": "anphuong2605@gmail.com",
        "balance": "0"
    })
    .expect(201);
})