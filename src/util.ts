import * as fsExtra from 'fs-extra';
import type { Location, RokuHardwarePlatform } from './interfaces';
import { ProductionStatus } from './interfaces';

class Util {
    public isDirSync(dirPath: string) {
        return fsExtra.existsSync(dirPath) && fsExtra.lstatSync(dirPath).isDirectory();
    }

    public createLocation(path: string, line: number, character: number) {
        return {
            path: path,
            line: line,
            character: character
        } as Location;
    }

    public identifyPlatform(platformCodeName: string): RokuHardwarePlatform {
        const rokuPlatforms = this.getAllRokuPlatforms();
        // Try an exact match
        return rokuPlatforms.find(p => p.codeName.toLowerCase() === platformCodeName.toLowerCase()) ??
            // Try a partial match
            rokuPlatforms.find(p => p.codeName.toLowerCase().includes(platformCodeName.toLowerCase())) ??
            // Split the code name and try an exact match with each part
            rokuPlatforms.find(
                p => platformCodeName.split(/;|,|_/) // Split on semicolon, comma, and underscore
                    .filter(part => part.toLowerCase() !== '4k') // Ignore 4K indicator
                    .some(part => p.codeName.toLowerCase().includes(part.toLowerCase()))
            ) ??
            // Return Unknown
            {
                productName: 'Unknown',
                codeName: platformCodeName,
                model: 'Unknown',
                productionStatus: ProductionStatus.Unknown
            };
    }

    // TODO: where to put this? should we store the codeName as string instead of RokuHardwarePlatform?
    /**
     * @see https://developer.roku.com/docs/specs/hardware.md
    */
    public getAllRokuPlatforms(): RokuHardwarePlatform[] {
        return [
            // Current Roku models
            // The following models are currently being manufactured and are supported:
            {
                productName: 'Roku Express',
                codeName: 'Nemo',
                model: '3930X',
                productionStatus: ProductionStatus.Current
            },
            {
                productName: 'Roku Express 4K',
                codeName: 'Marlin 4K',
                model: '3940X',
                productionStatus: ProductionStatus.Current
            },
            {
                productName: 'Roku Streaming Stick 4K',
                codeName: 'Madison',
                model: '3820X',
                productionStatus: ProductionStatus.Current
            },
            {
                productName: 'Roku Ultra LT',
                codeName: 'Benjamin-W',
                model: '4801X',
                productionStatus: ProductionStatus.Current
            },
            {
                productName: 'Roku Ultra',
                codeName: 'Benjamin',
                model: '4800X',
                productionStatus: ProductionStatus.Current
            },
            {
                productName: '4K Roku TV',
                codeName: 'Longview',
                model: '7000X',
                productionStatus: ProductionStatus.Current
            },
            {
                productName: 'Roku TV',
                codeName: 'Midland',
                model: '8000X',
                productionStatus: ProductionStatus.Current
            },
            {
                productName: 'Roku TV',
                codeName: 'Roma',
                model: 'D000X',
                productionStatus: ProductionStatus.Current
            },
            {
                productName: 'Roku TV (Brazil)',
                codeName: 'El Paso',
                model: '8000X',
                productionStatus: ProductionStatus.Current
            },
            {
                productName: 'Roku Smart Soundbar',
                codeName: 'Fruitland',
                model: '9100X',
                productionStatus: ProductionStatus.Current
            },
            {
                productName: 'Roku Streambar',
                codeName: 'Chico',
                model: '9102X',
                productionStatus: ProductionStatus.Current
            },
            {
                productName: '4K Roku TV',
                codeName: 'Reno',
                model: 'A000X',
                productionStatus: ProductionStatus.Current
            },
            {
                productName: '4K Roku TV',
                codeName: 'Malone',
                model: 'C000X',
                productionStatus: ProductionStatus.Current
            },
            {
                productName: '4K Roku TV',
                codeName: 'Athens',
                model: 'G000X',
                productionStatus: ProductionStatus.Current
            },
            {
                productName: '4K Roku TV (EU)',
                codeName: 'Camden',
                model: 'C000GB',
                productionStatus: ProductionStatus.Current
            },
            {
                productName: '8K Roku TV',
                codeName: 'Bandera',
                model: 'E000X',
                productionStatus: ProductionStatus.Current
            },
            // Updatable Roku models
            // The following models are no longer manufactured, but can run the latest Roku OS
            {
                productName: 'Roku Streaming Stick',
                codeName: 'Briscoe',
                model: '3600X',
                productionStatus: ProductionStatus.Updatable
            },
            {
                productName: 'Roku Express',
                codeName: 'Littlefield',
                model: '3700X',
                productionStatus: ProductionStatus.Updatable
            },
            {
                productName: 'Roku Streaming Stick',
                codeName: 'Amarillo 1080',
                model: '3800X',
                productionStatus: ProductionStatus.Updatable
            },
            {
                productName: 'Roku Streaming Stick+',
                codeName: 'Amarillo-2019',
                model: '3810X',
                productionStatus: ProductionStatus.Updatable
            },
            {
                productName: 'Roku Streaming Stick+',
                codeName: 'Amarillo 2019-HP',
                model: '3811X',
                productionStatus: ProductionStatus.Updatable
            },
            {
                productName: 'Roku Premiere',
                codeName: 'Gilbert 4K',
                model: '3920X',
                productionStatus: ProductionStatus.Updatable
            },
            {
                productName: 'Roku Express',
                codeName: 'Gilbert',
                model: '3900X',
                productionStatus: ProductionStatus.Updatable
            },
            {
                productName: 'Roku Premiere',
                codeName: 'Cooper',
                model: '4620X',
                productionStatus: ProductionStatus.Updatable
            },
            {
                productName: 'Roku Ultra',
                codeName: 'Bryan',
                model: '4660X',
                productionStatus: ProductionStatus.Updatable
            },
            {
                productName: 'Roku Ultra LT',
                codeName: 'Bryan -W',
                model: '4662X',
                productionStatus: ProductionStatus.Updatable
            },
            {
                productName: 'Roku Ultra',
                codeName: 'Bryan 2',
                model: '4670X',
                productionStatus: ProductionStatus.Updatable
            },
            {
                productName: 'Roku 3',
                codeName: 'Austin',
                model: '4200X',
                productionStatus: ProductionStatus.Updatable
            },
            {
                productName: 'Roku LT',
                codeName: 'Tyler',
                model: '2700X',
                productionStatus: ProductionStatus.Updatable
            },
            {
                productName: 'Roku Streaming Stick',
                codeName: 'Sugarland',
                model: '3500X',
                productionStatus: ProductionStatus.Updatable
            },
            {
                productName: 'Roku 2',
                codeName: 'Mustang',
                model: '4210X',
                productionStatus: ProductionStatus.Updatable
            },
            {
                productName: 'Roku 4',
                codeName: 'Dallas',
                model: '4400X',
                productionStatus: ProductionStatus.Updatable
            },
            {
                productName: 'Roku TV',
                codeName: 'Liberty',
                model: '5000X',
                productionStatus: ProductionStatus.Updatable
            },
            {
                productName: '4K Roku TV',
                codeName: 'Ft. Worth',
                model: '6000X',
                productionStatus: ProductionStatus.Updatable
            },
            // Legacy models
            // The following models have been discontinued,
            // cannot run newer Roku OS versions, and cannot be used to run IDK apps
            {
                productName: 'Roku DVP',
                codeName: 'Griffin',
                model: 'N1000',
                productionStatus: ProductionStatus.Legacy,
                latestOsVersion: { major: 3, minor: 1 }
            },
            {
                productName: 'Roku SD',
                codeName: 'Redwood',
                model: 'N1050',
                productionStatus: ProductionStatus.Legacy,
                latestOsVersion: { major: 3, minor: 1 }
            },
            {
                productName: 'Roku HD',
                codeName: 'Pico',
                model: '2000C',
                productionStatus: ProductionStatus.Legacy,
                latestOsVersion: { major: 3, minor: 1 }
            },
            {
                productName: 'Roku LT',
                codeName: 'Giga',
                model: '2400X',
                productionStatus: ProductionStatus.Legacy,
                latestOsVersion: { major: 9, minor: 1 }
            },
            {
                productName: 'Roku LT',
                codeName: 'Paolo',
                model: '2450X',
                productionStatus: ProductionStatus.Legacy,
                latestOsVersion: { major: 9, minor: 1 }
            },
            {
                productName: 'Roku Streaming Stick',
                codeName: 'Jackson',
                model: '3400X',
                productionStatus: ProductionStatus.Legacy,
                latestOsVersion: { major: 9, minor: 1 }
            }
        ];
    }
}

export const util = new Util();
