export function render(root) {
    root.innerHTML = `
    <div class="dashboard-header">
      <img src="BrewLog.87fd6b7e.png" alt="BrewLog Logo" class="brand-logo" />
      <h2>DASHBOARD</h2>
      <div class="balance-display">-$22.00 <span class="balance-label">Current Balance</span></div>
    </div>

    <div class="dashboard-cards">
      <div class="card" id="logOrderCard">
        <h3>LOG AN ORDER</h3>
        <img src="/src/assets/order-icon.svg" alt="Order Icon">
        <button class="card-btn">➤</button>
      </div>

      <div class="card" id="recordPaymentCard">
        <h3>RECORD PAYMENT</h3>
        <img src="/src/assets/payment-icon.svg" alt="Payment Icon">
        <button class="card-btn">➤</button>
      </div>

      <div class="card" id="viewHistoryCard">
        <h3>YOUR ORDER HISTORY</h3>
        <img src="/src/assets/history-icon.svg" alt="History Icon">
        <button class="card-btn">➤</button>
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
      <div class="history-summary">Total No. Cups: 16</div>
      <table class="history-table">
        <thead>
          <tr><th>Date</th><th>Quantity</th><th>Cost</th></tr>
        </thead>
        <tbody>
          <tr><td>01/04/2025</td><td>1</td><td>$1.00</td></tr>
          <tr><td>03/04/2025</td><td>2</td><td>$2.00</td></tr>
          <tr><td>05/04/2025</td><td>1</td><td>$1.00</td></tr>
        </tbody>
      </table>
    </sl-dialog>
  `;

    document.getElementById('logOrderCard').addEventListener('click', () => {
        document.getElementById('orderModal').show();
    });

    document.getElementById('recordPaymentCard').addEventListener('click', () => {
        document.getElementById('paymentModal').show();
    });

    document.getElementById('viewHistoryCard').addEventListener('click', () => {
        document.getElementById('historyModal').show();
    });
}