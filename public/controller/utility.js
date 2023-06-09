import * as Constant from '../model/constant.js';

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function validateFilename(filename) {
    if (filename == undefined || filename == null || filename.length == 0) return `Filename required`;
    let invalidCharacters = ['/', '\\', ':', '?', '<', '>', '|'];
    for (let i = 0; i < invalidCharacters.length; i++) if(filename.indexOf(invalidCharacters[i]) > -1) return `Filename cannot include ${invalidCharacters[i]}`;
    let indexOfDot = filename.indexOf('.');
    if (indexOfDot == 0) return 'Filename must include name prefix, cannot begin with dot';
    else if (indexOfDot == -1 || filename.substring(indexOfDot).length == 1) return 'Filename must include filetype suffix';
    else return null;
}

export function percentage(inputBits, outputBits) {
    if (outputBits < inputBits) return `Reduction of ${Number((1 - (outputBits / inputBits)) * 100).toFixed(1)}%`;
    else return `Expansion of ${Number(((outputBits / inputBits) - 1) * 100).toFixed(1)}%`;
}

export function fileSize(bits) {
    if (bits > 8000000) return `${Number(bits / 8000000).toFixed(2)} megabytes`;
    else if (bits > 8000) return `${Number(bits / 8000).toFixed(1)} kilobytes`;
    else return `${Number(bits / 8).toFixed(1)} bytes`;
}

export async function fadeIn() {
    let firstFade = document.querySelectorAll('.first-fade');
    if (firstFade !== undefined && firstFade !== null) {
        firstFade.forEach((element) => {
            element.animate(
                [
                    { opacity: '0', easing: 'ease-in' },
                    { opacity: '1' },
                ],
                {
                    duration: 250,
                    fill: 'forwards',
                }
            );
        });
    }

    let secondFade = document.querySelectorAll('.second-fade');
    if (secondFade !== undefined && secondFade !== null) {
        secondFade.forEach((element) => {
            element.animate(
                [
                    { opacity: '0' },
                    { opacity: '1' },
                ],
                {
                    duration: 250,
                    delay: 250,
                    fill: 'forwards',
                }
            );
        });
    }

    let thirdFade = document.querySelectorAll('.third-fade');
    if (thirdFade !== undefined && thirdFade !== null) {
        thirdFade.forEach((element) => {
            element.animate(
                [
                    { opacity: '0' },
                    { opacity: '1' },
                ],
                {
                    duration: 250,
                    delay: 500,
                    fill: 'forwards',
                }
            );
        })
    }
    
    await sleep(1000);
}

export async function fadeOut() {
    let thirdFade = document.querySelectorAll('.third-fade');
    if (thirdFade !== undefined && thirdFade !== null) {
        thirdFade.forEach((element) => {
            element.animate(
                [
                    { opacity: '1' },
                    { opacity: '0' },
                ],
                {
                    duration: 250,
                    fill: 'forwards',
                }
            );
        });
    }

    let secondFade = document.querySelectorAll('.second-fade');
    if (secondFade !== undefined && secondFade !== null) {
        secondFade.forEach((element) => {
            element.animate(
                [
                    { opacity: '1' },
                    { opacity: '0' },
                ],
                {
                    duration: 250,
                    delay: 250,
                    fill: 'forwards',
                }
            );
        });
    }
    

    let firstFade = document.querySelectorAll('.first-fade');
    if (firstFade !== undefined && secondFade !== null) {
        firstFade.forEach((element) => {
            element.animate(
                [
                    { opacity: '1' },
                    { opacity: '0' },
                ],
                {
                    duration: 250,
                    delay: 500,
                    fill: 'forwards',
                }
            );
        });
    }
    
    await sleep(1000);
}

export function displayCharacter(character) {
    let code = character.charCodeAt(0);
    switch (code) {
        case 9:
            return 'HT';
        case 10:
            return 'LF';
        case 13:
            return 'CR';
        case 32:
            return 'SP';
        case 160:
            return 'NB';
        case 173:
            return 'SH';
        default:
            return character;
    }
}

export async function disableButton(button) {
    let label = button.innerHTML;
    button.disabled = true;
    button.innerHTML = Constant.WORKING_BUTTON_LABEL;
    await sleep(10);
    return label;
}

export async function enableButton(button, label) {
    button.innerHTML = label;
    button.disabled = false;
    await sleep(10);
}