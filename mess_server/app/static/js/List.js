function exp_person_set_up(object){
    document.getElementById('search_result_div_id').innerHTML = '';
    const parentDiv = document.getElementById('search_result_div_id');
    object.forEach(element => {
        parentDiv.insertAdjacentHTML('beforeend',
            `<div class="search_result_display">
                    <div class="serach_para_div">
                        <p class="serach_para">${element['name']}</p>
                    </div>
                    <div class="search_date_div">
                        <p class="search_date_red">${element['expDate']}</p>
                    </div>
                    <button class="detail_button">Details</button>
            </div>`
        )
    });
}

function showRemainingMoney(object){
    document.getElementById('search_result_div_id').innerHTML = '';
    const parentDiv = document.getElementById('search_result_div_id');
    object.forEach(element => {
        parentDiv.insertAdjacentHTML('beforeend',
            `<div class="search_result_display">
                    <div class="serach_para_div">
                        <p class="serach_para">${element['name']}</p>
                    </div>
                    <div class="search_date_div">
                        <p class="search_date_red">₹ ${element['dueAmount']}</p>
                    </div>
                    <button class="detail_button">Details</button>
            </div>`
        )
    });
}

function exp_persons(){
    collectData("Expired");
    document.getElementById('drop_btn').innerText = "Expired";
}

function remainingMoney(){
    collectData('Payment')
    document.getElementById('drop_btn').innerText = "Payment";
}

function collectData(theam){
    fetch(`http://127.0.0.1:8000/userListAPI?theam=${encodeURIComponent(theam)}`, {
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
            if(theam === "Expired"){
                exp_person_set_up(data.message)
            }
            else if(theam === "Payment"){
                showRemainingMoney(data.message)
            }
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('An error occurred');
    })
}


document.addEventListener('DOMContentLoaded', function() {
    collectData("Expired");
});