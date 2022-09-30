import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';

async function main() {
  const response = await fetch('/static/3-read-geojson/geojson.json')
  const json = await response.json();

  const vectorSource = new VectorSource({
    features: new GeoJSON().readFeatures(json, { featureProjection: 'EPSG:3857' }),
  });

  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });

  function createMap() {
    return new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        center: [10000000, 5000000],
        zoom: 2
      }),
    })
  }

  const map = createMap();
}

main();
