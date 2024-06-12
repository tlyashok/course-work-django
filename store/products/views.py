import json

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render

from .models import Basket, Category, Product


def category_list(request):
    categories = Category.objects.all()
    return render(request, 'categories.html', {'categories': categories})


def category_products(request, category_id):
    category = Category.objects.get(pk=category_id)
    products = Product.objects.filter(category_id=category)

    products_list = []
    for product in products:
        products_list.append({  # noqa: PERF401
            'product_id': product.product_id,
            'product_name': product.product_name,
            'price': product.price,
            'product_image': product.product_image.url,
            'specifications': product.specifications,
        })

    filters_json = json.dumps(category.filters, ensure_ascii=False)
    products_json = json.dumps(products_list,  ensure_ascii=False)

    return render(request, 'category_products.html', {
        'category': category,
        'products': products_json,
        'filters': filters_json,
    })


@login_required
def basket_products(request):
    user_id = request.user.user_id
    basket_items = Basket.objects.filter(user_id=user_id)
    products = []
    for item in basket_items:
        products.append({  # noqa: PERF401
            'product': Product.objects.get(product_id=item.product_id_id),
            'count': item.count,
            'total_price': Product.objects.get(product_id=item.product_id_id).price * item.count,  # noqa: E501
        })
    return render(request, 'basket.html', {'products': products})


@login_required
def add_to_basket(request, product_id):
    user = request.user
    product = get_object_or_404(Product, product_id=product_id)
    basket_item, created = Basket.objects.get_or_create(user_id=user, product_id=product)

    if not created:
        basket_item.count += 1
        basket_item.save()
    return JsonResponse({'status': 'success', 'count': basket_item.count})


@login_required
def remove_from_basket(request, product_id):
    user_id = request.user.user_id
    basket_item = get_object_or_404(Basket, user_id=user_id, product_id=product_id)
    if basket_item.count > 1:
        basket_item.count -= 1
        basket_item.save()
    else:
        basket_item.delete()
    return JsonResponse({'status': 'success',
                         'count': basket_item.count if basket_item.count > 0 else 0})


@login_required
def get_basket(request):
    user_id = request.user.user_id
    basket_items = Basket.objects.filter(user_id=user_id)
    products_in_basket = [
        {
            'product_id': item.product_id.product_id,
            'name': item.product_id.product_name,
            'price': item.product_id.price,
        }
        for item in basket_items
    ]
    return JsonResponse({'products_in_basket': products_in_basket})
