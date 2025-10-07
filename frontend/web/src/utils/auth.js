import api, { setAuthToken } from '../api'


export function login(email, password) {
const form = new URLSearchParams()
form.append('username', email)
form.append('password', password)
return api.post('/api/auth/token', form).then(res => {
const token = res.data.access_token
localStorage.setItem('token', token)
setAuthToken(token)
return res
})
}


export function logout() {
localStorage.removeItem('token')
localStorage.removeItem('admin_token')
setAuthToken(null)
}


export function loadTokenOnStart() {
const t = localStorage.getItem('token')
if (t) setAuthToken(t)
}

export function adminLogin(email, password) {
  return api.post('/api/auth/admin/login', { email, password }).then(res => {
    const token = res.data.access_token
    localStorage.setItem('admin_token', token)
    setAuthToken(token)
    return res
  })
}
