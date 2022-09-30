import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import Draw from 'ol/interaction/Draw'

function createMap() {
  return new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM()
      })
    ],
    view: new View({
      center: [0, 0],
      zoom: 2
    }),
  })
}

const map = createMap();

const drawInteraction = new Draw({
  type: 'Polygon',
});
map.addInteraction(drawInteraction);

drawInteraction.on('drawend', event => {
  const geoJSON = new GeoJSON();
  const feature = geoJSON.writeFeature(event.feature);
  alert(feature);
});
