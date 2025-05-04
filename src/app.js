import { render as renderLogin } from './pages/login.js';
import { render as renderSignup } from './pages/signup.js';
import { render as renderGuide } from './pages/guide.js';
import { render as renderHome } from './pages/home.js';
import { render as renderProfile } from './pages/profile.js';

export default class App {
    constructor() {
        this.root = document.getElementById('root');
    }

    init() {
        // Example: setup logic like checking login state later
        this.route();
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