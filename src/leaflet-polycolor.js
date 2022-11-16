import * as LineUtil from 'leaflet/src/geometry/LineUtil';
import { Bounds } from 'leaflet/src/geometry/Bounds';
import { LatLng, toLatLng } from 'leaflet/src/geo/LatLng';

const _getStrokeGradient = (ctx, layer, prev, p) => {
  const options = layer.options;

  // Create a gradient for each segment, pick start and end colors from colors options
  const gradient = ctx.createLinearGradient(prev.x, prev.y, p.x, p.y);
  const gradientStartRGB = prev._color || options.color;
  const gradientEndRGB = p._color || options.color;

  gradient.addColorStop(0, gradientStartRGB);
  gradient.addColorStop(1, gradientEndRGB);

  return gradient;
};

// @function pointsToPath(rings: Point[], closed: Boolean): String
// Generates a SVG path string for multiple rings, with each ring turning
// into "M..L..L.." instructions
export function pointsToPaths(rings, closed) {
	const strings = [];

  let i, j, len, len2, points, p, prev, str;

	for (i = 0, len = rings.length; i < len; i++) {
		points = rings[i];

		for (j = 0, len2 = points.length; j < len2; j++) {
			p = points[j];
			prev = points[j - 1];

      str = `${(j ? 'L' : 'M') + p.x} ${p.y}`;

      if (prev) {
        str = `M ${prev.x} ${prev.y}${str}`;
      }

			strings.push(str);
    }

		// closes the ring for polygons
    if (closed) {
      strings.push('z');
    }
	}

	// SVG complains about empty path strings
	return strings.length ? strings : ['M0 0'];
}

const leafletPolycolor = function(L) {
  L.Canvas.include({
    _updatePoly: function(layer, closed) {
      const options = layer.options;
      const prevColor = options.color;

      if (!this._drawing) return;

      let i, j, len2, p, prev;
      const parts = layer._parts;
      const len = parts.length;
      const ctx = this._ctx;

      if (!len) return;

      this._layers[layer._leaflet_id] = layer;

      for (i = 0; i < len; i++) {
        for (j = 0, len2 = parts[i].length - 1; j < len2; j++) {
          p = parts[i][j + 1];
          prev = parts[i][j];

          ctx.beginPath();

          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(p.x, p.y);

          if (options.colors?.length) {
            options.color = options.useGradient ? this._getStrokeGradient(ctx, layer, prev, p) : (p._color ?? options.color)
          }

          this._fillStroke(ctx, layer, prev, p, j);

          options.color = prevColor;
        }
        if (closed) {
          ctx.closePath();
        }
      }
    },

    _getStrokeGradient,
  });

  const Polycolor = L.Polycolor = L.Polyline.extend({
    _colorParts: [],

    options: {
      colors: [],
      useGradient: true,
    },

    // recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
    _convertLatLngs(latlngs) {
      const result = [],
          flat = LineUtil.isFlat(latlngs);

      for (let i = 0, len = latlngs.length; i < len; i++) {
        if (flat) {
          result[i] = toLatLng(latlngs[i]);
          this._bounds.extend(result[i]);

          if (this.options.colors?.[i]) {
            result[i]._color = this.options.colors?.[i];
          }
        } else {
          result[i] = this._convertLatLngs(latlngs[i]);
        }
      }

      return result;
    },

    // recursively turns latlngs into a set of rings with projected coordinates
    _projectLatlngs(latlngs, result, projectedBounds) {
      const flat = latlngs[0] instanceof LatLng,
            len = latlngs.length;
      let i, ring;

      if (flat) {
        ring = [];
        for (i = 0; i < len; i++) {
          ring[i] = this._map.latLngToLayerPoint(latlngs[i]);

          if (latlngs[i]._color) {
            ring[i]._color = latlngs[i]._color;
          }

          projectedBounds.extend(ring[i]);
        }
        result.push(ring);
      } else {
        for (i = 0; i < len; i++) {
          this._projectLatlngs(latlngs[i], result, projectedBounds);
        }
      }
    },

    _project() {
      const pxBounds = new Bounds();
      this._rings = [];
      this._projectLatlngs(this._latlngs, this._rings, pxBounds);

      if (this._bounds.isValid() && pxBounds.isValid()) {
        this._rawPxBounds = pxBounds;
        this._updateBounds();
      }
    },

    _clipPoints() {
      const bounds = this._renderer._bounds;

      this._parts = [];
      if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
        return;
      }

      if (this.options.noClip) {
        this._parts = this._rings;
        return;
      }

      const parts = this._parts;
      let i, j, k, len, len2, segment, points;

      for (i = 0, k = 0, len = this._rings.length; i < len; i++) {
        points = this._rings[i];

        for (j = 0, len2 = points.length; j < len2 - 1; j++) {
          segment = LineUtil.clipSegment(points[j], points[j + 1], bounds, j, true);

          if (!segment) { continue; }

          parts[k] = parts[k] || [];
          parts[k].push(segment[0]);

          // if segment goes out of screen, or it's the last one, it's the end of the line part
          if ((segment[1] !== points[j + 1]) || (j === len2 - 2)) {
            parts[k].push(segment[1]);
            k++;
          }
        }
      }
    },

    // simplify each clipped part of the polyline for performance
    _simplifyPoints() {
      const parts = this._parts,
          tolerance = this.options.smoothFactor;

      for (let i = 0, len = parts.length; i < len; i++) {
        parts[i] = LineUtil.simplify(parts[i], tolerance);
      }

    },
  });

  // Factory
  L.polycolor = function(latlngs, options) {
    return new L.Polycolor(latlngs, options);
  }

  return Polycolor;
}

window.leafletPolycolor = leafletPolycolor;
console.log(window.leafletPolycolor);
export default leafletPolycolor;
