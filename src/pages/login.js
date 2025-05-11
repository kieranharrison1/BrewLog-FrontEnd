import { loginUser } from '../api.js';

export function render(root) {
    root.innerHTML = `

    <div class="login-container">
    <img src="/BrewLog.827a91fe.png" alt="BrewLog Logo" class="brand-logo" />
    <div class="form-field">
          <label for="email">Username:</label>
          <input type="email" id="email" placeholder="Enter your email" />
        </div>
    
        <div class="form-field">
          <label for="password">Password:</label>
          <input type="password" id="password" placeholder="Enter your password" />
        </div>
    
        <button class="auth-btn" id="loginBtn">LOGIN</button>
        <div class="error-message" id="loginError"></div>
    
        <span class="switch-link" id="signupLink">Don't have an account? Sign up</span>
      </div>
  `;

    document.getElementById('loginBtn').addEventListener('click', async () => {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const errorDiv = document.getElementById('loginError');

        try {
            const { token, isFirstLogin } = await loginUser(email, password);
            localStorage.setItem('token', token);

            // Example: track first login
            if (isFirstLogin) {
                window.location.hash = '#/guide';
            } else {
                window.location.hash = '#/home';
            }
        } catch (err) {
            errorDiv.textContent = 'Invalid login credentials. Please try again.';
        }
    });

    document.getElementById('signupLink').addEventListener('click', () => {
        window.location.hash = '#/signup';
    });
}