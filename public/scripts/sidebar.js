    const loc = window.location.pathname;
    console.log(loc);
    if (loc === "/"){
        const element = document.getElementById("homeItem")
        element.classList.add("activeSideBarItem");
    }
    if (loc === "/myCities"){
        const element = document.getElementById("citiesItem")
        element.classList.add("activeSideBarItem");
}