document.addEventListener('DOMContentLoaded', () => {
  
  // Static Product Catalog Configuration Dataset
  const inventoryMenu = [
    { id: 'PROD-01', name: 'Sip House Red Wine', price: 12.00 },
    { id: 'PROD-02', name: 'Craft IPA Beer', price: 8.50 },
    { id: 'PROD-03', name: 'Pioneer BBQ Burger', price: 16.00 },
    { id: 'PROD-04', name: 'Smoked Brisket Tacos', price: 14.50 },
    { id: 'PROD-05', name: 'Garlic Parmesan Fries', price: 7.00 },
    { id: 'PROD-06', name: 'Artisanal Soft Pretzel', price: 9.00 }
  ];

  // Transaction Ledger State Model Array
  let currentCheckTab = [];
  let currentTipRate = 0.18; // Default selected tip coefficient initialization (18%)
  const taxConstantRate = 0.0775; // San Diego Constant Sales Tax Index (7.75%)

  // UI Components Target DOM Selection Hooks
  const menuGridContainer = document.getElementById('menu-grid');
  const receiptTableBody = document.getElementById('receipt-body');
  const checkoutActionBtn = document.getElementById('btn-checkout');
  const tipSelectionButtons = document.querySelectorAll('.btn-tip');

  // Math Output String View Targets
  const displaySubtotal = document.getElementById('summary-subtotal');
  const displayTax = document.getElementById('summary-tax');
  const displayTotal = document.getElementById('summary-total');

  /* -------------------------------------------------------------
     1. Build Product Button Catalog Matrix Elements Natively
  ------------------------------------------------------------- */
  function initializePOSCatalogUI() {
    if (!menuGridContainer) return;
    menuGridContainer.innerHTML = '';

    inventoryMenu.forEach(item => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'product-card-btn';
      button.setAttribute('aria-label', `Add ${item.name} into transaction ledger for $${item.price.toFixed(2)}`);
      
      button.innerHTML = `
        <span class="prod-name">${escapeHTML(item.name)}</span>
        <span class="prod-price">$${item.price.toFixed(2)}</span>
      `;

      button.addEventListener('click', () => {
        addProductToCheckTab(item);
      });

      menuGridContainer.appendChild(button);
    });

    renderReceiptInvoiceLedger();
  }

  function addProductToCheckTab(product) {
    const existingCheckItem = currentCheckTab.find(item => item.id === product.id);

    if (existingCheckItem) {
      existingCheckItem.qty += 1;
    } else {
      currentCheckTab.push({
        id: product.id,
        name: product.name,
        price: product.price,
        qty: 1
      });
    }

    renderReceiptInvoiceLedger();
  }

  /* -------------------------------------------------------------
     2. Calculation Pipeline & Check Rendering Engine
  ------------------------------------------------------------- */
  function renderReceiptInvoiceLedger() {
    receiptTableBody.innerHTML = '';

    if (currentCheckTab.length === 0) {
      receiptTableBody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center" style="color: var(--text-muted); padding: 40px; font-style: italic;">
            No items added to current terminal register check.
          </td>
        </tr>
      `;
      displaySubtotal.textContent = '\$0.00';
      displayTax.textContent = '\$0.00';
      displayTotal.textContent = '\$0.00';
      return;
    }

    let accumulatedSubtotal = 0.0;

    currentCheckTab.forEach(item => {
      const totalItemRowCost = item.price * item.qty;
      accumulatedSubtotal += totalItemRowCost;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${escapeHTML(item.name)}</strong></td>
        <td class="text-center">${item.qty}</td>
        <td class="text-right" style="font-family: monospace;">$${totalItemRowCost.toFixed(2)}</td>
        <td class="text-center">
          <button type="button" class="btn-item-purge" data-id="${item.id}" aria-label="Purge item reference check lines for ${escapeHTML(item.name)}">
            &times;
          </button>
        </td>
      `;

      row.querySelector('.btn-item-purge').addEventListener('click', (e) => {
        const idMatch = e.target.getAttribute('data-id');
        currentCheckTab = currentCheckTab.filter(record => record.id !== idMatch);
        renderReceiptInvoiceLedger();
      });

      receiptTableBody.appendChild(row);
    });

    // Execute standard accounting balance matrices calculations
    const computedSalesTax = accumulatedSubtotal * taxConstantRate;
    const computedGratuity = accumulatedSubtotal * currentTipRate;
    const localizedFinalTotal = accumulatedSubtotal + computedSalesTax + computedGratuity;

    // Flush computed output balances directly down to individual panels view layers
    displaySubtotal.textContent = `$${accumulatedSubtotal.toFixed(2)}`;
    displayTax.textContent = `$${computedSalesTax.toFixed(2)}`;
    displayTotal.textContent = `$${localizedFinalTotal.toFixed(2)}`;
  }

  /* -------------------------------------------------------------
     3. Tip Selection Group Array Click Controls
  ------------------------------------------------------------- */
  tipSelectionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetPercent = parseFloat(button.getAttribute('data-tip'));

      tipSelectionButtons.forEach(b => {
        b.classList.remove('active');
        b.removeAttribute('aria-current');
      });

      button.classList.add('active');
      button.setAttribute('aria-current', 'true');
      currentTipRate = targetPercent;

      renderReceiptInvoiceLedger();
    });
  });

  /* -------------------------------------------------------------
     4. Tab Finalization Clear Settlement Execution Trigger Hooks
  ------------------------------------------------------------- */
  if (checkoutActionBtn) {
    checkoutActionBtn.addEventListener('click', () => {
      if (currentCheckTab.length === 0) return;

      alert(`Terminal Invoice Closed Successfully!\nCheck Balance Cleared: ${displayTotal.textContent}`);
      
      // Wipe structural model arrays back down to baseline values reset configurations
      currentCheckTab = [];
      renderReceiptInvoiceLedger();
    });
  }

  /* Helper script checking and cleaning text parameters string mutations */
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // Self execute constructor on module load
  initializePOSCatalogUI();
});
