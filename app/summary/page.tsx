import React from "react";
import Table from "@/components/Table";
import TestDb from "@/components/TestDb";

export default function SummaryPage() {
  return (
    <section>
      <TestDb />
      <Table />
    </section>
  );
}