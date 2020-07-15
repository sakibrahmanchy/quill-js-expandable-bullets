(function ()
{
    console.clear();
    console.log("New run! " + new Date());
    var orderedListConverter = {
        filter      : "ol",
        replacement : function (innerHTML, node)
        {
            var list_items = '';

            var depth = 0;
            var i;

            if (node.childNodes.length > 0)
            {
                node.childNodes.forEach(function (node, index, nodeList)
                {
                    var className = node.className.replace('ql-indent-', '');
                    console.log(className);
                    console.log(arguments);

                    depth = parseInt(className, 10);

                    if (!depth) {
                        depth = 0;
                    }
                    console.log(node.nextElementSibling);

                    for (i = 0; i < depth; i++) {
                        list_items += ' ';
                    }
                    list_items += "- " + node.innerText + "\n";
                });
            }

            console.log(list_items);

            return list_items;
        }
    };

    var toMarkdownOptions = {
        converters : [orderedListConverter]
    };


    function init(raw_markdown)
    {
        var quill = new Quill("#editor-container", {
            modules     : {
                toolbar : [
                    [{ header : [1, 2, false] }],
                    ["bold", "italic", "underline"],
                    [{ list : "ordered" }, { list : "bullet" }],
                    ["image", "code-block"]
                ]
            },
            placeholder : "Compose an epic...",
            theme       : "snow" // or 'bubble'
        });

        var md = window.markdownit();
        md.set({
            html : true
        });

        var result = md.render(raw_markdown);

        quill.clipboard.dangerouslyPasteHTML(result + "\n");

        // Need to do a first pass when we're passing in initial data.
        var html = quill.container.firstChild.innerHTML;
        $("#markdown").text(toMarkdown(html, toMarkdownOptions));
        $("#html").text(html);
        $("#output-quill").html(html);
        $("#output-markdown").html(result);

        // text-change might not be the right event hook. Works for now though.
        quill.on("text-change", function (delta, source)
        {
            var html              = quill.container.firstChild.innerHTML;
            var markdown          = toMarkdown(html, toMarkdownOptions);
            var rendered_markdown = md.render(markdown);
            $("#markdown").text(markdown);
            $("#html").text(html);
            $("#output-quill").html(html);
            $("#output-markdown").html(rendered_markdown);
        });
    }

    // Just some fake markdown that would come from the server.

    text = '<ol><li>Indent 0.1</li><li class="ql-indent-1">Indent 1.1</li><li class="ql-indent-2">Indent 2</li><li>Indent 0.1</li><li class="ql-indent-1">Indent 1.1</li><li class="ql-indent-2">Indent 2.1</li><li class="ql-indent-2">Indent 2.2</li><li>Indent 0.1</li><li class="ql-indent-1">Indent 1.1</li><li class="ql-indent-1">Indent 1.2</li><li class="ql-indent-2">Indent 2.1</li><li>List item 4</li><li class="ql-indent-1">Point a</li><li class="ql-indent-1">Point b</li><li class="ql-indent-1">Point c</li><li class="ql-indent-2">oh</li><li class="ql-indent-3">yeah</li><li class="ql-indent-4">boyyyy</li><li class="ql-indent-5">hahahahah</li><li class="ql-indent-6">yeah!</li><li class="ql-indent-7">maxiumum</li><li class="ql-indent-8">indent level!</li></ol>';
    text = toMarkdown(text, toMarkdownOptions);
    init(text);
})();
