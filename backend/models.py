import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey, Enum
)
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    phone_number = Column(String(20), nullable=False, index=True)
    delivery_address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    pincode = Column(String(20), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    orders = relationship("Order", back_populates="user")
    reviews = relationship("ProductReview", back_populates="user")
    cart = relationship("Cart", back_populates="user", uselist=False)

class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="super_admin")  # super_admin, inventory_manager
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    parent_id = Column(Integer, ForeignKey("categories.id"), nullable=True)

    products = relationship("Product", back_populates="category")
    subcategories = relationship("Category", backref="parent", remote_side=[id])

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    subcategory = Column(String(100), nullable=True)
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False)  # in INR
    mrp = Column(Float, nullable=False)
    image_url = Column(String(500), nullable=True)
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    category = relationship("Category", back_populates="products")
    specifications = relationship("ProductSpecification", back_populates="product", uselist=False)
    inventory = relationship("Inventory", back_populates="product", uselist=False)
    reviews = relationship("ProductReview", back_populates="product")

class ProductSpecification(Base):
    __tablename__ = "product_specifications"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), unique=True, nullable=False)
    
    # Electrical technical attributes
    nominal_voltage = Column(Float, nullable=False)  # e.g. 12.0, 24.0, 48.0, 230.0 V
    operating_voltage_min = Column(Float, nullable=True)
    operating_voltage_max = Column(Float, nullable=True)
    continuous_power_watts = Column(Float, nullable=False)  # continuous rating in W
    surge_power_watts = Column(Float, nullable=True)
    capacity_ah = Column(Float, nullable=True)  # in Ampere-hours (for batteries)
    battery_chemistry = Column(String(100), nullable=True)  # LiFePO4, Li-ion, Lead-Acid, Tubular, NiMH, VRLA
    connector_type = Column(String(100), nullable=False)  # Anderson SB50, M8 Bolt, Terminal Posts, XT60, MC4, Screw Terminal
    efficiency_percent = Column(Float, default=90.0)
    cycle_life = Column(Integer, nullable=True)  # e.g. 4000 cycles
    warranty_months = Column(Integer, default=24)
    weight_kg = Column(Float, nullable=True)
    hsn_code = Column(String(20), default="8507")  # 8507: Electric accumulators

    product = relationship("Product", back_populates="specifications")

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), unique=True, nullable=False)
    stock_quantity = Column(Integer, default=0, nullable=False)
    reserved_quantity = Column(Integer, default=0, nullable=False)
    low_stock_threshold = Column(Integer, default=5, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    product = relationship("Product", back_populates="inventory")

class Cart(Base):
    __tablename__ = "carts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="cart")
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")

class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey("carts.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, default=1, nullable=False)

    cart = relationship("Cart", back_populates="items")
    product = relationship("Product")

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    discount_type = Column(String(20), default="percentage")  # percentage or fixed
    discount_value = Column(Float, nullable=False)  # 10.0 for 10% or 500.0 for ₹500
    min_order_amount = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    valid_until = Column(DateTime, nullable=True)

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True, nullable=False)  # e.g. SV-1042
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    subtotal = Column(Float, nullable=False)
    gst_amount = Column(Float, nullable=False)  # 18% standard GST
    delivery_charge = Column(Float, default=0.0)
    discount_amount = Column(Float, default=0.0)
    coupon_applied = Column(String(50), nullable=True)
    total_amount = Column(Float, nullable=False)

    delivery_method = Column(String(50), default="shipping")  # shipping or shop_pickup
    delivery_address = Column(Text, nullable=False)
    customer_phone = Column(String(20), nullable=False)
    order_status = Column(String(50), default="confirmed")  # confirmed, processing, shipped, delivered, cancelled
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payment = relationship("Payment", back_populates="order", uselist=False)
    invoice = relationship("Invoice", back_populates="order", uselist=False)

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    product_name = Column(String(200), nullable=False)
    sku = Column(String(50), nullable=False)
    unit_price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    voltage_str = Column(String(50), nullable=True)
    wattage_str = Column(String(50), nullable=True)
    warranty_months = Column(Integer, default=24)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), unique=True, nullable=False)
    payment_method = Column(String(50), nullable=False)  # upi, qr_code, card_netbanking, cash_pickup
    transaction_id = Column(String(100), unique=True, nullable=True)
    amount = Column(Float, nullable=False)
    payment_status = Column(String(50), default="pending")  # pending, successful, failed, refunded
    gateway_response = Column(Text, nullable=True)
    paid_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    order = relationship("Order", back_populates="payment")

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(50), unique=True, index=True, nullable=False)  # e.g. INV-2026-1042
    order_id = Column(Integer, ForeignKey("orders.id"), unique=True, nullable=False)
    invoice_date = Column(DateTime, default=datetime.datetime.utcnow)
    pdf_file_path = Column(String(500), nullable=True)
    subtotal = Column(Float, nullable=False)
    cgst_amount = Column(Float, nullable=False)  # 9%
    sgst_amount = Column(Float, nullable=False)  # 9%
    total_tax = Column(Float, nullable=False)
    delivery_charge = Column(Float, default=0.0)
    discount_amount = Column(Float, default=0.0)
    final_amount = Column(Float, nullable=False)
    is_downloaded = Column(Boolean, default=False)

    order = relationship("Order", back_populates="invoice")

class ProductReview(Base):
    __tablename__ = "product_reviews"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1 to 5
    title = Column(String(150), nullable=True)
    comment = Column(Text, nullable=False)
    is_verified_purchase = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    product = relationship("Product", back_populates="reviews")
    user = relationship("User", back_populates="reviews")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True)
    channel = Column(String(50), nullable=False)  # whatsapp, sms
    recipient = Column(String(50), nullable=False)
    message_content = Column(Text, nullable=False)
    delivery_status = Column(String(50), default="sent")  # sent, delivered, failed, link_generated
    provider_message_id = Column(String(100), nullable=True)
    sent_at = Column(DateTime, default=datetime.datetime.utcnow)
