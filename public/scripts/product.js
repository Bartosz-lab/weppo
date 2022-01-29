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

function Add_to_basket() {
    postData('/basket/add', {
        id: document.getElementById('product_id').value,
        quantity: document.getElementById('quantity').value
    }).then(data => {
        alertBox.style.visibility = "visible";
        alertBox.style.borderColor = (data.Response[0] == '0') ? "var(--green)" : "var(--red)";
        alertBox.innerHTML = (data.Response[0] == '0') ? 
          "Poprawnie dodano wybrany produkt do koszyka" : 
          "Wystąpił problem z dodaniem produktu do koszyka";

        setTimeout(_ => {
          alertBox.style.visibility = "hidden";
        }, 3000);
    });

};