function loadNavbar() {
    fetch('navbar.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;
      })
      .catch(err => console.error(err));
  }
  
  // Call the function to load the navbar
  loadNavbar();
  