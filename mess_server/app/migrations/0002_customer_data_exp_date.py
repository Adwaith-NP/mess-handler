# Generated by Django 4.2.4 on 2024-10-24 17:46

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("app", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="customer_data",
            name="exp_date",
            field=models.DateField(default=datetime.date(2024, 10, 24)),
            preserve_default=False,
        ),
    ]
