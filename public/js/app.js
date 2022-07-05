"use strict";

var landing_bg = document.getElementsByClassName('parent')[0];
if (!landing_bg) landing_bg = document.getElementsByClassName('main-content')[0];
var header = document.getElementById('nav');
var burger = document.querySelector('.burger-wrapper');
var btop = document.querySelector('#burger-top');
var bmid = document.querySelector('#burger-mid');
var bbot = document.querySelector('#burger-bot');
var nav = document.querySelector('.nav_links');
var profile = document.querySelector('.profile');
var items = document.querySelector('.profile-dropdown');
var drop_arrow = document.querySelector('#dropdown-arrow');
var features = document.querySelector('.features');
var url = window.location.href

function animations() {
    function toggle_burger(class_name) {
        btop.classList.toggle(`top-${class_name}`);
        bmid.classList.toggle(`mid-${class_name}`);
        bbot.classList.toggle(`bot-${class_name}`);
    }

    burger.addEventListener('click', function () {
        try {
            if (items.classList.contains('profile-active')) profile.click();
        } catch { }
        if (nav.classList.contains('nav-active') || btop.classList.contains('top-inactive')) {
            toggle_burger('inactive');
        }
        nav.classList.toggle('nav-active');
        nav.classList.toggle('nav-closed');
        toggle_burger('active');
    });
    try {
        profile.addEventListener('click', function () {
            if (nav.classList.contains('nav-active')) burger.click();
            items.classList.toggle('profile-active');
            items.classList.toggle('profile-closed');
            drop_arrow.classList.toggle('dropdown-active');
        });
    } catch { }

    landing_bg.addEventListener('click', function () {
        try { if (items.classList.contains('profile-active')) profile.click(); } catch { }
    });
}

window.addEventListener('scroll', function () {
    try {
        if (window.scrollY >= features.offsetTop - 250) header.classList.add('fixed-top-features')
        if (window.scrollY < features.offsetTop - 250) header.classList.remove('fixed-top-features')
    } catch (err) { }
})

try {
    features.scrollTop -= 1000;
} catch (err) { }


url = url.split("/")
var last = url[url.length - 1]

setTimeout(function () {
    if (last === 'features') window.scrollTo({ top: (document.querySelector('.features').offsetTop - 150), behavior: 'smooth' });
}, 1500)

animations();