# SmartVolt – AI-Powered Battery & Electrical Shopping and Billing System

**SmartVolt** is an intelligent, full-stack electrical e-commerce platform and automated billing system designed specifically for batteries, power equipment, solar systems, and electrical hardware.

The system helps customers select electrically compatible products based on voltage, continuous wattage, capacity, and chemistry; calculates total budgets including GST; manages orders; generates authorized PDF invoices; and delivers notifications via WhatsApp and SMS.

---

## 1. System Architecture

- **Frontend**: React 19 SPA, Tailwind CSS v4, Lucide Icons, jsPDF Client Invoicing, Motion
- **Backend (Python)**: FastAPI, SQLAlchemy 2.0, Pydantic V2, Uvicorn
- **AI & Analytics**: Scikit-Learn (Cosine similarity vector ranking), NumPy, Pandas (Sales trend aggregation and demand forecasting)
- **Billing & Documents**: ReportLab (Python GST Tax Invoices with HSN 8507) & jsPDF
- **Notifications**: Meta WhatsApp Business Cloud API + direct WhatsApp link dispatch (`wa.me`) + SMS gateway integration
- **Database**: SQLite (local development) / MySQL (production)

---

## 2. Directory Structure

```text
├── backend/
│   ├── database.py              # SQLAlchemy connection & session manager (SQLite / MySQL)
│   ├── init_db.py               # Database seeder (categories, products, specs, coupons)
│   ├── invoice_generator.py     # ReportLab professional PDF GST invoice generator
│   ├── main.py                  # FastAPI server with all REST endpoints
│   ├── ml_recommender.py        # Scikit-learn similarity & electrical compatibility gatekeeper
│   ├── models.py                # SQLAlchemy models for all 15 tables
│   ├── notification_service.py  # WhatsApp Cloud API & SMS dispatch service
│   ├── requirements.txt         # All requested Python packages
│   └── schemas.py               # Pydantic validation schemas
├── src/
│   ├── assets/images/           # Photorealistic commercial hardware photography
│   ├── components/              # Navbar, Footer, ProductCard, ReviewModal
│   ├── context/AppContext.tsx   # React global state (Cart, Orders, Auth, Inventory)
│   ├── data/initialProducts.ts  # Catalog data with full electrical specifications
│   ├── types/index.ts           # Full TypeScript domain definitions
│   ├── utils/electricalEngine.ts# Physical formulas & ML compatibility logic
│   ├── utils/notifications.ts   # WhatsApp links and SMS notification dispatch
│   ├── utils/pdfGenerator.ts    # Browser-side high-resolution PDF invoice generator
│   ├── views/                   # All 16 requested application views
│   │   ├── HomeView.tsx
│   │   ├── AboutView.tsx
│   │   ├── CatalogView.tsx
│   │   ├── ProductDetailView.tsx
│   │   ├── SmartFinderView.tsx
│   │   ├── BudgetCalculatorView.tsx
│   │   ├── ComparisonView.tsx
│   │   ├── CartView.tsx
│   │   ├── CheckoutView.tsx
│   │   ├── PaymentView.tsx
│   │   ├── OrderConfirmationView.tsx
│   │   ├── MyOrdersView.tsx
│   │   ├── MyInvoicesView.tsx
│   │   ├── ProfileView.tsx
│   │   ├── ContactView.tsx
│   │   └── AdminDashboardView.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── package.json
└── README.md
```

---

## 3. Python Backend Setup & Execution

### Prerequisites
- Python 3.10+
- pip & virtualenv

### Installation

```bash
# 1. Create and activate a Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install all required dependencies
pip install -r backend/requirements.txt

# 3. Seed initial database (categories, products, coupons)
python -m backend.init_db

# 4. Start the FastAPI development server
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive API documentation will be available at `http://localhost:8000/docs`.

---

## 4. Frontend Web App Setup & Execution

```bash
# Install node packages
npm install

# Start Vite dev server on port 3000
npm run dev
```

The application will be live at `http://localhost:3000`.

---

## 5. Electrical Sizing & Compatibility Rules

The system enforces strict electrical safety:
- **Voltage Matching**: Nominal voltage must match within ±8% tolerance.
- **Continuous Wattage**: The product's continuous power rating must meet or exceed required wattage:
  $$P_{\text{rated}} \ge P_{\text{required}}$$
- **Backup Duration Runtime**:
  $$T_{\text{hours}} = \frac{V_{\text{nominal}} \times Ah \times \text{DoD} \times \eta}{P_{\text{load}}}$$
  *(LiFePO4 DoD = 0.90, Li-ion DoD = 0.80, Lead-Acid DoD = 0.50, Inverter $\eta = 0.90$)*
- **Budget Protection**: Cheaper compatible alternatives are suggested only if they satisfy technical constraints. Incompatible products are strictly blocked.

---

## 6. Testing Instructions

1. **Smart Product Finder**:
   - Navigate to **Smart Match**.
   - Set Voltage to `48V`, Continuous Power to `1500W`, Capacity to `100Ah`, Chemistry to `LiFePO4`.
   - Verify that compatible 48V LiFePO4 batteries and inverters are ranked first with estimated runtime.
   - Adjust Voltage to `72V`; observe that 48V batteries are marked incompatible with clear engineering reasons.

2. **Budget Calculator**:
   - Set Budget to `₹25,000`.
   - Add a 12V 100Ah LiFePO4 battery (₹24,500).
   - With 18% GST (₹4,410), the total exceeds ₹25,000.
   - Observe that the system suggests the **SmartVolt 12V 150Ah Tall Tubular Lead-Acid Battery (₹13,500)** as a cheaper, compatible alternative.

3. **Product Comparison**:
   - Add up to 4 items from the Catalog using the Compare button.
   - Navigate to **Compare** to view the matrix highlighting Voltage, Wattage, Chemistry, Warranty, Price, and Stock.

4. **Cart, Checkout & Payment**:
   - Add products to Cart.
   - Apply coupon `VOLT10` (10% off) or `ENERGY500` (₹500 off).
   - Proceed to Checkout, enter WhatsApp phone number, and select fulfillment (Shipping or Shop Pickup).
   - Authorize payment via Instant UPI QR Code or Simulated Gateway.

5. **Invoice & WhatsApp Notification**:
   - On the Order Confirmation page, click **Download Official PDF Invoice**.
   - Click **Open & Send on WhatsApp** to verify pre-formatted message dispatch link.

6. **Admin Dashboard**:
   - Toggle **Admin Mode** in the top navigation bar.
   - Review sales trends, edit stock quantities, add new products, or download generated invoices.
