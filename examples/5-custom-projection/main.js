import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import proj4 from 'proj4';
import {get as getProjection} from 'ol/proj';
import {register} from 'ol/proj/proj4';

// Определяем новую проекцию
// British National Grid -- United Kingdom Ordnance Survey
// Область применения: инженерные изыскания, топографическая съемка.
// Область использования: остров - шельф до границы UKCS в пределах от 49°45'N до 61°N и от 9°W до 2°E
proj4.defs('EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 ' +
    '+x_0=400000 +y_0=-100000 +ellps=airy ' +
    '+towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 ' +
    '+units=m +no_defs');

// Регистрируем кастомные проекции
register(proj4);
// Получаем зарегистрированную проекцию
const proj27700 = getProjection('EPSG:27700');
// Огрпничиваем видимую область проекции
proj27700.setExtent([0, 0, 700000, 1300000]);

function main() {
  function createMap() {
    return new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
      ],
      view: new View({
        // extent: transformExtent([-9.0, 49.75, 2.0, 61.01], 'EPSG:4326', 'EPSG:27700'),
        center: [305371.94, 610575.38],
        zoom: 2,
        projection: 'EPSG:27700'
      }),
    })
  }
  
  const map = createMap();
}

main();
