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

  subcat.onchange = _ => {
    postData('/p/params', {
      id: subcat.value
    }).then(data => {
      params.innerHTML = '';
      for(let param of data) { 
        params.innerHTML += 
        `<div> 
          <label for="${param.id}"> ${param.name}:</label>
          <input type="text" name="${param.id}">
        </div>`;
      }
    });
  };

  function change_img() {
    photo.src = imgurl.value;
  };
  function form_submit() {
    alert("Funkcja dostępna wkrótce");
    return false;
  };