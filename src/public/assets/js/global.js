const signout = () => {

    $.ajax({
        url: '/signout',
        method: 'POST',
        success: function(r){
            location.reload();
        },
    });
}

const dashboard = () => {location.href = "/dashboard"}

const displayMeny = () => {
    document.querySelector('#screenToRemove #box').style.display = "none"
}

const screenToRemove = () => {
    document.querySelector('#screenToRemove').style.display = "none"
}