import * as Utility from '../controller/utility.js';

import * as Constant from '../model/constant.js';

export async function buildSideBySide(text, head) {
    const outerDiv = document.createElement('div');
    outerDiv.id = 'div-side-by-side';
    outerDiv.style = 'align-items: center; display: flex; flex-direction: column; gap: 5vh; justify-content: center; max-width: 90vw; padding-top: 5vh;';
    outerDiv.className = 'third-fade';

    const mainDiv = document.createElement('div');
    mainDiv.style = 'align-items: center; display: flex; flex-direction: row; gap: 5vw; justify-content: center;';

    const textDiv = document.createElement('div-text');
    textDiv.style = 'border: 2px solid white; border-radius: 5px; font-size: 1.25rem; font-weight: bold; padding: 5px; overflow-x: hidden; overflow-y: scroll;';
    textDiv.className = 'side-by-side';

    const codeDiv = document.createElement('div-code');
    codeDiv.style = 'align-content: start; border: 2px solid white; border-radius: 5px; display: flex; flex-direction: row; flex-wrap: wrap; font-size: 1.25rem; font-weight: bold; padding: 5px; overflow-x: hidden; overflow-y: scroll;';
    codeDiv.className = 'side-by-side';

    const navigationDiv = document.createElement('div');
    navigationDiv.style = 'align-items: center; display: flex; flex-direction: row; gap: 2rem; justify-content: center;';

    await buildSideBySidePage(mainDiv, textDiv, codeDiv, navigationDiv, text, head, 1);

    mainDiv.appendChild(textDiv);
    mainDiv.appendChild(codeDiv);

    outerDiv.appendChild(mainDiv);
    outerDiv.appendChild(navigationDiv);

    return outerDiv;
}

export async function buildSideBySidePage(mainDiv, textDiv, codeDiv, navigationDiv, text, head, page) {
    textDiv.innerHTML = "";
    codeDiv.innerHTML = "";
    navigationDiv.innerHTML = "";

    const start = Constant.CHARACTERS_PER_PAGE * (page - 1);
    const end = text.length < Constant.CHARACTERS_PER_PAGE * page ? text.length : Constant.CHARACTERS_PER_PAGE * page;

    for (let i = start; i < end; i++) {
        const character = text[i];
        const characterDiv = document.createElement('div');
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

        const characterCodeDiv = document.createElement('div');
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

    if (text.length > Constant.CHARACTERS_PER_PAGE) {
        const previousButton = document.createElement('button');
        previousButton.innerHTML = 'Prev';
        if (page === 1) previousButton.disabled = true;
        else {
            previousButton.disabled = false;
            previousButton.addEventListener('click', async () => {
                let label = await Utility.disableButton(previousButton);
                await buildSideBySidePage(mainDiv, textDiv, codeDiv, navigationDiv, text, head, page - 1);
                await Utility.enableButton(previousButton, label);
            });
        }
        navigationDiv.appendChild(previousButton);

        const pageNumberElement = document.createElement('div');
        pageNumberElement.style = 'display: inline; font-size: 2rem; font-weight: bold;';
        pageNumberElement.innerHTML = page;
        navigationDiv.appendChild(pageNumberElement);

        const nextButton = document.createElement('button');
        nextButton.innerHTML = 'Next';
        if (text.length <= Constant.CHARACTERS_PER_PAGE * page) nextButton.disabled = true;
        else {
            nextButton.disabled = false;
            nextButton.addEventListener('click', async () => {
                let label = await Utility.disableButton(nextButton);
                await buildSideBySidePage(mainDiv, textDiv, codeDiv, navigationDiv, text, head, page + 1);
                await Utility.enableButton(nextButton, label);
            });
        }
        navigationDiv.appendChild(nextButton);
    }
}