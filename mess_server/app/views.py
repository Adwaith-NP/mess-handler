from django.shortcuts import render,redirect
import re
from django.http import JsonResponse
from .models import customer_data
from django.db.models import F
from datetime import timedelta,datetime
from django.utils import timezone
from django.forms.models import model_to_dict

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
        
        vareables = [userIDGet,
                     nameGet,
                     mobile_number,
                     locationGet,
                     totalAmount,
                     startDateGet,
                     totalDaysGet,
                     givenAmount,
                     endDate]
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
            print(returnData)
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
            elif data == 'Break_Fast':
                break_fast_customers = customer_data.objects.filter(breakFast = True)
                break_fast_customers_data = [
                    {'name':person.name,'location':person.location,
                     'userID':person.userID,'end_date':person.exp_date} for person in break_fast_customers
                    ]
                exp_break_fast_customers_data = validatePersons(break_fast_customers_data)
                return JsonResponse({'message': exp_break_fast_customers_data}, status=200)
            elif data == 'lunch':
                lunch_customers = customer_data.objects.filter(lunch = True)
                lunch_customers_data = [
                    {'name':person.name,'location':person.location,
                     'userID':person.userID,'end_date':person.exp_date} for person in lunch_customers
                    ]
                exp_lunch_customers_data = validatePersons(lunch_customers_data)
                return JsonResponse({'message': exp_lunch_customers_data}, status=200)
            elif data == 'dinner':
                dinner_customers = customer_data.objects.filter(dinner = True)
                dinner_customers_data = [
                    {'name':person.name,'location':person.location,
                     'userID':person.userID,'end_date':person.exp_date} for person in dinner_customers
                    ]
                exp_dinner_customers_data = validatePersons(dinner_customers_data)
                return JsonResponse({'message': exp_dinner_customers_data}, status=200)
            else:
                return JsonResponse({'message': 'Invalid thaem selected'}, status=400)
        else:
            return JsonResponse({'message': 'No name provided'}, status=400)
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=405)
    
    
def detailEdit(request,userID):
    if request.method == 'POST':
        userIDGet = request.POST.get('user_field_name',None)
        nameGet = request.POST.get('name_field_name',None)
        mobile_number = request.POST.get('num_field_name',None)
        locationGet = request.POST.get('loc_field_name',None)
        emailGet = request.POST.get('email_field_name',None)
        startDateGet = request.POST.get('StartDate',None)
        givenAmount = request.POST.get('given_field_name',None)
        endDate = request.POST.get('EndDate',None)
        #added food time
        addMeals = request.POST.getlist('meal')
        ##ending food time
        endMeals = request.POST.getlist('ed_meal')
        
        addMealsList = [False,False,False]
        endMealsList = [False,False,False]
        
        vareables = [userIDGet,
                     nameGet,
                     mobile_number,
                     locationGet,
                     startDateGet,
                     givenAmount,
                     endDate]
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
                
        customer_as_per_id = customer_data.objects.get(userID = userIDGet)                
        updats = {
                             'name' : nameGet,
                             'mobileNumber' : mobile_number,
                             'location' : locationGet,
                             'email' : emailGet,
                             'startDate' : startDateGet,
                             'breakFast' : addMealsList[0],
                             'lunch' : addMealsList[1],
                             'dinner' : addMealsList[2],
                             'ed_breakFast' : endMealsList[0],
                             'ed_lunch' : endMealsList[1],
                             'ed_dinner' : endMealsList[2],
                             'exp_date' : endDate,
                             'givenMoney' : float(givenAmount),
                            }   
        customer_as_per_id.__dict__.update(updats)
        customer_as_per_id.save()
        return redirect('main_app:detailEdit',userIDGet)
        
    return render(request,'custo_details.html',{'userID':userID})

def detailEditAPI(request):
    if request.method == 'GET':
        data = request.GET.get('userID', None)
        if data:
            userData = customer_data.objects.get(userID = data)
            userDataToDic = model_to_dict(userData)
            return JsonResponse({'message': userDataToDic}, status=200)
        else:
            return JsonResponse({'message': 'No userID provided'}, status=400)
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=405)
    
    
def update_expDate_as_per_leave_API(request):
    if request.method == 'GET':
        startDate = request.GET.get('leave_start',None)
        endDate = request.GET.get('end_leave',None)
        if startDate and endDate:
            startDateInDateFormat = datetime.strptime(startDate, '%Y-%m-%d').date()
            endDateInDateFormat = datetime.strptime(endDate, '%Y-%m-%d').date()
            customer = customer_data.objects.filter(exp_date__range=(startDate,endDate))
            for cust in customer:
                customerInstance = customer_data.objects.get(userID = cust.userID)
                cusExpDate = cust.exp_date
                updateDays = ((cusExpDate-startDateInDateFormat).days)+1
                customerInstance.exp_date = endDateInDateFormat + timedelta(days=updateDays)
                customerInstance.save()
            return JsonResponse({'message': 'ok'}, status=200)
        else:
            return JsonResponse({'message': 'No data provided'}, status=400)
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=405)