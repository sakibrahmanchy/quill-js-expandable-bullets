import React, { useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import './App.css';
import ExpandableList from "./ExpandableList/ExpandableList";
import ExpandableListItem from "./ExpandableList/ExpandableListItem";
import ExpandableListModule from "./ExpandableList/ExpandableListModule";

Quill.register({
    'formats/expandable-list': ExpandableList,
    'formats/expandable-list/item': ExpandableListItem,
    'modules/expandable-list': ExpandableListModule,
});

Quill.import('ui/icons')['expandable-list'] = `EB`;

const bindings = {
    shiftTab: {
        shiftKey: true,
        key: 'tab',
        handler: function(range, context) {
            this.quill.format('indent', '-1', Quill.sources.USER);
        }
    },
    tab: {
        key: 'tab',
        handler: function(range, context) {
            this.quill.format('indent', '+1', Quill.sources.USER);
        }
    },
};

export default function Editor() {
    const [value, setValue] = useState('');

    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            modules={{
                toolbar: ['expandable-list'],
                keyboard: {
                    bindings,
                },
                'expandable-list': true,
            }}
        />
    );
}
