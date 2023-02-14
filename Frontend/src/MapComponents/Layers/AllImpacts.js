import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {GeoJSON} from "ol/format";


const allImpacts = new VectorLayer({
    source: new VectorSource({
        url: 'http://localhost:8080/geoserver/quaketext/ows?service=' +
            'WFS&version=1.0.0&request=GetFeature&typeName=quaketext:quake_text' +
            '&maxFeatures=1000&outputFormat=application/json',
        format: new GeoJSON(),
    }),
    title: 'Impact Layer'

});


export default allImpacts;