# Generated by Django 4.2.1 on 2024-10-25 17:01

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("app", "0003_customer_data_duemoney_customer_data_givenmoney"),
    ]

    operations = [
        migrations.RenameField(
            model_name="customer_data",
            old_name="dueMoney",
            new_name="totalMoney",
        ),
    ]
