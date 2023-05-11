import {
  type LayerProps,
  createElementObject,
  createTileLayerComponent,
  updateGridLayer,
  withPane,
} from '@react-leaflet/core'
import { TileLayer as LeafletTileLayer, type TileLayerOptions } from 'leaflet'

export interface TileLayerProps extends TileLayerOptions, LayerProps {
  url: string
}

var vectorTileStyling = {

  cemt_EU_2019: function (properties, zoom, geometryDimension) {

    var weight = 3;
    var color = 'black';
    var dashArray = '0, 1';
    var fillOpacity = 1;
    var fill = true;


    if (zoom <= 6) { weight = 1; }
    if (properties.waterway == 'fairway') { dashArray = '2, 6'; }

    switch (properties.CEMT) {
      case "0":
        color = 'black';
        break;
      case "I":
        color = '#7C0175';
        break;
      case "II":
        color = '#FF00FF';
        break;
      case "III":
        color = '#0906A6';
        break;
      case "IV":
        color = '#A6FD26';
        break;
      case "V":
        color = '#A6FD26';
        break;
      case "Va":
        color = '#70872E';
        break;
      case "Vb":
        color = '#0DF7FB';
        break;
      case "VI":
        color = '#AA2628';
        break;
      case "VIa":
        color = '#AA2628';
        break;
      case "VIb":
        color = '#A7A7A7';
        break;
      case "VIc":
        color = 'OrangeRed';
        break;
      case "VII":
        color = 'DarkRed';
        break;
      default:
    }


    return {
      weight: weight,
      color: color,
      fillOpacity: fillOpacity,
      dashArray: dashArray,
      fill: fill
    }
  }
};

export const TileLayerCus = createTileLayerComponent<
  LeafletTileLayer,
  TileLayerProps
>(
 function createTileLayer({ url, attribution, ...options }, context) {
  const layer = L.vectorGrid.protobuf(url, {
    rendererFactory: L.canvas.tile,
    vectorTileLayerStyles: vectorTileStyling,
    attribution: attribution + "_added",
    ...options,
  })
  return createElementObject(layer, context)
},
  
  function updateTileLayer(layer, props, prevProps) {
    updateGridLayer(layer, props, prevProps)

    const { url } = props
    if (url != null && url !== prevProps.url) {
      layer.setUrl(url)
    }
  },
)