import { Api } from './Api';

export const api = new Api({
    withCredentials: true,
    baseURL: 'http://localhost:8000',
    // headers: {
    //     'X-CSRFToken': getCookie('csrftoken') 
    // }
});

// function getCookie(name: string) {
//     let cookieValue = null;
//     if (document.cookie && document.cookie !== '') {
//         const cookies = document.cookie.split(';');
//         for (let i = 0; i < cookies.length; i++) {
//             const cookie = cookies[i].trim();
//             if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                 break;
//             }
//         }
//     }
//     return cookieValue;
// }