"use client";

import React, { useEffect, useState } from "react";
import { MdOutlineUpdate } from "react-icons/md";
import { Button } from "@nextui-org/react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { CoinsForChartData } from "@/types/coins";
import WalletPieChart from "@/components/WalletPieChart";
import { loadRateFromCoinbase } from "@/services/coinbase";

interface WalletsOnNowModalProps {
  data: CoinsForChartData[];
}

const WalletsOnNowModal = ({ data }: WalletsOnNowModalProps) => {
  const [coinIsLoading, setCoinIsLoading] = useState<string | undefined>();
  const [dataWithNewRates, setDataWithNewRates] = useState<CoinsForChartData[]>(
    [],
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (!isOpen || !data) return;

    setDataWithNewRates([]);

    const fetchData = async () => {
      for (const coin of data) {
        setCoinIsLoading(coin.symbol);
        const rate = await loadRateFromCoinbase(coin.symbol);
        setDataWithNewRates((prev) => {
          const newRate = rate || coin.rate;
          const total = newRate * coin.amount;
          const oldTotal = coin.rate * coin.amount;
          return [
            ...prev,
            {
              symbol: coin.symbol,
              amount: coin.amount,
              rate: newRate,
              total: newRate * coin.amount,
              difference: total - oldTotal,
            },
          ];
        });
      }
      setCoinIsLoading(undefined);
    };

    fetchData();
  }, [isOpen, data]);

  return (
    <>
      <Button isIconOnly onClick={onOpen} variant={"light"}>
        <MdOutlineUpdate size={24} />
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement={"center"}
        className={"max-w-[700px]"}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                All coins with current rates
              </ModalHeader>
              <ModalBody className={"mb-3"}>
                <section
                  className={
                    "w-full h-[550px] flex items-center justify-center"
                  }
                >
                  {coinIsLoading ? (
                    `Loading rate for ${coinIsLoading}...`
                  ) : (
                    <WalletPieChart
                      chartData={dataWithNewRates}
                      className={"mt-3"}
                    />
                  )}
                </section>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default WalletsOnNowModal;
