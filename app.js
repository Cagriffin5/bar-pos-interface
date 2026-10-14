/**
 * Pioneer POS Application Core Engine
 * Manages item datasets, asynchronous quantity updates, and financial state calculations.
 */

// 1. Core Data State Configuration (Products, Prices, and Stock Trackers)
const menuItems = [
    { id: 101, name: "Smoked Brisket Sandwich", price: 16.50, stock: 12 },
    { id: 102, name: "Pulled Pork Sliders", price: 14.00, stock: 15 },
    { id: 103, name: "Pioneer Craft IPA", price: 8.50, stock: 4 }, // Low Stock Demo
    { id: 104, name: "Bourbon Barrel Stout", price: 10.00, stock: 8 },
    { id: 105, name: "Smoked Wings (6pc)", price: 12.00, stock: 0 }, // Out of Stock Demo
    { id: 106, name: "House Sour Mash Cocktail", price: 11.50, stock: 20 },
    { id: 107, name: "Crispy Garlic Fries", price: 6.50, stock: 25 },
    { id: 108, name: "Artisanal Soft Pretzel", price: 7.00, stock: 10 }
];

// 2. Local State Management Tracking Containers
let currentTab = [];
let selectedTipRate = 0.18; // Default active tip rate percentage setting

// 3. UI DOM Element Node Handle Points
const menuGrid = document.getElementById('menu-grid');
const receiptBody = document.getElementById('receipt-body');
const subtotalDisplay = document.getElementById('summary-subtotal');
const taxDisplay = document.getElementById('summary-tax');
const totalDisplay = document.getElementById('summary-total');
const checkoutBtn = document.getElementById('btn-checkout');
const tipButtons = document.querySelectorAll('.btn-tip');

// 4. Render Touch-Friendly Menu Grid
function renderMenuGrid() {
    menuGrid.innerHTML = '';

    menuItems.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('menu-card');
        
        // Dynamic stock tracking display conditions
        let stockLabel = `In Stock: ${item.stock}`;
        if (item.stock === 0) {
            card.classList.add('out-of-stock');
            stockLabel = "Sold Out";
        } else if (item.stock <= 4) {
            card.classList.add('low-stock');
            stockLabel = `Low Stock: ${item.stock}`;
        }

        card.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p class="menu-item-price">$${item.price.toFixed(2)}</p>
            </div>
            <span class="stock-badge">${stockLabel}</span>
        `;

        // Intercept card clicks to add items to tab
        if (item.stock > 0) {
            card.addEventListener('click', () => addItemToTab(item.id));
        }

        menuGrid.appendChild(card);
    });
}

// 5. Add Items to the Tab Component
function addItemToTab(itemId) {
    const itemData = menuItems.find(i => i.id === itemId);
    const existingIndex = currentTab.findIndex(t => t.id === itemId);

    // Validate active physical inventory availability counts before processing item addition
    const currentQtyInCart = existingIndex > -1 ? currentTab[existingIndex].qty : 0;
    if (itemData.stock <= currentQtyInCart) {
        alert(`Cannot add item. Pioneer stock limits reached for: ${itemData.name}`);
        return;
    }

    if (existingIndex > -1) {
        currentTab[existingIndex].qty += 1;
    } else {
        currentTab.push({ id: itemData.id, name: itemData.name, price: itemData.price, qty: 1 });
    }

    updatePOSView();
}

// 6. Remove/Subtract Quantities From Tab Component
function removeItemFromTab(itemId) {
    const existingIndex = currentTab.findIndex(t => t.id === itemId);
    if (existingIndex === -1) return;

    if (currentTab[existingIndex].qty > 1) {
        currentTab[existingIndex].qty -= 1;
    } else {
        currentTab.splice(existingIndex, 1);
    }

    updatePOSView();
}

// 7. Process Calculations Math Ledger
function calculateTotals() {
    const subtotal = currentTab.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const taxRate = 0.0775; // San Diego Regional Sales Tax Configuration Constant (7.75%)
    
    const calculatedTax = subtotal * taxRate;
    const calculatedTip = subtotal * selectedTipRate;
    const finalBillTotal = subtotal + calculatedTax + calculatedTip;

    subtotalDisplay.textContent = `$${subtotal.toFixed(2)}`;
    taxDisplay.textContent = `$${calculatedTax.toFixed(2)}`;
    totalDisplay.textContent = `$${finalBillTotal.toFixed(2)}`;
}

// 8. Render Tab Receipt Matrix
function renderReceiptTable() {
    receiptBody.innerHTML = '';

    currentTab.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td class="text-right">$${(item.price * item.qty).toFixed(2)}</td>
            <td style="text-align: center;"><button class="btn-remove" data-id="${item.id}">×</button></td>
        `;

        row.querySelector('.btn-remove').addEventListener('click', (e) => {
            removeItemFromTab(parseInt(e.target.getAttribute('data-id')));
        });

        receiptBody.appendChild(row);
    });
}

// 9. Master UI Sync Operations Orchestration Hub
function updatePOSView() {
    renderReceiptTable();
    calculateTotals();
}

// 10. Setup Interactive Event Listeners for Tips and Checkout
tipButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Toggle selected button visual treatments
        tipButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Extract value configuration parameters from DOM node bindings
        selectedTipRate = parseFloat(e.target.getAttribute('data-tip'));
        calculateTotals();
    });
});

checkoutBtn.addEventListener('click', () => {
    if (currentTab.length === 0) {
        alert("The current tab ledger contains no line items to execute.");
        return;
    }

    // Deduct stock levels permanently to simulate standard real-world checkout persistence
    currentTab.forEach(cartItem => {
        const structuralMenuItem = menuItems.find(i => i.id === cartItem.id);
        if (structuralMenuItem) {
            structuralMenuItem.stock -= cartItem.qty;
        }
    });

    // Alert successful payment confirmation execution loop
    alert("Transaction authorized successfully. Tab synchronized and invoice printed.");
    
    // Purge cart states and update master view tracking
    currentTab = [];
    updatePOSView();
    renderMenuGrid();
});

// 11. Initial Application Setup Execution Lifecycles
renderMenuGrid();
updatePOSView();
