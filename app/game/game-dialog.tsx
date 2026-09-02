import { BriefcaseBusiness, PhoneCall, RotateCcw, Trophy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { formatMoney, type Phase } from './game-data';

type GameDialogProps = {
  phase: Phase;
  offer: number | null;
  chosenCase: number | null;
  otherCase: number | null;
  finalCase: number | null;
  finalAmount: number | null;
  chosenCaseValue: number | null;
  otherCaseValue: number | null;
  dealAccepted: boolean;
  remainingAverage: number;
  onAccept: () => void;
  onReject: () => void;
  onKeep: () => void;
  onSwap: () => void;
  onReset: () => void;
};

export function GameDialog({
  phase,
  offer,
  chosenCase,
  otherCase,
  finalCase,
  finalAmount,
  chosenCaseValue,
  otherCaseValue,
  dealAccepted,
  remainingAverage,
  onAccept,
  onReject,
  onKeep,
  onSwap,
  onReset,
}: GameDialogProps) {
  const isOpen = phase === 'offer' || phase === 'swap' || phase === 'finished';

  return (
    <Dialog open={isOpen}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[520px] overflow-hidden border border-white/12 bg-[#0d1b2e] p-0 text-white shadow-[0_30px_100px_rgba(0,0,0,0.65)] ring-0"
      >
        {phase === 'offer' && offer !== null && (
          <>
            <div className="border-b border-white/10 bg-[#091421] px-6 py-5 text-center">
              <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full border border-rose-300/20 bg-rose-400/10 text-rose-300">
                <PhoneCall className="size-5" />
              </span>
              <DialogHeader className="gap-1.5">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-rose-300">BANKER OFFER</p>
                <DialogTitle className="font-mono text-4xl font-black tracking-tight text-amber-300 sm:text-5xl">
                  {formatMoney(offer)}
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  银行家愿意用这个价格买走你的 {chosenCase} 号箱
                </DialogDescription>
              </DialogHeader>
            </div>
            <div className="grid grid-cols-2 gap-3 px-6 py-4 text-center">
              <Metric label="本轮报价" value={formatMoney(offer, true)} />
              <Metric label="剩余平均值" value={formatMoney(remainingAverage, true)} />
            </div>
            <DialogFooter className="m-0 grid grid-cols-2 border-white/10 bg-black/15 p-4 sm:grid-cols-2">
              <Button onClick={onReject} className="h-12 bg-rose-500 text-base font-black text-white hover:bg-rose-400">
                不成交
              </Button>
              <Button onClick={onAccept} className="h-12 bg-amber-300 text-base font-black text-[#081525] hover:bg-amber-200">
                成交
              </Button>
            </DialogFooter>
          </>
        )}

        {phase === 'swap' && chosenCase !== null && otherCase !== null && (
          <>
            <div className="px-6 pb-2 pt-6 text-center">
              <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full border border-amber-300/25 bg-amber-300/10 text-amber-300">
                <BriefcaseBusiness className="size-5" />
              </span>
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">最后只剩两个箱子</DialogTitle>
                <DialogDescription className="text-slate-400">你可以坚持最初的选择，也可以在最后一刻交换。</DialogDescription>
              </DialogHeader>
            </div>
            <div className="grid grid-cols-2 gap-3 px-6 py-4">
              <FinalCaseCard label="你的箱子" caseNumber={chosenCase} />
              <FinalCaseCard label="最后的箱子" caseNumber={otherCase} />
            </div>
            <DialogFooter className="m-0 grid grid-cols-2 border-white/10 bg-black/15 p-4 sm:grid-cols-2">
              <Button
                onClick={onKeep}
                variant="outline"
                className="h-12 border-white/15 bg-white/5 font-bold text-white hover:bg-white/10 hover:text-white"
              >
                保留 {chosenCase} 号
              </Button>
              <Button onClick={onSwap} className="h-12 bg-amber-300 font-black text-[#081525] hover:bg-amber-200">
                交换到 {otherCase} 号
              </Button>
            </DialogFooter>
          </>
        )}

        {phase === 'finished' && finalAmount !== null && finalCase !== null && (
          <>
            <div className="px-6 pb-3 pt-7 text-center">
              <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full border border-amber-300/30 bg-amber-300 text-[#081525] shadow-[0_0_35px_rgba(245,200,76,0.22)]">
                <Trophy className="size-7" />
              </span>
              <DialogHeader className="gap-1">
                <p className="text-[10px] font-black uppercase tracking-[0.26em] text-amber-300">FINAL RESULT</p>
                <DialogTitle className="text-2xl font-black">
                  {dealAccepted ? '成交！奖金已锁定' : '你的箱子揭晓了'}
                </DialogTitle>
                <p className="font-mono text-4xl font-black tracking-tight text-amber-300 sm:text-5xl">
                  {formatMoney(finalAmount)}
                </p>
                <DialogDescription className="pt-1 text-slate-400">
                  {dealAccepted
                    ? `你的 ${finalCase} 号箱里其实是 ${formatMoney(chosenCaseValue ?? 0)}`
                    : `最终选择了 ${finalCase} 号箱`}
                </DialogDescription>
              </DialogHeader>
            </div>
            {!dealAccepted && chosenCase !== null && otherCase !== null && (
              <div className="grid grid-cols-2 gap-3 px-6 pb-5">
                <RevealCard
                  label={`${chosenCase} 号箱`}
                  value={chosenCaseValue ?? 0}
                  active={finalCase === chosenCase}
                />
                <RevealCard
                  label={`${otherCase} 号箱`}
                  value={otherCaseValue ?? 0}
                  active={finalCase === otherCase}
                />
              </div>
            )}
            <DialogFooter className="m-0 border-white/10 bg-black/15 p-4 sm:justify-center">
              <Button onClick={onReset} className="h-11 w-full bg-amber-300 font-black text-[#081525] hover:bg-amber-200 sm:w-auto sm:min-w-48">
                <RotateCcw className="size-4" />
                再玩一局
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.035] p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 font-mono font-black text-white">{value}</p>
    </div>
  );
}

function FinalCaseCard({ label, caseNumber }: { label: string; caseNumber: number }) {
  return (
    <div className="rounded-2xl border border-amber-300/18 bg-amber-300/[0.06] p-5 text-center">
      <BriefcaseBusiness className="mx-auto mb-2 size-8 text-amber-300" />
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 font-mono text-2xl font-black text-white">{String(caseNumber).padStart(2, '0')}</p>
    </div>
  );
}

function RevealCard({ label, value, active }: { label: string; value: number; active: boolean }) {
  return (
    <div
      className={cn(
        'rounded-xl border p-3 text-center',
        active ? 'border-amber-300/50 bg-amber-300/10' : 'border-white/8 bg-white/[0.025]',
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className={cn('mt-1 font-mono text-sm font-black', active ? 'text-amber-300' : 'text-slate-300')}>
        {formatMoney(value)}
      </p>
    </div>
  );
}
