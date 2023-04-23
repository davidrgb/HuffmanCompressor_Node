import * as Compressor from '../controller/compressor.js';
import * as Utility from '../controller/utility.js';

import * as Element from './element.js';

export function compressionPage() {
    let html = `
        <div id="div-page">
            <div style="align-items: center; display:flex; flex-wrap:wrap; height:100vh; max-width:90vw; min-width:70vw; justify-content:center;">
                <div style="padding: 5vh 5vw;">
                    <h1>Compression</h1>
                    <form id="form-compress" method="post">
                        <input id="file-upload" type="file" style="display: none" />
                        <div style="align-items: center; display: flex; flex-direction: column; gap: 10px; padding-bottom:5vh">
                            <textarea id="textarea-input" name="input" placeholder="Upload a text file or enter text for compression here" cols="50" rows="10"></textarea>
                            <div id="input-error" style="display:none"></div>
                        </div>
                        <br>
                        <div style="display:flex; justify-content: space-around; width:100%;">
                            <button id="button-upload" type="button">Upload</button>
                            <button id="button-submit" type="submit">Compress</button>
                        </div>
                    </form>
                </div>
                <div class="description" style="font-size:1.5rem; font-weight: bold; padding: 5vh 5vw;">
                    <hr class="rounded">
                    Huffman codes are the most efficient method of compressing individual characters, 
                    allowing encoded characters to take up as little as 1 bit. To achieve this, each
                    character present in the initial text is assigned a unique bit string. If a character
                    appears frequently, it is assigned a shorter bit string, ultimately resulting in an
                    inverse relation between character frequency and encoded size.
                    <hr class="rounded">
                </div>
            </div>
        </div>
        <div id="div-uploading" style="display: none">
            <div style="align-items:center; display:flex; flex-direction:column; height:100vh; justify-content:center;">
                <div class="row">
                    <h1>Uploading</h1>
                </div>
                <div class="row">
                    <h2>This may take a moment</h2>
                </div>
                <div class="row">
                    <div class="lds-dual-ring"></div>
                </div>
            </div>
        </div>
    `;

    Element.root.innerHTML = html;

    document.getElementById('file-upload').onchange = async e => {
        document.getElementById('input-error').style = 'display: none';
        document.getElementById('div-page').style = 'display: none';
        document.getElementById('div-uploading').style = 'display: block';
        await Utility.sleep(50);
        let file = e.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = async readerEvent => {
            document.getElementById('textarea-input').value = readerEvent.target.result;
            document.getElementById('button-submit').click();
        }
        
    }

    document.getElementById('button-upload').addEventListener('click', function() {
        document.getElementById('file-upload').click();
    });

    document.getElementById('form-compress').addEventListener('submit', async e => {
        e.preventDefault();
        const text = e.target.input.value;
        if (text === null || text.length == 0) {
            let filenameErrorElement = document.getElementById('input-error');
            filenameErrorElement.style = 'color:red; display:inline; font-weight:bold;';
            filenameErrorElement.innerHTML = 'Input required';
            return;
        }
        compressionProgressPage();
        const data = await Compressor.compress(text);
        postCompressionPage(data);
    });
}

function compressionProgressPage() {
    let html = `
        <div style="align-items:center; display:flex; flex-direction:column; height:100vh; justify-content:center;">
            <div class="row" style="padding: 5vh 5vw">
                <h1 id="compression-status"></h1>
            </div>
            <div class="row" style="padding: 5vh 5vw">
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
                <h2>
                   ${Utility.percentage(data.text.length * 8, data.tree.length * 8 + data.numberOfBits.toString().length * 8 + data.numberOfBits + 32)} from ${Utility.fileSize(data.text.length * 8)} to ${Utility.fileSize(data.tree.length * 8 + data.numberOfBits.toString().length * 8 + data.numberOfBits + 32)}
                </h2>
                <div style="padding-bottom: 10px;">
                    <hr class="rounded">
                </div>
                <form id="form-download-compressed-file" method="get">
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
    document.getElementById('form-download-compressed-file').addEventListener('submit', async e => {
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
            await Compressor.createAndDownloadFile(data, filename);
        }
    });
}