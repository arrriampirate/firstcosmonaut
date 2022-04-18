const CleanCSS = require('clean-css')
const htmlmin = require('html-minifier')
const { minify } = require('terser')

module.exports = function(eleventyConfig) {

	// Copy the `img` and `css` folders to the output
	eleventyConfig.addPassthroughCopy('images')
	eleventyConfig.addPassthroughCopy('assets')

	// Format Date
	eleventyConfig.addFilter('htmlDateString', (date) => {
		return new Intl.DateTimeFormat('ru-RU', {
			month: 'long',
			day: 'numeric',
			timeZone: 'UTC',
			year: 'numeric'
		  }).format(new Date(date))
	})

	// Get year from Date
	eleventyConfig.addFilter('htmlYearString', (date) => {
		return (new Date(date)).getFullYear()
	})

	// Inline minified JS
	eleventyConfig.addNunjucksAsyncFilter('jsmin', async function (code, callback) {
		try {
			const minified = await minify(code, { module: true });
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
