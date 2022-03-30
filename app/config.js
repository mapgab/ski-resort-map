define([
  "esri/geometry/SpatialReference"
], function (SpatialReference) {
  return {
    appId: "iLylggsE3toQeCGV",
    portalUrl: "https://jsapi.maps.arcgis.com/",
    terrain: {
      exaggerationFactor: 2,
    },
    extent: {
      xmax: -12306255.7,
      xmin: -12310018.0,
      ymin: 4937137.1,
      ymax: 4939447.3,
      spatialReference: SpatialReference.WebMercator
    }
  }
});
