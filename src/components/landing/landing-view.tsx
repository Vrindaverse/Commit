'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import {
  motion,
  MotionConfig,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Sparkles,
} from 'lucide-react';
import SiteFooter from '@/components/shared/site-footer';
import Tape from './tape';
import MagneticCTA from './magnetic-cta';
import HeroScene from './hero-scene';
import ScrollStory from './scroll-story';
import CustomCursor from './custom-cursor';
import ScrollProgress from './scroll-progress';
import CountUp from './count-up';
import Aurora from './aurora';
import FeatureWall from './feature-wall';
import Sandbox from './sandbox';

const TAPE_WORDS = [
  'GOALS',
  'TASKS',
  'HABITS',
  'FINANCE',
  'ACADEMICS',
  'LEARNING',
  'JOURNAL',
  'PROJECTS',
  'ANALYTICS',
  'ACHIEVEMENTS',
];

const STATS = [
  {
    to: 11,
    suffix: '',
    label: 'Tools, one console',
    color: 'var(--sticker-yellow)',
    shadow: 'var(--shadow-yellow)',
  },
  {
    to: 47,
    suffix: 'd',
    label: 'Longest streak logged',
    color: 'var(--sticker-peach)',
    shadow: 'var(--shadow-pink)',
  },
  {
    to: 100,
    suffix: '%',
    label: 'Yours — private by design',
    color: 'var(--sticker-green)',
    shadow: 'var(--shadow-green)',
  },
  {
    to: 0,
    suffix: '',
    prefix: '₹',
    label: 'Cost to start',
    color: 'var(--sticker-blue)',
    shadow: 'var(--shadow-blue)',
  },
];

const NAV = [
  { href: '#loop', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#sandbox', label: 'Try it' },
];

const PROOF = ['Free to start', '11 tools, one console', 'Private by design'];

export default function LandingView() {
  const heroRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();

  const glowX = useMotionValue(50);
  const glowY = useMotionValue(38);
  const springGlowX = useSpring(glowX, { stiffness: 140, damping: 30, mass: 0.7 });
  const springGlowY = useSpring(glowY, { stiffness: 140, damping: 30, mass: 0.7 });
  const heroGlow = useMotionTemplate`radial-gradient(640px circle at ${springGlowX}% ${springGlowY}%, oklch(92% 0.1 95 / 0.26), transparent 68%)`;
  const glint = useMotionTemplate`radial-gradient(200px circle at ${springGlowX}% ${springGlowY}%, oklch(100% 0 0 / 0.32), transparent 72%)`;
  const driftX = useTransform(springGlowX, [0, 100], [14, -14]);
  const driftY = useTransform(springGlowY, [0, 100], [10, -10]);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 16));

  function handleHeroPointer(e: React.PointerEvent<HTMLElement>) {
    if (reduceMotion || e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    glowX.set(((e.clientX - rect.left) / rect.width) * 100);
    glowY.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  function resetHeroPointer() {
    glowX.set(50);
    glowY.set(38);
  }

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, -36]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.2]);

  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen w-full overflow-x-clip bg-[var(--paper)] text-[var(--ink)]">
        <CustomCursor />
        <ScrollProgress />
        <div aria-hidden className="grain-overlay" />

        {/* ---------------- header ---------------- */}
        <header
          className={`sticky top-0 z-50 border-b-[3px] border-[#2D2D2D] transition-all duration-300 ${
            scrolled
              ? 'bg-[var(--paper)]/90 py-0 shadow-[0_6px_0_0_oklch(75%_0.07_300_/_0.18)] backdrop-blur-md'
              : 'bg-[var(--paper)]/55 py-0 backdrop-blur-sm'
          }`}
        >
          <div
            className={`mx-auto flex w-full max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-6 ${
              scrolled ? 'py-2.5' : 'py-3.5'
            }`}
          >
            <Link href="/" className="group flex items-center gap-2.5">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl border-[3px] border-[#2D2D2D] bg-[var(--sticker-yellow)] font-display text-base font-extrabold text-[#2A2A2A] transition-transform duration-300 group-hover:-rotate-12 hard-shadow-sm"
                style={{ '--sh': 'var(--shadow-yellow)' } as React.CSSProperties}
              >
                C
              </span>
              <span className="font-display text-xl font-extrabold tracking-tight">Commit</span>
            </Link>

            <nav className="hidden items-center gap-7 md:flex" aria-label="Sections">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="group relative font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-[#2D2D2D] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            <nav className="flex items-center gap-2.5" aria-label="Account">
              <Link
                href="/login"
                className="neo-button hidden bg-[var(--paper-2)] px-4 py-2 text-sm text-[#2A2A2A] tint-blue sm:inline-flex"
              >
                Sign in
              </Link>
              <MagneticCTA
                href="/signup"
                className="neo-button inline-flex bg-[#2A2A2A] px-4 py-2 text-sm text-[#FFFDF8] tint-purple"
              >
                Get started
              </MagneticCTA>
            </nav>
          </div>
        </header>

        {/* ---------------- hero ---------------- */}
        <section
          ref={heroRef}
          onPointerMove={handleHeroPointer}
          onPointerLeave={resetHeroPointer}
          className="relative isolate overflow-hidden px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:pt-16"
        >
          <Aurora />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 mix-blend-multiply"
            style={{ background: heroGlow }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 opacity-50 mix-blend-soft-light"
            style={{ background: glint }}
          />
          <motion.div
            aria-hidden
            style={{ x: driftX, y: driftY }}
            className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
          >
            <span className="absolute left-[43%] top-[13%] font-display text-5xl font-extrabold leading-none text-[#2D2D2D]/[0.055]">
              ✦
            </span>
            <span className="absolute bottom-[19%] right-[4%] h-14 w-14 rotate-12 rounded-xl border-[3px] border-[#2D2D2D]/10" />
            <span className="absolute left-[3%] top-[62%] h-2.5 w-2.5 rounded-full bg-[#2D2D2D]/15" />
          </motion.div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(#2D2D2D 1px, transparent 1px), linear-gradient(90deg, #2D2D2D 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              maskImage:
                'radial-gradient(ellipse 80% 62% at 50% 0%, #000 38%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 80% 62% at 50% 0%, #000 38%, transparent 100%)',
              opacity: 0.055,
            }}
          />

          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-6 lg:min-h-[calc(100svh-13rem)] lg:grid-cols-[1.04fr_0.96fr] lg:gap-4">
            <motion.div style={{ y: headlineY, opacity: heroOpacity }} className="relative z-10 min-w-0">
              <motion.span
                {...fade()}
                className="mb-6 inline-flex items-center gap-2 rounded-full border-[3px] border-[#2D2D2D] bg-[var(--paper-2)] px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] shadow-[4px_4px_0_0_var(--shadow-purple)]"
              >
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--sticker-green)]" />
                Your personal command center
              </motion.span>

              <motion.h1
                {...fade(0.08)}
                className="font-display text-[clamp(2.55rem,7.2vw,5.4rem)] font-extrabold leading-[0.93] tracking-[-0.035em]"
              >
                <span className="block">Plan your life.</span>
                <span className="relative mt-1 block">
                  <span className="relative z-10 font-editorial text-[1.08em] font-normal tracking-[-0.02em]">
                    Commit
                  </span>
                  <span className="relative z-10"> to it.</span>
                  <motion.span
                    aria-hidden
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.75, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-x-[-1%] bottom-[5%] z-0 h-[36%] origin-left -rotate-[1.4deg] rounded-sm bg-[var(--sticker-yellow)]"
                  />
                </span>
              </motion.h1>

              <motion.p
                {...fade(0.16)}
                className="mt-7 max-w-lg text-base font-medium leading-relaxed text-[var(--ink-soft)] sm:text-lg"
              >
                Goals, tasks, habits, learning, academics, and money in one loud,
                focused console — so you stop juggling apps and start following
                through.
              </motion.p>

              <motion.div {...fade(0.24)} className="mt-8 flex flex-wrap items-center gap-3">
                <MagneticCTA
                  href="/signup"
                  className="neo-button inline-flex items-center gap-2 bg-[#2A2A2A] px-7 py-3.5 text-sm text-[#FFFDF8] tint-purple"
                >
                  Create your account
                  <ArrowUpRight size={16} />
                </MagneticCTA>
                <Link
                  href="/login"
                  className="neo-button inline-flex items-center gap-2 bg-[var(--paper-2)] px-7 py-3.5 text-sm text-[#2A2A2A] tint-blue"
                >
                  I have an account
                </Link>
              </motion.div>

              <motion.ul
                {...fade(0.32)}
                className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)]"
              >
                {PROOF.map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#2D2D2D] bg-[var(--sticker-green)]">
                      <Check size={9} strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.div
              style={{ y: sceneY }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 min-w-0"
            >
              <HeroScene />
            </motion.div>
          </div>

          <motion.a
            href="#loop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mx-auto mt-6 hidden w-fit items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)] lg:flex"
          >
            Scroll to see the loop
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown size={12} />
            </motion.span>
          </motion.a>
        </section>

        {/* ---------------- tape ---------------- */}
        <div className="border-y-[3px] border-[#2D2D2D] bg-[var(--sticker-yellow)] py-3">
          <Tape
            items={TAPE_WORDS}
            speed={38}
            className="font-display text-xl font-extrabold tracking-wide text-[#2A2A2A] sm:text-2xl"
          />
        </div>

        {/* ---------------- scroll story ---------------- */}
        <ScrollStory />

        {/* ---------------- feature wall ---------------- */}
        <FeatureWall />

        {/* ---------------- live sandbox ---------------- */}
        <Sandbox />

        {/* ---------------- stats band ---------------- */}
        <section className="relative overflow-hidden bg-[var(--paper-2)] px-4 py-16 sm:px-6 sm:py-20">
          <div aria-hidden className="dot-grid-ink pointer-events-none absolute inset-0 opacity-30" />
          <div className="relative mx-auto w-full max-w-7xl">
            <div className="mb-9 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <h2 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                Built for the long game.
              </h2>
              <p className="max-w-xs font-mono text-[10px] font-bold uppercase leading-relaxed tracking-[0.14em] text-[var(--ink-soft)]">
                Small numbers. Honest ones. No vanity metrics.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="group rounded-2xl border-[3px] border-[#2D2D2D] bg-[var(--paper)] p-5 transition-transform duration-300 hover:-translate-y-1.5 hard-shadow-sm sm:p-6"
                  style={{ '--sh': stat.shadow } as React.CSSProperties}
                >
                  <span
                    className="mb-3 block h-2.5 w-10 rounded-full border-[2px] border-[#2D2D2D] transition-transform duration-300 group-hover:w-14"
                    style={{ backgroundColor: stat.color }}
                  />
                  <p className="font-display text-4xl font-extrabold leading-none sm:text-5xl">
                    <CountUp to={stat.to} prefix={stat.prefix} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)]">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- second tape ---------------- */}
        <div className="border-y-[3px] border-[#2D2D2D] bg-[#2A2A2A] py-3">
          <Tape
            items={[
              'STOP JUGGLING APPS',
              'ONE CONSOLE',
              'FOLLOW THROUGH',
              'BUILD THE STREAK',
              'OWN YOUR DAY',
            ]}
            speed={30}
            reverse
            separator="→"
            className="font-display text-xl font-extrabold tracking-wide text-[var(--sticker-yellow)] sm:text-2xl"
          />
        </div>

        {/* ---------------- CTA ---------------- */}
        <section className="px-4 py-20 sm:px-6 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto max-w-5xl overflow-hidden rounded-[32px] border-[3px] border-[#2D2D2D] bg-[var(--sticker-purple)] px-6 py-16 text-center hard-shadow sm:px-16 sm:py-20"
            style={{ '--sh': 'var(--shadow-purple)' } as React.CSSProperties}
          >
            <motion.span
              aria-hidden
              animate={{ rotate: [12, 22, 12], y: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-3xl border-[3px] border-[#2D2D2D] bg-[var(--sticker-yellow)]/75"
            />
            <motion.span
              aria-hidden
              animate={{ rotate: [-6, -16, -6], y: [0, 12, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="pointer-events-none absolute -bottom-14 -left-10 h-36 w-36 rounded-full border-[3px] border-[#2D2D2D] bg-[var(--sticker-blue)]/70"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-10 right-6 hidden font-display text-[9rem] font-extrabold leading-none text-[#2A2A2A]/10 sm:block"
            >
              C
            </span>

            <span className="relative mb-4 inline-flex items-center gap-2 rounded-full border-[2px] border-[#2D2D2D] bg-[var(--paper-2)] px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em]">
              <Sparkles size={11} /> One place for all of it
            </span>
            <h2 className="relative font-display text-4xl font-extrabold leading-[1.0] sm:text-5xl">
              Everything you&apos;re
              <br className="hidden sm:block" /> committed to.
            </h2>
            <p className="relative mx-auto mt-5 max-w-lg text-sm font-medium leading-relaxed text-[#2A2A2A]/80 sm:text-base">
              Start with one task. Keep one streak. In a month you&apos;ll have a
              system instead of a pile of apps.
            </p>
            <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
              <MagneticCTA
                href="/signup"
                className="neo-button inline-flex items-center gap-2 bg-[#2A2A2A] px-7 py-3.5 text-sm text-[#FFFDF8] tint-yellow"
              >
                Get started — it&apos;s free
                <ArrowUpRight size={16} />
              </MagneticCTA>
              <Link
                href="/login"
                className="neo-button inline-flex items-center gap-2 bg-[var(--paper-2)] px-7 py-3.5 text-sm text-[#2A2A2A] tint-blue"
              >
                Sign in
              </Link>
            </div>

            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#2A2A2A]/70">
              <span>No card required</span>
              <span aria-hidden>·</span>
              <span>Reset anytime</span>
              <span aria-hidden>·</span>
              <span>Your data stays yours</span>
            </div>
          </motion.div>
        </section>

        <div className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6">
          <SiteFooter />
        </div>
      </div>
    </MotionConfig>
  );
}
