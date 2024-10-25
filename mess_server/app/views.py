from django.shortcuts import render,redirect
import re
from django.http import JsonResponse
from .models import customer_data
from django.db.models import F
from datetime import timedelta,datetime
from django.utils import timezone

# Create your views here.
def is_valid_email(email):
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_regex, email) is not None

def is_valid_phone(phone):
    phone_regex = r'^\d{10}$'
    return re.match(phone_regex, phone) is not None

# return the unique user ID
def giveUserID(request):
    if request.method == 'GET':
        lastUserId = customer_data.objects.all().order_by('-id').first()
        newUserID = int(lastUserId.userID)+1 + 1000000
        newUserID = str(newUserID)[1:]
        return JsonResponse({"userID": newUserID})


## Collect the data from user
def add_customer(request):
    if request.method == 'POST':
        userIDGet = request.POST.get('user_field',None)
        nameGet = request.POST.get('name_field',None)
        mobile_number = request.POST.get('num_field',None)
        locationGet = request.POST.get('loc_field',None)
        emailGet = request.POST.get('email_field',None)
        totalAmount = request.POST.get('amo_field',None)
        startDateGet = request.POST.get('StartDate',None)
        totalDaysGet = request.POST.get('days_field',None)
        givenAmount = request.POST.get('given_field',None)
        endDate = request.POST.get('EndDate',None)
        #added food time
        addMeals = request.POST.getlist('meals')
        ##ending food time
        endMeals = request.POST.getlist('end_meals')
        
        addMealsList = [False,False,False]
        endMealsList = [False,False,False]
        
        vareables = [userIDGet,nameGet,mobile_number,locationGet,totalAmount,startDateGet,totalDaysGet,givenAmount,endDate]
        if any(not elements for elements in vareables):
            ##return a message
            print("not fill")
            return redirect('main_app:add_customer')
        if emailGet:
            if not is_valid_email(emailGet):
                print("email")
                return redirect('main_app:add_customer')
        if not is_valid_phone(mobile_number):
            print("phone")
            return redirect('main_app:add_customer')
        
        
        for item in addMeals:
            if "BREAKFAST" == item:
                addMealsList[0] = True
            elif "LUNCH"  == item:
                addMealsList[1] = True
            elif "DINNER" == item:
                addMealsList[2] = True
        
        for item in endMeals:
            if "ed_BREAKFAST" == item:
                endMealsList[0] = True
            elif "ed_LUNCH"  == item:
                endMealsList[1] = True
            elif "ed_DINNER" == item:
                endMealsList[2] = True
                
        # endDate = datetime.strptime(endDate, '%d/%m/%Y').date()
                
        data = customer_data(userID = userIDGet,
                             name = nameGet,
                             mobileNumber = mobile_number,
                             location = locationGet,
                             email = emailGet,
                             startDate = startDateGet,
                             totalDays = totalDaysGet,
                             breakFast = addMealsList[0],
                             lunch = addMealsList[1],
                             dinner = addMealsList[2],
                             ed_breakFast = endMealsList[0],
                             ed_lunch = endMealsList[1],
                             ed_dinner = endMealsList[2],
                             exp_date = endDate,
                             totalMoney = float(totalAmount),
                             givenMoney = float(givenAmount),
                             )
        data.save()
        return redirect('main_app:add_customer')
    return render(request,'add_menu.html')

def validatePersons(data):
    current_date = timezone.now().date()
    for person in data:
        exp_date = person['end_date']
        if current_date > exp_date:
            person['color'] = 'red'
        else:
            person['color'] = 'green'
    return data

##Search query
def search_query(request):
    if request.method == 'GET':
        data = request.GET.get('name', None)
        if data:
            result = customer_data.objects.filter(name__icontains = data)
            result_list = [{'name':person.name,'startDate':person.startDate,'end_date':person.exp_date,'userID':person.userID} for person in result]
            returnData = validatePersons(result_list)
            # return the search result
            return JsonResponse({'message': returnData}, status=200)
        else:
            return JsonResponse({'message': 'No name provided'}, status=400)
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=405)
    
    
##Dashboard setups
def dashboard_view(request):
    current_date = datetime.now().date()
    expDate = current_date+timedelta(days=2)
    exp_persons = customer_data.objects.filter(exp_date = expDate)
    return render(request,'dashboard.html',{'exp_persons':exp_persons})


def userList(request):
    return render(request,'List.html')

def userListAPI(request):
    if request.method == 'GET':
        today = timezone.now().date()
        data = request.GET.get('theam', None)
        if data:
            if data == 'Expired':
                expired_records = customer_data.objects.filter(exp_date__lt=today)
                expired_persons = [{'name':person.name,'expDate':person.exp_date,'userID':person.userID} for person in expired_records]
                return JsonResponse({'message': expired_persons}, status=200)
            elif data == 'Payment':
                remainMoneyPersons = customer_data.objects.exclude(totalMoney=F('givenMoney'))
                due_money_persons = [{'name':person.name,'dueAmount':(person.totalMoney-person.givenMoney),'userID':person.userID} for person in remainMoneyPersons]
                return JsonResponse({'message': due_money_persons}, status=200)
            else:
                return JsonResponse({'message': 'Invalid thaem selected'}, status=400)
        else:
            return JsonResponse({'message': 'No name provided'}, status=400)
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=405)