export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function validateFilename(filename) {
    let invalidCharacters = ['/', '\\', ':', '?', '<', '>', '|'];
    for (let i = 0; i < invalidCharacters.length; i++) if(filename.indexOf(invalidCharacters[i]) > -1) return `Filename cannot include ${invalidCharacters[i]}`;
    let indexOfDot = filename.indexOf('.')
    if (indexOfDot == 0) return 'Filename must include name prefix, cannot begin with dot';
    else if (indexOfDot == -1 || filename.substring(indexOfDot).length == 0) return 'Filename must include filetype suffix';
    else return null;
}