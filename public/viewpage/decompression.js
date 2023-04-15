import * as Decompressor from '../controller/decompressor.js';
import * as Utility from '../controller/utility.js';

import * as Element from './element.js';

export function decompressionPage() {
    Element.navbarHome.style = '';

    let html;

    html = `
        <div style="align-items: center; display:flex; flex-wrap:wrap; height: 85vh; max-width:90vw; min-width:70vw; justify-content:center;">
            <div style="padding: 5vh 5vw;">
                <h1>Decompression</h1>
                <form id="form-decompress" method="post">
                    <input id="file-upload" type="file" style="display: none" />
                    <div style="padding-bottom:5vh">
                        <textarea id="textarea-input" name="input" placeholder="Upload a compressed file for decompression" cols="50" rows="10" readonly></textarea>
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

    let tree, numberOfBits, bytes;

    document.getElementById('file-upload').onchange = e => {
        let file = e.target.files[0];
        var reader = new FileReader();

        reader.readAsArrayBuffer(file);
        reader.onload = readerEvent => {
            let text = new Uint8Array(readerEvent.target.result);
            let string = "";
            for (let i = 0; i < text.length; i++) {
                if (tree === undefined || tree === null) {
                    let currentChar = String.fromCharCode(text[i]);
                    if (currentChar === '\n' && String.fromCharCode(text[i + 1]) === '\n'){
                        tree = string;
                        string = "";
                        i++;
                    }
                    else string += String.fromCharCode(text[i]);
                }
                else if (numberOfBits === undefined || numberOfBits === null) {
                    let currentChar = String.fromCharCode(text[i]);
                    if (currentChar === '\n' && String.fromCharCode(text[i + 1]) === '\n'){
                        numberOfBits = Number(string);
                        i++;
                    }
                    else string += String.fromCharCode(text[i]);
                }
                else {
                    bytes = text.subarray(i);
                    break;
                }
            }
            document.getElementById('textarea-input').value = new TextDecoder().decode(text);
        }

    };

    document.getElementById('button-upload').addEventListener('click', function() {
        document.getElementById('file-upload').click();
    });

    document.getElementById('form-decompress').addEventListener('submit', async e => {
        e.preventDefault();
        decompressionProgressPage();
        const data = await Decompressor.decompress({
            tree: tree,
            numberOfBits: numberOfBits,
            bytes: bytes,
        });
        postDecompressionPage(data);
    });
}

function decompressionProgressPage() {
    let html = `
        <div style="align-items:center; display:flex; flex-direction:column; height:85vh; justify-content:center;">
            <div class="row">
                <h1 id="decompression-status"></h1>
            </div>
            <div class="row">
                <div class="lds-dual-ring"></div>
            </div>
        </div>
    `;
    Element.root.innerHTML = html;
}

function postDecompressionPage(data) {
    let html = `
        <div style="align-items:center; display:flex; flex-wrap:wrap; height:85vh; justify-content:center; max-width:90vw; min-width:70vw;">
            <div style="padding: 5vh 5vw">
                <h1>Decompression complete!</h1>
                <h2>
                   ${Utility.percentage(data.input.length * 8, data.text.length * 8)} from ${Utility.fileSize(data.input.length * 8)} to ${Utility.fileSize(data.text.length * 8)}
                </h2>
                <div style="padding-bottom: 10px;">
                    <hr class="rounded">
                </div>
                <form id="form-download-decompressed-file" method="get">
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
    document.getElementById('form-download-decompressed-file').addEventListener('submit', async e => {
        e.preventDefault();
        const filename = e.target.filename.value;
        let error = Utility.validateFilename(filename);
        console.log(error);
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