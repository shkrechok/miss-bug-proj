export const userService = {
    login,
    signup,
    logout,
    getLoggedinUser,
    getEmptyCredentials
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem('loggedInUser'))
}

function login({ username, password }) {
    return axios.post('/api/auth/login', { username, password })
        .then(res => res.data, error => {
            console.error('Error occurred during login:', error)
            throw error 
        })
        .then(user => {
            sessionStorage.setItem('loggedInUser', JSON.stringify(user))
            return user
        })
        .catch(err => {
            console.error('Error occurred during login:', err)
            return err 
        })
}

function signup({ username, password, fullname }) {
    return axios.post('/api/auth/signup', { username, password, fullname })
        .then(res => res.data)
        .then(user => {
            sessionStorage.setItem('loggedInUser', JSON.stringify(user))
            return user
        })
}

function logout() {
    return axios.post('/api/auth/logout')
        .then(() => {
            sessionStorage.removeItem('loggedInUser')
        })
}

function getEmptyCredentials() {
    return {
        username: '',
        password: '',
        fullname: ''
    }
}

