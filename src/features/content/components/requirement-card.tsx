import { FadeIn } from "@/components/animations";
import EditableImage from "@/features/content/components/editable-image";
import EditableText from "@/features/content/components/editable-text";

interface RequirementCardProps {
  step: number;
  title: string;
  description: string;
  icon: string;
  index?: number;
}

export default function RequirementCard({
  step,
  title,
  description,
  icon,
  index = 0,
}: RequirementCardProps) {
  return (
    <li className="flex items-center">
      <FadeIn delay={index * 0.1} distance={24} className="w-full">
        <div className="group relative flex w-full items-center gap-2.5 rounded-2xl border-2 border-primary-700/35 bg-card p-2.5 shadow-xs transition-colors duration-300 hover:border-primary-700/70 hover:shadow-lg sm:gap-4 sm:rounded-3xl sm:p-4 md:p-5">
          <EditableImage
            defaultSrc={icon}
            label={`تعديل أيقونة الخطوة ${step}`}
            width={24}
            height={24}
            imageClassName="size-5 sm:size-6"
            frameClassName="flex size-9 items-center justify-center rounded-xl bg-primary-100 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-primary-200 sm:size-12 sm:rounded-2xl"
          />
          <div className="min-w-0 flex-1 text-start">
            <h3 className="text-xs font-bold text-foreground sm:text-sm md:text-base">
              <EditableText
                defaultValue={title}
                label={`تعديل عنوان الخطوة ${step}`}
                fullWidth
              />
            </h3>
            <p className="mt-0.5 text-xs leading-4 text-muted-foreground sm:leading-5 md:text-sm md:leading-6">
              <EditableText
                defaultValue={description}
                label={`تعديل وصف الخطوة ${step}`}
                fullWidth
              />
            </p>
          </div>
          <span
            className="shrink-0 bg-primary-gradient bg-clip-text text-2xl leading-none font-black text-transparent tabular-nums transition-transform duration-300 select-none group-hover:scale-110 sm:text-4xl md:text-5xl"
            aria-hidden="true"
          >
            {step}
          </span>
        </div>
      </FadeIn>
    </li>
  );
}
