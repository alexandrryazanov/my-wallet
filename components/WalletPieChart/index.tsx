"use client";

import React from "react";
import { ResponsivePie } from "@nivo/pie";

import { formatValue } from "@/services/calc";
import { CoinsForChartData } from "@/types/coins";
import { PieCustomLayerProps } from "@nivo/pie/dist/types/types";
import { COLORS } from "@/config/colors";

interface WalletPieChartProps {
  chartData: CoinsForChartData[];
}

const WalletPieChart = ({ chartData }: WalletPieChartProps) => {
  const data = chartData.map((coin) => ({
    id: coin.symbol,
    label: coin.symbol,
    value: coin.total,
  }));

  const total = chartData.reduce((acc, coin) => acc + coin.total, 0);

  const CenteredText = ({ centerX, centerY }: PieCustomLayerProps<any>) => {
    if (!total) return null;
    return (
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="central"
        fill={COLORS.MID_GRAY}
        className={"text-2xl"}
        style={{ fontWeight: 600 }}
      >
        {formatValue(total)}
      </text>
    );
  };

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
        layers={["arcs", "arcLabels", "arcLinkLabels", CenteredText]}
      />
    </div>
  );
};

export default WalletPieChart;
