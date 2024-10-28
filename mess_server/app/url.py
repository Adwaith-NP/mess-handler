from django.urls import path
from . import views

app_name = 'main_app'

urlpatterns = [
    path("user_idAPI/",views.giveUserID,name="giveUserID"),
    path("search_API/",views.search_query,name=('search_API')),
    path("add_customer/",views.add_customer,name="add_customer"),
    path("dashboard/",views.dashboard_view,name='dashboard_view'),
    path("userList/",views.userList,name="list"),
    path("userListAPI/",views.userListAPI,name="listAPI"),
    path("detail-edit/<str:userID>/",views.detailEdit,name="detailEdit"),
    path("detail-editAPI/",views.detailEditAPI,name="detailEditAPI"),
    path('leaveAPI/',views.update_expDate_as_per_leave_API,name="leaveAPI")
]