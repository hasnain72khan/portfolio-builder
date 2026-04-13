import { Clock } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { SectionHeader, TimelineItem } from '../portfolio';

const ExperienceSection = ({ experience }) => {
  if (!experience.length) return null;

  return (
    <ScrollReveal>
      <section id="experience">
        <SectionHeader icon={Clock} title="Experience" />
        <div className="space-y-4">
          {experience.map((exp) => (
            <TimelineItem
              key={exp._id}
              title={exp.title}
              subtitle={`${exp.company}${exp.location ? ' · ' + exp.location : ''}`}
              dateRange={`${exp.startDate} — ${exp.endDate || 'Present'}`}
              description={exp.description}
              dotColor="bg-violet-400"
            />
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
};

export default ExperienceSection;
