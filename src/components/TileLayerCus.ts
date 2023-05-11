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



export const TileLayerCus = createTileLayerComponent<
  LeafletTileLayer,
  TileLayerProps
>(
  function createTileLayer({ url, ...options }, context) {
    const layer = L.vectorGrid.protobuf(url, {
      // pane: 'tilePane',
      rendererFactory: L.canvas.tile,
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