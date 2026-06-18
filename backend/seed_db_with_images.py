import os
import sys
import getpass

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

def main():
    print("====================================================")
    print("      NovaBasket Supabase Image Seeding Tool        ")
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
    
    print("\nConnecting to Supabase...")
    try:
        import django
        django.setup()
        
        from store.models import Category, Product
        
        print("Clearing old products and categories to reset with correct image paths...")
        Product.objects.all().delete()
        Category.objects.all().delete()
        
        # 1. Define Categories
        categories_data = [
            {"name": "Phones", "slug": "phones"},
            {"name": "Books", "slug": "books"},
            {"name": "Sports", "slug": "sports"},
            {"name": "Furniture", "slug": "furniture"},
            {"name": "Food & Groceries", "slug": "food-groceries"}
        ]
        
        categories = {}
        for cat_info in categories_data:
            cat = Category.objects.create(name=cat_info["name"], slug=cat_info["slug"])
            categories[cat_info["slug"]] = cat
            print(f"Created category: {cat.name}")
            
        # 2. Define Products with Images
        products_data = [
            # Phones
            {
                "category": categories["phones"],
                "name": "Google Pixel 8",
                "price": 699.99,
                "description": "128GB Obsidian phone with high-quality AI-enhanced camera and clean Android interface.",
                "image": "products/google_pixel_8.jpg"
            },
            {
                "category": categories["phones"],
                "name": "iPhone 15 Pro",
                "price": 999.99,
                "description": "128GB Titanium smartphone with powerful A17 Pro chip and advanced camera system.",
                "image": "products/iphone_15_pro.jpg"
            },
            {
                "category": categories["phones"],
                "name": "Samsung Galaxy S24",
                "price": 799.99,
                "description": "Latest Samsung flagship with high resolution display, AI features, and premium camera.",
                "image": "products/samsung_s24.jpg"
            },
            {
                "category": categories["phones"],
                "name": "OnePlus 12",
                "price": 799.99,
                "description": "Fast charging premium phone with custom Hasselblad camera tuning and great performance.",
                "image": "products/oneplus_12.jpg"
            },
            {
                "category": categories["phones"],
                "name": "Redmi Note 13",
                "price": 299.99,
                "description": "Budget-friendly smartphone with exceptional battery life and high megapixel camera.",
                "image": "products/redmi_note_13.jpg"
            },
            
            # Books
            {
                "category": categories["books"],
                "name": "Atomic Habits",
                "price": 15.99,
                "description": "An Easy & Proven Way to Build Good Habits & Break Bad Ones by James Clear.",
                "image": "products/atomic_habits.jpg"
            },
            {
                "category": categories["books"],
                "name": "Clean Code",
                "price": 39.99,
                "description": "A Handbook of Agile Software Craftsmanship by Robert C. Martin.",
                "image": "products/clean_code.jpg"
            },
            {
                "category": categories["books"],
                "name": "Introduction to Algorithms",
                "price": 89.99,
                "description": "Comprehensive reference and textbook on algorithm design and analysis.",
                "image": "products/intro_algorithms.jpg"
            },
            {
                "category": categories["books"],
                "name": "The Great Gatsby",
                "price": 9.99,
                "description": "F. Scott Fitzgerald's classic American novel.",
                "image": "products/great_gatsby.jpg"
            },
            {
                "category": categories["books"],
                "name": "To Kill a Mockingbird",
                "price": 11.99,
                "description": "Harper Lee's Pulitzer Prize-winning classic novel.",
                "image": "products/to_kill_a_mockingbird.jpg"
            },
            
            # Sports
            {
                "category": categories["sports"],
                "name": "English Willow Cricket Bat",
                "price": 149.99,
                "description": "Handcrafted English willow bat for professional and recreational play.",
                "image": "products/cricket_bat.jpg"
            },
            {
                "category": categories["sports"],
                "name": "Professional Soccer Ball",
                "price": 29.99,
                "description": "Standard size 5 soccer ball with excellent air retention and durability.",
                "image": "products/soccer_ball.png"
            },
            {
                "category": categories["sports"],
                "name": "Pro Tennis Racket",
                "price": 119.99,
                "description": "Lightweight carbon fiber tennis racket for optimal power and control.",
                "image": "products/tennis_racket.jpg"
            },
            {
                "category": categories["sports"],
                "name": "Premium Yoga Mat",
                "price": 24.99,
                "description": "Non-slip eco-friendly yoga mat with extra cushioning for maximum comfort.",
                "image": "products/yoga_mat.jpg"
            },
            {
                "category": categories["sports"],
                "name": "Indoor/Outdoor Basketball",
                "price": 34.99,
                "description": "High-grip composite leather basketball for all court conditions.",
                "image": "products/basketball.jpg"
            },
            
            # Furniture
            {
                "category": categories["furniture"],
                "name": "Ergonomic Office Chair",
                "price": 189.99,
                "description": "Adjustable lumbar support, mesh backrest, and 3D armrests for ultimate workplace comfort.",
                "image": "products/ergonomic_chair.jpg"
            },
            {
                "category": categories["furniture"],
                "name": "Height Adjustable Standing Desk",
                "price": 299.99,
                "description": "Electric height-adjustable desk with dual motors and programmable memory presets.",
                "image": "products/standing_desk.jpg"
            },
            {
                "category": categories["furniture"],
                "name": "Modern Wooden Coffee Table",
                "price": 89.99,
                "description": "Sleek living room table made of solid walnut wood.",
                "image": "products/coffee_table.jpg"
            },
            {
                "category": categories["furniture"],
                "name": "Convertible Sofa Bed",
                "price": 399.99,
                "description": "Comfortable three-seater couch that easily converts to a guest bed.",
                "image": "products/sofa_bed.jpg"
            },
            {
                "category": categories["furniture"],
                "name": "Cris Wooden Jali Chair",
                "price": 79.99,
                "description": "Classic handcrafted wooden chair with intricate back panel design.",
                "image": "products/Cris-wooden-Jali-chair-1.jpg"
            },
            
            # Food & Groceries
            {
                "category": categories["food-groceries"],
                "name": "California Raw Almonds",
                "price": 14.99,
                "description": "1kg bag of premium quality raw unsalted California almonds.",
                "image": "products/california_almonds.png"
            },
            {
                "category": categories["food-groceries"],
                "name": "Extra Virgin Olive Oil",
                "price": 18.99,
                "description": "Cold-pressed extra virgin olive oil from Spain.",
                "image": "products/olive_oil.jpg"
            },
            {
                "category": categories["food-groceries"],
                "name": "Premium 85% Dark Chocolate",
                "price": 4.99,
                "description": "Rich, gourmet dark chocolate bar crafted from single-origin cacao.",
                "image": "products/dark_chocolate.jpg"
            },
            {
                "category": categories["food-groceries"],
                "name": "Organic Green Tea Bags",
                "price": 6.99,
                "description": "Box of 50 organic green tea bags filled with natural antioxidants.",
                "image": "products/green_tea_bags.jpg"
            },
            {
                "category": categories["food-groceries"],
                "name": "Raw Wildflower Honey",
                "price": 9.99,
                "description": "Pure raw wildflower honey sourced from local apiaries.",
                "image": "products/wildflower_honey.jpg"
            }
        ]
        
        for prod_info in products_data:
            prod = Product.objects.create(
                category=prod_info["category"],
                name=prod_info["name"],
                price=prod_info["price"],
                description=prod_info["description"],
                image=prod_info["image"]
            )
            print(f"Created product: {prod.name} with image {prod.image}")
                
        print("\n✅ Database seeded successfully with correct product image paths on Supabase!")
    except Exception as e:
        print(f"\n❌ Error seeding database: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
