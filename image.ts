import fs from "node:fs/promises";
import { ASCII_OUTPUT_FILE_PATH } from "./consts";

export async function getImageText() {
	return fs.readFile(ASCII_OUTPUT_FILE_PATH, "utf8");
}
