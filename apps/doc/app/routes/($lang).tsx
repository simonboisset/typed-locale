import {LoaderFunctionArgs, MetaFunction, SerializeFrom} from '@remix-run/node';
import {Outlet, useMatches} from '@remix-run/react';
import {createTranslator} from 'typed-locale';
import {DEFAULT_LANGUAGE, languageSchema, LATEST_VERSION, versions} from '~/contents/docs/doc.server';
import {dictionary} from '~/contents/i18n/translator';

export const loader = async ({params}: LoaderFunctionArgs) => {
  const {lang} = params;
  const validLang = languageSchema.safeParse(lang).data ?? DEFAULT_LANGUAGE;

  return {dictionary: dictionary[validLang].landingPage, DEFAULT_LANGUAGE, LATEST_VERSION, versions} as const;
};

export const meta: MetaFunction<typeof loader> = ({data}) => {
  if (!data) return [];
  const t = createTranslator(data.dictionary);
  return [
    {title: 'Typed Locale'},
    {name: 'description', content: t ? t(l => l.subtitle) : ''},
    {name: 'viewport', content: 'width=device-width, initial-scale=1'},
    {name: 'charset', content: 'utf-8'},
  ];
};

export default function Index() {
  return <Outlet />;
}

export const useAppConfig = () => {
  const matches = useMatches();

  const root = matches.find(match => match.id === 'routes/($lang)')?.data as
    | SerializeFrom<Awaited<ReturnType<typeof loader>>>
    | undefined;
  const {DEFAULT_LANGUAGE, LATEST_VERSION, versions} = root ?? {
    DEFAULT_LANGUAGE: 'en',
    LATEST_VERSION: '0.4.2',
    versions: ['0.4.2'],
  };
  return {DEFAULT_LANGUAGE, LATEST_VERSION, versions};
};
