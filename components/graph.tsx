"use client";

import { AreaChart, CustomTooltipProps } from "@tremor/react";
import { useState, useEffect } from "react";
import { AllLogData, LogData } from "@/components/homePage";
import Controls from "./controls";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://kl81k3q0-5000.inc1.devtunnels.ms";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const processLogs = (logs: string[]): LogData => {
  const counts = {
    "High Priority": 0,
    "Medium Priority": 0,
    "Low Priority": 0,
  };

  logs.forEach((log) => {
    const threatLevel = log.split("Threat Level:")[1].trim();
    if (threatLevel === "High") counts["High Priority"]++;
    else if (threatLevel === "Medium") counts["Medium Priority"]++;
    else if (threatLevel === "Low") counts["Low Priority"]++;
  });

  return {
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    ...counts,
  };
};
const processAllLogs = (logs: string[]): AllLogData[] => {
  return logs.map((log) => {
    const [domain, source, destination, threatLevel] = log.split(" | ");
    return {
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      Domain: domain,
      Source: source,
      Destination: destination,
      ThreatLevel: threatLevel,
    };
  });
};

const fetchLogData = async (): Promise<{
  processLogs: LogData;
  allLogs: AllLogData[];
}> => {
  const start = await fetch(`${BACKEND_URL}/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!start.ok) {
    throw new Error("Failed to start");
  }
  const response = await fetch(`${BACKEND_URL}/logs`);
  if (!response.ok) {
    throw new Error("Failed to fetch logs");
  }
  const logs = await response.json();
  return {
    processLogs: processLogs(logs),
    allLogs: processAllLogs(logs),
  };
};
const UPDATE_INTERVAL = 15000; // 15 seconds

export default function Graph({
  shouldStart,
  setShouldStart,
  setLogs,
  setAllLogs,
}: {
  shouldStart: boolean;
  setShouldStart: (shouldStart: boolean) => void;
  logs: LogData[];
  setLogs: React.Dispatch<React.SetStateAction<LogData[]>>;
  allLogs: AllLogData[];
  setAllLogs: React.Dispatch<React.SetStateAction<AllLogData[]>>;
}) {
  const [data, setData] = useState<LogData[]>(() => {
    // Initialize with empty data points
    return Array(20).fill({
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      "High Priority": 0,
      "Medium Priority": 0,
      "Low Priority": 0,
    });
  });

  const [summary, setSummary] = useState([
    {
      category: "High Priority",
      total: "0/s",
      color: "bg-red-500",
    },
    {
      category: "Medium Priority",
      total: "0/s",
      color: "bg-yellow-500",
    },
    {
      category: "Low Priority",
      total: "0/s",
      color: "bg-green-500",
    },
    {
      category: "Total Logs",
      total: "0/s",
      color: null,
    },
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const updateData = async () => {
      try {
        const { processLogs, allLogs } = await fetchLogData();
        console.log(allLogs);

        setData((currentData) => {
          const newData = [...currentData.slice(1), processLogs];

          // Update summary with latest values
          setSummary((prev) => [
            { ...prev[0], total: `${processLogs["High Priority"]}/s` },
            { ...prev[1], total: `${processLogs["Medium Priority"]}/s` },
            { ...prev[2], total: `${processLogs["Low Priority"]}/s` },
            {
              ...prev[3],
              total: `${
                processLogs["High Priority"] +
                processLogs["Medium Priority"] +
                processLogs["Low Priority"]
              }/s`,
            },
          ]);

          return newData;
        });
        setLogs(data);
        setAllLogs((prev) => [...prev, ...allLogs]);
      } catch (error) {
        console.error("Error fetching log data:", error);
        // If there's an error, stop the fetching
        setShouldStart(false);
      }
    };

    if (shouldStart) {
      // Initial fetch when starting
      updateData();
      // Set up interval for subsequent fetches
      interval = setInterval(updateData, UPDATE_INTERVAL);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [shouldStart, setShouldStart]); // Add dependencies

  function logsFormatter(number: number) {
    return `${number}/s`;
  }

  const customTooltip = (props: CustomTooltipProps) => {
    const { payload, active, label } = props;
    if (!active || !payload) return null;
    return (
      <div className="rounded-tremor-default border border-tremor-border bg-tremor-background text-tremor-default shadow-tremor-dropdown dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:shadow-dark-tremor-dropdown">
        <div className="border-b border-tremor-border px-4 py-2 dark:border-dark-tremor-border">
          <p className="font-medium text-tremor-content dark:text-dark-tremor-content">
            {label}
          </p>
        </div>
        <div className="px-4 py-2">
          <div className="mt-2 space-y-1">
            {payload.map((category, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between space-x-8"
              >
                <div className="flex items-center space-x-2">
                  <span
                    className={`h-1 w-3 shrink-0 rounded-sm ${
                      category.dataKey === "High Priority"
                        ? "bg-red-500"
                        : category.dataKey === "Medium Priority"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    aria-hidden={true}
                  />
                  <p className="text-tremor-content dark:text-dark-tremor-content">
                    {category.dataKey}
                  </p>
                </div>
                <span className="font-medium tabular-nums text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  {logsFormatter(category.value as number)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="sm:mx-auto sm:w-full">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-3xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
            🛡 DNS Guard
            </h3>
            <p className="text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
              Real-time Network Vulnerabilities Checker
            </p>
          </div>
          <Controls shouldStart={shouldStart} setShouldStart={setShouldStart} />
        </div>
        <ul role="list" className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {summary.map((item, index) => (
            <li key={index}>
              <div className="flex space-x-3">
                {item.color && (
                  <span
                    className={classNames(item.color, "w-1 shrink-0 rounded")}
                    aria-hidden={true}
                  />
                )}
                <p className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  {item.total}
                </p>
              </div>
              {item.color !== null ? (
                <p className="pl-4 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                  {item.category}
                </p>
              ) : (
                <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                  {item.category}
                </p>
              )}
            </li>
          ))}
        </ul>
        <AreaChart
          data={data}
          index="timestamp"
          categories={["High Priority", "Medium Priority", "Low Priority"]}
          colors={["red", "yellow", "green"]}
          showLegend={true}
          showGradient={false}
          yAxisWidth={55}
          valueFormatter={logsFormatter}
          customTooltip={customTooltip}
          className="mt-10 hidden h-72 sm:block"
        />
        <AreaChart
          data={data}
          index="timestamp"
          categories={["High Priority", "Medium Priority", "Low Priority"]}
          colors={["red", "yellow", "green"]}
          showLegend={true}
          showGradient={false}
          showYAxis={false}
          startEndOnly={true}
          valueFormatter={logsFormatter}
          customTooltip={customTooltip}
          className="mt-6 h-72 sm:hidden"
        />
      </div>
    </>
  );
}
