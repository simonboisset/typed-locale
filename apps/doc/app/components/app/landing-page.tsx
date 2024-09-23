import {Link, useParams} from '@remix-run/react';
import {Boxes, ShieldCheck, SquareFunction} from 'lucide-react';
import {useTranslation} from '~/contents/i18n/translator';
import {getAppUrl} from '~/contents/navigation/get-url';
import {useAppConfig} from '~/routes/($lang)';
import {CodeBlock} from '../content/code-block';
import {Header} from '../content/layout';
import {Button} from '../ui/button';
import {ScreenshotSection} from './screenshot-section';

export const LandingPage = () => {
  const t = useTranslation();
  const {DEFAULT_LANGUAGE, LATEST_VERSION} = useAppConfig();
  const {lang} = useParams();
  const docUrl = getAppUrl({lang: lang, type: 'docs', DEFAULT_LANGUAGE, LATEST_VERSION});
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-col">
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
            <div className="px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    {t(l => l.landingPage.title)}
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    {t(l => l.landingPage.subtitle)}
                  </p>
                </div>
                <div className="space-x-4 pb-24">
                  <Button asChild>
                    <Link to={docUrl}>{t(l => l.landingPage.getStarted)}</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="https://github.com/simonboisset/typed-locale">{t(l => l.landingPage.viewOnGithub)}</Link>
                  </Button>
                </div>
                <CodeBlock className="bash w-80 text-start">npm install typed-locale</CodeBlock>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
            <div className="px-4 md:px-6">
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <ShieldCheck className="h-10 w-10" />
                  <h2 className="text-xl font-bold">{t(l => l.landingPage.features.typeSafe.title)}</h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    {t(l => l.landingPage.features.typeSafe.description)}
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4 text-center">
                  <Boxes className="h-10 w-10" />
                  <h2 className="text-xl font-bold">{t(l => l.landingPage.features.frameworkAgnostic.title)}</h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    {t(l => l.landingPage.features.frameworkAgnostic.description)}
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4 text-center">
                  <SquareFunction className="h-10 w-10" />
                  <h2 className="text-xl font-bold">{t(l => l.landingPage.features.pureFunctions.title)}</h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    {t(l => l.landingPage.features.pureFunctions.description)}
                  </p>
                </div>
              </div>
            </div>
          </section>
          <ScreenshotSection />
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-gray-500 dark:text-gray-400">{t(l => l.landingPage.footer.copyright)}</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link
              className="text-xs hover:underline underline-offset-4"
              to="https://github.com/simonboisset/typed-locale">
              {t(l => l.landingPage.footer.github)}
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" to="https://simonboisset.com">
              {t(l => l.landingPage.footer.simonBoisset)}
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  );
};
