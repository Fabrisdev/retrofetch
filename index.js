import Jimp from 'jimp'
import chalk from 'chalk'
import fs from 'node:fs'
import args from 'args'
import { ASCII_OUTPUT_FILE_PATH, GAP, IMAGE_SIZE, IMAGE_HORIZONTAL_SCALE } from './consts.js'
import { getUserStats } from './info-scrapper.js'
import os from 'node:os'

args.option("image", "The image to show next to your stats")

const flags = args.parse(process.argv)
const imageName = flags.image

if(imageName){
    let image = (await readImage(imageName)).resize(IMAGE_SIZE, IMAGE_SIZE)
    const text = await imageToText(image) 
    updateAsciiFile(text)
    console.log(chalk.green("✅ Done! The image has updated succesfully."))
    process.exit(0)
}

const imageText = fs.readFileSync(ASCII_OUTPUT_FILE_PATH, "utf8", err => {
    console.error(chalk.red(`❌ An error ocurred while trying to show the image: ${error}`))
    process.exit(1)
})

const statsText = getUserStats()
const imageTextSplittedByLine = imageText.split(os.EOL)
const statsTextSplittedByLine = statsText.split(os.EOL)
let textToShow = ""
const maxLineSize = Math.max(...getLinesSizes(statsText))
const startPadding = Math.floor(process.stdout.columns / 2 - maxLineSize / 2)
for(let x = 0; x < Math.max(IMAGE_SIZE, statsTextSplittedByLine.length); x++){
    const imageLine = imageTextSplittedByLine[x] ?? ""
    const statsLine = statsTextSplittedByLine[x] ?? ""
    const line = `${"".padStart(startPadding)}${imageLine}${"".padStart(GAP)}${statsLine}${os.EOL}`
    textToShow += line
}
console.log(textToShow)

function getLinesSizes(statsText){
    const linesSizes = []
    const statsTextSplittedByLine = statsText.split(os.EOL)
    for(let x = 0; x < Math.max(IMAGE_SIZE, statsTextSplittedByLine.length); x++){
        const statsLine = statsTextSplittedByLine[x] ?? ""
        const lineSize = IMAGE_HORIZONTAL_SCALE * IMAGE_SIZE + GAP + statsLine.length
        linesSizes.push(lineSize)
    }
    return linesSizes
}

async function imageToText(image){
    const { width, height } = image.bitmap
    let imageOutput = ""
    for(let y = 0; y < height; y++){
        let lineText = ""
        for(let x = 0; x < width; x++){
            const { r, g, b } = await getPixelColorInRGB({
                image, x, y
            })
            lineText += chalk.bgRgb(r, g, b).bold("").padStart(IMAGE_HORIZONTAL_SCALE)
        }
        imageOutput += `${lineText}${os.EOL}`
    }
    return imageOutput
}

function updateAsciiFile(ascii){
    try{
        fs.writeFileSync(ASCII_OUTPUT_FILE_PATH, ascii)
    }catch{
        console.error(chalk.red(`❌ An error ocurred while trying to write to the output ascii file: ${error}`))
        process.exit(1)
    }
}

async function readImage(imageName){
    let image
    try{
        image = await Jimp.read(imageName)
    }catch(error){
        console.error(chalk.red(`❌ An error ocurred while trying to read the image: ${error}`))
        process.exit(1)
    }
    return image
}

async function getPixelColorInRGB({ image, x, y }){
    const colorInHex = image.getPixelColor(x, y)
    return Jimp.intToRGBA(colorInHex)
}