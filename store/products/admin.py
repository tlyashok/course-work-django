from django.contrib import admin

from .models import Basket, Category, Product

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Basket)
