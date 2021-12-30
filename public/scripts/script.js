// dynamiczny topbar
window.addEventListener('load', () => {
    var header = document.getElementById('header')
    var links = document.getElementById('links')

    var offset = header.offsetTop;

    window.addEventListener('scroll', () => {
        header.classList.toggle('sticky', window.scrollY > offset);
        links.classList.toggle('sticky', window.scrollY > offset);
    })
})