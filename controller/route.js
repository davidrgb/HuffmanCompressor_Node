import * as Home from '../viewpage/home.js';
import * as Compression from '../viewpage/compression.js';
import * as Decompression from '../viewpage/decompression.js';

export const routePathnames = {
    HOME: '/',
    COMPRESSION: '/compression',
    DECOMPRESSION: '/decompression',
}

export const routes = [
    {pathname: routePathnames.HOME, page: Home.homePage},
    {pathname: routePathnames.COMPRESSION, page: Compression.compressionPage},
    {pathname: routePathnames.DECOMPRESSION, page: Decompression.decompressionPage},
]

export function routing(pathname, hash) {
    const route = routes.find(r => r.pathname == pathname);
    if (route) {
        if (hash && hash.length > 1) {
            route.page(hash.substring(1));
        }
        else {
            route.page();
        }
    }
    else routes[0].page();
}