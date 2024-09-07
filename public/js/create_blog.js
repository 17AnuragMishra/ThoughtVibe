'use strict'

import imagePreview from './utils/imagePreview.js';
import Snackbar from './snackbar.js';
import config from './config.js';
import imageAsDataURL from './utils/imageAsDataUrl.js';
// import $imagePreview from './utils/imagePreview.js';


const $imageField = document.querySelector('[data-image-field]');
const $imagePreview = document.querySelector('[data-image-preview]');
const $imagePreviewClear = document.querySelector('[data-image-preview-clear]');

/**
 * @function to preview the image
 */

$imageField.addEventListener('change', () => {
    imagePreview($imageField, $imagePreview);
})


/**
 * @function to clearImagePreview
 */

const clearImagePreview = function (){
    $imagePreview.classList.remove('show');
    $imagePreview.innerHTML = '';
}

$imagePreviewClear.addEventListener('click', clearImagePreview);


/**\
 * publish management
 */

const $form = document.querySelector('[data-form]');
const $publishBtn = document.querySelector('[data-publish-btn]');
const $progressBar = document.querySelector('[data-progress-bar]');


const handlePublishBlog = async function (event) {
    event.preventDefault();

    //disable published button to prevent multiple submission
    $publishBtn.setAttribute('disabled', '');
    
    //FormData onject to capture form data
    const formData = new FormData($form);

    if (!formData.get('banner').size) {
        $publishBtn.removeAttribute('disabled');
        Snackbar({ type: 'error', message: 'You didn\'t select any image for blog banner.' });
        return;
    }

    // When size is more than 5MB
    if (formData.get('banner').size > config.blogBanner.maxByteSize) {
        $publishBtn.removeAttribute('disabled');
        Snackbar({ type: 'error', message: 'Image should be less than 5MB.' });
        return;
    }

    // Convert the image to a base64 string
    const bannerBase64 = await imageAsDataURL(formData.get('banner'));
    formData.set('banner', bannerBase64);

    // Convert formData to a plain object for JSON
    const body = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${window.location.origin}/createblog`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        //Handle case where response is success

        const result = await response.json();

        if (response.ok) {
            Snackbar({ type: 'success', message: 'Blog created successfully!' });
            $progressBar.classList.add('loading-end');

            //redirect
            return window.location = response.url;

        } else {
            Snackbar({ type: 'error', message: result.error || 'Failed to create blog.' });
        }

    } catch (error) {
        console.error('Error:', error);
        Snackbar({ type: 'error', message: 'An error occurred while creating the blog.' });
    } finally {
        $publishBtn.removeAttribute('disabled');
    }
}

$form.addEventListener('submit', handlePublishBlog);
