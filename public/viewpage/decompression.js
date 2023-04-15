import * as Element from './element.js';

export function decompressionPage() {
    Element.navbarHome.style = '';

    let html;

    html = `
        <div style="align-items: center; display:flex; flex-wrap:wrap; max-width:90vw; min-width:70vw; justify-content:center;">
            <div style="padding: 5vh 5vw;">
                <h1>Decompression</h1>
                <form id="form-decompress" method="post">
                    <div style="padding-bottom:5vh">
                        <textarea id="textarea-input" name="input" placeholder="Upload a compressed file or enter text for decompression here" cols="50" rows="10" autofocus required></textarea>
                    </div>
                    <br>
                    <div style="display:flex; justify-content: space-around; width:100%;">
                        <button type="button" id="button-upload">Upload</button>
                        <button type="submit">Decompress</button>
                    </div>
                </form>
            </div>
            <div style="font-size:1.5rem; font-weight: bold; padding: 5vh 5vw; max-width:40vw; min-width: 30vw;">
                <hr class="rounded">
                To decompress a file that has been compressed using Huffman codes, the Huffman tree must be reconstructed.
                Using the compressed bit string, the tree is traversed from the head such that every 0 leads to the next left node
                and every 1 to the next right. Once a character, or leaf, node is reached, we have decompressed a single character
                and can begin again at the head until the bit string has been fully decompressed.
                <hr class="rounded">
            </div>
        </div>
    `;

    Element.root.innerHTML = html;

    document.getElementById('form-decompress').addEventListener('submit', e => {
        e.preventDefault();
        const text = e.target.input.value;
        // Show spinner
        Element.root.innerHTML = `<div style="align-items:center; display:flex; justify-content:center; min-height: 65vh;"><div class="lds-dual-ring"></div></div>`
    });
}