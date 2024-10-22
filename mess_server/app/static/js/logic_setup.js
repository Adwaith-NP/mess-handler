const today = new Date().toISOString().split('T')[0];
document.getElementById('startDate').value = today;

function set_end_date(){
    try{
    let days = parseInt(document.getElementById('days_field').value);
    let startDay = new Date(document.getElementById('startDate').value);
    startDay.setDate(startDay.getDate() + days);
    let newDate = startDay.toISOString().split('T')[0];
    let [year, month, day] = newDate.split('-');
    let formattedDate = `End date : ${day}/${month}/${year}`;
    document.getElementById('EndDate').value = formattedDate;
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