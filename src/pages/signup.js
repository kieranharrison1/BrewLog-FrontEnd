import {signupUser} from '../api.js';

export function render(root) {
    root.innerHTML = `
    <div class="auth-container">
        <img src="BrewLog.87fd6b7e.png" alt="BrewLog Logo" class="brand-logo" />
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
        
        <div class="form-field">
        <label for="avatar">Profile Avatar:</label>
        <input type="file" id="avatar" accept="image/*" />
        </div>

      </form>

      <span class="switch-link" id="loginLink">Already have an account? Login</span>
    </div>
  `;

    document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const errorDiv = document.getElementById('signupError');
        const avatarFile = document.getElementById('avatar').files[0];

        try {
            // Step 1: Create the user (without avatar)
            const user = {
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim(),
                email: document.getElementById('email').value.trim(),
                password: document.getElementById('password').value.trim(),
                bio: document.getElementById('bio').value.trim(),
                accessLevel: 1,
                avatar: null
            };

            const res = await fetch(`${API_BASE}/user`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(user)
            });

            if (!res.ok) throw new Error('User creation failed');
            const createdUser = await res.json();

            // Step 2: Upload avatar if selected
            if (avatarFile) {
                const formData = new FormData();
                formData.append('avatar', avatarFile);

                const uploadRes = await fetch(`${API_BASE}/user/${createdUser._id}/avatar`, {
                    method: 'POST',
                    body: formData
                });

                if (!uploadRes.ok) throw new Error('Avatar upload failed');
            }

            // After user and avatar created successfully:
            window.location.hash = '#/guide';
        } catch (err) {
            errorDiv.textContent = 'Signup failed. Please check your input and try again.';
            console.error(err);
        }
    });

    document.getElementById('loginLink').addEventListener('click', () => {
        window.location.hash = '#/login';
    });
}