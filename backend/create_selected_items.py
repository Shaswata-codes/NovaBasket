import os
import django

# Load environment variables from .env (for DB connection)
from dotenv import load_dotenv
load_dotenv()

# Set Django settings module and initialize
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from store.models import Category, Product
from django.contrib.auth import get_user_model

def get_or_create_category(name, slug):
    cat, _ = Category.objects.get_or_create(name=name, slug=slug)
    return cat

def create_product(name, category, price, description, image_filename):
    """Create or update a product.
    image_filename must exist in backend/media/products/ (relative to MEDIA_ROOT)."""
    image_path = f'products/{image_filename}'
    prod, created = Product.objects.get_or_create(
        name=name,
        defaults={
            'category': category,
            'price': price,
            'description': description,
            'image': image_path,
        }
    )
    if not created:
        prod.category = category
        prod.price = price
        prod.description = description
        prod.image = image_path
        prod.save()
        print(f'🔄 Updated product: {name}')
    else:
        print(f'✅ Created product: {name}')

def main():
    # Categories
    bikes_cat = get_or_create_category('Bikes', 'bikes')
    books_cat = get_or_create_category('Books', 'books')
    phones_cat = get_or_create_category('Mobile Phones', 'mobile-phones')
    chairs_cat = get_or_create_category('Chairs', 'chairs')

    # Bikes (using the two uploaded images you provided)
    create_product(
        name='Mountain Bike X200',
        category=bikes_cat,
        price=499.99,
        description='A sturdy mountain bike with 21‑speed drivetrain and front suspension.',
        image_filename='media_1795281998354_abe06f74.jpg'
    )
    create_product(
        name='City Commuter Bike',
        category=bikes_cat,
        price=349.99,
        description='Lightweight commuter bike with integrated rack and fenders.',
        image_filename='media_1795281998354_0b75566e.jpg'
    )

    # Books
    create_product(
        name='The Great Gatsby',
        category=books_cat,
        price=12.99,
        description='Classic novel by F. Scott Fitzgerald.',
        image_filename='great_gatsby.jpg'
    )
    create_product(
        name='Clean Code',
        category=books_cat,
        price=29.99,
        description='A Handbook of Agile Software Craftsmanship by Robert C. Martin.',
        image_filename='clean_code.jpg'
    )

    # Mobile Phones
    create_product(
        name='Google Pixel 8',
        category=phones_cat,
        price=699.99,
        description='128 GB Obsidian phone with AI‑enhanced camera.',
        image_filename='google_pixel_8.jpg'
    )
    create_product(
        name='iPhone 15 Pro',
        category=phones_cat,
        price=999.99,
        description='Apple’s flagship with A17 Pro chip and ProMotion display.',
        image_filename='iphone_15_pro.jpg'
    )

    # Chairs
    create_product(
        name='Ergonomic Office Chair',
        category=chairs_cat,
        price=149.99,
        description='Adjustable lumbar support, breathable mesh back.',
        image_filename='ergonomic_chair.jpg'
    )
    create_product(
        name='Cris‑Wooden Jali Chair',
        category=chairs_cat,
        price=199.99,
        description='Artisan wooden chair with intricate Jali pattern.',
        image_filename='Cris-wooden-Jali-chair-1.jpg'
    )

    # Create a test admin user if it doesn't exist
    User = get_user_model()
    admin_user, created = User.objects.get_or_create(
        username='admin', defaults={'email': 'admin@example.com'}
    )
    if created:
        admin_user.set_password('adminpass123')
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.save()
        print('✅ Admin test user created (admin / adminpass123)')
    else:
        print('ℹ️ Admin user already exists')

if __name__ == '__main__':
    main()
