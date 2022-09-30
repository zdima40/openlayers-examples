import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import LayerGroup from 'ol/layer/Group';
import ImageLayer from 'ol/layer/Image';
import VectorImageLayer from 'ol/layer/VectorImage';
import VectorLayer from 'ol/layer/Vector';
import Heatmap from 'ol/layer/Heatmap';
import OSM from 'ol/source/OSM';
import BingMaps from 'ol/source/BingMaps';
import XYZ from 'ol/source/XYZ';
import Stamen from 'ol/source/Stamen';
import TileDebug from 'ol/source/TileDebug';
import TileArcGISRest from 'ol/source/TileArcGISRest';
import TileWMS from 'ol/source/TileWMS';
import Static from 'ol/source/ImageStatic';
import VectorSource from 'ol/source/Vector';
import Attribution from 'ol/control/Attribution';
import { defaults as defaultControls } from 'ol/control';
import GeoJSON from 'ol/format/GeoJSON';
import KML from 'ol/format/KML';

function createBaseRasterLayers() {
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

function createRaterLayers() {
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
      url: '/static/6-custom-layer-switcher/static_images/openlayers_static_humanitarian.PNG',
      imageExtent: [4991698.9328313675, 5050292.393744084, 10008191.828130603, 10013417.911357462],
      attributions: '<a href=https://www.openstreetmap.org/copyright/>© OpenStreetMap contributors<a/>',
    }),
    title: 'openstreetMapFragmentStatic'
  });

  return [tileArcGISLayer, NOAAWMSLayer, tileDebugLayer, openstreetMapFragmentStatic];
}

function createVectorLayers() {
  // Vector Layers
  // Central EU Countries GeoJSON VectorImage Layer
  const EUCountriesGeoJSONVectorImage = new VectorImageLayer({
    source: new VectorSource({
      url: '/static/6-custom-layer-switcher/vector_data/Central_EU_countries_GEOJSON.geojson',
      format: new GeoJSON()
    }),
    visible: false,
    title: 'CentralEUCountriesGeoJSON'
  });

  // Central EU Countries KML
  const EUCountriesKML = new VectorLayer({
    source: new VectorSource({
      url: '/static/6-custom-layer-switcher/vector_data/Central_EU_countries_KML.kml',
      format: new KML()
    }),
    visible: false,
    title: 'CentralEUCountriesKML'
  });

  // HeatMap
  const heatMapOnlineFBUsers = new Heatmap({
    source: new VectorSource({
      url: '/static/6-custom-layer-switcher/vector_data/onlineFBUsers.geojson',
      format: new GeoJSON()
    }),
    radius: 20,
    blur: 12,
    gradient: ['#DC143C', '#DC143C', '#000000', '#000000', '#000000'],
    title: 'OnlineFBUsers',
    visible: false
  });

  return [EUCountriesGeoJSONVectorImage, EUCountriesKML, heatMapOnlineFBUsers];
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
  layers: createBaseRasterLayers()
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
  layers: createRaterLayers()
})
map.addLayer(rasterLayerGroup);


// Layer Switcher Logic for Raster Tile Layers
const tileRasterLayerElements = document.getElementsByName('rasterLayerCheckbox');
checkboxLayerSwitcher(tileRasterLayerElements, rasterLayerGroup)

// Vector Tile Layer Group
const vectorLayerGroup = new LayerGroup({
  layers: createVectorLayers()
})
map.addLayer(vectorLayerGroup);

// Layer Switcher Logic for Vector Layers
const tileVectorLayerElements = document.getElementsByName('vectorLayerCheckbox');
checkboxLayerSwitcher(tileVectorLayerElements, vectorLayerGroup)

function checkboxLayerSwitcher(checkboxes, layerGroup) {
  for (let checkbox of checkboxes) {
    checkbox.addEventListener('change', function() {
      let tileVectorLayerElementValue = this.value;
      let tileVectorLayer;

      layerGroup.getLayers().forEach(function(layer, index, array) {
        if(tileVectorLayerElementValue === layer.get('title')) {
          tileVectorLayer = layer;
        }
      });
      tileVectorLayer.setVisible(this.checked);
    });
  }
}
