import ReactQuill, { Quill } from 'react-quill';

class ExpandAttributor extends ClassAttributor {
    add(node, value) {
        console.log(node, value);
        return super.add(node, value);
    }

    canAdd(node, value) {
        return super.canAdd(node, value) || super.canAdd(node, parseInt(value, 10));
    }

    value(node) {
        return parseInt(super.value(node), 10) || undefined; // Don't return NaN
    }
}

const ExpandClass = new ExpandAttributor('expand', 'ql-expand', {
    scope: Scope.BLOCK,
    whitelist: [1, 2, 3, 4, 5, 6, 7, 8],
});

