import { Q } from "../data/questions";

export const UNIT_SIZE = 10;
export const UNITS = Array.from({ length: 13 }, (_, i) =>
  Q.slice(i * UNIT_SIZE, i * UNIT_SIZE + UNIT_SIZE),
); // unit 13 has 8
