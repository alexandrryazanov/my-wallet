import React from "react";
import { Card, CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Item } from "@/types/item";

const ItemCard = ({ item }: { item: Item }) => {
  return (
    <Card
      isFooterBlurred
      className="w-[300px] h-[400px] col-span-12 sm:col-span-7"
    >
      <Image
        removeWrapper
        alt="Image background"
        className="z-0 w-full h-full object-cover"
        src={item.imageUrl}
      />
      <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
        <div className="flex flex-grow gap-2 items-center">
          <div className="flex flex-col">
            <p className="text-tiny text-white/60">{item.name}</p>
            <p className="text-tiny text-white/60">
              {item.partner.name} / {item.collection.name}
            </p>
          </div>
        </div>
        <Button radius="full" size="sm" color={"primary"}>
          View
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
