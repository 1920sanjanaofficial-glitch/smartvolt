from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# User Schemas
class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    phone_number: str
    delivery_address: Optional[str] = None
    city: Optional[str] = None
    pincode: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

# Product & Specification Schemas
class ProductSpecificationSchema(BaseModel):
    nominal_voltage: float
    operating_voltage_min: Optional[float] = None
    operating_voltage_max: Optional[float] = None
    continuous_power_watts: float
    surge_power_watts: Optional[float] = None
    capacity_ah: Optional[float] = None
    battery_chemistry: Optional[str] = None
    connector_type: str
    efficiency_percent: Optional[float] = 90.0
    cycle_life: Optional[int] = None
    warranty_months: int = 24
    weight_kg: Optional[float] = None
    hsn_code: Optional[str] = "8507"
    class Config:
        from_attributes = True

class ProductSchema(BaseModel):
    id: int
    sku: str
    name: str
    category_id: int
    subcategory: Optional[str] = None
    description: str
    price: float
    mrp: float
    image_url: Optional[str] = None
    is_featured: bool
    is_active: bool
    specifications: Optional[ProductSpecificationSchema] = None
    stock_quantity: int = 0
    average_rating: float = 0.0
    review_count: int = 0
    class Config:
        from_attributes = True

class ProductCreate(BaseModel):
    sku: str
    name: str
    category_id: int
    subcategory: Optional[str] = None
    description: str
    price: float
    mrp: float
    image_url: Optional[str] = None
    stock_quantity: int = 10
    specifications: ProductSpecificationSchema

# Recommendation & Compatibility Query
class SmartRecommendationQuery(BaseModel):
    required_voltage: float = Field(..., description="Target system voltage in Volts (e.g. 12, 24, 48, 230)")
    required_power_watts: float = Field(..., description="Continuous load power in Watts")
    battery_capacity_ah: Optional[float] = Field(None, description="Required or target battery capacity in Ah")
    connector_type: Optional[str] = Field(None, description="Connector format (e.g. Anderson, M8, Terminal, MC4)")
    battery_chemistry: Optional[str] = Field(None, description="Preferred chemistry (LiFePO4, Li-ion, Lead-Acid)")
    application_usage: Optional[str] = Field(None, description="Intended application (Solar, Car, UPS, Lab, EV)")
    required_backup_hours: Optional[float] = Field(None, description="Required backup runtime in hours")
    budget: Optional[float] = Field(None, description="Maximum available budget in INR")

class CompatibilityCheckResult(BaseModel):
    is_compatible: bool
    voltage_compatible: bool
    power_compatible: bool
    chemistry_compatible: bool
    connector_compatible: bool
    backup_hours_estimated: float
    compatibility_score: float  # 0 to 100
    engineering_notes: List[str]
    product: ProductSchema
    suggested_alternatives: List[ProductSchema] = []

# Budget Calculation
class BudgetCalculationRequest(BaseModel):
    budget: float
    required_voltage: Optional[float] = None
    required_power_watts: Optional[float] = None
    selected_product_ids: List[int] = []

class BudgetCalculationResponse(BaseModel):
    budget: float
    subtotal: float
    gst_amount: float
    delivery_charge: float
    discount_amount: float
    total_amount: float
    remaining_budget: float
    is_within_budget: bool
    compatible_products_within_budget: List[ProductSchema]
    cheaper_compatible_alternatives: List[ProductSchema]

# Order & Billing Schemas
class OrderCreateRequest(BaseModel):
    user_id: int
    items: List[dict]  # product_id, quantity
    delivery_method: str = "shipping"  # shipping, shop_pickup
    delivery_address: str
    customer_phone: str
    coupon_code: Optional[str] = None
    payment_method: str = "upi"

class PaymentVerificationRequest(BaseModel):
    order_id: int
    payment_method: str
    transaction_id: str
    status: str = "successful"
