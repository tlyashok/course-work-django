# Generated by Django 5.0.6 on 2024-06-11 01:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='basket',
            name='count',
            field=models.IntegerField(default=0),
        ),
    ]
