const CleanCSS = require('clean-css')
const htmlmin = require('html-minifier')
const { minify } = require('terser');

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

	// Inline minified JS
	eleventyConfig.addNunjucksAsyncFilter('jsmin', async function (code, callback) {
		try {
			const minified = await minify(code);
			callback(null, minified.code);
		} catch (err) {
			console.error("Terser error: ", err);
			callback(null, code);
		}
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
