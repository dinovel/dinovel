import { chevron } from './chevron.ts';
import { FileIcons } from './file.icon.ts';
import { FolderIcon } from './folder.icon.ts';
import { RefreshIcon } from './refresh.icon.ts';
import { xCircle } from './x-circle.icon.ts';

export const DnDefaultIconList: { [key: string]: string } = {
  default: FileIcons.file,
  ...chevron,
  ...FileIcons,
  ...FolderIcon,
  ...RefreshIcon,
  xCircle,
};
