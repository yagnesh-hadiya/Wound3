import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { WoundHistoryListType } from "../../../../../types/ManagePatientType";

interface WoundHistoryGraphProps {
  woundHistoryData: WoundHistoryListType[];
  selectedWound?: WoundHistoryListType | null;
}

const WoundHistoryGraph: React.FC<WoundHistoryGraphProps> = ({
  woundHistoryData,
  selectedWound,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    const labels = woundHistoryData.map((item) => new Date(item.scanDateTime));
    const volumes = woundHistoryData.map((item) => item.volume);
    const areas = woundHistoryData.map((item) => item.area);
    const depths = woundHistoryData.map((item) => item.depth);

    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        // Destroy the previous chart instance if it exists
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        // Create new chart instance
        chartInstanceRef.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Volume (cm³)",
                data: volumes,
                borderColor: "#a7aaff",
                yAxisID: "y-volume",
                fill: false,
                cubicInterpolationMode: "monotone",
                tension: 0.4,
              },
              {
                label: "Area (cm²)",
                data: areas,
                borderColor: "green",
                yAxisID: "y-area",
                fill: false,
                cubicInterpolationMode: "monotone",
              },
              {
                label: "Depth (cm)",
                data: depths,
                borderColor: "red",
                yAxisID: "y-depth",
                fill: false,
                cubicInterpolationMode: "monotone",
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              x: {
                type: "time",
                time: {
                  unit: "day",
                },
              },
              "y-volume": {
                type: "linear",
                display: true,
                position: "left",
              },
              "y-area": {
                type: "linear",
                display: false,
                position: "right",

                grid: {
                  drawOnChartArea: false,
                },
              },
              "y-depth": {
                type: "linear",
                display: true,
                position: "right",

                grid: {
                  drawOnChartArea: false,
                },
              },
            },
          },
        });
      }
    }

    // Cleanup function to destroy chart instance on component unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [woundHistoryData]);

  return (
    <div className="main-graph">
      <div className="p-2 pb-0">
        <canvas ref={chartRef} />
      </div>
      <div className="graph-data">
        <div>
          <div className="d-flex purple-data">
            <div className="line"></div>
            <div className="d-flex flex-column">
              <span>Volume</span>
              <h6>{selectedWound?.volumeText}</h6>
            </div>
          </div>
          {selectedWound?.volumeDelta && (
            <div className="box-wrapper">
              <div
                className={`${
                  parseFloat(selectedWound?.volumeDelta.toString()) > 0
                    ? "border-line"
                    : "border-line-green"
                }`}
              >
                <span
                  style={{
                    color:
                      parseFloat(selectedWound?.volumeDelta.toString()) > 0
                        ? "red"
                        : "green",
                  }}
                >
                  {parseFloat(selectedWound?.volumeDelta.toString()) > 0
                    ? "↑"
                    : "↓"}{" "}
                  {Math.abs(parseFloat(selectedWound?.volumeDelta.toString()))}
                  {"%"}
                </span>
              </div>
              <span>Vs last Scan</span>
            </div>
          )}
        </div>
        <div>
          <div className="d-flex purple-data green">
            <div className="line"></div>
            <div className="d-flex flex-column">
              <span>Area</span>
              <h6>{selectedWound?.areaText}</h6>
            </div>
          </div>
          {selectedWound?.areaDelta && (
            <div className="box-wrapper">
              <div
                className={`${
                  parseFloat(selectedWound?.areaDelta.toString()) > 0
                    ? "border-line"
                    : "border-line-green"
                }`}
              >
                <span
                  style={{
                    color:
                      parseFloat(selectedWound?.areaDelta.toString()) > 0
                        ? "red"
                        : "green",
                  }}
                >
                  {parseFloat(selectedWound?.areaDelta.toString()) > 0
                    ? "↑"
                    : "↓"}{" "}
                  {Math.abs(parseFloat(selectedWound?.areaDelta.toString()))}
                  {"%"}
                </span>
              </div>
              <span>Vs last Scan</span>
            </div>
          )}
        </div>
        <div>
          <div className="d-flex purple-data red">
            <div className="line"></div>
            <div className="d-flex flex-column">
              <span>Depth</span>
              <h6>{selectedWound?.depthText}</h6>
            </div>
          </div>
          {selectedWound?.depthDelta && (
            <div className="box-wrapper">
              <div
                className={`${
                  parseFloat(selectedWound?.depthDelta.toString()) > 0
                    ? "border-line"
                    : "border-line-green"
                }`}
              >
                <span
                  style={{
                    color:
                      parseFloat(selectedWound?.depthDelta.toString()) > 0
                        ? "red"
                        : "green",
                  }}
                >
                  {parseFloat(selectedWound?.depthDelta.toString()) > 0
                    ? "↑"
                    : "↓"}{" "}
                  {Math.abs(parseFloat(selectedWound?.depthDelta.toString()))}
                  {"%"}
                </span>
              </div>
              <span>Vs last Scan</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WoundHistoryGraph;
