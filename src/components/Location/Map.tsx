import { LatLngTuple } from 'leaflet'
import React from 'react'
import { MapContainer, Marker, ZoomControl, Popup } from 'react-leaflet'
import { GeoLocation } from '../../data/location'
import { BaseLayerControl } from './BaseLayerControl'
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import { LocationInfo } from './LocationInfo'

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 40],
    iconAnchor: [12, 40],
    popupAnchor: [0, -30]
});

L.Marker.prototype.options.icon = DefaultIcon;

export interface MapProps {
    location: GeoLocation | undefined | null,
}

export const Map = ({ location }: MapProps) => {

    const center: LatLngTuple = location?.coordinates
        ? [location.coordinates.lat, location.coordinates.lng]
        : [63.4305, 10.3951]

    return (
        <MapContainer style={{ width: '100%', height: 250 }} center={center} zoom={9} scrollWheelZoom={false} dragging={false} zoomControl={false}>
            <ZoomControl position='bottomright' />
            <BaseLayerControl center={center} />
            {location && <Marker position={center}>
                <Popup >
                    <LocationInfo location={location}/>
                </Popup>
            </Marker>}
        </MapContainer>
    )
}
