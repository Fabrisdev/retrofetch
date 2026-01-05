import fs from "node:fs";
import { ASCII_OUTPUT_FILE_PATH } from "./consts";
import { logger } from "./logger";

export function tryFindImageText() {
	try {
		return fs.readFileSync(ASCII_OUTPUT_FILE_PATH, "utf8");
	} catch {
		return logger
			.error(
				`Logo image has not yet been set. Please configure it with --image`,
			)
			.crash();
	}
}
