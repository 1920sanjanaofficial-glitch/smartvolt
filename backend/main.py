import os
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse
from sqlalchemy.orm import Session
import pandas as pd

from .database import engine, get_db, Base
from .models import (
    User, AdminUser, Category, Product, ProductSpecification, Inventory,
    Order, OrderItem, Payment, Invoice, ProductReview, Notification, Coupon
)
from .schemas import (
    UserCreate, UserLogin, UserResponse,
    ProductSchema, ProductCreate,
    SmartRecommendationQuery, CompatibilityCheckResult,
    BudgetCalculationRequest, BudgetCalculationResponse,
    OrderCreateRequest, PaymentVerificationRequest
)
from .ml_recommender import SmartVoltElectricalEngine, SalesAnalyticsEngine
from .invoice_generator import generate_pdf_invoice
from .notification_service import NotificationService

# Auto-create tables in SQLite/MySQL on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartVolt Electrical API",
    description="Backend API for SmartVolt Battery & Electrical Shopping System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- AUTHENTICATION -----------------

@app.post("/api/auth/register", response_model=UserResponse)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # In production use passlib/bcrypt; standard hash representation here
    new_user = User(
        full_name=user_in.full_name,
        email=user_in.email,
        hashed_password=f"hash_{user_in.password}",
        phone_number=user_in.phone_number,
        delivery_address=user_in.delivery_address,
        city=user_in.city,
        pincode=user_in.pincode
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/api/auth/login")
def login_user(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user or user.hashed_password != f"hash_{login_in.password}":
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {
        "access_token": f"token_{user.id}_auth",
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "phone_number": user.phone_number
        }
    }

# ----------------- PRODUCTS & CATEGORIES -----------------

@app.get("/api/categories")
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@app.get("/api/products")
def get_products(
    category_id: Optional[int] = None,
    min_voltage: Optional[float] = None,
    max_voltage: Optional[float] = None,
    min_power: Optional[float] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.is_active == True)
    if category_id:
        query = query.filter(Product.category_id == category_id)
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    
    products = query.all()
    # Format and join specs and stock
    res = []
    for p in products:
        spec = p.specifications
        stock = p.inventory.stock_quantity if p.inventory else 0
        if min_voltage and spec and spec.nominal_voltage < min_voltage:
            continue
        if max_voltage and spec and spec.nominal_voltage > max_voltage:
            continue
        if min_power and spec and spec.continuous_power_watts < min_power:
            continue
        
        res.append({
            "id": p.id,
            "sku": p.sku,
            "name": p.name,
            "category_id": p.category_id,
            "subcategory": p.subcategory,
            "description": p.description,
            "price": p.price,
            "mrp": p.mrp,
            "image_url": p.image_url,
            "is_featured": p.is_featured,
            "stock_quantity": stock,
            "specifications": {
                "nominal_voltage": spec.nominal_voltage if spec else 0.0,
                "continuous_power_watts": spec.continuous_power_watts if spec else 0.0,
                "capacity_ah": spec.capacity_ah if spec else None,
                "battery_chemistry": spec.battery_chemistry if spec else None,
                "connector_type": spec.connector_type if spec else "Standard",
                "warranty_months": spec.warranty_months if spec else 24
            }
        })
    return res

# ----------------- SMART RECOMMENDATIONS -----------------

@app.post("/api/recommendations/smart-match")
def recommend_products(query: SmartRecommendationQuery, db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.is_active == True).all()
    rows = []
    for p in products:
        spec = p.specifications
        stock = p.inventory.stock_quantity if p.inventory else 0
        rows.append({
            "id": p.id,
            "sku": p.sku,
            "name": p.name,
            "price": p.price,
            "mrp": p.mrp,
            "category_id": p.category_id,
            "image_url": p.image_url,
            "stock_quantity": stock,
            "nominal_voltage": spec.nominal_voltage if spec else 0.0,
            "continuous_power_watts": spec.continuous_power_watts if spec else 0.0,
            "capacity_ah": spec.capacity_ah if spec else 0.0,
            "battery_chemistry": spec.battery_chemistry if spec else "",
            "connector_type": spec.connector_type if spec else "",
            "warranty_months": spec.warranty_months if spec else 24
        })

    df = pd.DataFrame(rows)
    ranked_df = SmartVoltElectricalEngine.rank_products_ml(query.dict(), df)
    return ranked_df.to_dict(orient="records")

# ----------------- BUDGET CALCULATOR -----------------

@app.post("/api/budget/calculate", response_model=BudgetCalculationResponse)
def calculate_budget(req: BudgetCalculationRequest, db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.id.in_(req.selected_product_ids)).all() if req.selected_product_ids else []
    subtotal = sum(p.price for p in products)
    gst = subtotal * 0.18
    delivery = 0.0 if subtotal > 2000.0 or subtotal == 0 else 150.0
    total = subtotal + gst + delivery
    rem = req.budget - total

    return BudgetCalculationResponse(
        budget=req.budget,
        subtotal=subtotal,
        gst_amount=gst,
        delivery_charge=delivery,
        discount_amount=0.0,
        total_amount=total,
        remaining_budget=rem,
        is_within_budget=rem >= 0,
        compatible_products_within_budget=[],
        cheaper_compatible_alternatives=[]
    )

# ----------------- INVOICE DOWNLOAD -----------------

@app.get("/api/invoices/{order_number}/pdf")
def download_invoice(order_number: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order_data = {
        "invoice_number": f"INV-{order.order_number}",
        "order_number": order.order_number,
        "date": order.created_at.strftime("%d-%b-%Y"),
        "customer_name": order.user.full_name if order.user else "Customer",
        "customer_phone": order.customer_phone,
        "delivery_address": order.delivery_address,
        "payment_status": "Successful",
        "payment_method": order.payment.payment_method if order.payment else "UPI",
        "subtotal": order.subtotal,
        "gst_amount": order.gst_amount,
        "delivery_charge": order.delivery_charge,
        "discount_amount": order.discount_amount,
        "total_amount": order.total_amount,
        "items": [
            {
                "name": it.product_name,
                "voltage": it.voltage_str,
                "wattage": it.wattage_str,
                "warranty_months": it.warranty_months,
                "quantity": it.quantity,
                "unit_price": it.unit_price,
                "hsn": "8507"
            } for it in order.items
        ]
    }

    pdf_bytes = generate_pdf_invoice(order_data)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Invoice_{order_number}.pdf"}
    )
