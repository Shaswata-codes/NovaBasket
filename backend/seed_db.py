import os
import sys
import getpass

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

def main():
    print("====================================================")
    print("      NovaBasket Supabase DB Seeding Tool           ")
    print("====================================================")
    
    password = getpass.getpass("Enter your Supabase Database Password: ")
    if not password:
        print("Password cannot be empty!")
        sys.exit(1)
        
    # Override database configuration environment variables
    os.environ['DB_NAME'] = 'postgres'
    os.environ['DB_USER'] = 'postgres.jerkrgdlvpequzqcogxe'
    os.environ['DB_HOST'] = 'aws-1-ap-northeast-1.pooler.supabase.com'
    os.environ['DB_PORT'] = '6543'
    os.environ['DB_PASSWORD'] = password
    
    print("\nConnecting to Supabase and seeding database...")
    try:
        import django
        django.setup()
        
        from store.models import Category, Product
        
        # 1. Create Categories
        categories_data = [
            {"name": "Electronics", "slug": "electronics"},
            {"name": "Apparel", "slug": "apparel"},
            {"name": "Home & Living", "slug": "home-living"}
        ]
        
        categories = {}
        for cat_info in categories_data:
            cat, created = Category.objects.get_or_create(
                slug=cat_info["slug"],
                defaults={"name": cat_info["name"]}
            )
            categories[cat_info["slug"]] = cat
            if created:
                print(f"Created category: {cat.name}")
            else:
                print(f"Category already exists: {cat.name}")
                
        # 2. Create Products
        products_data = [
            {
                "category": categories["electronics"],
                "name": "Premium Wireless Headphones",
                "price": 199.99,
                "description": "High-fidelity sound, active noise cancellation, and a comfortable 40-hour battery life."
            },
            {
                "category": categories["electronics"],
                "name": "Minimalist Mechanical Keyboard",
                "price": 129.99,
                "description": "Compact 75% layout featuring silent linear switches, dye-sub PBT keycaps, and RGB backlighting."
            },
            {
                "category": categories["electronics"],
                "name": "Ultra-Wide Gaming Monitor",
                "price": 349.99,
                "description": "34-inch curved gaming display with 144Hz refresh rate, 1ms response time, and HDR support."
            },
            {
                "category": categories["apparel"],
                "name": "Classic Canvas Backpack",
                "price": 59.99,
                "description": "Spacious, water-resistant canvas backpack with dedicated laptop protection and quick-access pockets."
            },
            {
                "category": categories["apparel"],
                "name": "Organic Cotton Tee",
                "price": 24.99,
                "description": "Indescribably soft crewneck tee crafted from 100% certified organic cotton."
            },
            {
                "category": categories["home-living"],
                "name": "Sleek Desk Organizer",
                "price": 39.99,
                "description": "Premium anodized aluminum tray to keep your writing instruments, notes, and smartphone neat."
            },
            {
                "category": categories["home-living"],
                "name": "Ceramic Coffee Dripper",
                "price": 29.99,
                "description": "Artisan-crafted ceramic pour-over cone designed for clean, full-bodied morning brews."
            }
        ]
        
        for prod_info in products_data:
            prod, created = Product.objects.get_or_create(
                name=prod_info["name"],
                defaults={
                    "category": prod_info["category"],
                    "price": prod_info["price"],
                    "description": prod_info["description"]
                }
            )
            if created:
                print(f"Created product: {prod.name}")
            else:
                print(f"Product already exists: {prod.name}")
                
        print("\n✅ Database seeded successfully on Supabase!")
    except Exception as e:
        print(f"\n❌ Error seeding database: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
