import {useLocation, useNavigate, useParams} from '@remix-run/react';
import {getAppUrl} from '~/contents/navigation/get-url';
import {cn} from '~/lib/utils';
import {useAppConfig} from '~/routes/($lang)';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../ui/select';

export const VersionSelect = ({expand}: {expand?: boolean}) => {
  const navigate = useNavigate();
  const {DEFAULT_LANGUAGE, LATEST_VERSION, versions} = useAppConfig();
  const isDocUrl = useLocation().pathname.includes('/docs');
  const {version, lang, slug} = useParams();
  const value = version ?? LATEST_VERSION;

  const onSelect = (v: string) => {
    const newPathname = getAppUrl({type: 'docs', DEFAULT_LANGUAGE, LATEST_VERSION, slug, version: v, lang});

    navigate(newPathname);
  };

  if (!isDocUrl) return null;

  return (
    <Select value={value} onValueChange={onSelect}>
      <SelectTrigger className={cn('rounded-md', expand ? 'w-full' : 'w-24')}>
        <SelectValue>{value}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {versions.map(version => (
          <SelectItem key={version} value={version}>
            {version}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
