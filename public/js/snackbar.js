'use strict';

const $snackbarWrapper = document.querySelector('[data-snackbar-wrapper]');
let lastTimeout = null;


const Snackbar = (props) =>{ 
    // create element for the snackbar
    const $snackbar = document.createElement('div');
    $snackbar.classList.add('snackbar');
    props.type && $snackbar.classList.add('props.type');
    $snackbar.innerHTML = `
        <p class="body-medium snackbar-text">
            ${props.message}
        </p>
    `;
    
    //clear previous snackbar and append new onw
    $snackbarWrapper.innerHTML = '';
    $snackbarWrapper.append($snackbar);


    //remove snackbar affter 10 second
    clearTimeout(lastTimeout);
    lastTimeout = setTimeout(() => {
        $snackbarWrapper.removeChild($snackbar);
    }, 10000);
}

export default Snackbar;