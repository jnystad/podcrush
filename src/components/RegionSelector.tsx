import { useState } from "react";
import "./RegionSelector.scss";

const regions: { [region: string]: string } = {
  us: "United States",
  ca: "Canada",
  gb: "United Kingdom",
  no: "Norway",
  dk: "Denmark",
  se: "Sweden",
};

function RegionSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [show, setShow] = useState(false);

  return (
    <div className="region-selector">
      <span className="value" onClick={() => setShow((s) => !s)}>
        {regions[value]}
      </span>
      {show && (
        <ul className="values">
          {Object.keys(regions).map((region) => (
            <li
              key={region}
              onClick={() => {
                onChange(region);
                setShow(false);
              }}
            >
              {regions[region]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RegionSelector;
