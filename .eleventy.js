module.exports = function(eleventyConfig) {

	// https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
	eleventyConfig.addFilter('htmlDateString', (date) => {
		return new Intl.DateTimeFormat('ru-RU', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			timeZone: 'UTC'
		  }).format(new Date(date));
	});

	// Copy the `img` and `css` folders to the output
	eleventyConfig.addPassthroughCopy("img");
  	eleventyConfig.addPassthroughCopy("css");

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
};
