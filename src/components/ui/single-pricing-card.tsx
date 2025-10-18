import { motion } from 'framer-motion';
import { Crown, Check, Shield, Heart, MessageSquare, ChevronRight, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';

interface Benefit {
  icon: 'check' | 'shield' | 'heart';
  text: string;
}

interface Feature {
  text: string;
}

interface SinglePricingCardProps {
  badge: string;
  title: string;
  subtitle: string;
  price: string;
  benefits: Benefit[];
  features: Feature[];
  primaryButton: {
    text: string;
    onClick: () => void;
  };
  secondaryButton: {
    text: string;
    onClick: () => void;
  };
}

const iconMap = {
  check: Check,
  shield: Shield,
  heart: Heart,
};

export function SinglePricingCard({
  badge,
  title,
  subtitle,
  price,
  benefits,
  features,
  primaryButton,
  secondaryButton,
}: SinglePricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="grid md:grid-cols-2 gap-8 bg-gradient-to-br from-orange-50/80 to-amber-50/60 rounded-3xl border border-orange-100/50 shadow-[0_8px_30px_rgb(251,146,60,0.12)] p-8 md:p-12 backdrop-blur-sm">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Badge */}
          <Badge className="bg-orange-500 text-white hover:bg-orange-600 gap-2 px-4 py-2 text-sm font-semibold">
            <Crown className="h-4 w-4" />
            {badge}
          </Badge>

          {/* Title */}
          <div className="space-y-3">
            <h3 className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-orange-600 to-orange-500 bg-clip-text text-transparent leading-tight">
              {title}
            </h3>
            <p className="text-lg text-muted-foreground">
              {subtitle}
            </p>
          </div>

          {/* Price */}
          <div className="py-4">
            <p className="text-6xl md:text-7xl font-bold text-foreground">
              {price}
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => {
              const Icon = iconMap[benefit.icon];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-orange-600" />
                  </div>
                  <p className="text-base font-medium text-foreground">
                    {benefit.text}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={primaryButton.onClick}
              className="group bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              {primaryButton.text}
              <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={secondaryButton.onClick}
              variant="outline"
              className="border-2 border-orange-200 bg-transparent hover:bg-orange-50 text-orange-700 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300"
            >
              {secondaryButton.text}
              <ExternalLink className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Features Header */}
          <div className="space-y-3">
            <h4 className="text-2xl font-bold text-foreground">
              Fonctionnalités Incluses
            </h4>
            <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white gap-2 px-4 py-2 text-sm font-semibold border-0">
              <Sparkles className="h-4 w-4" />
              Toutes les fonctionnalités
            </Badge>
          </div>

          {/* Features List */}
          <div className="space-y-4 pt-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center mt-0.5">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <p className="text-base text-foreground leading-relaxed">
                  {feature.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
