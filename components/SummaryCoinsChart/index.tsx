"use client";

import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { getDatabase, onValue, ref, Unsubscribe } from "@firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getAllCoinNames, getCoinsTableData } from "@/services/firebase";
import { Spinner } from "@nextui-org/spinner";
import { formatValue } from "@/services/calc";
import { Card } from "@nextui-org/card";

const SummaryCoinsChart = () => {
  const [rows, setRows] = useState<Record<string, number | string>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [columnNames, setColumnNames] = useState<string[]>([]);

  useEffect(() => {
    let unsubscribeDb: Unsubscribe | null;
    const auth = getAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const db = getDatabase();
      const userRef = ref(db, `data/${user.uid}`);

      unsubscribeDb = onValue(userRef, async (userSnapshot) => {
        setIsLoading(true);
        setColumnNames(getAllCoinNames(userSnapshot));
        setRows(getCoinsTableData(userSnapshot).reverse());
        setIsLoading(false);
      });
    });

    return () => {
      unsubscribeDb?.();
      unsubscribeAuth();
    };
  }, []);

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
      />
    </Card>
  );
};

export default SummaryCoinsChart;
