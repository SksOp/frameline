import { Focus, Gift, MonitorSmartphone, ShieldCheck, Zap } from "lucide-react";
import type { SolutionIconKind } from "../studio-solutions";

export const solutionIcons = { focus: Focus, shield: ShieldCheck, device: MonitorSmartphone, bolt: Zap, gift: Gift } satisfies Record<SolutionIconKind, typeof Focus>;
