import AddRecordButton from "@/components/AddRecordButton";
import React from "react";
import SummaryCoinsTable from "@/components/SummaryCoinsTable";

export default function SummaryCoinsPage() {
  return (
    <section>
      <SummaryCoinsTable />
      <AddRecordButton />
    </section>
  );
}
