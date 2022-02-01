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
    postData('/account/edit_adress').then(data => {
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
  
  