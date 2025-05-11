import { signupUser } from '../api.js';
export function render(root) {
    root.innerHTML = `
    <div class="auth-container">
        <img src="/BrewLog.827a91fe.png" alt="BrewLog Logo" class="brand-logo" />
      <form id="signupForm">
        <div class="form-field">
          <label for="firstName">First Name:</label>
          <input type="text" id="firstName" required />
        </div>

        <div class="form-field">
          <label for="lastName">Last Name:</label>
          <input type="text" id="lastName" required />
        </div>

        <div class="form-field">
          <label for="email">Email:</label>
          <input type="email" id="email" required />
        </div>

        <div class="form-field">
          <label for="password">Password:</label>
          <input type="password" id="password" required />
        </div>

        <div class="form-field">
          <label for="bio">Bio:</label>
          <input type="text" id="bio" />
        </div>

        <button type="submit" class="auth-btn">SIGN UP</button>
        <div class="error-message" id="signupError"></div>
      </form>

      <span class="switch-link" id="loginLink">Already have an account? Login</span>
    </div>
  `;

    document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const user = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value.trim(),
            bio: document.getElementById('bio').value.trim()
        };

        const errorDiv = document.getElementById('signupError');

        try {
            const { token } = await signupUser(user);
            localStorage.setItem('token', token);
            window.location.hash = '#/guide';
        } catch (err) {
            errorDiv.textContent = 'Signup failed. Please check your input and try again.';
        }
    });

    document.getElementById('loginLink').addEventListener('click', () => {
        window.location.hash = '#/login';
    });
}