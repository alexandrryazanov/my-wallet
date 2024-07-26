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

interface CoinData {
  id: string;
  label: string;
  value: number;
  difference?: number;
}

const Tooltip = ({ data }: { data: CoinData }) => {
  const sign = data.difference !== undefined && data.difference > 0 ? "+" : "";
  const formattedDifference = sign + formatValue(data.difference || 0);
  const formattedValue = formatValue(data.value);

  return (
    <div className={"px-2 py-1 bg-white rounded-lg shadow-small"}>
      <span>
        {data.label}: {formattedValue}
      </span>
      {data.difference !== undefined && (
        <span
          className={data.difference < 0 ? "text-danger" : "text-success-900"}
        >
          {" "}
          ({formattedDifference})
        </span>
      )}
    </div>
  );
};

const WalletPieChart = ({ chartData, className }: WalletPieChartProps) => {
  const data: CoinData[] = chartData.map((coin) => ({
    id: coin.symbol,
    label: coin.symbol,
    value: coin.total,
    difference: coin.difference,
  }));

  const total = chartData.reduce((acc, coin) => acc + coin.total, 0);
  const oldTotal = chartData.reduce(
    (acc, coin) => acc + coin.total - (coin.difference || 0),
    0,
  );

  const CenteredText = ({ centerX, centerY }: PieCustomLayerProps<any>) => {
    if (!total) return null;

    const difference = total - oldTotal;
    const sign = difference < 0 ? "" : "+";

    return (
      <>
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
        {difference !== 0 && (
          <text
            x={centerX}
            y={centerY + 27}
            textAnchor="middle"
            dominantBaseline="central"
            fill={difference < 0 ? COLORS.FUCHSIA : COLORS.DARK_GREEN}
            className={"text-md"}
          >
            {sign + formatValue(difference)}
          </text>
        )}
      </>
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
        tooltip={(e) => <Tooltip data={e.datum.data} />}
      />
    </div>
  );
};

export default React.memo(WalletPieChart);
