import React from 'react';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';

export default class Maps extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            center: [0, 0],
            zoom: 0,
            myMap: new Map({
                target: "",
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    }),
                ],
                view: new View({
                    center: [0, 0],
                    zoom: 0,
                })
            })
        };
    }

    componentDidMount() {

        this.state.myMap.setTarget("map-container");

    }

    render() {
        return (
            <div style={{height: '500px', width: '500px'}} id="map-container" className="map-container"/>
        );
    }
}