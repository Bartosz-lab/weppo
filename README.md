[Link do heroku](https://weppo.herokuapp.com/)


Kody błędu:
0. Success
1. Access deined
2. Invalid login
3. Invalid password
4. Something went wrong //pod to podpioł bym też nieznane błędy (bo mogą takie wystąpić)
5. Password too weak



Hoho chyba narazie traktuje to jako miejsce na notatki ale tu może będzie to zauważone xd
Tak więc zauważyłem że jest literówka w wielu miejscach i pisze Powrór zamiast Powrót

Ja tą stronę widziałbym tak, że masz szablon np. template (prawie jak topbar tylko bardziej) który zawiera cały szablon strony tzn. 

<!DOCTYPE html>
<html lang="en">
    <%- include('head') %>
<body id="body">
    <%- include('nagłówek') %>
    <%- include('kontent') %>
    <%- include('stopka') %>
</body>
</html>

i wtedy wszystkie zakładki oprócz logowania i rejestracji powinny z tego korzystać