const CleanCSS = require('clean-css')
const htmlmin = require("html-minifier")

module.exports = function(eleventyConfig) {

	// Copy the `img` and `css` folders to the output
	eleventyConfig.addPassthroughCopy('img')
	eleventyConfig.addPassthroughCopy('css')

	// https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
	eleventyConfig.addFilter('htmlDateString', (date) => {
		return new Intl.DateTimeFormat('ru-RU', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			timeZone: 'UTC'
		  }).format(new Date(date))
	})

	eleventyConfig.addJavaScriptFunction('changeOrder', () => {

	})

	// Inline minified CSS
	eleventyConfig.addFilter('cssmin', (code) => {
		return new CleanCSS({}).minify(code).styles
	})

	// Minify HTML Output
	eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
		if (outputPath && outputPath.endsWith('.html')) {
			return htmlmin.minify(content, {
				useShortDoctype: true,
				removeComments: true,
				collapseWhitespace: true,
			})
		}
		return content
	})

	return {
		dir: {
			input: '.',
			output: 'dist',
			layouts: 'layouts',
			includes: 'includes',
			data: 'data',
		},
		templateFormats: ['njk'],
	}
}
