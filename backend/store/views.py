from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from .serializers import UserSerializer, UserRegistrationSerializer
from rest_framework import status
from .models import Category, Product, Cart, CartItem, Order, OrderItem
from .serializers import CategorySerializer, ProductSerializer, CartSerializer, CartItemSerializer
from django.conf import settings
from django.core.mail import send_mail
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_product(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)
    serializer = ProductSerializer(product)
    return Response(serializer.data)

@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

def get_or_create_cart(request):
    if request.user and request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return cart
    # Use Django session for anonymous carts
    if not request.session.session_key:
        request.session.create()
    cart_id = request.session.session_key
    cart, _ = Cart.objects.get_or_create(cart_id=cart_id)
    return cart

@api_view(['GET'])
@permission_classes([AllowAny])
def get_cart(request):
    cart = get_or_create_cart(request)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Log the registration event
        reg_logger = logging.getLogger('nova.registration')
        reg_logger.info(f"User registered: {user.username} (email={user.email}) at {datetime.utcnow().isoformat()}Z")
        # Send welcome email
        try:
            subject = 'Welcome to NovaBasket – Your Account Has Been Created!'
            message = (
                f"Dear {user.username},\n\n"
                "Welcome to NovaBasket!\n\n"
                "Thank you for creating an account with us. We're excited to have you as part of our community.\n\n"
                "Your account has been successfully registered, and you can now explore our collection, save your favorite products, and enjoy a seamless shopping experience.\n\n"
                "If you did not create this account, please contact our support team immediately.\n\n"
                "Thank you for choosing NovaBasket. We look forward to serving you!\n\n"
                "Best regards,\n"
                "The NovaBasket Team\n"
                "Email: support@novabasket.com\n"
                "Website: https://xyz.com\n"
                f"\n--- Registration logged at {datetime.utcnow().isoformat()}Z ---\n"
            )
            from_email = settings.DEFAULT_FROM_EMAIL
            send_mail(subject, message, from_email, [user.email], fail_silently=False)
            reg_logger.info(f"Welcome email sent to {user.email} for user {user.username} at {datetime.utcnow().isoformat()}Z")
        except Exception as e:
            reg_logger.error(f"Failed to send signup email to {user.email}: {e}")
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def add_to_cart(request):
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)
    cart = get_or_create_cart(request)
    cart_item, _ = CartItem.objects.get_or_create(cart=cart, product=product)
    cart_item.quantity += quantity
    cart_item.save()
    return Response(CartSerializer(cart).data)

@api_view(['POST'])
@permission_classes([AllowAny])
def clear_cart(request):
    cart = get_or_create_cart(request)
    cart.items.all().delete()
    return Response(CartSerializer(cart).data)

@api_view(['POST'])
@permission_classes([AllowAny])
def remove_from_cart(request):
    product_id = request.data.get('product_id')
    cart = get_or_create_cart(request)
    try:
        cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
        cart_item.delete()
    except CartItem.DoesNotExist:
        pass
    return Response(CartSerializer(cart).data)

@api_view(['POST'])
@permission_classes([AllowAny])
def update_cart_quantity(request):
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)
    cart = get_or_create_cart(request)
    if quantity <= 0:
        CartItem.objects.filter(cart=cart, product=product).delete()
    else:
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product, defaults={'quantity': quantity})
        if not created:
            cart_item.quantity = quantity
            cart_item.save()
    return Response(CartSerializer(cart).data)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_order(request):
    try:
        data = request.data
        name = data.get('name')
        address = data.get('address')
        phone = data.get('phone')
        payment_method = data.get('payment_method', 'COD')
        if not phone.isdigit() or len(phone) != 10:
            return Response({"error": "Invalid phone number"}, status=400)
        cart = get_or_create_cart(request)
        if not cart.items.exists():
            return Response({"error": "Cart is empty"}, status=400)
        total = sum(item.product.price * item.quantity for item in cart.items.all())
        user = request.user if request.user.is_authenticated else None
        order = Order.objects.create(user=user, name=name, address=address, phone=phone, total_price=total, payment_method=payment_method)
        for item in cart.items.all():
            OrderItem.objects.create(order=order, product=item.product, quantity=item.quantity, price=item.product.price)
        cart.items.all().delete()
        return Response({"message": "Order created successfully", "order_id": order.id}, status=201)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)
