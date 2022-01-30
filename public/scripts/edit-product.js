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
const product_id = +document.getElementById('product_id').innerHTML;

subcat.onchange = _ => {
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

function change_img() {
  photo.src = imgurl.value;
};

alertBox = document.getElementById('alert')
alertBox.style.visibility = "hidden";

function dell_button() {
  if (confirm('Czy jesteś pewien, usunięcia produktu?')) {
    postData(`/p/${product_id}/del`).then(data => {
      alertBox.style.visibility = "visible";
      alertBox.style.borderColor = (data.Response[0] == '0') ? "var(--green)" : "var(--red)";
      alertBox.innerHTML = (data.Response[0] == '0') ? 
        "Usunięto" : 
        "Wystąpił problem";

      setTimeout(_ => {
        alertBox.style.visibility = "hidden";
        if (data.Response[0] == '0') {
          window.location.replace('/');
        }
      }, 3000); 
    });
  };
};