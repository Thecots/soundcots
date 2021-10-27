const form = document.querySelector("#form")
const album = document.querySelector('#album');
const autor = document.querySelector('#autor');
const precio = document.querySelector('#precio');
const foto = document.querySelector('#foto');

if(form != null){
    form.addEventListener("submit", (e)=> {
        e.preventDefault();
        if(album.value != '' && autor.value != '' && precio.value != '' && foto.value){
            const formData = new FormData(e.currentTarget);
            fetch('/newAlbum',{
                method: 'POST',
                body: formData
            }).then(e => {
                location.href = "/dashboard"
            })
        }else{
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: '¡Campos vacíos',
              }) 
        }
    
    })
}

const deleteAlbum = (e) => {    
    $.ajax({
        url: '/deleteAlbum',
        method: 'POST',
        data: {
            id: e
        },
        success: function(r){
            location.href = "/dashboard";
        },
    });
}