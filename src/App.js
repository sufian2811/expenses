import React, { useState, useEffect } from 'react';
import './App.css';

const STORAGE_KEY = 'expense-admin-data';
const COMPANIES_KEY = 'expense-admin-companies';
const ORDER_COMPANIES_KEY = 'expense-admin-order-companies';
const ORDERS_KEY = 'expense-admin-orders';
const PRODUCTS_KEY = 'expense-admin-products';

const defaultExpenseCompanies = [
  'Acme Corp',
  'Tech Solutions Ltd',
  'Global Services Inc',
  'Prime Industries',
];

const defaultOrderCompanies = [
  'Acme Corp',
  'Tech Solutions Ltd',
  'Global Services Inc',
  'Prime Industries',
];

const defaultProducts = ['Fabric Roll', 'Steel Sheet', 'PVC Pipe', 'Aluminum Bar'];

function loadExpenses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return list.map((ex) => ({ ...ex, type: ex.type || 'receive' }));
  } catch {
    return [];
  }
}

function loadCompanies() {
  try {
    const raw = localStorage.getItem(COMPANIES_KEY);
    return raw ? JSON.parse(raw) : defaultExpenseCompanies;
  } catch {
    return defaultExpenseCompanies;
  }
}

function loadOrderCompanies() {
  try {
    const raw = localStorage.getItem(ORDER_COMPANIES_KEY);
    return raw ? JSON.parse(raw) : defaultOrderCompanies;
  } catch {
    return defaultOrderCompanies;
  }
}

function saveExpenses(expenses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function saveCompanies(companies) {
  localStorage.setItem(COMPANIES_KEY, JSON.stringify(companies));
}

function saveOrderCompanies(companies) {
  localStorage.setItem(ORDER_COMPANIES_KEY, JSON.stringify(companies));
}

function loadOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadProducts() {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : defaultProducts;
  } catch {
    return defaultProducts;
  }
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

function App() {
  const [expenses, setExpenses] = useState(loadExpenses);
  const [companies, setCompanies] = useState(loadCompanies);
  const [company, setCompany] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [type, setType] = useState('receive');
  const [editingId, setEditingId] = useState(null);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [showCompanyList, setShowCompanyList] = useState(false);

  const [orders, setOrders] = useState(loadOrders);
  const [orderCompanies, setOrderCompanies] = useState(loadOrderCompanies);
  const [products, setProducts] = useState(loadProducts);
  const [orderCompany, setOrderCompany] = useState('');
  const [orderProduct, setOrderProduct] = useState('');
  const [sizeMeters, setSizeMeters] = useState('');
  const [orderAmount, setOrderAmount] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [orderEditingId, setOrderEditingId] = useState(null);
  const [newOrderCompanyName, setNewOrderCompanyName] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [showAddOrderCompany, setShowAddOrderCompany] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showProductList, setShowProductList] = useState(false);
  const [showOrderCompanyList, setShowOrderCompanyList] = useState(false);

  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    saveCompanies(companies);
  }, [companies]);

  useEffect(() => {
    saveOrderCompanies(orderCompanies);
  }, [orderCompanies]);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  const resetForm = () => {
    setCompany('');
    setAmount('');
    setDueDate('');
    setType('receive');
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedCompany = company.trim();
    const numAmount = parseFloat(amount);
    if (!trimmedCompany || isNaN(numAmount) || numAmount <= 0 || !dueDate) return;

    if (editingId) {
      setExpenses((prev) =>
        prev.map((ex) =>
          ex.id === editingId
            ? { ...ex, company: trimmedCompany, amount: numAmount, dueDate, type }
            : ex
        )
      );
      resetForm();
      return;
    }

    setExpenses((prev) => [
      ...prev,
      {
        id: Date.now(),
        company: trimmedCompany,
        amount: numAmount,
        dueDate,
        type,
      },
    ]);
    resetForm();
  };

  const handleEdit = (expense) => {
    setCompany(expense.company);
    setAmount(String(expense.amount));
    setDueDate(expense.dueDate);
    setType(expense.type || 'receive');
    setEditingId(expense.id);
  };

  const handleDelete = (id) => {
    setExpenses((prev) => prev.filter((ex) => ex.id !== id));
    if (editingId === id) resetForm();
  };

  const addCompany = () => {
    const name = newCompanyName.trim();
    if (name && !companies.includes(name)) {
      setCompanies((prev) => [...prev, name]);
      setNewCompanyName('');
      setShowAddCompany(false);
    }
  };

  const deleteCompany = (name) => {
    if (companies.length <= 1) return;
    setCompanies((prev) => prev.filter((c) => c !== name));
    if (company === name) setCompany('');
  };

  const addOrderCompany = () => {
    const name = newOrderCompanyName.trim();
    if (name && !orderCompanies.includes(name)) {
      setOrderCompanies((prev) => [...prev, name]);
      setNewOrderCompanyName('');
      setShowAddOrderCompany(false);
    }
  };

  const deleteOrderCompany = (name) => {
    if (orderCompanies.length <= 1) return;
    setOrderCompanies((prev) => prev.filter((c) => c !== name));
    if (orderCompany === name) setOrderCompany('');
  };

  const resetOrderForm = () => {
    setOrderCompany('');
    setOrderProduct('');
    setSizeMeters('');
    setOrderAmount('');
    setDeliveryDate('');
    setOrderEditingId(null);
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const trimmedCompany = orderCompany.trim();
    const trimmedProduct = orderProduct.trim();
    const numSize = parseFloat(sizeMeters);
    const numAmount = parseFloat(orderAmount);
    if (!trimmedCompany || !trimmedProduct || isNaN(numSize) || numSize < 0 || isNaN(numAmount) || numAmount <= 0 || !deliveryDate) return;

    if (orderEditingId) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderEditingId
            ? { ...o, company: trimmedCompany, product: trimmedProduct, sizeMeters: numSize, amount: numAmount, deliveryDate }
            : o
        )
      );
      resetOrderForm();
      return;
    }

    setOrders((prev) => [
      ...prev,
      { id: Date.now(), company: trimmedCompany, product: trimmedProduct, sizeMeters: numSize, amount: numAmount, deliveryDate },
    ]);
    resetOrderForm();
  };

  const handleOrderEdit = (order) => {
    setOrderCompany(order.company);
    setOrderProduct(order.product);
    setSizeMeters(String(order.sizeMeters));
    setOrderAmount(String(order.amount));
    setDeliveryDate(order.deliveryDate);
    setOrderEditingId(order.id);
  };

  const handleOrderDelete = (id) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    if (orderEditingId === id) resetOrderForm();
  };

  const addProduct = () => {
    const name = newProductName.trim();
    if (name && !products.includes(name)) {
      setProducts((prev) => [...prev, name]);
      setNewProductName('');
      setShowAddProduct(false);
    }
  };

  const deleteProduct = (name) => {
    if (products.length <= 1) return;
    setProducts((prev) => prev.filter((p) => p !== name));
    if (orderProduct === name) setOrderProduct('');
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const formatDisplayDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = (dateStr) => new Date(dateStr) < new Date() && new Date(dateStr).toDateString() !== new Date().toDateString();

  const totalReceive = expenses
    .filter((ex) => (ex.type || 'receive') === 'receive')
    .reduce((sum, ex) => sum + ex.amount, 0);
  const totalSend = expenses
    .filter((ex) => ex.type === 'send')
    .reduce((sum, ex) => sum + ex.amount, 0);

  const totalOrdersAmount = orders.reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="app">
      <header className="header">
        <h1>Expense Admin</h1>
        <p>Control which company to collect from, amount, and due date</p>
      </header>

      <main className="main">
        <div className="main-left">
        <section className="card form-card">
          <h2>{editingId ? 'Edit expense' : 'Add expense'}</h2>
          <form onSubmit={handleSubmit} className="expense-form">
            <div className="form-row">
              <label htmlFor="company">Company</label>
              <div className="select-wrap">
                <select
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                >
                  <option value="">Select company</option>
                  {companies.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn-add-company"
                  onClick={() => setShowAddCompany(!showAddCompany)}
                  title="Add new company"
                >
                  +
                </button>
                <button
                  type="button"
                  className="btn-add-company btn-list-company"
                  onClick={() => setShowCompanyList(!showCompanyList)}
                  title="Manage companies"
                >
                  ⋮
                </button>
              </div>
              {showAddCompany && (
                <div className="add-company-row">
                  <input
                    type="text"
                    placeholder="New company name"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCompany())}
                  />
                  <button type="button" className="btn btn-secondary" onClick={addCompany}>
                    Add
                  </button>
                </div>
              )}
              {showCompanyList && (
                <div className="company-list">
                  <span className="company-list-label">Expense companies (delete to remove):</span>
                  <ul>
                    {companies.map((c) => (
                      <li key={c}>
                        <span>{c}</span>
                        <button
                          type="button"
                          className="btn-icon danger btn-delete-company"
                          onClick={() => deleteCompany(c)}
                          disabled={companies.length <= 1}
                          title={companies.length <= 1 ? 'Keep at least one company' : 'Delete company'}
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="form-row">
              <label>Amount type</label>
              <div className="type-toggle">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="type"
                    value="receive"
                    checked={type === 'receive'}
                    onChange={(e) => setType(e.target.value)}
                  />
                  To receive (from company)
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="type"
                    value="send"
                    checked={type === 'send'}
                    onChange={(e) => setType(e.target.value)}
                  />
                  To give / send
                </label>
              </div>
            </div>
            <div className="form-row">
              <label htmlFor="amount">Amount (PKR)</label>
              <input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="form-row">
              <label htmlFor="dueDate">Due date</label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Add expense'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-ghost" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="card list-card">
          <h2>Expenses</h2>
          {(totalReceive > 0 || totalSend > 0) && (
            <div className="totals-bar">
              <div className="total-item total-receive">
                <span className="total-label">Total to receive</span>
                <span className="total-value">{formatCurrency(totalReceive)}</span>
              </div>
              <div className="total-item total-send">
                <span className="total-label">Total to send</span>
                <span className="total-value">{formatCurrency(totalSend)}</span>
              </div>
            </div>
          )}
          {expenses.length === 0 ? (
            <p className="empty-state">No expenses yet. Add one above.</p>
          ) : (
            <div className="table-wrap">
              <table className="expense-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>To receive (PKR)</th>
                    <th>To send (PKR)</th>
                    <th>Due date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {[...expenses]
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                    .map((ex) => (
                      <tr key={ex.id} className={isOverdue(ex.dueDate) ? 'overdue' : ''}>
                        <td>{ex.company}</td>
                        <td>{(ex.type || 'receive') === 'receive' ? formatCurrency(ex.amount) : '—'}</td>
                        <td>{ex.type === 'send' ? formatCurrency(ex.amount) : '—'}</td>
                        <td>
                          <span className="due-date">
                            {formatDisplayDate(ex.dueDate)}
                            {isOverdue(ex.dueDate) && <span className="badge overdue-badge">Overdue</span>}
                          </span>
                        </td>
                        <td className="actions">
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => handleEdit(ex)}
                            title="Edit"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn-icon danger"
                            onClick={() => handleDelete(ex.id)}
                            title="Delete"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        </div>

        <div className="main-right">
        <section className="card form-card">
          <h2>Manage Orders</h2>
          <h3 className="card-subtitle">{orderEditingId ? 'Edit order' : 'Add order'}</h3>
          <form onSubmit={handleOrderSubmit} className="expense-form">
            <div className="form-row">
              <label htmlFor="order-company">Company</label>
              <div className="select-wrap">
                <select
                  id="order-company"
                  value={orderCompany}
                  onChange={(e) => setOrderCompany(e.target.value)}
                  required
                >
                  <option value="">Select company</option>
                  {orderCompanies.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <button type="button" className="btn-add-company" onClick={() => setShowAddOrderCompany(!showAddOrderCompany)} title="Add company">+</button>
                <button type="button" className="btn-add-company btn-list-company" onClick={() => setShowOrderCompanyList(!showOrderCompanyList)} title="Manage companies">⋮</button>
              </div>
              {showAddOrderCompany && (
                <div className="add-company-row">
                  <input type="text" placeholder="New company name" value={newOrderCompanyName} onChange={(e) => setNewOrderCompanyName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOrderCompany())} />
                  <button type="button" className="btn btn-secondary" onClick={addOrderCompany}>Add</button>
                </div>
              )}
              {showOrderCompanyList && (
                <div className="company-list">
                  <span className="company-list-label">Order companies (delete to remove):</span>
                  <ul>
                    {orderCompanies.map((c) => (
                      <li key={c}>
                        <span>{c}</span>
                        <button type="button" className="btn-icon danger btn-delete-company" onClick={() => deleteOrderCompany(c)} disabled={orderCompanies.length <= 1} title={orderCompanies.length <= 1 ? 'Keep at least one company' : 'Delete company'}>Delete</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="form-row">
              <label htmlFor="order-product">Product / Name</label>
              <div className="select-wrap">
                <select
                  id="order-product"
                  value={orderProduct}
                  onChange={(e) => setOrderProduct(e.target.value)}
                  required
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <button type="button" className="btn-add-company" onClick={() => setShowAddProduct(!showAddProduct)} title="Add product">+</button>
                <button type="button" className="btn-add-company btn-list-company" onClick={() => setShowProductList(!showProductList)} title="Manage products">⋮</button>
              </div>
              {showAddProduct && (
                <div className="add-company-row">
                  <input type="text" placeholder="New product name" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addProduct())} />
                  <button type="button" className="btn btn-secondary" onClick={addProduct}>Add</button>
                </div>
              )}
              {showProductList && (
                <div className="company-list">
                  <span className="company-list-label">Order products (delete to remove):</span>
                  <ul>
                    {products.map((p) => (
                      <li key={p}>
                        <span>{p}</span>
                        <button type="button" className="btn-icon danger btn-delete-company" onClick={() => deleteProduct(p)} disabled={products.length <= 1} title={products.length <= 1 ? 'Keep at least one product' : 'Delete product'}>Delete</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="form-row">
              <label htmlFor="size-meters">Size (meters)</label>
              <input id="size-meters" type="number" min="0" step="0.01" placeholder="0.00" value={sizeMeters} onChange={(e) => setSizeMeters(e.target.value)} required />
            </div>
            <div className="form-row">
              <label htmlFor="order-amount">Total amount (PKR)</label>
              <input id="order-amount" type="number" min="0" step="0.01" placeholder="0.00" value={orderAmount} onChange={(e) => setOrderAmount(e.target.value)} required />
            </div>
            <div className="form-row">
              <label htmlFor="delivery-date">Delivery date</label>
              <input id="delivery-date" type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} required />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">{orderEditingId ? 'Update order' : 'Add order'}</button>
              {orderEditingId && <button type="button" className="btn btn-ghost" onClick={resetOrderForm}>Cancel</button>}
            </div>
          </form>
        </section>

        <section className="card list-card">
          <h2>Orders</h2>
          {orders.length > 0 && (
            <div className="totals-bar">
              <div className="total-item total-receive">
                <span className="total-label">Total amount (PKR)</span>
                <span className="total-value">{formatCurrency(totalOrdersAmount)}</span>
              </div>
            </div>
          )}
          {orders.length === 0 ? (
            <p className="empty-state">No orders yet. Add one above.</p>
          ) : (
            <div className="table-wrap">
              <table className="expense-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Product</th>
                    <th>Size (m)</th>
                    <th>Amount (PKR)</th>
                    <th>Delivery date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {[...orders]
                    .sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate))
                    .map((o) => (
                      <tr key={o.id}>
                        <td>{o.company}</td>
                        <td>{o.product}</td>
                        <td>{Number(o.sizeMeters) === o.sizeMeters && o.sizeMeters % 1 === 0 ? o.sizeMeters : o.sizeMeters}</td>
                        <td>{formatCurrency(o.amount)}</td>
                        <td>{formatDisplayDate(o.deliveryDate)}</td>
                        <td className="actions">
                          <button type="button" className="btn-icon" onClick={() => handleOrderEdit(o)} title="Edit">Edit</button>
                          <button type="button" className="btn-icon danger" onClick={() => handleOrderDelete(o.id)} title="Delete">Delete</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        </div>
      </main>
    </div>
  );
}

export default App;
