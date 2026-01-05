import fs from "node:fs";
import os from "node:os";
import args from "args";
import chalk from "chalk";
import Jimp from "jimp";
import {
	ASCII_OUTPUT_FILE_PATH,
	GAP,
	IMAGE_HORIZONTAL_SCALE,
	IMAGE_SIZE,
} from "./consts.js";
import { getImageText } from "./image.js";
import { getUserStats } from "./info-scrapper.js";
import { logger } from "./logger.js";

args.option("image", "The image to show next to your stats");

const flags = args.parse(process.argv);
const imageName = flags.image;

if (imageName) {
	const image = (await readImage(imageName)).resize(
		IMAGE_SIZE,
		IMAGE_SIZE,
		Jimp.RESIZE_NEAREST_NEIGHBOR,
	);
	const text = await imageToText(image);
	updateAsciiFile(text);
	logger.success("Done! The image has updated succesfully.").exit();
}

const imageText = await getImageText().catch(() => {
	logger
		.error("Logo image has not yet been set. Please configure it with --image")
		.crash();
});

const statsText = getUserStats();
const imageTextSplittedByLine = imageText.split(os.EOL);
const statsTextSplittedByLine = statsText.split(os.EOL);
let textToShow = "";
const maxLineSize = Math.max(...getLinesSizes(statsText));
const startPadding = Math.floor(process.stdout.columns / 2 - maxLineSize / 2);
for (let x = 0; x < Math.max(IMAGE_SIZE, statsTextSplittedByLine.length); x++) {
	const imageLine = imageTextSplittedByLine[x] ?? "";
	const statsLine = statsTextSplittedByLine[x] ?? "";
	const line = `${"".padStart(startPadding)}${imageLine}${"".padStart(GAP)}${statsLine}${os.EOL}`;
	textToShow += line;
}
console.log(textToShow);

function getLinesSizes(statsText: string) {
	const linesSizes: number[] = [];
	const statsTextSplittedByLine = statsText.split(os.EOL);
	for (
		let x = 0;
		x < Math.max(IMAGE_SIZE, statsTextSplittedByLine.length);
		x++
	) {
		const statsLine = statsTextSplittedByLine[x] ?? "";
		const lineSize =
			IMAGE_HORIZONTAL_SCALE * IMAGE_SIZE + GAP + statsLine.length;
		linesSizes.push(lineSize);
	}
	return linesSizes;
}

async function imageToText(image: Jimp) {
	const { width, height } = image.bitmap;
	let imageOutput = "";
	for (let y = 0; y < height; y++) {
		let lineText = "";
		for (let x = 0; x < width; x++) {
			const { r, g, b } = await getPixelColorInRGB({
				image,
				x,
				y,
			});
			lineText += chalk
				.bgRgb(r, g, b)
				.bold("".padStart(IMAGE_HORIZONTAL_SCALE));
		}
		imageOutput += `${lineText}${os.EOL}`;
	}
	return imageOutput;
}

function updateAsciiFile(ascii: string) {
	try {
		fs.writeFileSync(ASCII_OUTPUT_FILE_PATH, ascii);
	} catch (error) {
		logger
			.error(
				`An error ocurred while trying to write to the output ascii file: ${error}`,
			)
			.crash();
	}
}

async function readImage(imageName: string) {
	try {
		return await Jimp.read(imageName);
	} catch (error) {
		return logger
			.error(`An error ocurred while trying to read the image: ${error}`)
			.crash();
	}
}

async function getPixelColorInRGB({
	image,
	x,
	y,
}: {
	image: Jimp;
	x: number;
	y: number;
}) {
	const colorInHex = image.getPixelColor(x, y);
	return Jimp.intToRGBA(colorInHex);
}
