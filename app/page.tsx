'use client';

import { useMemo, useState } from 'react';
import {
  BriefcaseBusiness,
  CircleDollarSign,
  Crown,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GameDialog } from './game/game-dialog';
import {
  createGame,
  formatMoney,
  OFFER_FACTORS,
  PRIZES,
  ROUND_TARGETS,
  type OpenedRecord,
  type Phase,
} from './game/game-data';
import { PrizeBoard, StatCard } from './game/game-panels';

export default function Home() {
  const [game, setGame] = useState(() => createGame(8312026));
  const [phase, setPhase] = useState<Phase>('select');
  const [chosenCase, setChosenCase] = useState<number | null>(null);
  const [openedCases, setOpenedCases] = useState<Set<number>>(() => new Set());
  const [openedThisRound, setOpenedThisRound] = useState(0);
  const [round, setRound] = useState(0);
  const [offer, setOffer] = useState<number | null>(null);
  const [history, setHistory] = useState<OpenedRecord[]>([]);
  const [finalCase, setFinalCase] = useState<number | null>(null);
  const [finalAmount, setFinalAmount] = useState<number | null>(null);
  const [dealAccepted, setDealAccepted] = useState(false);

  const unopenedOtherCases = useMemo(
    () =>
      game.caseValues
        .map((_, index) => index + 1)
        .filter((caseNumber) => caseNumber !== chosenCase && !openedCases.has(caseNumber)),
    [chosenCase, game.caseValues, openedCases],
  );

  const currentTarget = Math.min(
    ROUND_TARGETS[Math.min(round, ROUND_TARGETS.length - 1)],
    Math.max(1, unopenedOtherCases.length - 1),
  );

  const remainingValues = game.caseValues.filter(
    (_, index) => !openedCases.has(index + 1),
  );
  const remainingMax = Math.max(...remainingValues);
  const remainingAverage = Math.round(
    remainingValues.reduce((sum, value) => sum + value, 0) / remainingValues.length,
  );

  function resetGame() {
    setGame(createGame(Date.now() % 2147483647));
    setPhase('select');
    setChosenCase(null);
    setOpenedCases(new Set());
    setOpenedThisRound(0);
    setRound(0);
    setOffer(null);
    setHistory([]);
    setFinalCase(null);
    setFinalAmount(null);
    setDealAccepted(false);
  }

  function chooseCase(caseNumber: number) {
    if (phase !== 'select') return;
    setChosenCase(caseNumber);
    setPhase('playing');
  }

  function calculateOffer(nextOpened: Set<number>) {
    const values = game.caseValues.filter((_, index) => !nextOpened.has(index + 1));
    const expectedValue = values.reduce((sum, value) => sum + value, 0) / values.length;
    const factor = OFFER_FACTORS[Math.min(round, OFFER_FACTORS.length - 1)];
    const highValueCount = values.filter((value) => value >= 100_000).length;
    const leverage = 0.94 + Math.min(highValueCount, 3) * 0.02;
    const rawOffer = expectedValue * factor * leverage;
    const step = rawOffer >= 100_000 ? 1_000 : rawOffer >= 10_000 ? 100 : rawOffer >= 1_000 ? 10 : 1;
    return Math.max(1, Math.round(rawOffer / step) * step);
  }

  function openCase(caseNumber: number) {
    if (
      phase !== 'playing' ||
      caseNumber === chosenCase ||
      openedCases.has(caseNumber)
    ) {
      return;
    }

    const nextOpened = new Set(openedCases);
    nextOpened.add(caseNumber);
    const nextCount = openedThisRound + 1;
    setOpenedCases(nextOpened);
    setOpenedThisRound(nextCount);
    setHistory((current) => [
      { caseNumber, value: game.caseValues[caseNumber - 1] },
      ...current,
    ].slice(0, 4));

    if (nextCount >= currentTarget) {
      setOffer(calculateOffer(nextOpened));
      setPhase('offer');
    }
  }

  function acceptDeal() {
    if (offer === null || chosenCase === null) return;
    setDealAccepted(true);
    setFinalCase(chosenCase);
    setFinalAmount(offer);
    setPhase('finished');
  }

  function rejectDeal() {
    if (unopenedOtherCases.length === 1) {
      setOffer(null);
      setPhase('swap');
      return;
    }
    setOffer(null);
    setRound((current) => current + 1);
    setOpenedThisRound(0);
    setPhase('playing');
  }

  function finishWithCase(caseNumber: number) {
    setFinalCase(caseNumber);
    setFinalAmount(game.caseValues[caseNumber - 1]);
    setDealAccepted(false);
    setPhase('finished');
  }

  const statusTitle =
    phase === 'select'
      ? '先选一个属于你的箱子'
      : phase === 'playing'
        ? `本轮还需打开 ${currentTarget - openedThisRound} 个箱子`
        : phase === 'offer'
          ? '银行家的电话来了'
          : phase === 'swap'
            ? '最后的选择'
            : '本局结束';

  const statusCopy =
    phase === 'select'
      ? '它会一直保留到游戏最后——除非你接受银行家的报价。'
      : phase === 'playing'
        ? `第 ${round + 1} 轮 · 已打开 ${openedThisRound}/${currentTarget} 个箱子`
        : phase === 'offer'
          ? '仔细衡量桌面上还没揭晓的金额。'
          : phase === 'swap'
            ? '保留你的箱子，还是与最后一个箱子交换？'
            : '看看你是否战胜了银行家。';

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-white/10 bg-[#081525]">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-amber-300/30 bg-amber-300 text-[#081525] shadow-[0_0_24px_rgba(245,200,76,0.18)]">
              <CircleDollarSign className="size-6" strokeWidth={2.4} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-300/70">THE MONEY SHOW</p>
              <h1 className="text-lg font-black tracking-tight text-white sm:text-xl">成交还是不成交</h1>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={resetGame}
            className="h-9 border-white/15 bg-white/5 px-3 text-white hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="size-4" />
            <span className="hidden sm:inline">重新开始</span>
          </Button>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1500px] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <div className="mb-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex min-h-[86px] items-center gap-4 rounded-2xl border border-white/10 bg-card px-4 py-3 shadow-[0_14px_50px_rgba(0,0,0,0.2)] sm:px-5">
            <div className="hidden size-12 shrink-0 items-center justify-center rounded-full border border-amber-300/25 bg-amber-300/10 text-amber-300 sm:flex">
              <Sparkles className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="inline-flex rounded-full bg-amber-300 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#081525]">
                  {phase === 'select' ? '准备开始' : `第 ${Math.min(round + 1, 9)} 轮`}
                </span>
                {chosenCase && (
                  <span className="text-xs font-semibold text-slate-400">你的箱子 · {chosenCase} 号</span>
                )}
              </div>
              <h2 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">{statusTitle}</h2>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-400 sm:text-sm">{statusCopy}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:w-[330px]">
            <StatCard label="最高剩余奖金" value={formatMoney(remainingMax, true)} icon={<Crown />} />
            <StatCard label="剩余平均值" value={formatMoney(remainingAverage, true)} icon={<ShieldCheck />} />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)_180px] xl:grid-cols-[210px_minmax(0,1fr)_210px]">
          <PrizeBoard prizes={PRIZES.slice(0, 10)} openedCases={openedCases} caseValues={game.caseValues} />

          <section className="order-first min-w-0 rounded-2xl border border-white/10 bg-[#0a1728] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.24)] lg:order-none sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/8 pb-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">CASE WALL</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-200">20 个箱子 · 只有一个百万大奖</p>
              </div>
              <div className="flex items-center gap-1.5" aria-label="开箱进度">
                {Array.from({ length: currentTarget }).map((_, index) => (
                  <span
                    key={index}
                    className={cn(
                      'size-2 rounded-full border border-white/15',
                      index < openedThisRound ? 'bg-amber-300' : 'bg-white/8',
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3 xl:gap-4">
              {game.caseValues.map((value, index) => {
                const caseNumber = index + 1;
                const isChosen = caseNumber === chosenCase;
                const isOpened = openedCases.has(caseNumber);
                const isPlayable = phase === 'select' || (phase === 'playing' && !isChosen && !isOpened);

                return (
                  <button
                    key={`${game.seed}-${caseNumber}`}
                    type="button"
                    disabled={!isPlayable}
                    onClick={() => phase === 'select' ? chooseCase(caseNumber) : openCase(caseNumber)}
                    aria-label={
                      isOpened
                        ? `${caseNumber}号箱，金额${formatMoney(value)}`
                        : isChosen
                          ? `${caseNumber}号箱，你的箱子`
                          : `${phase === 'select' ? '选择' : '打开'}${caseNumber}号箱`
                    }
                    className={cn(
                      'case-button group relative flex min-h-[86px] flex-col items-center justify-center overflow-hidden rounded-xl border px-1 py-3 text-center transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1728] sm:min-h-[104px]',
                      isOpened
                        ? 'case-opened border-rose-400/15 bg-rose-400/5 text-rose-300'
                        : isChosen
                          ? 'case-chosen border-amber-300 bg-amber-300/12 text-amber-200 shadow-[0_0_28px_rgba(245,200,76,0.14)]'
                          : 'border-white/12 bg-[#10223a] text-white hover:-translate-y-1 hover:border-amber-300/60 hover:bg-[#142a47] hover:shadow-[0_12px_26px_rgba(0,0,0,0.25)] disabled:opacity-60',
                    )}
                  >
                    {isChosen && (
                      <span className="absolute right-1.5 top-1.5 rounded-full bg-amber-300 px-1.5 py-0.5 text-[8px] font-black text-[#081525]">你的</span>
                    )}
                    <BriefcaseBusiness
                      className={cn('mb-1.5 size-6 sm:size-7', isOpened ? 'opacity-35' : 'text-amber-300')}
                      strokeWidth={1.8}
                    />
                    {isOpened ? (
                      <span className="text-[11px] font-black leading-tight sm:text-xs">{formatMoney(value, true)}</span>
                    ) : (
                      <span className="font-mono text-lg font-black leading-none sm:text-xl">{String(caseNumber).padStart(2, '0')}</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex min-h-10 items-center justify-between gap-3 rounded-xl border border-white/8 bg-black/15 px-3 py-2 text-xs">
              <div className="flex items-center gap-2 text-slate-400" aria-live="polite">
                <span className="size-1.5 shrink-0 rounded-full bg-teal-300" />
                {history[0]
                  ? `刚刚打开：${history[0].caseNumber} 号箱 · ${formatMoney(history[0].value)}`
                  : '选择任意箱子开始游戏'}
              </div>
              <span className="shrink-0 font-semibold text-slate-500">剩余 {remainingValues.length} 箱</span>
            </div>
          </section>

          <PrizeBoard prizes={PRIZES.slice(10)} openedCases={openedCases} caseValues={game.caseValues} high />
        </div>
      </section>

      <GameDialog
        phase={phase}
        offer={offer}
        chosenCase={chosenCase}
        otherCase={unopenedOtherCases[0] ?? null}
        finalCase={finalCase}
        finalAmount={finalAmount}
        chosenCaseValue={chosenCase ? game.caseValues[chosenCase - 1] : null}
        otherCaseValue={unopenedOtherCases[0] ? game.caseValues[unopenedOtherCases[0] - 1] : null}
        dealAccepted={dealAccepted}
        remainingAverage={remainingAverage}
        onAccept={acceptDeal}
        onReject={rejectDeal}
        onKeep={() => chosenCase && finishWithCase(chosenCase)}
        onSwap={() => unopenedOtherCases[0] && finishWithCase(unopenedOtherCases[0])}
        onReset={resetGame}
      />
    </main>
  );
}
