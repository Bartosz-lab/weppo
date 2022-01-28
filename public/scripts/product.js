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

function Add_to_basket() {
    postData('/basket/add', {
        id: document.getElementById('product_id').value,
        quantity: document.getElementById('quantity').value
    }).then(data => {
        alert(data.Response);
    });

};