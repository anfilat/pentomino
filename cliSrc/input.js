import fs from "fs";
import {prepareItems, prepareSpace} from "../common/index.js";

export function getParams(argv) {
    let findAll = false;
    let fileName = argv[0];
    if (argv[0] === '-a') {
        findAll = true;
        fileName = argv[1];
    }
    if (!fileName) {
        return {err: true};
    }

    try {
        let {items, space} = JSON.parse(fs.readFileSync(fileName, 'utf8'));

        items = prepareItems(items);
        space = prepareSpace(space);

        return {err: false, findAll, items, space};
    } catch {
        return {err: true};
    }
}
