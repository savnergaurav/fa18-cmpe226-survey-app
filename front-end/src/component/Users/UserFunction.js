import axios from 'axios'

export const register = newUser => {
    return axios
        .post('users/register', {
            fname: newUser.fname,
            lname: newUser.lname,
            email: newUser.email,
            password: newUser.password
        })
        .then(response => {
            console.log('Registered')
        })
};

export const login = user => {
    return axios
        .post('users/login', {
            email: user.email,
            password: user.password
        })
        .then(response => {
            localStorage.setItem('usertoken', response.data);
            console.log('Logged in');
            return response.data
        })
        .catch(err => {
            console.log(err)
        })
};