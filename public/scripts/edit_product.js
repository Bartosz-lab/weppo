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
  // =========================== params ====================================
  let subcat = document.getElementById('subcat_id');
  let product_id = document.getElementById('product_id');
  let quantity = document.getElementById('quantity');

  subcat.onchange = _ => {
    postData('/p/params', {
      id: subcat.value
    }).then(data => {
      console.log(data);
    });
  };

  function Add_to_basket() {
    console.log(product_id.innerText);
    postData('/basket/update', {
      id: product_id.innerText,
      quantity: quantity.value
    }).then(data => {
      console.log(data);
    });

  };
  //tutaj jest przykład zgrabniejszego wykorzystania AJAX 
  //trzeba jeszcze przekonwerować zwracane dane na wyświetlający się formularz