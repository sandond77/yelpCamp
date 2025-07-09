const maptilerApiKey = JSON.parse(
	document.getElementById('maptiler-key')?.textContent || '""'
);
const campgrounds = JSON.parse(
	document.getElementById('campgrounds-data')?.textContent || 'null'
);

// You can now safely use these variables
console.log('MapTiler API Key:', maptilerApiKey);
console.log('Campgrounds GeoJSON:', campgrounds);

// Example: initialize map here
initMap(maptilerApiKey, campgrounds);
