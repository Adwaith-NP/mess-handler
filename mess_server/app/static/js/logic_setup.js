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

//to collect the userID

document.addEventListener('DOMContentLoaded', function() {
    
fetch('http://127.0.0.1:8000/user_idAPI', {
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
    if (data.userID) {
        // Update the DOM to display the userID
        document.getElementById('userID_field').value = data.userID;
    } else {
        alert('Error: ' + data.error);
    }
})
.catch(error => {
    console.error('Fetch error:', error);
    alert('An error occurred');
})
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
