export default function getFirstTextFromLexicalJSON(json: any): string | null {
    if (!json) return null;

    const traverse = (node: any): string | null => {
        if (node?.text) {
            return node.text;
        }

        if (Array.isArray(node?.children)) {
            for (const child of node.children) {
                const result = traverse(child);
                if (result) return result;
            }
        }

        return null;
    };

    return traverse(json.root);
}
