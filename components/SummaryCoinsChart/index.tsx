"use client";

import React, { useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Spinner } from "@nextui-org/react";
import { formatValue } from "@/services/calc";
import { Card } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useUserData } from "@/hooks/db";
import { coinNamesFrom, coinsTableData } from "@/services/db/transforms";

const SummaryCoinsChart = () => {
  const router = useRouter();

  const { data, isLoading } = useUserData();

  const columnNames = useMemo(() => coinNamesFrom(data), [data]);
  // `coinsTableData` returns a fresh array, so reversing it in place is safe.
  const rows = useMemo(() => coinsTableData(data).reverse(), [data]);

  if (isLoading)
    return (
      <div className={"w-full flex justify-center"}>
        <Spinner color={"white"} />
      </div>
    );

  return (
    <Card style={{ width: "100%", height: rows.length * 68 }}>
      <ResponsiveBar
        data={rows}
        valueFormat={formatValue}
        keys={columnNames}
        indexBy="date"
        margin={{ top: 10, right: 20, bottom: 50, left: 85 }}
        padding={0.3}
        layout="horizontal"
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "pastel2" }}
        labelSkipWidth={26}
        labelSkipHeight={12}
        role="application"
        ariaLabel="Summary coins chart"
        enableGridX
        enableGridY={false}
        axisBottom={{ format: formatValue }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "top-right",
            direction: "column",
            justify: false,
            translateX: -7,
            translateY: 10,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "right-to-left",
            itemOpacity: 0.85,
            symbolSize: 20,
          },
        ]}
        onClick={(d) => router.push(`/record/${d.data.key}`)}
      />
    </Card>
  );
};

export default SummaryCoinsChart;
