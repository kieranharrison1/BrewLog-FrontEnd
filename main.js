import App from './src/app.js';

const app = new App();
window.addEventListener('load', () => app.init());
window.addEventListener('hashchange', () => app.route());