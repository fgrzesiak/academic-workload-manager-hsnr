import ApiService from './api.service';
import { saveToken } from './jwt.service';

const resource = '/auth';

const AuthService = {
    async login(payload) {
        const res = await ApiService.post(`${resource}/login`, payload);
        if (res.data) {
            saveToken(res.data.token);
        }
    }
};

export default AuthService;
