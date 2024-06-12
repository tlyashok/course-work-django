# products/urls.py
from django.urls import path

from .views import (
    add_to_basket,
    basket_products,
    category_list,
    category_products,
    get_basket,
    remove_from_basket,
)

urlpatterns = [
    path('categories/', category_list, name='category_list'),
    path('category/<int:category_id>/', category_products, name='category_products'),
    path('basket/', basket_products, name='basket'),
    path('product/add/<int:product_id>/', add_to_basket, name='add_product'),
    path('product/delete/<int:product_id>/', remove_from_basket, name='delete_product'),
    path('get_basket/', get_basket, name='get_basket'),
]
