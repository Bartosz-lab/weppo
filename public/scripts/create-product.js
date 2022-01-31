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
let photo = document.getElementById('photo');
let imgurl = document.getElementById('imgurl');
let params = document.getElementById('params');
let subcat = document.getElementById('subcat_id');
//const product_id = +document.getElementById('product_id').innerHTML;

function change_img() {
  photo.src = imgurl.value;
};

alertBox = document.getElementById('alert')
alertBox.style.visibility = "hidden";

subcat.onchange = edit_params();
params.onload = edit_params();



function edit_params() {
  postData('/p/params', {
    id: subcat.value
  }).then(data => {
    params.innerHTML = '';
    for (let param of data) {
      params.innerHTML +=
        `<div> 
          <label for="${param.name}"> ${param.name}:</label>
          <input type="text" name="${param.name}">
        </div>`;
    }
  });
};

