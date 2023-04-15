import * as Compressor from '../controller/compressor.js';
import * as Router from '../controller/route.js';
import * as Utility from '../controller/utility.js';

import * as Element from './element.js';

export function compressionPage() {
    let html = `
        <div style="align-items: center; display:flex; flex-wrap:wrap; height:100vh; max-width:90vw; min-width:70vw; justify-content:center;">
            <div style="padding: 5vh 5vw;">
                <h1>Compression</h1>
                <form id="form-compress" method="post">
                    <div style="padding-bottom:5vh">
                        <textarea id="textarea-input" name="input" placeholder="Upload a text file or enter text for compression here" cols="50" rows="10" autofocus required></textarea>
                    </div>
                    <br>
                    <div style="display:flex; justify-content: space-around; width:100%;">
                        <button type="button" id="button-upload">Upload</button>
                        <button type="submit">Compress</button>
                    </div>
                </form>
            </div>
            <div style="font-size:1.5rem; font-weight: bold; padding: 5vh 5vw; max-width:40vw; min-width: 30vw;">
                <hr class="rounded">
                Huffman codes are the most efficient method of compressing individual characters, 
                allowing encoded characters to take up as little as 1 bit. To achieve this, each
                character present in the initial text is assigned a unique bit string. If a character
                appears frequently, it is assigned a shorter bit string, ultimately resulting in an
                inverse relation between character frequency and encoded size.
                <hr class="rounded">
            </div>
        </div>
    `;

    Element.root.innerHTML = html;

    document.getElementById('form-compress').addEventListener('submit', async e => {
        e.preventDefault();
        const text = e.target.input.value;
        compressionProgressPage();
        const data = await Compressor.compress(text);
        postCompressionPage(data);
    });
}

function compressionProgressPage() {
    let html = `
        <div style="align-items:center; display:flex; flex-direction:column; height:100vh; justify-content:center;">
            <div class="row">
                <h1 id="compression-status"></h1>
            </div>
            <div class="row">
                <div class="lds-dual-ring"></div>
            </div>
        </div>
    `;
    Element.root.innerHTML = html;
}

function postCompressionPage(data) {
    let html = `
        <div style="align-items:center; display:flex; flex-wrap:wrap; height:100vh; justify-content:center; max-width:90vw; min-width:70vw;">
            <div style="padding: 5vh 5vw">
                <h1>Compression complete!</h1>
                <form id="form-download-compressed-file" method="get">
                    <div style="align-items:center; display:flex; flex-wrap:wrap; gap:5vw; justify-content:space-around; width:100%;">
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            <input type="text" name="filename" placeholder="Filename for download" style="height:100%; padding:5px;" required>
                            <div id="filename-error" style="display:none"></div>
                        </div>
                        <button type="submit">Download</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    Element.root.innerHTML = html;
    document.getElementById('form-download-compressed-file').addEventListener('submit', async e => {
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
            await Compressor.createAndDownloadFile(data, filename);
        }
    });
}