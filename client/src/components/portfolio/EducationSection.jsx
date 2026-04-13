import { GraduationCap } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { SectionHeader, TimelineItem } from '../portfolio';

const EducationSection = ({ education }) => {
  if (!education.length) return null;

  return (
    <ScrollReveal>
      <section id="education">
        <SectionHeader icon={GraduationCap} title="Education" />
        <div className="space-y-4">
          {education.map((edu) => (
            <TimelineItem
              key={edu._id}
              title={edu.degree}
              subtitle={edu.institution}
              dateRange={`${edu.startDate} — ${edu.endDate || 'Present'}`}
              description={edu.description}
              dotColor="bg-teal-400"
              brandDot={false}
            />
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
};

export default EducationSection;
