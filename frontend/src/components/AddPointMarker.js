import React from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";
import addPointIconUrl from "../assets/add_point.svg";

const AddPointMarker = ({ coords }) => {
  const icon = L.icon({
    iconUrl: addPointIconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  return <Marker position={[coords.lat, coords.lng]} icon={icon} />;
};

export default AddPointMarker;
