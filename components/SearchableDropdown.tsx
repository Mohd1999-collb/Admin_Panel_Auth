"use client";
import { useState, useEffect, useRef } from "react";

export default function SearchableDropdown({
  label,
  options = [],
  value,
  onSelect,
}: any) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<any>(null);

  // Close dropdown when click outside
  useEffect(() => {
    const handleClick = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = options.filter((item: any) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative w-full">
      <label className="font-semibold">{label}</label>

      <input
        type="text"
        placeholder={`Search ${label}...`}
        value={value?.name || search}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        onClick={() => setOpen(!open)}
        className="w-full p-3 border rounded mt-1"
      />

      {open && (
        <ul className="absolute z-20 w-full bg-white border rounded mt-1 max-h-60 overflow-y-auto shadow">
          {filtered.length === 0 && (
            <li className="p-2 text-gray-500">No results</li>
          )}
          {filtered.map((item: any) => (
            <li
              key={item.id}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                onSelect(item);
                setOpen(false);
                setSearch("");
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
