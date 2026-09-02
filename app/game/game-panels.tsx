import { CircleDollarSign } from 'lucide-react';

import { cn } from '@/lib/utils';
import { formatMoney } from './game-data';

export function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[86px] items-center gap-3 rounded-2xl border border-white/10 bg-card px-3 py-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-teal-300 [&_svg]:size-4">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
        <p className="mt-1 truncate font-mono text-lg font-black text-white">{value}</p>
      </div>
    </div>
  );
}

export function PrizeBoard({
  prizes,
  openedCases,
  caseValues,
  high = false,
}: {
  prizes: number[];
  openedCases: Set<number>;
  caseValues: number[];
  high?: boolean;
}) {
  const openedValues = new Set(
    [...openedCases].map((caseNumber) => caseValues[caseNumber - 1]),
  );

  return (
    <aside
      className={cn(
        'rounded-2xl border border-white/10 bg-card p-3 sm:p-4',
        high ? 'order-3' : 'order-2 lg:order-none',
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          {high ? '大奖区' : '奖金区'}
        </p>
        <CircleDollarSign className={cn('size-4', high ? 'text-amber-300' : 'text-teal-300')} />
      </div>
      <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-1">
        {prizes.map((prize) => {
          const removed = openedValues.has(prize);
          return (
            <div
              key={prize}
              className={cn(
                'relative flex h-7 items-center justify-between overflow-hidden rounded-md border px-2 font-mono text-[11px] font-extrabold transition sm:h-8 sm:text-xs',
                removed
                  ? 'border-white/5 bg-white/[0.025] text-slate-700 line-through'
                  : high
                    ? 'border-amber-300/16 bg-amber-300/[0.07] text-amber-200'
                    : 'border-teal-300/14 bg-teal-300/[0.06] text-teal-200',
              )}
            >
              <span>{formatMoney(prize)}</span>
              {!removed && (
                <span className={cn('size-1 rounded-full', high ? 'bg-amber-300' : 'bg-teal-300')} />
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
