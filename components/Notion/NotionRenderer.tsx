import { NotionRenderer as Renderer } from 'react-notion-x';

import { NotionComponents } from '@/components/Notion/NotionComponents';
import { useTheme } from '@/lib/theme';

const mapPageUrl = (id: string) => `https://www.notion.so/${id.replace(/-/g, '')}`;

type RendererProps = React.ComponentProps<typeof Renderer>;

type Props = Omit<RendererProps, 'components' | 'mapPageUrl'>;

export const NotionRenderer = (props: Props) => {
  const { theme } = useTheme();

  return (
    <Renderer
      components={NotionComponents}
      mapPageUrl={mapPageUrl}
      darkMode={theme !== 'light'}
      {...props}
    />
  );
};
