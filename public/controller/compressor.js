import * as Utility from '../controller/utility.js';

import { TreeNode } from '../model/treeNode.js';

const WORD_LENGTH = 8;

let numberOfBits = 0;

function setCompressionStatus(state) {
    const compressionStatusElement = document.getElementById('compression-status');
    compressionStatusElement.innerHTML = state;
}

async function createFrequencyTable(text) {
    setCompressionStatus('Creating frequency table');
    await Utility.sleep(50);

    const list = [];
    for (let i = 0; i < text.length; i++) {
        const currentChar = text[i];
        if (list.length == 0) {
            list.push(new TreeNode({
                character: currentChar,
                frequency: 1,
                isBridge: false,
            }));
        }
        else {
            const node = list.find(n => n.character == currentChar);
            if (node) node.frequency++;
            else {
                list.push(new TreeNode({
                    character: currentChar,
                    frequency: 1,
                    isBridge: false,
                }));
            }
        }
    }
    list.sort((a, b) => a.frequency - b.frequency);

    return list;
}

async function constructTree(list) {
    setCompressionStatus('Constructing tree');
    await Utility.sleep(50);

    while (list.length > 1) {
        const firstNode = list[0];
        list.splice(0, 1);
        const secondNode = list[0];
        list.splice(0, 1);

        const parentNode = new TreeNode({
            frequency: firstNode.frequency + secondNode.frequency,
            isBridge: true,
            leftChild: firstNode,
            rightChild: secondNode,
        });

        firstNode.parent = parentNode;
        secondNode.parent = parentNode;

        for (let i = 0; i < list.length; i++) {
            if (parentNode.frequency < list[i].frequency) {
                list.splice(i, 0, parentNode);
                break;
            }
            else if (i == list.length - 1) {
                list.push(parentNode);
                break;
            }
        }
        if (list.length == 0) list.push(parentNode);
    }

    return list[0];
}

function numberFromBinaryString(string) {
    let number = 0;

    for (let i = 0; i < string.length; i++) {
        if (string[i] === '1') number += Math.pow(2, WORD_LENGTH - 1 - i);
    }

    return number;
}

async function constructBytes(text, head) {
    setCompressionStatus('Constructing bytes');
    await Utility.sleep(50);

    const bytesAsNumbers = [];

    let currentCode = "";

    for (let i = 0; i < text.length; i++) {
        const currentChar = text[i];

        currentCode += head.getCode(currentChar, "");

        while (currentCode.length > WORD_LENGTH) {
            const binaryString = currentCode.substring(0, WORD_LENGTH);
            const byte = numberFromBinaryString(binaryString);
            bytesAsNumbers.push(byte);

            numberOfBits += WORD_LENGTH;

            currentCode = currentCode.substring(WORD_LENGTH);
        }
    }

    let remainder = 0;
    if (currentCode.length > 0) {
        remainder = WORD_LENGTH - currentCode.length;
        for (let i = 0; i < remainder; i++) {
            currentCode += '0';
        }

        const byte = numberFromBinaryString(currentCode);
        bytesAsNumbers.push(byte);

        numberOfBits += (WORD_LENGTH - remainder);
    }

    const bytes = new Uint8Array(bytesAsNumbers);

    return bytes;
}

export async function compress(text) {
    numberOfBits = 0;

    const list = await createFrequencyTable(text);
    await Utility.sleep(250);

    const head = await constructTree(list);
    const tree = head.constructTreeString();
    await Utility.sleep(250);
    
    const bytes = await constructBytes(text, head);
    await Utility.sleep(250);

    return {
        text: text,
        head: head,
        tree: tree,
        numberOfBits: numberOfBits,
        bytes: bytes,
    };

}

export async function createAndDownloadFile(data, filename) {
    const link = document.createElement("a");
    const file = new Blob([data.tree, '\n\n', data.numberOfBits, '\n\n', data.bytes], { type: 'text/plain; charset=utf-8' });
    link.href = URL.createObjectURL(file);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}