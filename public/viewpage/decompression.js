import * as Decompressor from '../controller/decompressor.js';
import * as Utility from '../controller/utility.js';

import * as Element from './element.js';

export async function decompressionPage() {
    let html;

    html = `
        <div id="div-page">
            <div style="align-items: center; display:flex; flex-wrap:wrap; height: 100vh; max-width:90vw; min-width:70vw; justify-content:center;">
                <div style="padding: 5vh 5vw;">
                    <h1 class="first-fade">Decompression</h1>
                    <form id="form-decompress" class="second-fade" method="post">
                        <input id="file-upload" type="file" style="display: none" />
                        <div style="align-items: center; display: flex; flex-direction: column; gap: 10px; padding-bottom:5vh">
                            <textarea id="textarea-input" name="input" placeholder="Upload a compressed file for decompression" cols="50" rows="10" readonly></textarea>
                            <div id="input-error" style="display:none"></div>
                        </div>
                        <br>
                        <div style="display:flex; justify-content: space-around; width:100%;">
                            <button id="button-upload" type="button">Upload</button>
                            <button id="button-submit" type="submit">Decompress</button>
                        </div>
                    </form>
                </div>
                <div class="description third-fade" style="font-size:1.5rem; font-weight: bold; padding: 5vh 5vw;">
                    <hr class="rounded">
                    To decompress a file that has been compressed using Huffman codes, the Huffman tree must be reconstructed.
                    Using the compressed bit string, the tree is traversed from the head such that every 0 leads to the next left node
                    and every 1 to the next right. Once a character, or leaf, node is reached, we have decompressed a single character
                    and can begin again at the head until the bit string has been fully decompressed.
                    <hr class="rounded">
                </div>
            </div>
        </div>
        <div id="div-uploading" style="display: none">
            <div style="align-items:center; display:flex; flex-direction:column; height:100vh; justify-content:center;">
                <div class="row first-fade">
                    <h1>Uploading</h1>
                </div>
                <div class="row second-fade">
                    <h2>This may take a moment</h2>
                </div>
                <div class="row third-fade">
                    <div class="lds-dual-ring"></div>
                </div>
            </div>
        </div>
    `;

    Element.root.innerHTML = html;

    await Utility.fadeIn();

    let tree, numberOfBits, bytes;

    document.getElementById('file-upload').onchange = async e => {
        await Utility.fadeOut();
        document.getElementById('input-error').style = 'display: none';
        document.getElementById('div-page').style = 'display: none';
        document.getElementById('div-uploading').style = 'display: block';
        await Utility.fadeIn();

        let file = e.target.files[0];
        var reader = new FileReader();

        reader.readAsArrayBuffer(file);
        reader.onload = async readerEvent => {
            let utf8text = new Uint8Array(readerEvent.target.result);                   // Get full content of compressed file as byte array to preserve character encoding
            let encoder = new TextEncoder();                                            // Create an encoder to convert strings to UTF-8 byte arrays
            let decoder = new TextDecoder();                                            // Create a decoder to convert UTF-8 byte arrays to strings
            let text = decoder.decode(utf8text);                                        // Decode full UTF-8 byte array of compressed file to a string
            let sections = text.split('\n\n');                                          // Split the string into the tree, numberOfBits, and bytes sections
            tree = sections[0];                                                         // Assign the tree section string
            numberOfBits = Number(sections[1]);                                         // Convert and assign the numberOfBits section string
            let index = encoder.encode(tree).length + encoder.encode('\n\n').length     // Calculate the index of the beginning of the bytes section in the
                        + encoder.encode(numberOfBits.toString()).length                // original UTF-8 byte array by encoding the tree and numberOfBits sections
                        + encoder.encode('\n\n').length;                                // as well as the newline separators.
            bytes = utf8text.subarray(index);                                           // Assign the subarray of UTF-8 bytes (these bytes cannot be decoded before decompression since some integers are not represented by characters)
            document.getElementById('textarea-input').value = text;                     // Set the value of the textarea to the fully decoded UTF-8 bytes
            document.getElementById('button-submit').click();
        }
    };

    document.getElementById('button-upload').addEventListener('click', function() {
        document.getElementById('file-upload').click();
    });

    document.getElementById('form-decompress').addEventListener('submit', async e => {
        e.preventDefault();
        const text = e.target.input.value;
        if (text === null || text.length == 0) {
            let filenameErrorElement = document.getElementById('input-error');
            filenameErrorElement.style = 'color:red; display:inline; font-weight:bold;';
            filenameErrorElement.innerHTML = 'Input required';
            return;
        }
        await Utility.fadeOut();
        await decompressionProgressPage();
        const data = await Decompressor.decompress({
            tree: tree,
            numberOfBits: numberOfBits,
            bytes: bytes,
        });
        await Utility.fadeOut();
        await postDecompressionPage(data);
    });
}

async function decompressionProgressPage() {
    let html = `
        <div style="align-items:center; display:flex; flex-direction:column; height:100vh; justify-content:center;">
            <div class="row first-fade" style="padding: 5vh 5vw">
                <h1 id="decompression-status">Starting decompressor</h1>
            </div>
            <div class="row second-fade" style="padding: 5vh 5vw">
                <div class="lds-dual-ring"></div>
            </div>
        </div>
    `;
    Element.root.innerHTML = html;
    await Utility.fadeIn();
}

async function postDecompressionPage(data) {
    let html = `
        <div style="align-items:center; display:flex; flex-wrap:wrap; height:100vh; justify-content:center; max-width:90vw; min-width:70vw;">
            <div style="padding: 5vh 5vw">
                <h1 class="first-fade">Decompression complete!</h1>
                <h2 class="second-fade">
                   ${Utility.percentage(data.input.length * 8, data.text.length * 8)} from ${Utility.fileSize(data.input.length * 8)} to ${Utility.fileSize(data.text.length * 8)}
                </h2>
                <div class="second-fade" style="padding-bottom: 10px;">
                    <hr class="rounded">
                </div>
                <form id="form-download-decompressed-file" class="third-fade" method="get">
                    <div style="align-items:center; display:flex; flex-wrap:wrap; gap:5vw; justify-content:space-around; width:100%;">
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            <input type="text" name="filename" placeholder="Filename for download" style="height:100%; padding:5px;">
                            <div id="filename-error" style="display:none"></div>
                        </div>
                        <button type="submit">Download</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    Element.root.innerHTML = html;
    await Utility.fadeIn();

    document.getElementById('form-download-decompressed-file').addEventListener('submit', async e => {
        e.preventDefault();
        const filename = e.target.filename.value;
        let error = Utility.validateFilename(filename);
        if (error != null) {
            let filenameErrorElement = document.getElementById('filename-error');
            filenameErrorElement.style = 'color:red; display:inline; font-weight:bold;';
            filenameErrorElement.innerHTML = error;
        }
        else {
            document.getElementById('filename-error').style = 'display:none';
            await Decompressor.createAndDownloadFile(data, filename);
        }
    });
}