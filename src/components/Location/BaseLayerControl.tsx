import { LatLngTuple } from 'leaflet';
import React, { useEffect } from 'react'
import { LayersControl, TileLayer, useMap } from 'react-leaflet'

const apikey = process.env.REACT_APP_NORKART_API_KEY;

const layers = [
    {
        Name: 'grey',
        Tileset: 'webatlas-gray-vektor',
        Ext: 'png'
    },
    {
        Name: 'medium',
        Tileset: 'webatlas-medium-vektor',
        Ext: 'png'
    },
    {
        Name: 'lite',
        Tileset: 'webatlas-lite-vektor',
        Ext: 'png'
    },
    {
        Name: 'vector',
        Tileset: 'webatlas-standard-vektor',
        Ext: 'png'
    },
    {
        Name: 'aerial',
        Tileset: 'webatlas-orto-newup',
        Ext: 'jpeg'
    },
    {
        Name: 'hybrid',
        Tileset: 'webatlas-standard-hybrid',
        Ext: 'jpeg'
    }
]

interface Props {
    center: LatLngTuple
}

export const BaseLayerControl = ({center}: Props) => {
    const map = useMap()
    const defaultLayer = 'vector';
    
    useEffect(() => {
        center && map.flyTo(center)
        map.invalidateSize();
    }, [center, map])

    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 300)
    }, [map])

    return (
        <LayersControl position="bottomleft">
                {layers.map(l => (
                    <LayersControl.BaseLayer key={l.Name} checked={l.Name === defaultLayer} name={l.Name}>
                        <TileLayer
                            url={`https://waapi.webatlas.no/maptiles/tiles/${l.Tileset}/wa_grid/{z}/{x}/{y}.${l.Ext}?APITOKEN=${apikey}`}
                            attribution={`Norkart.`}
                        />
                    </LayersControl.BaseLayer>))}
            </LayersControl>
    )
}
