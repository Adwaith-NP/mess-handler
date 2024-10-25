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