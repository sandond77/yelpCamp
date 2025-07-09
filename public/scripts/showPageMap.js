// const maptilerApiKey = JSON.parse(
// 	document.getElementById('maptiler-key')?.textContent || '""'
// );
// const campgrounds = JSON.parse(
// 	document.getElementById('campgrounds-data')?.textContent || 'null'
// );

maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
	container: 'map',
	style: maptilersdk.MapStyle.BRIGHT,
	center: campground.geometry.coordinates, // starting position [lng, lat]
	zoom: 10 // starting zoom
});

new maptilersdk.Marker()
	.setLngLat(campground.geometry.coordinates)
	.setPopup(
		new maptilersdk.Popup({ offset: 25 }).setHTML(
			`<h3>${campground.title}</h3><p>${campground.location}</p>`
		)
	)
	.addTo(map);
