# Generated by Django 5.1.2 on 2024-10-22 10:48

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="customer_data",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("userID", models.CharField(max_length=6, unique=True)),
                ("name", models.CharField(max_length=25)),
                ("location", models.TextField(null=True)),
                ("mobileNumber", models.CharField(max_length=15)),
                ("email", models.EmailField(max_length=254, null=True)),
                ("startDate", models.DateField()),
                ("totalDays", models.IntegerField()),
                ("breakFast", models.BooleanField(default=False)),
                ("lunch", models.BooleanField(default=False)),
                ("dinner", models.BooleanField(default=False)),
                ("ed_breakFast", models.BooleanField(default=False)),
                ("ed_lunch", models.BooleanField(default=False)),
                ("ed_dinner", models.BooleanField(default=False)),
            ],
        ),
    ]
