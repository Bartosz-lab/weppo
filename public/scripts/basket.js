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

function update_product_in_basket(id, quantity) {
    console.log(id + " " + quantity)
    postData('/basket/update', {
        id: id,
        quantity: quantity
    }).then(data => {
        alertBox.style.visibility = "visible";
        alertBox.style.borderColor = (data.Response[0] == '0') ? "var(--green)" : "var(--red)";
        alertBox.innerHTML = (data.Response[0] == '0') ? 
            ((quantity === 0) ? "Produkt Usunięty" :
          "Poprawnie zaktualizowano wybrany produkt w koszyku") : 
          "Wystąpił problem z dodaniem produktu do koszyka";

        // usuwanie elementu z widoku 
        if(data.Response[0] == '0' && quantity == 0) {
            document.getElementById("cont"+id).style.visibility = "hidden";
        }
        
        setTimeout(_ => {
          alertBox.style.visibility = "hidden";
          if(quantity === 0) {
            window.location.reload(true);
          }
        }, 3000);    
    });

};
