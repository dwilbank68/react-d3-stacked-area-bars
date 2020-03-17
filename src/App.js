import React, { useState } from "react";
import "./App.css";
import StackedAreaChart from "./StackedAreaChart.jsx";
import StackedBarChart from "./StackedBarChart.jsx";

const data = [
    { year: 1980, "🥑": 10, "🍌": 20, "🍆": 30 },
    { year: 1990, "🥑": 20, "🍌": 40, "🍆": 60 },
    { year: 2000, "🥑": 30, "🍌": 45, "🍆": 80 },
    { year: 2010, "🥑": 40, "🍌": 60, "🍆": 100 },
    { year: 2020, "🥑": 50, "🍌": 80, "🍆": 120 }
];
// d3.stack will convert the above array of objects into an array of 3 layers
// [ [avocado 1980-2020 vals],
//   [banana 1980-2020 vals],
//   [eggplant 1980-2020 vals] 
// according to the keys you specify

const allKeys = ["🥑", "🍌", "🍆"];

const colors = {
    "🥑": "green",
    "🍌": "orange",
    "🍆": "purple"
};

function App() {
    const [keys, setKeys] = useState(allKeys);
    return (
        <React.Fragment>
            <h2>Stacked Bar Chart with D3 </h2>
            <StackedAreaChart data={data} keys={keys} colors={colors} />
            <StackedBarChart data={data} keys={keys} colors={colors} />

            <div className="fields">
                {allKeys.map(key => (
                    <div key={key} className="field">
                        <input  id={key} type="checkbox"
                                checked={keys.includes(key)}
                                onChange={e => {
                                    if (e.target.checked) {
                                        setKeys(Array.from(new Set([...keys, key])));
                                    } else {
                                        setKeys(keys.filter(k => k !== key));
                                    }
                                }}/>
                        <label htmlFor={key} style={{ color: colors[key] }}>
                            {key}
                        </label>
                    </div>
                ))}
            </div>
        </React.Fragment>
    );
}

export default App;