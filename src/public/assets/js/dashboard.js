const saveNewAlbum = (e) => {
    const album = document.querySelector('#album');
    const autor = document.querySelector('#autor');
    const precio = document.querySelector('#precio');
    const foto = document.querySelector('#foto');

    if(album.value != '' && autor.value != '' && precio.value != '' && foto.value){
        $.ajax({
            url: '/newAlbum',
            method: 'POST',
            data: {
                album: album.value,
                autor: autor.value,
                precio: precio.value,
                foto: foto.value,
            },
            contentType: 'multipart/form-data',
            success: function(r){
                console.log(r);
               /*  location.reload(); */
            },
        });
    }else{
        Swal.fire({
            icon: 'error',
            title: 'ERROR',
            text: '¡Campos vacíos',
          }) 
    }
    
}