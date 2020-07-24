import { Quill } from "react-quill";
import ExpandableList from './ExpandableList';
const Parchment = Quill.import('parchment');
const ListItem = Quill.import('formats/list/item');

class ExpandableListItem extends ListItem {

    constructor(props) {
        super(props);
        this.addClassIfNeeded();

        this.wasClicked = false;
        this.onClick = this.onClick.bind(this);
        this.domNode.addEventListener('click', this.onClick);
    }

    onClick() {
        if (!this.hasChildNodes()) {
            return;
        }

        this.wasClicked = true;
        if (this.isNodeExpanded()) {
            this.collapse();
        } else {
            this.expand();
        }
    }

   hasChildNodes() {
        const childNodes = this.getChildNodes();

        return Boolean(childNodes.length);
    }

   isNodeExpanded(ref = null) {
        let expanded = false;

        const nodeRef = ref ?? this;

        const childNodes = nodeRef.getChildNodes(1);

        if (!childNodes[0].domNode.classList.contains('collapsed')) {
            expanded = true;
        }

        return expanded;
    }


    format(name, value) {
        console.log(this.wasClicked);
        if (name === ExpandableList.blotName && !value) {
            this.replaceWith(Parchment.create(this.statics.scope));
        }
        else if (name === ExpandableList.blotName && value && !this.wasClicked) {
            const childNodes = this.getChildNodes(null, this.next);
            if (childNodes.length) {
                if (!this.isNodeExpanded(this.next)) {
                    const nodeLevel = this.getNodeLevel(this.next.domNode);
                    const liNode = document.createElement('LI');
                    const content = this.domNode.innerText;
                    const node = Parchment.create(liNode);
                    this.domNode.remove();
                    this.replace(node);
                    this.next.domNode.innerText = content;
                    const lastNode =  childNodes[childNodes.length - 1];
                    this.parent.insertBefore(Parchment.create(liNode), lastNode.next);
                    if (lastNode.next) {
                        lastNode.next.domNode.setAttribute('class', `ql-indent-${nodeLevel}`);
                    }
                    this.scroll.update();
                }
            }
        }
        else {
            super.format(name, value);
        }
        this.wasClicked = false;
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

    getChildNodes(depth = null, ref = null) {
        let childNodes = [];

        const refNode = ref ?? this;

        if (!refNode.next) {
            return childNodes;
        }

        let next = refNode.next;

        let nodeLevel = refNode.getNodeLevel(refNode.domNode);
        let nextNodeLevel = refNode.getNodeLevel(next.domNode);
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
            nextNodeLevel = refNode.getNodeLevel(next.domNode);

            if (nextNodeLevel > depthLevel) {
                continue;
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
