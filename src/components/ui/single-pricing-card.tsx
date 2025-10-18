import { motion } from 'framer-motion';
import { Crown, Check, Shield, Heart, MessageSquare, ChevronRight, ExternalLink } from 'lucide-react';
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
  priceNote?: string;
  benefits: Benefit[];
  features: Feature[];
  primaryButton: {
    text: string;
    onClick: () => void;
  };
  secondaryButton?: {
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
  priceNote,
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
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="grid md:grid-cols-2 gap-12 bg-card rounded-2xl border border-border shadow-float p-10 md:p-12">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Badge */}
          <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-xs font-medium border border-border">
            <Crown className="h-3.5 w-3.5 text-primary" />
            {badge}
          </Badge>

          {/* Title */}
          <div className="space-y-2">
            <h3 className="text-4xl font-bold text-foreground">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Price */}
          <div className="py-2">
            <p className="text-4xl font-medium text-foreground">
              <span className="font-bold">À partir de</span> {price.replace('À partir de ', '')}
            </p>
            {priceNote && (
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {priceNote}
              </p>
            )}
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            {benefits.map((benefit, index) => {
              const Icon = iconMap[benefit.icon];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2.5"
                >
                  <Icon className="h-4 w-4 text-primary flex-shrink-0" strokeWidth={2} />
                  <p className="text-sm text-foreground">
                    {benefit.text}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              onClick={primaryButton.onClick}
              className="group bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-5 text-sm font-medium rounded-xl transition-all duration-300"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {primaryButton.text}
              <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            {secondaryButton && (
              <Button
                onClick={secondaryButton.onClick}
                variant="outline"
                className="border border-border bg-background hover:bg-secondary text-foreground px-6 py-5 text-sm font-medium rounded-xl transition-all duration-300"
              >
                {secondaryButton.text}
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Features Header */}
          <h4 className="text-lg font-semibold text-foreground">
            Included Features
          </h4>

          {/* Features List */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                className="flex items-start gap-2.5"
              >
                <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <p className="text-sm text-foreground leading-relaxed">
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
