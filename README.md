# leaflet-polycolor [![NPM version](https://badge.fury.io/js/leaflet-polycolor.svg)](https://npmjs.org/package/leaflet-polycolor) [![Build Status](https://travis-ci.org/Oliv/leaflet-polycolor.svg?branch=master)](https://travis-ci.org/Oliv/leaflet-polycolor)

Color each polyline segment

## Installation

### npm

```sh
$ npm install --save leaflet-polycolor
```

### browser

- Download or clone this github project
- Include `dist/polycolor.min.js` in your project

### compile

- Download or clone this github project
- Run `npm i` in the project folder
- Run `npm run build`

## Demo

[Demo](https://oliv.github.io/leaflet-polycolor)

## Usage

### es6

```js
import L from 'leaflet';
import leafletPolycolor from 'leaflet-polycolor';
leafletPolycolor(L);

const map = L.map('map', {
    center: [45.1834782, 5.7831946],
    zoom: 13
});

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar'}).addTo(map);

const latLngs = [[45.187273, 5.758124], [45.182772, 5.758516], [45.185767, 5.747106], [45.176569, 5.752082], [45.171863, 5.757120], [45.168354, 5.755178]];
const colors = ['rgb(20, 200, 100)', 'rgb(200, 100, 20)', null, null, 'rgb(20, 200, 100)', 'rgb(0, 0, 0)'];

const polyline = L.polycolor(latLngs, {
  colors: colors,
  weight: 5
}).addTo(map);
```

### normal include of the minified file

```html
<script src="leaflet-polycolor.min.js"></script>
```

```js
var leafletPolycolor = require('leaflet-polycolor');
leafletPolycolor.default(L);

var map = L.map('map', {
    center: [45.1834782, 5.7831946],
    zoom: 13
});

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar'}).addTo(map);

var latLngs = [[45.187273, 5.758124], [45.182772, 5.758516], [45.185767, 5.747106], [45.176569, 5.752082], [45.171863, 5.757120], [45.168354, 5.755178]];
var colors = ['rgb(20, 200, 100)', 'rgb(200, 100, 20)', null, null, 'rgb(20, 200, 100)', 'rgb(0, 0, 0)'];

var polyline = L.polycolor(latLngs, {
  colors: colors,
  weight: 5
}).addTo(map);
```

## API

### Factory `L.polycolor(<LatLng[]> latlngs, <Polyline options> options?)`

#### Options
- colors `<Array>` : An array of rgb colors strings `rgb(x,y,z)`

If `colors` are `undefined`, the default `color` parameter is used.
To leave default color, use `null` in colors. `['rgb(0, 0, 0)', null, 'rgb(0, 45, 120)']`

`clip` and `smoothFactor` parameters are disabled for now, planned in v1.0.0.

## License

MIT © [Olivier Gasc](https://github.com/Oliv)
