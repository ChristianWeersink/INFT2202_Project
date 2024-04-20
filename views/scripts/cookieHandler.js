/*
    Final project
    Christina Jackson and Christian Weersink
    INFT 2202-07
    Cookie Handler function
*/

// cookieHandler.js

// Function to get the value of a cookie by its name
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null; // Return null if cookie not found
}
