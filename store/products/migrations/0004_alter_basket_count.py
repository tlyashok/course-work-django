# Generated by Django 4.2.10 on 2024-06-11 05:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0003_basket_count'),
    ]

    operations = [
        migrations.AlterField(
            model_name='basket',
            name='count',
            field=models.IntegerField(default=1),
        ),
    ]