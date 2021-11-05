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

const deleteAlbum = (e,public_id) => {    
    console.log(public_id);
    Swal.fire({
        title: 'Estas seguro?',
        text: "No podrás revertir los cambios!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar álbum!'
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            url: '/deleteAlbum',
            method: 'POST',
            data: {
                id: e,
                public_id
            },
            success: function(r){
                location.href = "/dashboard";
            },
        });

        }
      })



 
}

const admin = (e) => {
    $.ajax({
        url: '/adminstate',
        method: 'POST',
        data: {id:e},
        success: function(r){
            location.reload();
        },
    });
}