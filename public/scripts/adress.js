async function postData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  
  alertBox = document.getElementById('alert')
  alertBox.style.visibility = "hidden";
  
  function adress_Edit() {
    postData('/account/edit_adress', {
      street: document.getElementById('street').value,
      nr_house: document.getElementById('nr_house').value,
      nr_flat: document.getElementById('nr_flat').value,
      zip_code: document.getElementById('zip_code').value,
      city: document.getElementById('city').value,
      country: document.getElementById('country').value,
    }).then(data => {
        alertBox.style.visibility = "visible";
        alertBox.style.borderColor = (data.Response[0] == '0') ? "var(--green)" : "var(--red)";
        alertBox.innerHTML = (data.Response[0] == '0') ? 
          "Zapisano Poprawnie" : 
          "Błąd zapisu";

        setTimeout(_ => {
          alertBox.style.visibility = "hidden";
        }, 3000);
    });
  };
  
  