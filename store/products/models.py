from django.db import models
from users.models import User


class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=255)
    category_image = models.ImageField(upload_to='category_images/')
    filters = models.JSONField()

    def __str__(self):
        return self.category_name

class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    product_name = models.CharField(max_length=255)
    category_id = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.FloatField()
    specifications = models.JSONField()
    product_image = models.ImageField(upload_to='product_images/')

    def __str__(self):
        return self.product_name

class Basket(models.Model):  # noqa: DJ008
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE)
    count = models.IntegerField(default=1)

    class Meta:
        unique_together = ('user_id', 'product_id')
