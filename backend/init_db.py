"""
Database seed script for SmartVolt
Populates standard categories, products, electrical specifications, and inventory.
"""
from backend.database import SessionLocal, engine, Base
from backend.models import Category, Product, ProductSpecification, Inventory, User, AdminUser, Coupon

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(Category).first():
        print("Database already seeded.")
        db.close()
        return

    print("Seeding SmartVolt categories and products...")

    # 1. Categories
    cat_battery = Category(name="Batteries", slug="batteries", description="Lithium-ion, LiFePO4, Lead-Acid and Solar storage batteries")
    cat_power = Category(name="Power Equipment", slug="power-equipment", description="Power supplies, stabilizers, inverters and UPS systems")
    cat_solar = Category(name="Solar Products", slug="solar-products", description="Solar panels, MPPT controllers and hybrid solar systems")
    cat_acc = Category(name="Electrical Accessories", slug="electrical-accessories", description="Smart chargers, Anderson connectors, cables and switches")
    cat_other = Category(name="Other Electrical Equipment", slug="other-equipment", description="BLDC motors, motor controllers and battery sensors")

    db.add_all([cat_battery, cat_power, cat_solar, cat_acc, cat_other])
    db.commit()

    # 2. Admin & Demo User
    admin = AdminUser(
        username="admin",
        email="admin@smartvolt.com",
        hashed_password="hash_admin123",
        role="super_admin"
    )
    user = User(
        full_name="Rajesh Sharma",
        email="rajesh@example.com",
        hashed_password="hash_password123",
        phone_number="+91 98201 54321",
        delivery_address="Flat 402, Green Meadows, Andheri East",
        city="Mumbai",
        pincode="400069"
    )
    coupon = Coupon(code="VOLT10", discount_type="percentage", discount_value=10.0, min_order_amount=1000.0)
    db.add_all([admin, user, coupon])
    db.commit()

    print("Seeding completed successfully.")
    db.close()

if __name__ == "__main__":
    seed_database()
