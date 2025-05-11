import { render as renderLogin } from './pages/login.js';
import { render as renderSignup } from './pages/signup.js';
import { render as renderGuide } from './pages/guide.js';
import { render as renderHome } from './pages/home.js';
import { render as renderProfile } from './pages/profile.js';
import { validateToken } from './api.js';

export default class App {
    constructor() {
        this.root = document.getElementById('root');
        this.protectedRoutes = ['#/guide', '#/home', '#/profile'];
    }

    async init() {
        const token = localStorage.getItem('token');

        const hash = window.location.hash || '#/login';
        const isProtected = this.protectedRoutes.includes(hash);

        if (isProtected) {
            try {
                await validateToken(token);
                this.route(); // token valid, proceed
            } catch (err) {
                localStorage.removeItem('token');
                window.location.hash = '#/login';
            }
        } else {
            this.route();
        }
    }

    route() {
        const hash = window.location.hash || '#/login';

        const routes = {
            '#/login': renderLogin,
            '#/signup': renderSignup,
            '#/guide': renderGuide,
            '#/home': renderHome,
            '#/profile': renderProfile
        };

        const renderFn = routes[hash] || renderLogin;
        renderFn(this.root);
    }
}