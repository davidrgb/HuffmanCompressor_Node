// Character
// Frequency
// Is Bridge
// Parent
// Left Child
// Right Child

export class TreeNode {
    constructor(data) {
        this.character = data.character === undefined ? null : data.character;
        this.frequency = data.frequency === undefined ? 0 : data.frequency;
        this.isBridge = data.isBridge === undefined ? true : data.isBridge;
        this.parent = data.parent === undefined ? null : data.parent;
        this.leftChild = data.leftChild === undefined ? null : data.leftChild;
        this.rightChild = data.rightChild === undefined ? null : data.rightChild;
    }
    setChildren(leftChild, rightChild) {
        this.frequency = leftChild.frequency + rightChild.frequency;
        this.leftChild = leftChild;
        this.rightChild = rightChild;
        leftChild.parent = this;
        rightChild.parent = this;
    }
    getCode(character, code) {
        if (this.character === character) return code;
        else {
            let search = null;
            if (this.leftChild != null) search = this.leftChild.getCode(character, code + '0');
            if (search == null && this.rightChild != null) search = this.rightChild.getCode(character, code + '1');
            return search;
        }
    }
    constructTreeString() {
        let tree = "";
        if (this.parent != null) {
            if (this.isBridge == true) tree += '0';
            else tree += `1${this.character}`;
        }
        if (this.leftChild != null) tree += this.leftChild.constructTreeString();
        if (this.rightChild != null) tree += this.rightChild.constructTreeString();
        return tree;
    }
}