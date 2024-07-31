/**
 * @license Apache-2.0
 * @copyright 2024 codewithsaadee
 */

'use strict';


/**
 * IMoprt module
 */

import Snackbar from "./snackbar.js";

const $form = document.querySelector('[data-form]');
const $submitBtn = document.querySelector('[data-submit-btn]');

//Handling Sing-Up form Submission
$form.addEventListener('submit', async (event) => {
    event.preventDefault();

    //multiple submission disable
    $submitBtn.setAttribute('disabled', '');

    //FormData caputure function
    const formData = new FormData($form);


    //send account request to create 
    const response = await fetch(`${window.location.origin}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(Object.fromEntries(formData.entries())).toString()
    });

    //for correct response
    if(response.ok){
        //user to login page
        return window.location = response.url;
    }

    if(response.status === 400){

        //remove the submit btn
        $submitBtn.removeAttribute('disabled');
        const { message } = await response.json();
        Snackbar({
            type: 'error',
            message
        });
    }
})