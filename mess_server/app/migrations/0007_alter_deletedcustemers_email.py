# Generated by Django 4.2.1 on 2024-10-29 08:41

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("app", "0006_alter_deletedcustemers_email"),
    ]

    operations = [
        migrations.AlterField(
            model_name="deletedcustemers",
            name="email",
            field=models.CharField(max_length=50, null=True),
        ),
    ]