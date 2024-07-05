import React from "react";
import AddRecordButton from "@/components/AddRecordButton";
import SummaryTable from "@/components/SummaryTable";

export default function SummaryPage() {
  return (
    <section>
      <SummaryTable />
      <AddRecordButton />
    </section>
  );
}
