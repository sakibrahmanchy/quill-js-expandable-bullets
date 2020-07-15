import { Quill } from "react-quill";
import ExpandableList from './ExpandableList';
const Parchment = Quill.import('parchment');
const ListItem = Quill.import('formats/list/item');

class ExpandableListItem extends ListItem {

    constructor(props) {
        super(props);
        this.addClassIfNeeded();

        this.onClick = this.onClick.bind(this);
        this.domNode.addEventListener('click', this.onClick);
    }

    onClick(event) {
        const childNodes = this.getChildNodes();

        if (!childNodes.length) {
            return;
        }

        let expanded = false;
        if (!childNodes[0].domNode.classList.contains('collapsed')) {
            expanded = true;
        }

        if (expanded) {
            this.collapse();
        } else {
            this.expand();
        }
    }

    format(name, value) {
        if (name === ExpandableList.blotName && !value) {
            this.replaceWith(Parchment.create(this.statics.scope));
        }
        else {
            super.format(name, value);
        }
    }

    getNodeLevel(node) {
        if (!node.classList.length) {
            return 0;
        }

        const classes = node.getAttribute('class');
        const match = classes.match('(ql-indent-\\d)');
        if (match) {
            return Number(match[0].split('-')[2]);
        }

        return 0;
    }

    getChildNodes(depth = null) {
        let childNodes = [];
        if (!this.next) {
            return childNodes;
        }

        let next = this.next;

        let nodeLevel = this.getNodeLevel(this.domNode);
        let nextNodeLevel = this.getNodeLevel(next.domNode);
        const depthLevel = depth ? nodeLevel + depth : 8;

        if (nodeLevel >= nextNodeLevel) {
            return childNodes;
        }

        childNodes = [...childNodes, next];

        do {
            if (!next.next) {
                break;
            }

            next = next.next;
            nextNodeLevel = this.getNodeLevel(next.domNode);

            if (nextNodeLevel > depthLevel) {
                break;
            }

            if (nodeLevel < nextNodeLevel) {
                childNodes = [...childNodes, next];
            }
        } while (next.next && nodeLevel < nextNodeLevel);

        return childNodes;
    }

    addClassIfNeeded() {
        if (this.prev) {
            const prev = this.prev;
            const parentLevel = this.getNodeLevel(prev.domNode);
            const currentLevel = this.getNodeLevel(this.domNode);

            if (currentLevel > parentLevel) {
                prev.domNode.classList.add('collapsible');
            } else {
                prev.domNode.classList.remove('collapsible');
            }
        }
    }

    expand() {
        this.domNode.classList.remove('expandable');
        this.domNode.classList.add('collapsible');

        const childNodes = this.getChildNodes(1);

        if (childNodes.length) {
            for (let i = 0 ; i < childNodes.length; i++) {
                const childNode = childNodes[i];

                childNode.domNode.classList.add('expanded');
                childNode.domNode.classList.remove('collapsed');
                if (childNode.domNode.getAttribute('class').includes('collapsible')) {
                    childNode.domNode.classList.add('expandable');
                    childNode.domNode.classList.remove('collapsible');
                }
            }
        }
    }

    collapse() {
        this.domNode.classList.remove('collapsible');
        this.domNode.classList.add('expandable');

        const childNodes = this.getChildNodes();
        if (childNodes.length) {
            for (let i = 0 ; i < childNodes.length; i++) {
                const childNode = childNodes[i];

                childNode.domNode.classList.add('collapsed');
                childNode.domNode.classList.remove('expanded');
            }
        }
    }

    optimize(context) {
        this.addClassIfNeeded();
        super.optimize(context);
    }

    update(mutations, context) {
        this.addClassIfNeeded();
        super.update(mutations, context);
    }
}

ExpandableListItem.blotName = 'expandable-list-item';
ExpandableListItem.tagName = "LI";

export default ExpandableListItem;
