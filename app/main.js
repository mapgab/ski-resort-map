define([
  "app/config",
  "app/renderers",
  "esri/Map",
  "esri/geometry/SpatialReference",
  "app/tin",
  "esri/views/SceneView",
  "esri/Graphic",
  "esri/geometry/Point",
  "esri/geometry/Extent",
  "esri/layers/GraphicsLayer",
  "esri/layers/FeatureLayer",
  "esri/layers/CSVLayer",
  "esri/layers/SceneLayer",
  "esri/layers/support/LabelClass",
  "esri/core/watchUtils",
  "esri/geometry/support/meshUtils",
  "esri/widgets/Editor",
  "app/utils"
], function (
  config,
  renderers,
  Map,
  SpatialReference,
  tin,
  SceneView,
  Graphic,
  Point,
  Extent,
  GraphicsLayer,
  FeatureLayer,
  CSVLayer,
  SceneLayer,
  LabelClass,
  watchUtils,
  meshUtils,
  Editor,
  utils
  ) {
  return {
    init: function () {

      const map = new Map({
        ground: {
          opacity: 0
        }
      });

      const view = new SceneView({
        container: "viewDiv",
        map: map,
        alphaCompositingEnabled: true,
        environment: {
          lighting: {
            directShadowsEnabled: false
          },
          background: {
            type: "color",
            color: [0, 0, 0, 0]
          },
          starsEnabled: false,
          atmosphereEnabled: false
        },
        camera: {
          position: {
            spatialReference: SpatialReference.WebMercator,
            x: -12308222.0,
            y: 4933000.0,
            z: 8000.0
          },
          heading: 0,
          tilt: 60
        },
        spatialReference: SpatialReference.WebMercator,
        viewingMode: "local",
        qualityProfile: "high",
        clippingArea: config.extent
      });

      tin.createGeometry()
        .then(function (mesh) {
          const graphic = new Graphic({
            geometry: mesh,
            symbol: {
              type: "mesh-3d",
              symbolLayers: [{ type: "fill" }]
            }
          });

          view.graphics.add(graphic);

          // Create elevation sampler to add z values to
          // to features in layer
          // meshUtils.createElevationSampler(mesh)
          //   .then(function(sampler) {
          //     utils.setZValues(layer, sampler, 0);
          //   });

          view.when(function() {
            watchUtils.whenFalseOnce(view, "updating", function() {
                document.getElementsByTagName("canvas")[0].style.filter = "opacity(1)";
                document.getElementById("loader").style.display = "none";
          
                // const editor = new Editor({
                //   view: view,
                //   layerInfos: [ editConfigBuildingsLayer ],
                //   supportingWidgetDefaults: {
                //     featureTemplates: {}
                //   }
                // });
                // view.ui.add(editor, "top-right");
          
                
            });
          });
        });

 
     
      let symbol = {
        type: "mesh-3d",  // autocasts as new MeshSymbol3D()
        symbolLayers: [{
          type: "fill",  // autocasts as new FillSymbol3DLayer()
          material: { color: "red" }
        }]
      };
     
      const buildingsPointsLayer = new FeatureLayer({
        url: "https://services3.arcgis.com/pc3XoC7xWFtxUKdH/arcgis/rest/services/Layer_1/FeatureServer",
        renderer: {
          type: "simple",  // autocasts as new SimpleRenderer()
          symbol: symbol
        },
        returnZ: true,
        elevationInfo: { mode: "on-the-ground" }
      });

      buildingsPointsLayer.on("layer-view-create", function(evt){
        //The LayerView for the layer that emitted this event
        console.info(evt.layerView);
      });

      map.add(buildingsPointsLayer);
      
      console.log(map);
      const editConfigBuildingsLayer = { layer: " "};

      view.map.layers.forEach((layer) => {
        editConfigBuildingsLayer.layer = layer;
      });



      const mapExtent = new Extent(config.extent);
      const center = mapExtent.center;

    }
  }
})
