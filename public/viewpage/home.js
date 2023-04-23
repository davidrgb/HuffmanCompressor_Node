import * as Router from '../controller/route.js';
import * as Utility from '../controller/utility.js';

import * as Element from './element.js';
import * as Compression from './compression.js';
import * as Decompression from './decompression.js';

export async function homePage() {
    let html;

    html = `
        <div style="align-items: center; display: flex; flex-direction: column; height: 100vh; justify-content: center; max-width:90vw;">
            <div style="padding: 5vh 5vw;">
                <h1 class="first-fade">Huffman Compressor</h1>
                <div class="second-fade" style="font-size: 1.5rem; font-weight:bold; padding: 0 0 5vh 0;">
                    This is a website that uses Huffman coding to compress and decompress text files,
                    <br>built with JavaScript and served using Express.
                </div>
                <div class="third-fade" style="display:flex; justify-content: space-around;">
                    <button id='button-open-compression'>Compress</button>
                    <button id='button-open-decompression'>Decompress</button>
                </div>
            </div>
        </div>
    `;

    Element.root.innerHTML = html;

    await Utility.fadeIn();

    document.getElementById('button-open-compression').addEventListener('click', async () => {
        history.pushState(null, null, Router.routePathnames.COMPRESSION);
        await Utility.fadeOut();
        await Compression.compressionPage();
    });

    document.getElementById('button-open-decompression').addEventListener('click', async () => {
        history.pushState(null, null, Router.routePathnames.DECOMPRESSION);
        await Utility.fadeOut();
        await Decompression.decompressionPage();
    });
}