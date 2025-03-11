import axios from 'axios';

const API_URL = 'http://localhost:8080';

class AuthService {
    async login(email, password) {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
       console.log(response.data);
       
        return response;
    }

    async signup(userData) {
        const response = await axios.post(`${API_URL}/signup/post`, userData);
        return response;
    }
}

export default new AuthService();
