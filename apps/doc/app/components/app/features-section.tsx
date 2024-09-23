import {Boxes, ShieldCheck, SquareFunction} from 'lucide-react';
import {useTranslation} from '~/contents/i18n/translator';

export const FeaturesSection = () => {
  const t = useTranslation();
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-accent">
      <div className="px-4 md:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureItem
            Icon={ShieldCheck}
            title={t(l => l.landingPage.features.typeSafe.title)}
            description={t(l => l.landingPage.features.typeSafe.description)}
          />
          <FeatureItem
            Icon={Boxes}
            title={t(l => l.landingPage.features.frameworkAgnostic.title)}
            description={t(l => l.landingPage.features.frameworkAgnostic.description)}
          />
          <FeatureItem
            Icon={SquareFunction}
            title={t(l => l.landingPage.features.pureFunctions.title)}
            description={t(l => l.landingPage.features.pureFunctions.description)}
          />
        </div>
      </div>
    </section>
  );
};

const FeatureItem = ({Icon, title, description}: {Icon: React.ElementType; title: string; description: string}) => {
  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <Icon className="h-10 w-10 text-primary" />
      <h2 className="text-xl font-bold text-primary">{title}</h2>
      <p className="text-accent-foreground">{description}</p>
    </div>
  );
};
