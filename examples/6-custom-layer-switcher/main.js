import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import LayerGroup from 'ol/layer/Group';
import ImageLayer from 'ol/layer/Image';
import OSM from 'ol/source/OSM';
import BingMaps from 'ol/source/BingMaps';
import XYZ from 'ol/source/XYZ';
import Stamen from 'ol/source/Stamen';
import TileDebug from 'ol/source/TileDebug';
import TileArcGISRest from 'ol/source/TileArcGISRest';
import TileWMS from 'ol/source/TileWMS';
import Static from 'ol/source/ImageStatic';
import Attribution from 'ol/control/Attribution';
import { defaults as defaultControls } from 'ol/control';


function createBaseLayers() {
  // Base Layers
  // Openstreet Map Standard
  const openstreetMapStandard = new TileLayer({
    source: new OSM(),
    visible: true,
    title: 'OSMStandard'
  });

  // Openstreet Map Humanitarian
  const openstreetMapHumanitarian = new TileLayer({
    source: new OSM({
      url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
    }),
    visible: false,
    title: 'OSMHumanitarian'
  });

  // Bing Maps Basemap Layer
  const bingMaps = new TileLayer({
    source: new BingMaps({
      key: "Your Bing Maps API Key Here",
      imagerySet: 'CanvasGray'  // Road, CanvasDark, CanvasGray
    }),
    visible: false,
    title: 'BingMaps'
  });

  // CartoDB BaseMap Layer
  const cartoDBBaseLayer = new TileLayer({
    source: new XYZ({
      url: 'http://{1-4}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
      attributions: '© CARTO'
    }),
    visible: false,
    title: 'CartoDarkAll'
  });

  // Stamen basemap layer
  const StamenTerrainWithLabels = new TileLayer({
    source: new Stamen({
      layer: 'terrain-labels',
      attributions: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    }),
    visible: false,
    title: 'StamenTerrainWithLabels'
  });

  const StamenTerrain = new TileLayer({
    source: new XYZ({
      url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
      attributions: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    }),
    visible: false,
    title: 'StamenTerrain'
  });

  return [
    openstreetMapStandard, openstreetMapHumanitarian, bingMaps, cartoDBBaseLayer,
    StamenTerrainWithLabels, StamenTerrain
  ];
}

function createLayers() {
  // TileDebug
  const tileDebugLayer = new TileLayer({
    source: new TileDebug(),
    visible: true,
    title: 'TileDebugLayer'
  });

  // tile ArcGIS REST API Layer
  const tileArcGISLayer = new TileLayer({
    source: new TileArcGISRest({
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/Polar/Antarctic_Imagery/MapServer",
      attributions: 'Copyright© 2008, MSD, PVA, Louisville Water Company, Louisville Metro Government'
    }),
    visible: true,
    title: 'TileArcGISLayer'
  });

  // NOAA WMS Layer
  const NOAAWMSLayer = new TileLayer({
    source: new TileWMS({
      url:'https://nowcoast.noaa.gov/arcgis/services/nowcoast/forecast_meteoceanhydro_sfc_ndfd_dailymaxairtemp_offsets/MapServer/WMSServer?',
      params:{
        LAYERS: 5,
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      attributions: '<a href=https://nowcoast.noaa.gov/>© NOAA<a/>'
    }),
    visible: true,
    title: 'NOAAWMSLayer'
  });

  // Static Image OpenstreetMap
  const openstreetMapFragmentStatic = new ImageLayer({
    source: new Static({
      url: '/static_images/openlayers_static_humanitarian.PNG',
      imageExtent: [4991698.9328313675, 5050292.393744084, 10008191.828130603, 10013417.911357462],
      attributions: '<a href=https://www.openstreetmap.org/copyright/>© OpenStreetMap contributors<a/>',
    }),
    title: 'openstreetMapFragmentStatic'
  });

  return [tileArcGISLayer, NOAAWMSLayer, tileDebugLayer, openstreetMapFragmentStatic];
}

const attributionControl = new Attribution({
  collapsible: true
});

function createMap() {
  return new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM()
      }),
    ],
    view: new View({
      center: [0, 0],
      zoom: 2,
    }),
    controls: defaultControls({ attribution: false }).extend([attributionControl])
  })
}

const map = createMap();


// Layer Group
const baseLayerGroup = new LayerGroup({
  layers: createBaseLayers()
})
map.addLayer(baseLayerGroup);

// Layer Switcher Logic for BaseLayers
const baseLayerElements = document.querySelectorAll('.sidebar > input[type=radio]')

for (let baseLayerElement of baseLayerElements) {
  baseLayerElement.addEventListener('change', function() {
    let baseLayerElementValue = this.value;
    baseLayerGroup.getLayers().forEach(function(layer, index, array) {
      let baseLayerName = layer.get('title');
      layer.setVisible(baseLayerName === baseLayerElementValue)
    })
  })
}

// Raster Tile Layer Group
const rasterLayerGroup = new LayerGroup({
  layers: createLayers()
})
map.addLayer(rasterLayerGroup);

// Layer Switcher Logic for Raster Tile Layers
const tileRasterLayerElements = document.querySelectorAll('.sidebar > input[type=checkbox]');
for(let tileRasterLayerElement of tileRasterLayerElements){
  tileRasterLayerElement.addEventListener('change', function() {
    let tileRasterLayerElementValue = this.value;
    let tileRasterLayer;

    rasterLayerGroup.getLayers().forEach(function(layer, index, array){
      if(tileRasterLayerElementValue === layer.get('title')){
        tileRasterLayer = layer;
      }
    })
    tileRasterLayer.setVisible(this.checked);
  })
}