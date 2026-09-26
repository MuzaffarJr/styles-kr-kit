import {
  createDataPixelArcRenderer,
  DATA_PIXEL_ARC_DEFAULTS,
} from "../../../../vendor/threeui/src/data-pixel-arc/dataPixelArcRenderer";
import { adaptThreeUI } from "./adapt";

/** ThreeUI Community "Data Pixel Arc" (MIT, © Meng To). Canvas 2D — WebGL shart emas. */
export default adaptThreeUI(createDataPixelArcRenderer, { ...DATA_PIXEL_ARC_DEFAULTS });
