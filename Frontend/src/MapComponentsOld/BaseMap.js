import './MapStyle.css';
import React, {useEffect, useRef, useState} from 'react';
import 'ol/ol.css';
//import TileWMS from 'ol/source/TileWMS';
import Map from 'ol/Map';
import View from 'ol/View';
import 'ol/ol.css';
import OSM from 'ol/source/OSM';
import {Tile as TileLayer} from 'ol/layer';
//import {ImageWMS} from "ol/source";
import {Group} from "ol/layer";
//import {Image} from "ol/layer"
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {GeoJSON} from "ol/format";
import {Fill, Stroke, Style} from "ol/style";

const base = new Group({
    'title': 'Base maps',
    layers: [
        new TileLayer({
            title: 'OSM',
            type: 'base',
            visible: true,
            source: new OSM()
        })
    ]
});
/*
For use with WMS Layer:
const overlays = new Group({
    'title': 'Overlays',
    layers: [
        new Image({
            title: 'countries',
            visible: true,
            source: new ImageWMS({
                url: 'http://localhost:8080/geoserver/wms',
                params: {'LAYERS': 'quaketext:quake_text'},
                ratio: 1,
                serverType: 'geoserver'
            })
        })
    ]
});

*/

const vectorLayer = new VectorLayer({
    source: new VectorSource({
        url: 'http://localhost:8080/geoserver/quaketext/ows?service=' +
            'WFS&version=1.0.0&request=GetFeature&typeName=quaketext:quake_text' +
            '&maxFeatures=50&outputFormat=application/json',
        format: new GeoJSON(),
    })
});
/*
const selectStyle = new Style({
    fill: new Fill({
        color: '#eeeeee',
    }),
    stroke: new Stroke({
        color: 'rgba(255, 255, 255, 0.7)',
        width: 2,
    }),
});

function addHover(initialMap) {
    let selected = null;
    initialMap.on('pointermove', function (e) {
        if (selected !== null) {
            selected.setStyle(undefined);
            selected = null;
        }

        initialMap.forEachFeatureAtPixel(e.pixel, function (f) {
            selected = f;
            selectStyle.getFill().setColor(f.get('COLOR') || '#eeeeee');
            f.setStyle(selectStyle);
            return true;
        });

    });
}

 */

function BaseMap() {
    const [map, setMap] = useState();
    const mapElement = useRef();
    const mapRef = useRef();
    mapRef.current = map;

    useEffect(() => {
        const initialMap = new Map({
            target: mapElement.current,
            layers: [base, vectorLayer],
            view: new View({
                projection: 'EPSG:4326',
                center: [78.0, 23.0],
                zoom: 3,
                minZoom: 2,
                maxZoom: 18,
            }),
        });
       // addHover(initialMap);
        setMap(initialMap)
    }, []);
    return (
        <div ref={mapElement} className="map-container"/>
    );
}

export default BaseMap;