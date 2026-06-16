from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .serializers import UserSerializer, UserRegistrationSerializer
from rest_framework import status
from .models import Category, Product, Cart, CartItem, Order, OrderItem
from .serializers import CategorySerializer, ProductSerializer, CartSerializer, CartItemSerializer


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
        cart, created = Cart.objects.get_or_create(user=request.user)
        return cart
    
    cart_id = request.headers.get('X-Cart-ID')
    if not cart_id:
        cart_id = request.query_params.get('cart_id') or request.data.get('cart_id')
    
    if cart_id:
        cart, created = Cart.objects.get_or_create(cart_id=cart_id)
    else:
        import uuid
        cart = Cart.objects.create(cart_id=str(uuid.uuid4()))
    return cart

@api_view(['GET'])
@permission_classes([AllowAny])
def get_cart(request):
    cart = get_or_create_cart(request)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['POST'])
def clear_cart(request):
    cart = get_or_create_cart(request)

    cart.items.all().delete()

    serializer = CartSerializer(cart)
    return Response(serializer.data)

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
    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product, defaults={'quantity': 0})
    cart_item.quantity += quantity
    cart_item.save()
    
    serializer = CartSerializer(cart)
    return Response(serializer.data)

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
    
    serializer = CartSerializer(cart)
    return Response(serializer.data)

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
            
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_order(request):
    try:
        data = request.data
        name = data.get('name')
        address = data.get('address')
        phone = data.get('phone')
        payment_method = data.get('payment_method','COD')
        if not phone.isdigit() or len(phone) != 10:
            return Response({"error": "Invalid phone number"}, status=400)
        cart = get_or_create_cart(request)
        if(not cart.items.exists()):
            return Response({"error": "Cart is empty"}, status=400)
        total = sum(item.product.price * item.quantity for item in cart.items.all())
        user = request.user if request.user and request.user.is_authenticated else None
        order = Order.objects.create(user=user, name=name, address=address, phone=phone, total_price=total, payment_method=payment_method)
        for item in cart.items.all():
            OrderItem.objects.create(order=order, product=item.product, quantity=item.quantity, price=item.product.price)
        cart.items.all().delete()
        return Response({"message": "Order created successfully", "order_id": order.id}, status=201)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)