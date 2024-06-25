import { Partner } from "./partner";
import { Collection } from "./collection";

export interface Item {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  partner: Partner;
  collection: Collection;
}
