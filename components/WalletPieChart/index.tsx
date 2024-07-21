"use client";

import React from "react";
import { ResponsivePie } from "@nivo/pie";

import { formatValue } from "@/services/calc";
import { CoinsForChartData } from "@/types/coins";
import { PieCustomLayerProps } from "@nivo/pie/dist/types/types";
import { COLORS } from "@/config/colors";
import clsx from "clsx";

interface WalletPieChartProps {
  chartData: CoinsForChartData[];
  className?: string;
}

const WalletPieChart = ({ chartData, className }: WalletPieChartProps) => {
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
    <div className={clsx("w-full h-full", className)}>
      <ResponsivePie
        data={data}
        margin={{ top: 50, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.6}
        padAngle={2}
        cornerRadius={6}
        activeOuterRadiusOffset={8}
        borderWidth={2}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        valueFormat={formatValue}
        arcLinkLabelsSkipAngle={4}
        arcLinkLabelsTextColor={COLORS.MID_GRAY}
        arcLinkLabelsOffset={10}
        arcLinkLabelsDiagonalLength={20}
        arcLinkLabelsStraightLength={20}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        layers={["arcs", "arcLabels", "arcLinkLabels", CenteredText]}
        colors={{ scheme: "pastel2" }}
      />
    </div>
  );
};

export default React.memo(WalletPieChart);
