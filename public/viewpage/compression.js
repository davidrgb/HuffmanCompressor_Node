import * as Compressor from '../controller/compressor.js';
import * as Utility from '../controller/utility.js';

import * as Constant from '../model/constant.js';

import * as Element from './element.js';

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

    document.getElementById('file-upload').onchange = async e => {
        await Utility.fadeOut();
        document.getElementById('input-error').style = 'display: none';
        document.getElementById('div-page').style = 'display: none';
        document.getElementById('div-uploading').style = 'display: block';
        await Utility.fadeIn();
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
    let encoder = new TextEncoder();
    let inputSize = encoder.encode(data.text).length * 8;
    let outputSize = (encoder.encode(data.tree).length + `\n\n${data.numberOfBits}`.length + data.bytes.length) * 8;
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

    document.getElementById('div-post-compression').appendChild(await buildSideBySide(data.text, data.head));

    await Utility.fadeIn();
    
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

async function buildSideBySide(text, head) {
    let outerDiv = document.createElement('div');
    outerDiv.id = 'div-side-by-side';
    outerDiv.style = 'align-items: center; display: flex; flex-direction: column; gap: 5vh; justify-content: center; max-width: 90vw; padding-top: 5vh;';
    outerDiv.className = 'third-fade';
    let mainDiv = document.createElement('div');
    mainDiv.style = 'align-items: center; display: flex; flex-direction: row; flex-wrap: wrap; gap: 5vw; justify-content: center;';
    let textDiv = document.createElement('div-text');
    textDiv.style = 'border: 2px solid white; border-radius: 5px; font-size: 1.25rem; font-weight: bold; padding: 5px; overflow-x: hidden; overflow-y: scroll;';
    textDiv.className = 'side-by-side';
    let codeDiv = document.createElement('div-code');
    codeDiv.style = 'border: 2px solid white; border-radius: 5px; display: flex; flex-direction: row; flex-wrap: wrap; font-size: 1.25rem; font-weight: bold; padding: 5px;overflow-x: hidden; overflow-y: scroll;';
    codeDiv.className = 'side-by-side';
    let navigationDiv = document.createElement('div');
    navigationDiv.style = 'align-items: center; display: flex; flex-direction: row; gap: 2rem; justify-content: center;';
    await buildSideBySidePage(mainDiv, textDiv, codeDiv, navigationDiv, text, head, 1);
    mainDiv.appendChild(textDiv);
    mainDiv.appendChild(codeDiv);
    outerDiv.appendChild(mainDiv);
    outerDiv.appendChild(navigationDiv);
    return outerDiv;
}

async function buildSideBySidePage(mainDiv, textDiv, codeDiv, navigationDiv, text, head, page) {
    textDiv.innerHTML = "";
    codeDiv.innerHTML = "";
    navigationDiv.innerHTML = "";
    let start = Constant.CHARACTERS_PER_PAGE * (page - 1);
    let end = text.length < Constant.CHARACTERS_PER_PAGE * page ? text.length : Constant.CHARACTERS_PER_PAGE * page;
    for (let i = start; i < end; i++) {
        let character = text[i];
        let characterDiv = document.createElement('div');
        characterDiv.className = `character-div character-${i}`;
        characterDiv.innerHTML = character;
        textDiv.appendChild(characterDiv);
        characterDiv.addEventListener('mouseover', (e) => {
            mainDiv.querySelectorAll(`.character-${i}`).forEach((classDiv) => {
                classDiv.animate(
                    [
                        {
                            backgroundColor: '#242424',
                            color: 'white',
                        },
                        {
                            backgroundColor: 'white',
                            color: '#242424',
                        }
                    ],
                    {
                        duration: 250,
                        fill: 'forwards',
                    }
                );
            });   
        });
        characterDiv.addEventListener('mouseleave', (e) => {
            mainDiv.querySelectorAll(`.character-${i}`).forEach((classDiv) => {
                classDiv.animate(
                    [
                        {
                            backgroundColor: 'white',
                            color: '#242424',
                        },
                        {
                            backgroundColor: '#242424',
                            color: 'white',
                        }
                    ],
                    {
                        duration: 250,
                        fill: 'forwards',
                    }
                );
            }); 
        });
        characterDiv.addEventListener('click', (e) => {
            codeDiv.querySelector(`.character-${i}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        let characterCodeDiv = document.createElement('div');
        characterCodeDiv.className = `character-div character-${i}`;
        characterCodeDiv.innerHTML = head.getCode(character, '');
        codeDiv.appendChild(characterCodeDiv);
        characterCodeDiv.addEventListener('mouseover', (e) => {
            mainDiv.querySelectorAll(`.character-${i}`).forEach((classDiv) => {
                classDiv.animate(
                    [
                        {
                            backgroundColor: '#242424',
                            color: 'white',
                        },
                        {
                            backgroundColor: 'white',
                            color: '#242424',
                        }
                    ],
                    {
                        duration: 250,
                        fill: 'forwards',
                    }
                );
            });
        });
        characterCodeDiv.addEventListener('mouseleave', (e) => {
            mainDiv.querySelectorAll(`.character-${i}`).forEach((classDiv) => {
                classDiv.animate(
                    [
                        {
                            backgroundColor: 'white',
                            color: '#242424',
                        },
                        {
                            backgroundColor: '#242424',
                            color: 'white',
                        }
                    ],
                    {
                        duration: 250,
                        fill: 'forwards',
                    }
                );
            }); 
        });
        characterCodeDiv.addEventListener('click', (e) => {
            textDiv.querySelector(`.character-${i}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
    let previousButton = document.createElement('button');
    previousButton.innerHTML = 'Prev';
    if (page === 1) previousButton.disabled = true;
    else {
        previousButton.disabled = false;
        previousButton.addEventListener('click', async () => {
            await buildSideBySidePage(mainDiv, textDiv, codeDiv, navigationDiv, text, head, page - 1);
        });
    }
    if (text.length > Constant.CHARACTERS_PER_PAGE) {
        navigationDiv.appendChild(previousButton);
        let pageNumber = document.createElement('div');
        pageNumber.style = 'display: inline; font-size: 2rem; font-weight: bold;';
        pageNumber.innerHTML = page;
        navigationDiv.appendChild(pageNumber);
        let nextButton = document.createElement('button');
        nextButton.innerHTML = 'Next';
        if (text.length <= Constant.CHARACTERS_PER_PAGE * page) nextButton.disabled = true;
        else {
            nextButton.disabled = false;
            nextButton.addEventListener('click', async () => {
                await buildSideBySidePage(mainDiv, textDiv, codeDiv, navigationDiv, text, head, page + 1);
            });
        }
        navigationDiv.appendChild(nextButton);
    }
}