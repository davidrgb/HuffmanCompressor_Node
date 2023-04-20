import * as Utility from './utility.js';

import { TreeNode } from '../model/treeNode.js';

const WORD_LENGTH = 8;

function setDecompressionStatus(state) {
    document.getElementById('decompression-status').innerHTML = state;
}

async function reconstructTree(tree) {
    setDecompressionStatus('Reconstructing tree');
    let head = new TreeNode();
    let currentNode = head;
    for (let i = 0; i < tree.length; i++) {
        while (!currentNode.isBridge) currentNode = currentNode.parent;
        if (currentNode.leftChild == null) {
            if (tree[i] === '0') {
                currentNode.leftChild = new TreeNode({
                    parent: currentNode,
                });
                currentNode = currentNode.leftChild;
            }
            else if (tree[i] === '1') currentNode.leftChild = new TreeNode({
                character: tree[++i],
                isBridge: false,
                parent: currentNode,
            });
        }
        else if (currentNode.righthild == null) {
            if (tree[i] === '0') {
                currentNode.rightChild = new TreeNode({
                    parent: currentNode,
                });
                currentNode = currentNode.rightChild;
            }
            else if (tree[i] === '1') currentNode.rightChild = new TreeNode({
                character: tree[++i],
                isBridge: false,
                parent: currentNode,
            });
            while (currentNode != null && currentNode.leftChild != null && currentNode.rightChild != null) currentNode = currentNode.parent;
        }
    }
    return head;
}

async function reconstructText(bytes, head, numberOfBits) {
    setDecompressionStatus('Reconstructing text');
    let text = "";
    let currentNode = head;

    for (let i = 0; i < bytes.length; i++) {
        let string = binaryStringFromNumber(bytes[i]);
        while (string.length > 0) {
            let bit = string[0];
            string = string.substring(1);
            if (numberOfBits > 0) {
                if (bit === '0') currentNode = currentNode.leftChild;
                else if (bit === '1') currentNode = currentNode.rightChild;
                if (!currentNode.isBridge) {
                    text += currentNode.character;
                    currentNode = head;
                }
                numberOfBits--;
            }
        }
    }
    return text;
}

function binaryStringFromNumber(number) {
    let string = number.toString(2);
    while (string.length < WORD_LENGTH) string = `0${string}`;
    return string;
}

export async function decompress(data) {
    const tree = data.tree;
    const head = await reconstructTree(tree);
    await Utility.sleep(250);
    let numberOfBits = data.numberOfBits;
    const bytes = data.bytes;
    const text = await reconstructText(bytes, head, numberOfBits);
    await Utility.sleep(250);
    return {
        input: `${data.tree}\n\n${data.numberOfBits}\n\n${new TextDecoder().decode(data.bytes)}`,
        text: text,
        head: head,
        bytes: bytes,
    };
}

export async function createAndDownloadFile(data, filename) {
    const link = document.createElement("a");
    const file = new Blob([data.text], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}