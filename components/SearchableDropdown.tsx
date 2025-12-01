"use client";

import { useState } from "react";
import indiaData from "@/data/india.json";

export default function LocationSelector() {
  const [country] = useState("India");

  const [searchState, setSearchState] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState("");

  const data = indiaData as Record<string, any>;
  const states = data[country].states;

  const filteredStates = states.filter((st: any) =>
    st.name.toLowerCase().includes(searchState.toLowerCase())
  );

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      {/* STATE SEARCH INPUT */}
      <div className="relative">
        <label className="font-semibold">Search State</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Type 'Maha' → suggestions appear"
          value={searchState}
          onChange={(e) => {
            setSearchState(e.target.value);
            setShowSuggestions(true);
          }}
        />

        {/* AUTO-SUGGESTIONS */}
        {showSuggestions && searchState.length > 0 && (
          <ul className="absolute left-0 right-0 bg-white border rounded shadow-lg max-h-60 overflow-auto z-10">
            {filteredStates.length === 0 && (
              <li className="p-2 text-gray-500">No State Found</li>
            )}

            {filteredStates.map((st: any) => (
              <li
                key={st.name}
                onClick={() => {
                  setSelectedState(st);
                  setSelectedDistrict(null);
                  setSelectedCity("");
                  setSearchState(st.name);
                  setShowSuggestions(false);
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {st.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* DISTRICT DROPDOWN */}
      {selectedState && (
        <div>
          <label className="font-semibold">District</label>
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => {
              const distObj = selectedState.districts.find(
                (d: any) => d.name === e.target.value
              );
              setSelectedDistrict(distObj);
              setSelectedCity("");
            }}
          >
            <option value="">Select District</option>
            {selectedState.districts.map((d: any) => (
              <option key={d.name} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* CITY DROPDOWN */}
      {selectedDistrict && (
        <div>
          <label className="font-semibold">City</label>
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">Select City</option>
            {selectedDistrict.cities.map((c: string) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* SHOW FINAL OUTPUT */}
      {selectedState && selectedDistrict && selectedCity && (
        <div className="p-4 border rounded bg-green-50 font-semibold">
          <p>State: {selectedState.name}</p>
          <p>District: {selectedDistrict.name}</p>
          <p>City: {selectedCity}</p>
        </div>
      )}
    </div>
  );
}
