'use strict'

const { text } = require("express");


const $topAppBar = document.querySelector('[data-top-app-bar]');
let lastScrollPos = 0;

window.addEventListener('scroll', (event) =>{
    $topAppBar.classList[window.scrollY > 50 ? 'add' : 'remove']('active');

    $topAppBar.classList[window.scrollY > lastScrollPos && window.screenY > 50 ? 'add' : 'remove']('hide');

    //last position like twitter
    lastScrollPos = window.scrollY;
})

/**
 * Toggle menu
 */

const $menuWrappers = document.querySelectorAll('[data-menu-wrapper]');

$menuWrappers.forEach(function ($menuWrapper) {
    const $menuToggler = $menuWrapper.querySelector('[data-menu-toggler]');
    const $menu = $menuWrapper.querySelector('[data-menu]');

    $menuToggler.addEventListener('click', () => {
        $menu.classList.toggle('active');
    });
});


const $backBtn = document.querySelector('[data-back-btn]');

const handleBackward = function (){
    window.history.back();
}

$backBtn?.addEventListener('click', handleBackward);


/**
 * Auto height in text blog area
 */

const $autoHeightTextarea = document.querySelector('[data-textarea-auto-height]');

const textareaAutoHeight = function (){

}

$autoHeightTextarea?.addEventListener('input', textareaAutoHeight);

$autoHeightTextarea && textareaAutoHeight.call($autoHeightTextarea);