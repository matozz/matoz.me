import { Layout } from '@/layouts/layout';

type Props = Omit<React.ComponentProps<typeof Layout>, 'fullWidth'>;

export const Profile: React.FC<Props> = ({ post, blockMap }) => {
  return (
    <div>
      <Layout blockMap={blockMap} post={post} fullWidth={false} onlyContents />
    </div>
  );
};
