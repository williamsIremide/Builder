class TrieNode {
  children: { [key: string]: TrieNode };
  isEndOfWord: boolean;

  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

export class AutocompleteTrie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    let node: TrieNode = this.root;
    for (const char of word) {
      if (!(char in node.children)) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  searchPrefix(prefix: string): string[] {
    let node: TrieNode = this.root;
    for (const char of prefix) {
      if (char in node.children) {
        node = node.children[char];
      } else {
        return []; // Return empty if prefix is not found
      }
    }
    return this.collectAllWords(node, prefix);
  }

  private collectAllWords(node: TrieNode, prefix: string): string[] {
    const words: string[] = [];
    if (node.isEndOfWord) {
      words.push(prefix);
    }
    for (const char in node.children) {
      words.push(...this.collectAllWords(node.children[char], prefix + char));
    }
    return words;
  }
}
