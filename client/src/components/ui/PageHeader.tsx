type Props = {
  title: string;
  subtitle?: string;
};

export default function PageHeader({
  title,
  subtitle,
}: Props) {
  const today = new Date();

  return (
    <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-200/70 pb-6 md:flex-row md:items-center">

      <div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">

          {title}

        </h1>

        {subtitle && (

          <p className="mt-2 text-slate-500">

            {subtitle}

          </p>

        )}

      </div>

      <div className="text-right">

        <p className="text-lg font-medium text-slate-900">

          {today.toLocaleDateString(undefined, {
            weekday: "long",
          })}

        </p>

        <p className="text-sm text-slate-900">

          {today.toLocaleDateString()}

        </p>

      </div>

    </div>
  );
}