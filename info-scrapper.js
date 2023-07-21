import os from 'node:os'
import { exec } from 'node:child_process'

const { username, shell } = os.userInfo()
const hostname = os.hostname()
const shellWithoutPath = shell.split('/').at(-1) //this may not work on Windows
const timeFormatter = new Intl.RelativeTimeFormat('en', { style: "long" })
const screenRes = getScreenResolution() // Optimize this with promises (promisify) later

export function getUserStats(){
return (
`${username}@${hostname}
--------------
OS: Arch Linux x86_64
Kernel: 6.4.4-arch1-1
Uptime: ${timeFormatter.format(-os.uptime()/60/60/24, "days")}
Shell: ${shellWithoutPath}
Resolution: ${screenRes}
DE: qtile
WM: LG3D
Theme: deepin-dark [GTK2/3]
Icons: bloom [GTK2/3]
Terminal: alacritty
Terminal Font: Cascadia Code
CPU: Intel i3-6100 (4) @ 3.700GHz
GPU: NVIDIA GeForce GTX 1060 3GB
GPU: Intel HD Graphics 530
Memory: 5247MiB / 7832MiB`)
}

//This will only work on linux for the moment
function getScreenResolution(){
    let output 
    exec("xrandr 2> /dev/null | grep \* | cut -d ' ' -f4", (err, stdout) => {
        if(err){
            if(process.platform === "win32"){
                output = "❌ Can't get info on Windows"
                return
            }
            console.error(chalk.red(`❌ An error ocurred while trying to get the screen resolution: ${error}`))
            process.exit(1)
        }
        output = stdout
    })
    return output
}