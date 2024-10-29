function formatDate(dateStr) {
    if (!dateStr) return ""; // Return an empty string if the date is undefined or null
  
    // Split the date string and create a Date object using the components
    const [year, month, day] = dateStr.split("-");
    const date = new Date(year, month - 1, day); // Month is zero-indexed in JavaScript
  
    // Format the date as "yyyy-MM-dd"
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }


function setValus(data){
    document.getElementById('user_field').value = data.userID;
    document.getElementById('name_field').value = data.name;
    document.getElementById('num_field').value = data.mobileNumber;
    document.getElementById('email_field').value = data.email;
    document.getElementById('loc_field').value = data.location;
    // document.getElementById('days_field').value = data.totalDays;
    document.getElementById('given_field').value = data.givenMoney;
    document.getElementById('due_field').value = data.totalMoney - data.givenMoney;
    document.getElementById('startDate').value = formatDate(data.startDate);
    document.getElementById('endDate').value = formatDate(data.exp_date);
    // times
    document.getElementById('breakfast').checked = data.breakFast;
    document.getElementById('lunch').checked = data.lunch;
    document.getElementById('dinner').checked = data.dinner;
    //end at
    document.getElementById('EDbreakfast').checked = data.ed_breakFast;
    document.getElementById('EDlunch').checked = data.ed_lunch;
    document.getElementById('EDdinner').checked = data.ed_dinner;
}



function collectData(userID){
    fetch(`http://127.0.0.1:8000/detail-editAPI?userID=${encodeURIComponent(userID)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();  // Parse the response as JSON
    })
    .then(data => {
        if (data.message) {
            setValus(data.message);
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('An error occurred');
    })
}

function deleteUser(){
    const userConfirmed = confirm("Do you want to delete?");
    if(userConfirmed){
    const csrf_token = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    const userID = document.getElementById('user_field').value;
    const name = document.getElementById('name_field').value;
    const location = document.getElementById('loc_field').value;
    const mobileNumber = document.getElementById('num_field').value;
    const email = document.getElementById('email_field').value;

    fetch(`http://127.0.0.1:8000/deleteAPI/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token // Pass the CSRF token here
            },
        body : JSON.stringify({ 
            userID: userID,
            name : name,
            location : location,
            mobileNumber : mobileNumber,
            email : email,
         }) 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();  // Parse the response as JSON
    })
    .then(data => {
        if (data.message) {
            alert('customer data deleted')
            window.location.href = "http://127.0.0.1:8000/dashboard/";
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('An error occurred');
    })
}
}