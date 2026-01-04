import { homedir } from "node:os";
import path from "node:path";

export const ASCII_OUTPUT_FILE_PATH = path.join(
	homedir(),
	".config",
	"retrofetch",
	"ascii.txt",
);
export const GAP = 10;
export const IMAGE_SIZE = 30;
export const IMAGE_HORIZONTAL_SCALE = 2;
