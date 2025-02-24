let switchMode = document.getElementById("theme-switch__checkbox");

switchMode.onclick = function() {
    let theme = document.getElementById("theme")

    if (theme.getAttribute("href") =="styles/navigator-style.css") {
        theme.href = "styles/darkmode.css";
    
    } else {
        theme.href = "styles/navigator-style.css";
    } 
        
    
}
