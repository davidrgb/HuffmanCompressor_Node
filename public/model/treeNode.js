export class TreeNode {
    constructor(data) {
        this.character = data === undefined || data.character === undefined ? null : data.character;
        this.frequency = data === undefined || data.frequency === undefined ? 0 : data.frequency;
        this.isBridge = data === undefined || data.isBridge === undefined ? true : data.isBridge;
        this.parent = data === undefined || data.parent === undefined ? null : data.parent;
        this.leftChild = data === undefined || data.leftChild === undefined ? null : data.leftChild;
        this.rightChild = data === undefined || data.rightChild === undefined ? null : data.rightChild;
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