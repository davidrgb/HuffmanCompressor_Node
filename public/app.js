import * as Router from './controller/route.js';

import * as Home from './viewpage/home.js';

window.onload = () => {
    const pathname = window.location.pathname;
    const hash = window.location.hash;

    Router.routing(pathname, hash);
}

window.addEventListener('popstate', e => {
    e.preventDefault();

    const pathname = e.target.location.pathname;
    const hash = e.target.location.hash;

    Router.routing(pathname, hash);
});

document.getElementById('icon-home').addEventListener('click', () => {
    history.pushState(null, null, Router.routePathnames.HOME);
    Home.homePage();
});

