export default function(L) {
  const Renderer = L.Renderer.RendererGradient = L.Canvas.extend({
    _updatePoly: function(layer) {
      if (!this._drawing) return;

      let i, j, len2, p, prev;
      const parts = layer._parts;
      const len = parts.length;
      const ctx = this._ctx;

      if (!len) return;

      this._drawnLayers[layer._leaflet_id] = layer;

      for (i = 0; i < len; i++) {
        for (j = 1, len2 = parts[i].length; j < len2; j++) {
          p = parts[i][j];
          prev = parts[i][j - 1];

          this._fillGradient(ctx, layer, prev, p, j);

          ctx.beginPath();

          ctx.moveTo(prev.x, prev.y);
          ctx[j ? 'lineTo' : 'moveTo'](p.x, p.y);

          ctx.closePath();
        }
      }
    },

    _fillGradient: function(ctx, layer, prev, p, j) {
      const options = layer.options;

      if (options.fill) {
        ctx.globalAlpha = options.fillOpacity;
        ctx.fillStyle = options.fillColor || options.color;
        ctx.fill(options.fillRule || 'evenodd');
      }

      if (options.stroke && options.weight !== 0) {
        if (ctx.setLineDash) {
          ctx.setLineDash(layer.options && layer.options._dashArray || []);
        }
        ctx.globalAlpha = options.opacity;
        ctx.lineWidth = options.weight;
        ctx.strokeStyle = this._getStrokeGradient(ctx, layer, prev, p, j);

        ctx.lineCap = options.lineCap;
        ctx.lineJoin = options.lineJoin;
        ctx.stroke();
      }
    },

    _getStrokeGradient: function(ctx, layer, prev, p, j) {
      const options = layer.options;

      if (!options.colors[j])
        return options.color;

      // Create a gradient for each segment, pick start and end colors from colors options
      const gradient = ctx.createLinearGradient(prev.x, prev.y, p.x, p.y);
      const gradientStartRGB = options.colors[j - 1] || options.colors[j];
      const gradientEndRGB = options.colors[j];

      gradient.addColorStop(0, gradientStartRGB);
      gradient.addColorStop(1, gradientEndRGB);

      return gradient;
    },
  });

  const Polycolor = L.Polycolor = L.Polyline.extend({
    _colorParts: [],

    options: {
      colors: [],
      renderer: new Renderer()
    },

    initialize: function(latlngs, options) {
      L.Util.setOptions(this, options);
      this._setLatLngs(latlngs);
      this._colorParts = [];
    },

    // TODO add clip and smoothFactor
    _clipPoints: function() {
      const bounds = this._renderer._bounds;

      this._parts = [];
      this._colorParts = [];
      if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
        return;
      }

      this._parts = this._rings;
      this._colorParts = this.options.colors;
    },

    _update: function() {
      if (!this._map) return;

      this._clipPoints();
      this._updatePath();
    }
  });

  // Factory
  L.polycolor = function(latlngs, options) {
    return new L.Polycolor(latlngs, options);
  }

  return Polycolor;
}
