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

Quill.import('ui/icons')['expandable-list'] = `
  <svg class="" viewbox="0 0 18 18">
    <line class="ql-stroke" x1="9" x2="15" y1="4" y2="4"></line>
    <polyline class="ql-stroke" points="3 4 4 5 6 3"></polyline>
    <line class="ql-stroke" x1="9" x2="15" y1="14" y2="14"></line>
    <polyline class="ql-stroke" points="3 14 4 15 6 13"></polyline>
    <line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"></line>
    <polyline class="ql-stroke" points="3 9 4 10 6 8"></polyline>
  </svg>
`;


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
    enter: {
        key: 'enter',
        format: ['list'],
        empty: true,
        handler(range, context) {
            const formats = { list: false };
            if (context.format.indent) {
                formats.indent = false;
            }
            this.quill.formatLine(
                range.index,
                range.length,
                formats,
                Quill.sources.USER,
            );
        },
    }
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
