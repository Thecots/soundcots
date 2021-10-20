const signout = () => {
    console.log('x');
    $.ajax({
        url: '/signout',
        method: 'POST',
        success: function(r){
            location.reload();
        },
    });
}

const displayMeny = () => {
    document.querySelector('#screenToRemove #box').style.display = "none"
}

const screenToRemove = () => {
    document.querySelector('#screenToRemove').style.display = "none"
}