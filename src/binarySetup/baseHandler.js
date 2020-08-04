import * as tc from '@actions/tool-cache';
import * as io from '@actions/io';
import * as core from '@actions/core';
import * as path from 'path';
import constants from '../../config/constants';

const { LOCAL_BINARY_FOLDER } = constants;

class BaseHandler {
  static async _makeDirectory() {
    try {
      const binaryFolder = path.resolve(process.env.HOME, 'work', 'executables', LOCAL_BINARY_FOLDER);
      await io.mkdirP(binaryFolder);
      return binaryFolder;
    } catch (e) {
      core.setFailed(`Failed while creating directory for Local Binary: ${e.message}`);
    }
  }

  async downloadBinary(zipURL) {
    const binaryFolder = await BaseHandler._makeDirectory();
    const downloadPath = await tc.downloadTool(zipURL, path.resolve(binaryFolder, this.platform));
    const expath = await tc.extractZip(downloadPath, downloadPath);
    console.log('downloadPath: ', downloadPath);
    console.log('extracted at: ', expath);
    const cachedPath = await tc.cacheDir(downloadPath, 'BrowserStackLocal', '1.0.0');
    console.log('cached path: ', cachedPath);
    core.addPath(cachedPath);
    console.log('added to PATH');
    this.binaryPath = downloadPath;
  }
}

export default BaseHandler;
