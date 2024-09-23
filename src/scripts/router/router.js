function setRouter() {
    switch(window.location.pathname){
        case "/":
        case "/pages/index.html":
        case "/pages/register.html":
            if(localStorage.getItem("token")) {
                window.location.pathname = '/pages/dashboard.html';
            }
            break;
        case "/pages/dashboard.html":
            if(!localStorage.getItem("token")) {
                window.location.pathname = '/pages/index.html';
            }
            break;

        default:
            break;
    }
}

export { setRouter };
