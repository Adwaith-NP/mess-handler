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
    document.getElementById('days_field').value = data.totalDays;
    document.getElementById('given_field').value = data.givenMoney;
    document.getElementById('due_field').value = data.totalMoney - data.givenMoney;
    document.getElementById('startDate').value = formatDate(data.startDate);
    document.getElementById('endDate').value = formatDate(data.exp_date);
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