import fs from "fs"

interface ConfigType{
    MAIN_ADDRESS: string,
    MAIN_ADDRESS_MNEMONICS: string,
    apiKey: string
}

const configFile = fs.readFileSync('./environment.json', "utf-8");
export const config = JSON.parse(configFile) as ConfigType;
