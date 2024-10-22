from django.shortcuts import render,redirect

# Create your views here.

def add_customer(request):
    if request.method == 'POST':
        name = request.POST.get('name_field',None)
        mobile_number = request.POST.get('num_field',None)
        location = request.POST.get('loc_field',None)
        email = request.POST.get('email_field',None)
        totalAmount = request.POST.get('amo_field',None)
        startDate = request.POST.get('StartDate',None)
        totalDays = request.POST.get('days_field',None)
        givenAmount = request.POST.get('given_field',None)
        #added food time
        addBREAKFAST = request.POST.get('addBREAKFAST',False)
        addLUNCH = request.POST.get('addLUNCH',False)
        addDINNER = request.POST.get('addDINNER',False)
        ##ending food time
        endBREAKFAST = request.POST.get('endBREAKFAST',False)
        endLUNCH = request.POST.get('endLUNCH',False)
        endDINNER = request.POST.get('endDINNER',False)
        
        
        
        return redirect('main_app:add_customer')
    return render(request,'add_menu.html')