from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Category, Product, Cart, CartItem, Order, OrderItem

class ECommerceAPITests(APITestCase):

    def setUp(self):
        # Create initial test data
        self.category = Category.objects.create(name="Electronics", slug="electronics")
        self.product = Product.objects.create(
            category=self.category,
            name="Smartphone",
            description="A high-end smartphone",
            price=699.99
        )
        self.register_url = '/api/register/'
        self.token_url = '/api/token/'
        self.products_url = '/api/products/'
        self.categories_url = '/api/categories/'
        self.cart_url = '/api/cart/'
        self.cart_add_url = '/api/cart/add/'
        self.cart_remove_url = '/api/cart/remove/'
        self.cart_update_url = '/api/cart/update/'
        self.cart_clear_url = '/api/cart/clear/'
        self.order_create_url = '/api/orders/create/'

    def test_get_products(self):
        response = self.client.get(self.products_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Smartphone")

    def test_get_product_detail(self):
        url = f"{self.products_url}{self.product.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Smartphone")

        invalid_url = f"{self.products_url}9999/"
        response = self.client.get(invalid_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_categories(self):
        response = self.client.get(self.categories_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Electronics")

    def test_user_registration(self):
        data = {
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "strongpassword123",
            "password2": "strongpassword123"
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['username'], "testuser")

        # Test password mismatch
        data['password2'] = "differentpassword"
        data['username'] = "testuser2"
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_guest_cart_operations(self):
        # 1. Fetch empty cart
        cart_id = "test_guest_cart_123"
        self.client.credentials()  # Ensure no auth credentials are set
        response = self.client.get(self.cart_url, HTTP_X_CART_ID=cart_id)
        # Without fixes, this will fail with 401 Unauthorized because of @permission_classes([IsAuthenticated])
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['items']), 0)

        # 2. Add product to cart
        data = {
            "product_id": self.product.id,
            "quantity": 2
        }
        response = self.client.post(self.cart_add_url, data, format='json', HTTP_X_CART_ID=cart_id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['items']), 1)
        self.assertEqual(response.data['items'][0]['quantity'], 2)

        # 3. Update product quantity
        data = {
            "product_id": self.product.id,
            "quantity": 5
        }
        response = self.client.post(self.cart_update_url, data, format='json', HTTP_X_CART_ID=cart_id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['items'][0]['quantity'], 5)

        # 4. Remove product from cart
        data = {
            "product_id": self.product.id
        }
        response = self.client.post(self.cart_remove_url, data, format='json', HTTP_X_CART_ID=cart_id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['items']), 0)

        # Add item back and clear cart
        data = {
            "product_id": self.product.id,
            "quantity": 1
        }
        self.client.post(self.cart_add_url, data, format='json', HTTP_X_CART_ID=cart_id)
        response = self.client.post(self.cart_clear_url, HTTP_X_CART_ID=cart_id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['items']), 0)

    def test_guest_checkout(self):
        cart_id = "test_guest_checkout_123"
        # Add product to cart first
        data = {
            "product_id": self.product.id,
            "quantity": 2
        }
        self.client.post(self.cart_add_url, data, format='json', HTTP_X_CART_ID=cart_id)

        # Attempt guest checkout
        checkout_data = {
            "name": "John Doe",
            "address": "123 Main St, New York, NY 10001",
            "phone": "1234567890",
            "payment_method": "COD"
        }
        response = self.client.post(self.order_create_url, checkout_data, format='json', HTTP_X_CART_ID=cart_id)
        # Without fixes, this will fail with 401, IntegrityError, or field errors
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('order_id', response.data)

        # Check that database order has correct values
        from decimal import Decimal
        order = Order.objects.get(id=response.data['order_id'])
        self.assertEqual(order.name, "John Doe")
        self.assertEqual(order.total_price, Decimal('1399.98'))
        self.assertEqual(order.items.count(), 1)
        self.assertEqual(order.items.first().price, Decimal('699.99'))
