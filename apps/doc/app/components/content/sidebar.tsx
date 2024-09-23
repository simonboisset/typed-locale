import {Link, useNavigate, useParams} from '@remix-run/react';
import {Link2, MenuIcon} from 'lucide-react';
import {LinkTree} from '~/contents/doc/doc.server';
import {useTranslation} from '~/contents/i18n/translator';
import {getAppUrl} from '~/contents/navigation/get-url';
import {useAppConfig} from '~/routes/($lang)';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '../ui/accordion';
import {Button} from '../ui/button';
import {Separator} from '../ui/separator';
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from '../ui/sheet';
import {LanguageSelect} from './language-select';
import {VersionSelect} from './version-select';

export function DesktopSidebar({linksTree}: {linksTree: LinkTree[]}) {
  const t = useTranslation();
  return (
    <aside className="w-64 flex-shrink-0 hidden md:block">
      <div className="sticky top-24">
        <h2 className="text-lg font-semibold mb-4">{t(l => l.sidebar.documentation)}</h2>
        {linksTree.map(link => (
          <NavItem key={link.href} item={link} level={0} />
        ))}
      </div>
    </aside>
  );
}

export function MobileSidebar({linksTree}: {linksTree?: LinkTree[]}) {
  const t = useTranslation();
  const {DEFAULT_LANGUAGE, LATEST_VERSION} = useAppConfig();
  const {lang} = useParams();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">{t(l => l.sidebar.toggleDocumentationMenu)}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" aria-describedby={undefined} className="overflow-y-scroll">
        <SheetHeader aria-describedby={undefined}>
          <SheetTitle className="text-start">Typed Locale</SheetTitle>
        </SheetHeader>
        <div className="py-4 flex flex-col gap-2">
          <LanguageSelect expand />
          <VersionSelect expand />
          <Button variant="outline" className="w-full justify-start font-normal" asChild>
            <Link to={getAppUrl({type: 'docs', lang, DEFAULT_LANGUAGE, LATEST_VERSION})}>
              <span className="flex-1">{t(l => l.header.docs)}</span> <Link2 className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant="outline" className="w-full justify-start font-normal" asChild>
            <Link to={getAppUrl({type: 'blog', lang, DEFAULT_LANGUAGE, LATEST_VERSION})}>
              <span className="flex-1">{t(l => l.header.blog)}</span> <Link2 className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {linksTree && (
          <>
            <Separator className="my-4" />
            <h2 className="text-lg font-semibold">{t(l => l.sidebar.documentation)}</h2>
            <div className="py-4">
              {linksTree.map(link => (
                <NavItem key={link.href} item={link} level={0} />
              ))}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

interface NavItemProps {
  item: LinkTree;
  level: number;
}

const NavItem: React.FC<NavItemProps> = ({item, level}) => {
  const params = useParams();
  const slug = params.slug;
  const hasChildren = item.children && item.children.length > 0;
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(item.href);
  };

  const isActive = item.slug === slug;
  return (
    <div className={`my-1 ${level > 0 ? 'ml-4' : ''}`}>
      {hasChildren ? (
        <Accordion type="single" collapsible className="border-none">
          <AccordionItem value={item.href} className="border-none">
            <Button
              variant={isActive ? 'outline' : 'ghost'}
              className="w-full justify-between font-normal hover:no-underline"
              onClick={handleClick}
              asChild>
              <AccordionTrigger>{item.title}</AccordionTrigger>
            </Button>
            <AccordionContent className="-mb-4">
              {item.children?.map((child, index) => <NavItem key={index} item={child} level={level + 1} />)}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <Button variant={isActive ? 'outline' : 'ghost'} className="w-full justify-start font-normal" asChild>
          <Link to={item.href}>{item.title}</Link>
        </Button>
      )}
    </div>
  );
};