import * as Router from '../controller/route.js';

import * as Element from './element.js';
import * as Compression from './compression.js';
import * as Decompression from './decompression.js';

export function homePage() {
    let html;

    html = `
        <div style="align-items: center; display: flex; flex-direction: column; height: 100vh; justify-content: center; max-width:90vw;">
            <div style="padding: 5vh 5vw;">
                <h1>Huffman Compressor</h1>
                <div style="font-size: 1.5rem; font-weight:bold; padding: 0 0 5vh 0;">This is a website that uses Huffman coding to compress and decompress text files,
                <br>built with Node.js.</div>
                    <div style="display:flex; justify-content: space-around;">
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
    });
}