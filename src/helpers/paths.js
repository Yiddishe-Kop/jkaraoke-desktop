import electron from 'electron';
import Fs from 'fs';
import Path from 'path';

export function getSongsFolderPath() {
  const userDataPath = (electron.app || electron.remote.app).getPath('userData');
  const songsFolder = Path.resolve(userDataPath, 'blob');
  if (!Fs.existsSync(songsFolder)) {
    Fs.mkdirSync(songsFolder);
  }
  return songsFolder;
}
