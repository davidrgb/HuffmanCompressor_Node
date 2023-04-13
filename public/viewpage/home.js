import * as Router from '../controller/route.js';

import * as Element from './element.js';
import * as Compression from './compression.js';
import * as Decompression from './decompression.js';

export function homePage() {
    let html;

    html = `
        <div style="max-width:90vw;">
            <h1>Huffman Compressor</h1>
            <div style="font-size: 1.5rem; font-weight:bold; padding: 0 0 5vh 0;">This is a website that uses Huffman coding to compress and decompress text files,
            <br>built with Node.js.</div>
            <div style="display:flex; justify-content:center;">
                <div style="display:flex; justify-content: space-between; width:90%;">
                    <button id='button-open-compression'>Compress</button>
                    <button id='button-open-decompression'>Decompress</button>
                </div>
            </div>
        </div>
    `;

    Element.root.innerHTML = html;

    document.getElementById('button-open-compression').addEventListener('click', () => {
        history.pushState(null, null, Router.routePathnames.COMPRESSION);
        Compression.compressionPage();
    });

    document.getElementById('button-open-decompression').addEventListener('click', () => {
        history.pushState(null, null, Router.routePathnames.DECOMPRESSION);
        Decompression.decompressionPage();
    })
}