function formatDate(dateStr) {
    if (!dateStr) return ""; // Return an empty string if the date is undefined or null
  
    // Split the date string and create a Date object using the components
    const [year, month, day] = dateStr.split("-");
    const date = new Date(year, month - 1, day); // Month is zero-indexed in JavaScript
  
    // Format the date as "yyyy-MM-dd"
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }


function setValus(data){
    document.getElementById('userID_field').value = data.userID;
    document.getElementById('name_field').value = data.name;
    document.getElementById('num_field').value = data.mobileNumber;
    document.getElementById('email_field').value = data.email;
    document.getElementById('loc_field').value = data.location;
    document.getElementById('days_field').value = data.totalDays;
    document.getElementById('given_field').value = data.givenMoney;
    document.getElementById('amo_field').value = data.totalMoney;
    document.getElementById('startDate').value = formatDate(data.startDate);
    document.getElementById('EndDate').value = formatDate(data.exp_date);
    // times
    document.getElementById('meal_breakfast').checked = data.breakFast;
    document.getElementById('meal_lunch').checked = data.lunch;
    document.getElementById('meal_dinner').checked = data.dinner;
    //end at
    document.getElementById('end_meal_breakfast').checked = data.ed_breakFast;
    document.getElementById('end_meal_lunch').checked = data.ed_lunch;
    document.getElementById('end_meal_dinner').checked = data.ed_dinner;
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
    const userID = document.getElementById('userID_field').value;
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




// from logic_setup

const today = new Date().toISOString().split('T')[0];
document.getElementById('startDate').value = today;

function set_end_date(){
    try{
    let days = parseInt(document.getElementById('days_field').value);
    let startDay = new Date(document.getElementById('startDate').value);
    startDay.setDate(startDay.getDate() + (days-1));
    let newDate = startDay.toISOString().split('T')[0];
    let [year, month, day] = newDate.split('-');
    let formattedDate = `End date : ${day}/${month}/${year}`;
    document.getElementById('EndDate').innerText = formattedDate;
    document.getElementById('EndDate').value = newDate;
    }
    catch{
        return
    }
}

document.getElementById('days_field').addEventListener('focus', function() {
    this.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        set_end_date()
      }
    });
  });


const inputs = document.querySelectorAll('input');
inputs.forEach((input, index) => {
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
            const nextInput = inputs[index + 1];
            if (nextInput) {
                nextInput.focus(); // Focus on the next input field
            }
        }
    });
});

function validateForm(event) {
    // Prevent the form from submitting by default
    event.preventDefault();

    // Required fields (excluding email, meals, and end_meals)
    const requiredFields = [
        'userID_field',
        'name_field',
        'num_field',
        'loc_field',
        'amo_field',
        'startDate',
        'days_field',
        'given_field',
        'EndDate'
    ];

    let isValid = true;

    // Loop through required fields and check if any are empty
    for (let fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        
        if (!field.value.trim()) {
            isValid = false;
            field.style.border = "2px solid red";  // Highlight empty fields
            alert(`Please fill in the ${field.placeholder} field.`);
            break;  // Stop checking further fields after the first empty one
        } else {
            field.style.border = "";  // Remove highlight for filled fields
        }
    }

    // Validate mobile number (10 digits)
    const mobileField = document.getElementById('num_field');
    const mobilePattern = /^\d{10}$/;  // Pattern for 10 digits
    if (mobileField && !mobilePattern.test(mobileField.value)) {
        isValid = false;
        mobileField.style.border = "2px solid red";
        alert("Please enter a valid 10-digit mobile number.");
    } else {
        mobileField.style.border = "";
    }

    // Validate email format if email is entered
    const emailField = document.getElementById('email_field');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Basic email pattern
    if (emailField && emailField.value && !emailPattern.test(emailField.value)) {
        isValid = false;
        emailField.style.border = "2px solid red";
        alert("Please enter a valid email address.");
    } else if (emailField) {
        emailField.style.border = "";
    }

    // If all required fields are filled and validations pass, submit the form
    if (isValid) {
        document.querySelector("form").submit();
    }
}

// Attach the validation function to the form submit event
document.querySelector("form").addEventListener("submit", validateForm);
