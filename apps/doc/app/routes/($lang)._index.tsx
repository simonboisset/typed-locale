import {LinksFunction} from '@remix-run/node';
import {LandingPage} from '~/components/app/landing-page';

export const links: LinksFunction = () => [
  {
    rel: 'preload',
    href: 'https://lezo-files.s3.eu-west-3.amazonaws.com/media/typed-locale-demo.mp4',
    as: 'video',
    type: 'video/mp4',
  },
];

export default function Index() {
  return <LandingPage />;
}
