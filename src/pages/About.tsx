import React from 'react';
import { Shield, Dna, Zap, GitBranch } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

const About = () => {
  const { t } = useLanguage();
  
  const algorithmSteps = [
    { icon: GitBranch, text: t('algorithm.step1') },
    { icon: Zap, text: t('algorithm.step2') },
    { icon: Shield, text: t('algorithm.step3') },
    { icon: Dna, text: t('algorithm.step4') },
    { icon: GitBranch, text: t('algorithm.step5') },
    { icon: Shield, text: t('algorithm.step6') }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgba(240,235,228,1)' }}>
      <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-venice-dark mb-6">
                <Dna className="w-4 h-4" />
                <span>BioCryptor</span>
              </div>
              
              <h1 className="font-inter text-2xl font-bold text-venice-dark mb-2">
                {t('features.title')}
              </h1>
              <div className="w-24 h-px bg-venice-coral mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-8 h-8 text-venice-dark" />
                  <h2 className="font-playfair text-3xl font-bold text-venice-dark">
                    {t('features.private.title')}
                  </h2>
                </div>
                <p className="text-venice-dark/80 text-lg leading-relaxed">
                  {t('features.private.description')}
                </p>
              </div>

              <div className="bg-venice-dark/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-white">
                <div className="flex items-center space-x-3 mb-6">
                  <Dna className="w-8 h-8 text-white" />
                  <h2 className="font-playfair text-3xl font-bold text-white">
                    {t('features.uncensored.title')}
                  </h2>
                </div>
                <p className="text-white/90 text-lg leading-relaxed">
                  {t('features.uncensored.description')}
                </p>
              </div>
            </div>

            <div className="text-center mb-12">
              <h3 className="font-inter text-xl font-bold text-venice-dark mb-8">
                {t('algorithm.title')}
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {algorithmSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="bg-white/60 backdrop-blur-sm rounded-lg p-6 text-center">
                      <div className="w-12 h-12 bg-venice-coral rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm font-medium text-venice-dark leading-relaxed">{step.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-center">
              
            </div>
          </div>
        </div>
    </div>
  );
};

export default About;