const signout = () => {

    $.ajax({
        url: '/signout',
        method: 'POST',
        success: function(r){
            location.reload();
        },
    });
}

const cesta = () => { location.href = "/cesta"}

const dashboard = () => {location.href = "/dashboard"}

const displayMeny = () => {
    document.querySelector('#screenToRemove #box').style.display = "none"
}

const screenToRemove = () => {
    document.querySelector('#screenToRemove').style.display = "none"
}

const addToCesta = (id) => {
    $.ajax({
        url: '/addToBasket',
        method: 'POST',
        data:{ id },
        success: function(r){
            if(r == "error"){
                Swal.fire({
                    icon: 'error',
                    title: 'ERROR',
                    text: '¡Inicia sesión para poder añadir productos a la cesta!',
                  })
            }else{
                Swal.fire({
                    icon: 'success',
                    text: 'Prodcuto añadido correctamente',
                  })
            }
        },
    });
}

const cestaDelete = (e) => {
    $.ajax({
        url: '/deleteCesta',
        method: 'POST',
        data: {id:e},
        success: function(r){
            location.reload();
        },
    });
}