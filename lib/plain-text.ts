import { isValidElement } from "react";
import type { ReactNode } from "react";

export function plainTextFromNode(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(plainTextFromNode).join("");
  if (isValidElement(node) && node.props && typeof node.props === "object") {
    const p = node.props as { children?: ReactNode };
    if ("children" in p) return plainTextFromNode(p.children);
  }
  return "";
}
