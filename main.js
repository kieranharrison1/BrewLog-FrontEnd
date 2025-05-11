import App from './src/app.js'
import '@shoelace-style/shoelace/dist/shoelace.js';

const app = new App();
window.addEventListener('load', () => app.init());
window.addEventListener('hashchange', () => app.route());