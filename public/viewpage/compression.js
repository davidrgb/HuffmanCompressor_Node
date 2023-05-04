import * as Compressor from '../controller/compressor.js';
import * as Utility from '../controller/utility.js';

import * as Element from './element.js';
import * as SideBySide from './sideBySide.js';

export async function compressionPage() {
    let html = `
        <div id="div-page">
            <div style="align-items: center; display:flex; flex-wrap:wrap; height:100vh; max-width:90vw; min-width:70vw; justify-content:center;">
                <div style="padding: 5vh 5vw;">
                    <h1 class="first-fade">Compression</h1>
                    <form id="form-compress" class="second-fade" method="post">
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
                <div class="description third-fade" style="font-size:1.5rem; font-weight: bold; padding: 5vh 5vw;">
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

    const fileUpload = document.getElementById('file-upload');
    fileUpload.onchange = async e => {
        await Utility.fadeOut();

        const inputErrorElement = document.getElementById('input-error');
        inputErrorElement.style = 'display: none';
        const pageDiv = document.getElementById('div-page');
        pageDiv.style = 'display: none';
        const uploadingDiv = document.getElementById('div-uploading');
        uploadingDiv.style = 'display: block';

        await Utility.fadeIn();

        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = readerEvent => {
            const inputTextArea = document.getElementById('textarea-input');
            inputTextArea.value = readerEvent.target.result;
            const submitButton = document.getElementById('button-submit');
            submitButton.click();
        }    
    }

    const uploadButton = document.getElementById('button-upload');
    uploadButton.addEventListener('click', async () => {
        const label = await Utility.disableButton(uploadButton);

        document.getElementById('file-upload').click();
        await Utility.sleep(50);

        await Utility.enableButton(uploadButton, label);
    });

    const compressForm = document.getElementById('form-compress');
    compressForm.addEventListener('submit', async e => {
        e.preventDefault();

        const submitButton = document.getElementById('button-submit');
        const label = await Utility.disableButton(submitButton);

        const text = e.target.input.value;
        if (text === null || text.length == 0) {
            const filenameErrorElement = document.getElementById('input-error');
            filenameErrorElement.style = 'color:red; display:inline; font-weight:bold;';
            filenameErrorElement.innerHTML = 'Input required';
            await Utility.enableButton(submitButton, label);
            return;
        }

        await Utility.fadeOut();

        await compressionProgressPage();
        const data = await Compressor.compress(text);

        await Utility.fadeOut();

        await postCompressionPage(data);
    });
}

async function compressionProgressPage() {
    let html = `
        <div style="align-items:center; display:flex; flex-direction:column; height:100vh; justify-content:center;">
            <div class="row first-fade" style="padding: 5vh 5vw">
                <h1 id="compression-status">Starting compressor</h1>
            </div>
            <div class="row second-fade" style="padding: 5vh 5vw">
                <div class="lds-dual-ring"></div>
            </div>
        </div>
    `;

    Element.root.innerHTML = html;
    
    await Utility.fadeIn();
}

async function postCompressionPage(data) {
    const encoder = new TextEncoder();
    const inputSize = encoder.encode(data.text).length * 8;
    const outputSize = (encoder.encode(data.tree).length + `\n\n${data.numberOfBits}`.length + data.bytes.length) * 8;

    let html = `
        <div style="align-items:center; display:flex; flex-wrap:wrap; height:100vh; justify-content:center; max-width:90vw; min-width:70vw;">
            <div id="div-post-compression"  style="padding: 5vh 5vw">
                <h1 class="first-fade">Compression complete!</h1>
                <h2 class="second-fade">
                   ${Utility.percentage(inputSize, outputSize)} from ${Utility.fileSize(inputSize)} to ${Utility.fileSize(outputSize)}
                </h2>
                <div class="second-fade" style="padding-bottom: 10px;">
                    <hr class="rounded">
                </div>
                <form id="form-download-compressed-file" class="second-fade" method="get">
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

    const postCompressionDiv = document.getElementById('div-post-compression');
    postCompressionDiv.appendChild(await SideBySide.buildSideBySide(data.text, data.head));

    await Utility.fadeIn();
    
    const downloadCompressedFileForm = document.getElementById('form-download-compressed-file');
    downloadCompressedFileForm.addEventListener('submit', async e => {
        e.preventDefault();

        const filename = e.target.filename.value;
        const error = Utility.validateFilename(filename);
        const filenameErrorElement = document.getElementById('filename-error');
        if (error != null) {
            filenameErrorElement.style = 'color:red; display:inline; font-weight:bold;';
            filenameErrorElement.innerHTML = error;
        }
        else {
            filenameErrorElement.style = 'display:none';

            await Compressor.createAndDownloadFile(data, filename);
        }
    });
}