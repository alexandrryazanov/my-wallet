"use client";

import React from "react";
import { ResponsivePie } from "@nivo/pie";

import { formatValue } from "@/services/calc";
import { CoinsForChartData } from "@/types/coins";

interface WalletPieChartProps {
  chartData: CoinsForChartData[];
}

const WalletPieChart = ({ chartData }: WalletPieChartProps) => {
  const data = chartData.map((coin) => ({
    id: coin.symbol,
    label: coin.symbol,
    value: coin.total,
  }));

  return (
    <div className={"w-full h-full mt-12"}>
      <ResponsivePie
        data={data}
        margin={{ top: 50, right: 20, bottom: 80, left: 20 }}
        innerRadius={0.5}
        padAngle={4}
        cornerRadius={8}
        activeOuterRadiusOffset={8}
        borderWidth={2}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        valueFormat={formatValue}
        arcLinkLabelsSkipAngle={4}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsOffset={10}
        arcLinkLabelsDiagonalLength={20}
        arcLinkLabelsStraightLength={30}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
      />
    </div>
  );
};

export default WalletPieChart;
