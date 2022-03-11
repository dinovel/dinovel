import { file } from './file.icon.ts';
import { fileImage } from './file-image.icon.ts';
import { fileMusic } from './file-music.icon.ts';
import { fileVideo } from './file-video.icon.ts';
import { chevron } from './chevron.ts';
import { xCircle } from './x-circle.icon.ts';

export const DnDefaultIconList: { [key: string]: string } = {
  default: file,
  file,
  fileImage,
  fileMusic,
  fileVideo,
  ...chevron,
  xCircle,
};
