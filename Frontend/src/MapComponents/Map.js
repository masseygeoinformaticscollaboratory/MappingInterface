import React, {useEffect, useRef, useState} from "react";
import Map from "ol/Map";
import base from "./Layers/BaseLayer"
import vectorLayer from "./Layers/VectorLayer";
import view from "./MapStyle/mapView";
import './MapStyle/MapStyle.css';
import 'ol/ol.css';
import {setText} from "./MapStyle/PopUpStyle";
import {useProSidebar} from "react-pro-sidebar";
import SideBarComponent from "./sideBar";

function MapComponent(props) {
    const [map, setMap] = useState();
    const mapElement = useRef(null);
    const mapRef = useRef();
    //  const popupRef = useRef(null);
    // const popupContentRef = useRef(null);
    mapRef.current = map;

    const {collapseSidebar} = useProSidebar();


    useEffect(() => {
            const map = new Map({
                target: mapElement.current,
                layers: [base, vectorLayer],
                view: view
            });
            setMap(map)
            /*
                        const popup = new Overlay({
                            element: popupRef.current,
                            autoPan: true,
                            autoPanAnimation: {
                                duration: 250
                            }
                        });



                        map.addOverlay(popup);
                    */

            map.on("click", (event) => {

                let features = map.getFeaturesAtPixel(event.pixel);

                if (features && features.length > 0) {
                    //popupRef.current.style.display = "block"

                    let text = "";
                    let {location, coordinates, tweet, impact} = setText()

                    for (let i = 0; i < features.length; i++) {
                        //features[i].get("placename") for JSON
                        //features[i].get("instance") for CSV
                        text = text +
                            location + features[i].get("placename") + "\n" +
                            coordinates + features[i].get("geometry").flatCoordinates + "\n" +
                            tweet + features[i].get("tweet_text") + "\n" +
                            impact + features[i].get("impact_type") +
                            "\n \n"
                    }

                    collapseSidebar(false);

                    //popup.setPosition(features[0].get("geometry").flatCoordinates);
                    // popupContentRef.current.innerHTML = text;
                    // formatPopup(mapElement, popupRef);
                    mapElement.current.style.width = '85vw'


                }


            });
        },
        []);


    // function closePopup() {
    //   popupRef.current.style.display = "none";
    // }

    return (
        <main style={({display: "flex"})}>
            <SideBarComponent id="side-bar" collapseSidebar={collapseSidebar} mapElement = {mapElement}/>
            <div ref={mapElement} className="map-container"></div>
        </main>
    );
}

export default MapComponent;
