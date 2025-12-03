"use client";

import { useEffect, useState } from "react";
import SearchableDropdown from "@/components/SearchableDropdown";

export default function LocationPage() {
  const API = process.env.NEXT_PUBLIC_CSC_API!;

  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);

  useEffect(() => {
    fetch("https://api.countrystatecity.in/v1/countries/IN/states", {
      headers: { "X-CSCAPI-KEY": API },
    })
      .then((res) => res.json())
      .then((data) =>
        setStates(data.map((s: any) => ({ id: s.iso2, name: s.name })))
      );
  }, []);

  useEffect(() => {
    if (!selectedState) return;

    fetch(
      `https://api.countrystatecity.in/v1/countries/IN/states/${selectedState.id}/cities`,
      { headers: { "X-CSCAPI-KEY": API } }
    )
      .then((res) => res.json())
      .then((data) =>
        setDistricts(data.map((d: any) => ({ id: d.id, name: d.name })))
      );
  }, [selectedState]);

  // 3️⃣ Load Cities (same response, but filtered per district)
  useEffect(() => {
    if (!selectedDistrict) return;

    const sameCity = districts.filter(
      (d: any) => d.name === selectedDistrict.name
    );

    setCities(sameCity);
  }, [selectedDistrict]);

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">

      <h1 className="text-2xl font-bold">India Location Selector (FREE API)</h1>

      {/* State */}
      <SearchableDropdown
        label="State"
        options={states}
        value={selectedState}
        onSelect={(item: any) => {
          setSelectedState(item);
          setSelectedDistrict(null);
          setSelectedCity(null);
        }}
      />

      {/* District */}
      {selectedState && (
        <SearchableDropdown
          label="District"
          options={districts}
          value={selectedDistrict}
          onSelect={(item: any) => {
            setSelectedDistrict(item);
            setSelectedCity(null);
          }}
        />
      )}

      {/* City */}
      {selectedDistrict && (
        <SearchableDropdown
          label="City"
          options={cities}
          value={selectedCity}
          onSelect={(item: any) => setSelectedCity(item)}
        />
      )}

      {/* Show Output */}
      {selectedCity && (
        <div className="p-4 border rounded bg-green-50 mt-4">
          <h2 className="font-bold">Selected Location:</h2>
          <p>State: {selectedState.name}</p>
          <p>District: {selectedDistrict.name}</p>
          <p>City: {selectedCity.name}</p>
        </div>
      )}
    </div>
  );
}
