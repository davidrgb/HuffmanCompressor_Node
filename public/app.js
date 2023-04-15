import * as Route from '../controller/route.js';

import * as Home from './viewpage/home.js';

window.onload = () => {
    const pathname = window.location.pathname;
    const hash = window.location.hash;

    Route.routing(pathname, hash);
}

window.addEventListener('popstate', e => {
    e.preventDefault();

    const pathname = e.target.location.pathname;
    const hash = e.target.location.hash;

    Route.routing(pathname, hash);
});

Home.addEventListeners();


