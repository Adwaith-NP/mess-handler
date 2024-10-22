from django.db import models

# Create your models here.

class customer_data(models.Model):
    userID = models.CharField(max_length=6,unique=True,null=False)
    name = models.CharField(max_length=25,null=False)
    location = models.TextField(null=True)
    mobileNumber = models.CharField(null=False,max_length=15)
    email = models.EmailField(null=True)
    startDate = models.DateField(null=False)
    totalDays = models.IntegerField(null=False)
    # Meal preferences
    breakFast = models.BooleanField(default=False)
    lunch = models.BooleanField(default=False)
    dinner = models.BooleanField(default=False)
    #end Meal preferences
    ed_breakFast = models.BooleanField(default=False)
    ed_lunch = models.BooleanField(default=False)
    ed_dinner = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.name} - {self.userID}"