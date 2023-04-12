import { TreeNode } from '../model/treeNode.js';

import * as fs from 'fs';

async function createFrequencyTable(text) {
    const list = [];
    for (let i = 0; i < text.length; i++) {
        let currentChar = text[i];
        if (list.length == 0) {
            list.push(new TreeNode({
                character: currentChar,
                frequency: 1,
                isBridge: false,
            }));
        }
        else {
            let node = list.find(n => n.character == currentChar);
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
    while (list.length > 1) {
        let firstNode = list[0];
        list.splice(0, 1);
        let secondNode = list[0];
        list.splice(0, 1);
        let parentNode = new TreeNode({
            frequency: firstNode.frequency + secondNode.frequency,
            isBridge: true,
            leftChild: firstNode,
            rightChild: secondNode,
        });
        firstNode.parent = parentNode;
        secondNode.parent = parentNode;
        for (let i = 0; i < list.length; i++) {
            if (parentNode.frequency < list[i].frequency) list.splice(i, 0, parentNode);
            else if (i == list.length - 1) {
                list.push(parentNode);
                break;
            }
        }
        if (list.length == 0) list.push(parentNode);
    }
    return list[0];
}

export async function compress(text) {
    const list = await createFrequencyTable(text);
    const head = await constructTree(list);
    const tree = head.constructTreeString();
    fs.writeFile('tree.txt', tree, (e) => {
        if (e) throw e;
        else {
            console.log('Write successful');
        }
    })
}