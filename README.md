# leaflet-polycolor [![NPM version](https://badge.fury.io/js/leaflet-polycolor.svg)](https://npmjs.org/package/leaflet-polycolor) [![Build Status](https://travis-ci.org/Oliv/leaflet-polycolor.svg?branch=master)](https://travis-ci.org/Oliv/leaflet-polycolor)

Color each polyline segment

## Installation

### npm

```sh
$ npm install --save leaflet-polycolor
```

### browser

- Download or clone this github project
- Run `npm i` in the project folder
- Run `npm run build`
- Include `dist/polycolor.min.js` in your project

## Usage

### es6

```js
import L from 'leaflet';
import leaflet-polycolor from 'leaflet-polycolor';
leaflet-polycolor(L);

const map = L.map(el, {
    center: [45.1834782, 5.7831946],
    zoom: 13
});

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar'}).addTo(map);

const latLngs = [[45.18, 5.78], [45.19, 5.79], [45.17, 5.77]];
const colors = ['rgb(0, 0, 0)', 'rgb(40, 10, 0)', 'rgb(0, 45, 120)'];

const polyline = L.polycolor(latLngs, {
  colors: colors,
  weight: 5
}).addTo(map);
```

## API

### Factory `L.polycolor(<LatLng[]> latlngs, <Polyline options> options?)`

#### Options
- colors `<Array>` : An array of rgb colors strings `rgb(x,y,z)`

`clip` and `smoothFactor` are disabled for now, planned in v1.0.0.
If `colors` are undefined, default `color` parameter is used.
To leave default color, use `null` in colors array : `['rgb(0, 0, 0)', null, 'rgb(0, 45, 120)']`

## License

MIT © [Olivier Gasc](https://github.com/Oliv)
