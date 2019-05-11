import {paths} from "../../common/utils/paths";
const fs = require('fs');
const {promisify} = require('util');
export const writeFile = promisify(fs.writeFile);
export const readFile = promisify(fs.readFile);

async function _write(object: {token?: string, libraryPath?: string}) {
  const content = await readFile(paths.config.setup);
  const obj = JSON.parse(content.toString());

  return writeFile(paths.config.setup, JSON.stringify({
    ...obj,
    ...object
  }, null, 2));
}

export function saveSetupToken(token: string) {
  return _write({token});
}

export function saveSetupLibraryPath(libraryPath: string) {
  return _write({libraryPath});
}