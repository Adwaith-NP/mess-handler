function addElementToDiv(object){
    document.getElementById('search_result_div_id').innerHTML = '';
    const parentDiv = document.getElementById('search_result_div_id');
    object.forEach(element => {
        if(element['color'] === 'green'){
            parentDiv.insertAdjacentHTML('beforeend',`
                    <div class="search_result_display">
                        <div class="serach_para_div">
                            <p class="serach_para">${ element['name'] }</p>
                        </div>
                        <div class="search_date_div">
                            <p class="search_date_green">${ element['end_date'] }</p>
                        </div>
                        <a href="http://127.0.0.1:8000/detail-edit/${element['userID']}/">
                            <button class="detail_button">Details</button>
                        </a>
                    </div>`)
        }
        else{
            parentDiv.insertAdjacentHTML('beforeend',`
                <div class="search_result_display">
                    <div class="serach_para_div">
                        <p class="serach_para">${ element['name'] }</p>
                    </div>
                    <div class="search_date_div">
                        <p class="search_date_red">${ element['end_date'] }</p>
                    </div>
                    <a href="http://127.0.0.1:8000/detail-edit/${element['userID']}/">
                        <button class="detail_button">Details</button>
                    </a>
                </div>`)
        }
    });
}

function searchItem(key){
    fetch(`http://127.0.0.1:8000/search_API?name=${encodeURIComponent(key)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();  // Parse the response as JSON
    })
    .then(data => {
        if (data.message) {
            addElementToDiv(data.message)
        } else {
            alert(data.error);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('An error occurred');
    });
}


document.getElementById('search_input').addEventListener('focus', function() {
    this.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        let searchString = document.getElementById('search_input').value;
        searchItem(searchString)
      }
    });
  });

function setMainWindoeBlur(){
    const div = document.getElementById("container_div");
    const sub_div = document.getElementById("settings_div");
    div.style.filter = "blur(5px)";
    sub_div.style.display = "block"
}

function setMainWindoeNotBlur(){
    const div = document.getElementById("container_div");
    const sub_div = document.getElementById("settings_div");
    div.style.filter = "none";
    sub_div.style.display = "none"
}

function setLeave(){
    const startLeave = document.getElementById("leave_start").value;
    const endLeave = document.getElementById("end_leave").value;
    fetch(`http://127.0.0.1:8000/leaveAPI?leave_start=${encodeURIComponent(startLeave)}&end_leave=${encodeURIComponent(endLeave)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();  // Parse the response as JSON
    })
    .then(data => {
        if (data.message) {
            alert(data.message)
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('An error occurred');
    });
}