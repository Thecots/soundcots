const saveNewAlbum = (e) => {
    const album = document.querySelector('#album');
    const autor = document.querySelector('#autor');
    const precio = document.querySelector('#precio');
    const foto = document.querySelector('#foto');

    if(album.value != '' && autor.value != '' && precio.value != '' && foto.value){

    }else{
        Swal.fire({
            icon: 'error',
            title: 'ERROR',
            text: '¡Campos vacíos',
          })
    }
    console.log();
}