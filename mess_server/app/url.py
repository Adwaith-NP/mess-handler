from django.urls import path
from . import views

app_name = 'main_app'

urlpatterns = [
    path("add_customer/",views.add_customer,name="add_customer"),
]