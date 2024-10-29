from django.contrib import admin
from .models import customer_data,deletedCustemers
# Register your models here.
admin.site.register(customer_data)
admin.site.register(deletedCustemers)