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
import { loadRatesFromProvider } from '@/services/coinbase';

interface WalletsOnNowModalProps {
  data: CoinsForChartData[];
}

const WalletsOnNowModal = ({ data }: WalletsOnNowModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [dataWithNewRates, setDataWithNewRates] = useState<CoinsForChartData[]>(
    [],
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (!isOpen || !data) return;

    setDataWithNewRates([]);

    const fetchData = async () => {
      const rates = await loadRatesFromProvider(data.map((coin) => coin.symbol));

      setDataWithNewRates(data.map((coin) => ({
        symbol: coin.symbol,
        amount: coin.amount,
        rate: rates[coin.symbol] || 0,
        total: (rates[coin.symbol] || 0) * coin.amount,
        difference: (rates[coin.symbol] || 0) * coin.amount - (coin.rate * coin.amount) ,
      })));

      setIsLoading(false);
    };

    fetchData();
  }, [isOpen, data]);

  return (
    <>
      <Button isIconOnly onClick={onOpen} onTouchEnd={onOpen} variant={"light"}>
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
                  {isLoading ? (
                    `Loading rates...`
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
