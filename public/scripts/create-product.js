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
//let params = document.getElementById('params');
let subcat = document.getElementById('subcat_id');
//const product_id = +document.getElementById('product_id').innerHTML;

function change_img() {
  photo.src = imgurl.value;
};

alertBox = document.getElementById('alert')
alertBox.style.visibility = "hidden";