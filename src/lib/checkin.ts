import { nanoid } from "nanoid";

export function generateCheckinCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateCheckinToken() {
  return nanoid(24);
}
