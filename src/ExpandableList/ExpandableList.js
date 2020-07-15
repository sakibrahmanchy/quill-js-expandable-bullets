import { Quill } from "react-quill";
import ExpandableListItem from "./ExpandableListItem";

const Parchment = Quill.import('parchment');
const List = Quill.import('formats/list');

class ExpandableList extends List {

    static create(value) {
        return super.create('bullet');
    }

    static formats(domNode) {
        return 'bullet';
    }
}


ExpandableList.blotName = 'expandable-list';
ExpandableList.className = 'contentblock';
ExpandableList.scope = Parchment.Scope.BLOCK_BLOT;
ExpandableList.tagName = 'UL';
ExpandableList.defaultChild = 'expandable-list-item';
ExpandableList.allowedChildren = [ExpandableListItem];

export default ExpandableList;
