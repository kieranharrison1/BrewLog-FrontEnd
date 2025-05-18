import {logOrder, recordPayment, fetchOrderHistory} from '../api.js';
import {getUserIdFromToken, getAuthHeader} from '../auth.js';
import {API_BASE, logOrder, recordPayment, fetchOrderHistory} from '../api.js';


export function render(root) {
    root.innerHTML = `
  <!-- NAVBAR -->
    <nav class="navbar">
      <div class="navbar-left">
        <img src="BrewLog.87fd6b7e.png" alt="BrewLog Logo" class="brand-logo" />
      </div>
      <h1 class="navbar-title">DASHBOARD</h1>
      <button class="hamburger" id="menuToggle" aria-label="Menu">
        <i class="fa-solid fa-bars"></i>
      </button>
    </nav>
    
    <!-- MENU PANEL -->
    <div id="mobileMenu" class="mobile-menu hidden">
      <div class="menu-header">
        <img src="BrewLog.87fd6b7e.png" alt="Logo" class="menu-logo" />
        <h2>MENU</h2>
        <button class="menu-close" id="menuClose">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    
      <div class="menu-links">
        <a href="#/home" class="menu-link">Dashboard</a>
        <a href="#/profile" class="menu-link">Profile</a>
        <a href="#/admin" class="menu-link">Admin Dashboard</a>
        <a href="#/logout" class="menu-link">Logout</a>
      </div>
    </div>

    <div id="pageContent">
      <div class="dashboard-header">
        <div class="balance-display" id="balanceDisplay">
          <span id="balanceAmount"></span>
          <span class="balance-label">CURRENT BALANCE</span>
        </div>
      </div>
    
      <div class="dashboard-cards">
      <div class="card" id="logOrderCard">
        <h3>LOG AN ORDER</h3>
        <i class="fa-solid fa-mug-hot card-icon"></i>
        <button class="card-btn">➤</button>
      </div>

      <div class="card" id="recordPaymentCard">
        <h3>RECORD PAYMENT</h3>
        <i class="fa-solid fa-credit-card card-icon"></i>
        <button class="card-btn">➤</button>
      </div>

      <div class="card" id="viewHistoryCard">
        <h3>YOUR ORDER HISTORY</h3>
        <i class="fa-solid fa-table-list card-icon"></i>
        <button class="card-btn">➤</button>
      </div>
  </div>
          </div>

    <!-- Modals -->
    <sl-dialog label="Log Order" class="modal" id="orderModal">
      <form id="logOrderForm">
        <p><strong>Your Name:</strong> <span id="orderName">Kieran Harrison</span></p>
        <label>No. Cups:
          <select name="cups" id="cupsSelect">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </label>
        <sl-button type="submit" variant="primary">SUBMIT</sl-button>
      </form>
    </sl-dialog>

    <sl-dialog label="Record Payment" class="modal" id="paymentModal">
      <form id="recordPaymentForm">
        <p><strong>Your Name:</strong> <span id="paymentName">Kieran Harrison</span></p>
        <label>Payment Amount:
          <input type="number" id="paymentAmount" required />
        </label>
        <label>Payment Date:
          <input type="date" id="paymentDate" required />
        </label>
        <sl-button type="submit" variant="primary">SUBMIT</sl-button>
      </form>
    </sl-dialog>

    <sl-dialog label="Order History" class="modal" id="historyModal">
      <div class="history-summary">Total No. Cups: 0</div>
      <table class="history-table">
        <thead>
          <tr><th>Date</th><th>Quantity</th><th>Cost</th></tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </sl-dialog>
  `;

    const menu = document.getElementById('mobileMenu');
    const openBtn = document.getElementById('menuToggle');
    const closeBtn = document.getElementById('menuClose');

    openBtn.addEventListener('click', () => {
        menu.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
        menu.classList.add('hidden');
    });

    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
        });
    });

    const pageContent = document.getElementById('pageContent');

    ['orderModal', 'paymentModal', 'historyModal'].forEach(id => {
        const modal = document.getElementById(id);

        modal.addEventListener('sl-show', () => {
            pageContent.classList.add('blurred');
        });

        modal.addEventListener('sl-hide', () => {
            pageContent.classList.remove('blurred');
        });
    });

    // Attach modal triggers
    document.getElementById('logOrderCard')?.addEventListener('click', () => {
        document.getElementById('orderModal').show();
    });

    document.getElementById('recordPaymentCard')?.addEventListener('click', () => {
        document.getElementById('paymentModal').show();
    });

    document.getElementById('logOrderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const cups = document.getElementById('cupsSelect').value;

        try {
            await logOrder(Number(cups));
            document.getElementById('orderModal').hide();
            await updateBalanceDisplay();
        } catch (err) {
            console.error(err);
        }
    });

    document.getElementById('recordPaymentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('paymentAmount').value);
        const date = document.getElementById('paymentDate').value;

        try {
            await recordPayment(amount, date);
            document.getElementById('paymentModal').hide();
            await updateBalanceDisplay();
        } catch (err) {
            console.error(err);
        }
    });

    document.getElementById('viewHistoryCard').addEventListener('click', async () => {
        try {
            const orders = await fetchOrderHistory();
            const tableBody = document.querySelector('.history-table tbody');
            const summary = document.querySelector('.history-summary');

            tableBody.innerHTML = '';
            let totalCups = 0;

            orders.forEach(order => {
                const rawDate = new Date(order.date);
                const date = `${String(rawDate.getDate()).padStart(2, '0')}/${String(rawDate.getMonth() + 1).padStart(2, '0')}/${rawDate.getFullYear()}`;
                const quantity = order.quantity;
                const cost = `$${(quantity * 1).toFixed(2)}`;

                tableBody.innerHTML += `
        <tr>
          <td>${date}</td>
          <td>${quantity}</td>
          <td>${cost}</td>
        </tr>
      `;

                totalCups += quantity;
            });

            summary.textContent = `Total No. Cups: ${totalCups}`;
            document.getElementById('historyModal').show();
        } catch (err) {
            console.error(err);
        }
    });

    async function updateBalanceDisplay() {
        try {
            const userId = getUserIdFromToken();
            const authHeaders = {
                headers: getAuthHeader()
            };

            const [ordersRes, paymentsRes] = await Promise.all([
                fetch(`${API_BASE}/orders/user/${userId}`, authHeaders),
                fetch(`${API_BASE}/payments/user/${userId}`, authHeaders)
            ]);

            const orders = await ordersRes.json();
            const payments = await paymentsRes.json();

            // 1. Calculate total order cost ($1 per cup)
            const orderTotal = orders.reduce((sum, order) => sum + (order.quantity * 1), 0);

            // 2. Sum of approved payments
            const approvedPayments = payments.filter(p => p.confirmed);
            const paymentTotal = approvedPayments.reduce((sum, payment) => sum + payment.amount, 0);

            // 3. Calculate final balance
            const balance = orderTotal - paymentTotal;
            const formattedBalance = balance < 0
                ? `-$${Math.abs(balance).toFixed(2)}`
                : `$${balance.toFixed(2)}`;

            // 4. Update UI
            const balanceAmount = document.getElementById('balanceAmount');
            const balanceDisplay = document.getElementById('balanceDisplay');

            if (balanceAmount && balanceDisplay) {
                balanceAmount.textContent = formattedBalance;
                if (balance > 0) {
                    balanceDisplay.style.color = '#ff3c54'; // debt
                } else if (balance < 0) {
                    balanceDisplay.style.color = '#00cc66'; // credit
                } else {
                    balanceDisplay.style.color = 'white';   // neutral
                }
            }
        } catch (err) {
            console.error('Failed to fetch balance:', err);
        }
    }

    // Safe async call at the end of render
    (async () => {
        await updateBalanceDisplay();
    })();


}