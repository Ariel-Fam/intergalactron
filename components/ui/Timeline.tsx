"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
    RotateCcw,
    Star,
    Sparkles,
    Zap,
    Rocket,
    Globe,
    Lightbulb,
    Target,
    Award,
    type LucideIcon,
} from "lucide-react";

// ============================================================
// RANDOM ICON POOL
// ============================================================

/**
 * Pool of 8 icons to randomly assign when no icon is provided
 */
const ICON_POOL: LucideIcon[] = [
    Star,
    Sparkles,
    Zap,
    Rocket,
    Globe,
    Lightbulb,
    Target,
    Award,
];

/**
 * Pool of gradient colors for text/accents
 */
const COLOR_POOL: string[] = [
    "from-amber-500 to-orange-600",
    "from-green-500 to-emerald-600",
    "from-blue-500 to-cyan-600",
    "from-purple-500 to-pink-600",
    "from-red-500 to-rose-600",
    "from-indigo-500 to-violet-600",
    "from-teal-500 to-cyan-600",
    "from-yellow-500 to-amber-600",
];

/**
 * Pool of 8 unique solid colors for icon backgrounds
 */
const ICON_COLOR_POOL: string[] = [
    "bg-rose-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-cyan-500",
    "bg-blue-500",
    "bg-violet-500",
    "bg-pink-500",
    "bg-orange-500",
];

/**
 * Simple seeded random number generator for consistent randomization
 * Uses the index to create a deterministic but varied result
 */
function seededRandom(seed: number): number {
    const x = Math.sin(seed * 9999) * 10000;
    return x - Math.floor(x);
}

/**
 * Get a random icon from the pool based on index
 */
function getRandomIcon(index: number): LucideIcon {
    const randomIndex = Math.floor(seededRandom(index + 1) * ICON_POOL.length);
    return ICON_POOL[randomIndex];
}

/**
 * Get a random gradient color from the pool based on index
 */
function getRandomColor(index: number): string {
    const randomIndex = Math.floor(seededRandom(index + 7) * COLOR_POOL.length);
    return COLOR_POOL[randomIndex];
}

/**
 * Get a random solid icon background color from the pool based on index
 */
function getRandomIconColor(index: number): string {
    const randomIndex = Math.floor(seededRandom(index + 13) * ICON_COLOR_POOL.length);
    return ICON_COLOR_POOL[randomIndex];
}

// ============================================================
// TYPES & INTERFACES
// ============================================================

/**
 * Represents a single event/milestone in the timeline
 */
export interface TimelineEvent {
    /** Unique identifier for the event (used as React key) */
    id?: string;
    /** The date/year/time label shown on the timeline */
    date: string;
    /** Main title of the event (e.g., person's name, event name) */
    title: string;
    /** Description of what happened */
    description: string;
    /** Optional Lucide icon component to display */
    icon?: LucideIcon;
    /** Tailwind gradient classes for the icon background (e.g., "from-purple-500 to-pink-600") */
    color?: string;
}

/**
 * Configuration options for the Timeline component
 */
export interface TimelineConfig {
    /** Show/hide the replay animation button */
    showReplayButton?: boolean;
    /** Custom text for the replay button */
    replayButtonText?: string;
    /** Gradient classes for the center line (e.g., "from-amber-500 via-purple-500 to-indigo-500") */
    lineGradient?: string;
    /** Animation delay between each item (in seconds) */
    animationDelay?: number;
    /** Enable/disable animations */
    animated?: boolean;
}

/**
 * Props for the Timeline component
 */
export interface TimelineProps {
    /** Array of timeline events to display */
    events: TimelineEvent[];
    /** Optional configuration options */
    config?: TimelineConfig;
    /** Optional CSS class name for the container */
    className?: string;
}

// ============================================================
// DEFAULT VALUES
// ============================================================

const defaultConfig: Required<TimelineConfig> = {
    showReplayButton: true,
    replayButtonText: "Replay Timeline Animation",
    lineGradient: "from-amber-500 via-purple-500 to-indigo-500",
    animationDelay: 0.1,
    animated: true,
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

/**
 * Replay button component shown above the timeline
 */
interface ReplayButtonProps {
    onClick: () => void;
    text: string;
}

function ReplayButton({ onClick, text }: ReplayButtonProps) {
    return (
        <div className="text-center mb-8">
            <button
                onClick={onClick}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-500/30 border border-amber-500/50 text-black rounded-full text-sm font-medium transition-all hover:scale-105"
            >
                <RotateCcw className="w-4 h-4" />
                {text}
            </button>
        </div>
    );
}

/**
 * Individual timeline event card
 */
interface TimelineCardProps {
    event: TimelineEvent;
    index: number;
    config: Required<TimelineConfig>;
}

function TimelineCard({ event, index, config }: TimelineCardProps) {
    const isEven = index % 2 === 0;
    
    // Use provided icon/color or get a random one based on index
    const IconComponent = event.icon || getRandomIcon(index);
    const color = event.color || getRandomColor(index);
    const iconBgColor = getRandomIconColor(index);

    const cardContent = (
        <div
            className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700 hover:border-slate-600 transition-colors w-full overflow-hidden`}
        >
            {/* Header with icon and date */}
            <div
                className={`flex items-center gap-3 mb-3 ${isEven ? "md:justify-end" : ""}`}
            >
                <div className={`p-2 rounded-lg ${iconBgColor}`}>
                    <IconComponent className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">{event.date}</span>
            </div>

            {/* Title */}
            <h3
                className={`text-xl font-semibold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-2`}
            >
                {event.title}
            </h3>

            {/* Description */}
            <p className="text-slate-300 break-words">{event.description}</p>
        </div>
    );

    // Wrapper with animation
    const motionWrapper = config.animated ? (
        <motion.div
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * config.animationDelay }}
            className={`flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
        >
            {/* Card container */}
            <div className={`w-full md:flex-1 min-w-0 ${isEven ? "md:text-right" : "md:text-left"}`}>
                {cardContent}
            </div>

            {/* Center dot on the timeline */}
            <div className="hidden md:flex w-12 h-12 shrink-0 rounded-full bg-slate-900 border-4 border-slate-700 items-center justify-center z-10">
                <div className={`w-4 h-4 rounded-full ${iconBgColor}`}></div>
            </div>

            {/* Spacer for the other side */}
            <div className="flex-1 hidden md:block"></div>
        </motion.div>
    ) : (
        <div
            className={`flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
        >
            {/* Card container */}
            <div className={`w-full md:flex-1 min-w-0 ${isEven ? "md:text-right" : "md:text-left"}`}>
                {cardContent}
            </div>

            {/* Center dot on the timeline */}
            <div className="hidden md:flex w-12 h-12 shrink-0 rounded-full bg-slate-900 border-4 border-slate-700 items-center justify-center z-10">
                <div className={`w-4 h-4 rounded-full ${iconBgColor}`}></div>
            </div>

            {/* Spacer for the other side */}
            <div className="flex-1 hidden md:block"></div>
        </div>
    );

    return motionWrapper;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

/**
 * Timeline Component
 * 
 * A reusable, animated timeline component that displays events in an 
 * alternating left-right layout with a vertical center line.
 * 
 * @example Basic Usage
 * ```tsx
 * import { Timeline } from "@/components/Timeline";
 * import { Rocket, Star, Trophy } from "lucide-react";
 * 
 * const events = [
 *   {
 *     date: "2020",
 *     title: "Project Started",
 *     description: "The beginning of our journey",
 *     icon: Rocket,
 *     color: "from-blue-500 to-cyan-600"
 *   },
 *   {
 *     date: "2022",
 *     title: "Major Milestone",
 *     description: "Reached 1 million users",
 *     icon: Star,
 *     color: "from-yellow-500 to-orange-600"
 *   },
 *   {
 *     date: "2024",
 *     title: "Award Won",
 *     description: "Best Product of the Year",
 *     icon: Trophy,
 *     color: "from-purple-500 to-pink-600"
 *   }
 * ];
 * 
 * <Timeline events={events} />
 * ```
 * 
 * @example With Custom Configuration
 * ```tsx
 * <Timeline
 *   events={events}
 *   config={{
 *     showReplayButton: false,
 *     lineGradient: "from-red-500 via-orange-500 to-yellow-500",
 *     animationDelay: 0.2,
 *     animated: true
 *   }}
 *   className="my-16"
 * />
 * ```
 * 
 * @example Minimal Data (icons & colors auto-assigned)
 * ```tsx
 * const simpleEvents = [
 *   { date: "Jan 2024", title: "Event 1", description: "Description..." },
 *   { date: "Feb 2024", title: "Event 2", description: "Description..." },
 * ];
 * 
 * // Icons and colors are automatically randomized from a pool of 8
 * <Timeline events={simpleEvents} />
 * ```
 */
export function Timeline({ events, config, className = "" }: TimelineProps) {
    // Merge provided config with defaults
    const mergedConfig: Required<TimelineConfig> = {
        ...defaultConfig,
        ...config,
    };

    // State for triggering animation replay
    const [animationKey, setAnimationKey] = useState(0);

    const handleReplay = () => {
        setAnimationKey((prev) => prev + 1);
    };

    return (
        <div className={className}>
            {/* Replay Button */}
            {mergedConfig.showReplayButton && mergedConfig.animated && (
                <ReplayButton
                    onClick={handleReplay}
                    text={mergedConfig.replayButtonText}
                />
            )}

            {/* Timeline Container */}
            <div className="relative w-full overflow-hidden" key={animationKey}>
                {/* Vertical center line (hidden on mobile) */}
                <div
                    className={`absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b ${mergedConfig.lineGradient} hidden md:block`}
                />

                {/* Timeline Events */}
                <div className="space-y-8 sm:space-y-12">
                    {events.map((event, index) => (
                        <TimelineCard
                            key={event.id || event.date + index}
                            event={event}
                            index={index}
                            config={mergedConfig}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ============================================================
// UTILITY FUNCTION FOR DATA TRANSFORMATION
// ============================================================

/**
 * Helper function to transform data into TimelineEvent format
 * Useful when your data has different property names
 * 
 * @example
 * ```tsx
 * const apiData = [
 *   { year: "2020", name: "Event", info: "Details" }
 * ];
 * 
 * const events = createTimelineEvents(apiData, {
 *   date: (item) => item.year,
 *   title: (item) => item.name,
 *   description: (item) => item.info
 * });
 * ```
 */
export function createTimelineEvents<T>(
    data: T[],
    mappers: {
        date: (item: T) => string;
        title: (item: T) => string;
        description: (item: T) => string;
        icon?: (item: T) => LucideIcon | undefined;
        color?: (item: T) => string | undefined;
        id?: (item: T) => string | undefined;
    }
): TimelineEvent[] {
    return data.map((item) => ({
        id: mappers.id?.(item),
        date: mappers.date(item),
        title: mappers.title(item),
        description: mappers.description(item),
        icon: mappers.icon?.(item),
        color: mappers.color?.(item),
    }));
}

// Default export for convenience
export default Timeline;
