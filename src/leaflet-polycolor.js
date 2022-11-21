import * as LineUtil from 'leaflet/src/geometry/LineUtil';
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

const leafletPolycolor = function(L) {
  L.Canvas.include({
    _updatePolycolor: function(layer, closed) {
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
            options.color = options.useGradient ? this._getStrokeGradient(ctx, layer, prev, p) : (prev._color ?? options.color);
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

    _updatePath() {
		  this._renderer._updatePolycolor(this);
	  },
  });

  // Factory
  L.polycolor = function(latlngs, options) {
    return new L.Polycolor(latlngs, options);
  }

  return Polycolor;
}

if (typeof module !== 'undefined' && module?.hot) {
  global.leafletPolycolor = leafletPolycolor;
}

export default leafletPolycolor;
