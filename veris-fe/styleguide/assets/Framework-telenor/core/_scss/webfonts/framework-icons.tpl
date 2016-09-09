%icon-base-styles {
	font-family: "<%= fontName %>";
	display: inline-block;
	font-weight: normal;
	font-style: normal;
	font-variant: normal;
	speak: none;
	text-decoration: inherit;
	text-transform: none;
	text-rendering: optimizeLegibility;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	font-size: 1em;
	line-height: 1;
	vertical-align: top;
}

/* Bootstrap Overrides */
[class^="<%= className %>-"]:before,
[class*=" <%= className %>-"]:before {
	@extend %icon-base-styles;
}

<% glyphs.forEach(function(glyph) { %>.<%= className %>-<%= glyph.name.toLowerCase().replace('_','-') %> {
	&:before {
	 content: "\<%= glyph.codepoint.toString(16).toUpperCase() %>";
	}
}

<% }); %>

<% glyphs.forEach(function(glyph) { %>@mixin <%= className %>-<%= glyph.name.toLowerCase().replace('_','-') %> {
	content: "\<%= glyph.codepoint.toString(16).toUpperCase() %>";
}

<% });%>

@font-face {
	font-family: "<%= fontName %>";
	src: url("<%= fontPath %><%= fontName %>.eot");
	src: url("<%= fontPath %><%= fontName %>.eot?#iefix") format("eot"),
			 url("<%= fontPath %><%= fontName %>.woff") format("woff"),
			 url("<%= fontPath %><%= fontName %>.ttf") format("truetype"),
			 url("<%= fontPath %><%= fontName %>.svg#<%= fontName %>") format("svg");
	font-weight: normal;
	font-style: normal;
}
