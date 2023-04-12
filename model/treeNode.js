// Character
// Frequency
// Is Bridge
// Parent
// Left Child
// Right Child

export class TreeNode {
    constructor(data) {
        this.character = data.character;
        this.frequency = data.frequency;
        this.isBridge = data.isBridge;
        this.parent = data.parent;
        this.leftChild = data.leftChild;
        this.rightChild = data.rightChild;
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
            if (leftChild != null) search = leftChild.getCode(character, code + '0');
            if (search == null && rightChild != null) search = rightChild.getCode(character, code + '1');
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
        if (this.parent == null) tree += '\n\n';
        return tree;
    }
}