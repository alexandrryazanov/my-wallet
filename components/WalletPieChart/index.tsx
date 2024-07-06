"use client";

import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { CoinsTableRow } from "@/types/coins";
import { formatValue } from "@/services/calc";

interface WalletPieChartProps {
  walletData: CoinsTableRow[];
}

const WalletPieChart = ({ walletData }: WalletPieChartProps) => {
  const data = walletData.map((coin) => ({
    id: coin.symbol,
    label: coin.symbol,
    value: coin.total,
  }));

  return (
    <div className={"w-full h-full mt-14"}>
      <ResponsivePie
        data={data}
        margin={{ top: 35, right: 0, bottom: 80, left: 0 }}
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
