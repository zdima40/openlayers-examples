import { Feature, Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat, getTransform, transform } from 'ol/proj';
import { LineString } from 'ol/geom';

function getLineCoordinatesDegrees() {
  return [
    [
      113.5546875,
      66.37275500247455
    ],
    [
      116.3671875,
      59.17592824927136
    ],
    [
      131.8359375,
      64.01449619484472
    ],
    [
      137.4609375,
      56.36525013685606
    ]
  ]
}

// Первый способ: transform()
function createLineGeometryFirst() {
  const lineCoordinatesDegree = getLineCoordinatesDegrees();
  const lineCoordinatesMeters = lineCoordinatesDegree.map(coordinate => transform(coordinate, 'EPSG:4326', 'EPSG:3857'));
  return new LineString(lineCoordinatesMeters);
}

// Второй способ: fromLonLat()
function createLineGeometrySecond() {
  const lineCoordinatesDegree = getLineCoordinatesDegrees();
  const lineCoordinatesMeters = lineCoordinatesDegree.map(coordinate => fromLonLat(coordinate, 'EPSG:3857'));
  return new LineString(lineCoordinatesMeters);
}

// Третий способ: getTransform()
function createLineGeometryThird() {
  const transform4326To3857 = getTransform('EPSG:4326', 'EPSG:3857');
  const lineCoordinatesDegree = getLineCoordinatesDegrees();
  const lineCoordinatesMeters = lineCoordinatesDegree.map(coordinate => transform4326To3857(coordinate));
  return new LineString(lineCoordinatesMeters);
}

// Четвертый способ: <geometry>.transform()
function createLineGeometryFourth() {
  const lineCoordinatesDegree = getLineCoordinatesDegrees();
  return new LineString(lineCoordinatesDegree).transform('EPSG:4326', 'EPSG:3857');
}

function main() {
  const lineGeometry = createLineGeometryFirst();
  // const lineGeometry = createLineGeometrySecond();
  // const lineGeometry = createLineGeometryThird();
  // const lineGeometry =  createLineGeometryFourth();
  const lineFeature = new Feature(lineGeometry);
  const vectorSource = new VectorSource({ features: [lineFeature] });

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
