import type { PopoverContent } from '@/components/help/HelpPopover';

export const popoverContent: Record<string, PopoverContent> = {
  // ==========================================================================
  // Training Levels
  // ==========================================================================

  'level-position-1': {
    icon: '📍',
    title: 'Position 1-Back',
    description:
      'The foundational level for spatial working memory. Match when the current position is the same as one step ago.',
    whyItMatters:
      'Spatial memory is crucial for navigation, mental imagery, and remembering where things are. This level builds the core skill.',
    proTip:
      'Focus on the grid as a whole rather than tracking specific cells. Let the pattern emerge naturally.',
  },

  'level-position-2': {
    icon: '📍',
    title: 'Position 2-Back',
    description:
      'Advanced spatial training. Match when the current position matches the one from two steps ago.',
    whyItMatters:
      'Holding 2 positions in mind significantly increases working memory load, leading to greater cognitive improvements.',
    proTip:
      'Try creating a mental "queue" - as each new position appears, let the oldest one fade away.',
  },

  'level-audio-1': {
    icon: '🔊',
    title: 'Audio 1-Back',
    description:
      'Foundation for auditory working memory. Match when the current letter sounds the same as one step ago.',
    whyItMatters:
      'Auditory memory is essential for language processing, following conversations, and musical ability.',
    proTip:
      'Subvocalize (silently repeat) each letter in your head to strengthen the memory trace.',
  },

  'level-audio-2': {
    icon: '🔊',
    title: 'Audio 2-Back',
    description:
      'Advanced auditory training. Match when the current letter matches the one from two steps ago.',
    whyItMatters:
      'Stronger auditory working memory improves reading comprehension, learning, and verbal reasoning.',
    proTip:
      'Create a rhythm by associating letters with a mental beat. Rhythm aids memory.',
  },

  'level-dual-2': {
    icon: '🧠',
    title: 'Dual 2-Back',
    description:
      'The classic dual n-back task. Track both position AND audio simultaneously, matching each to 2 steps ago.',
    whyItMatters:
      'Research by Jaeggi et al. (2008) showed dual n-back training can improve fluid intelligence - the ability to solve novel problems.',
    proTip:
      'Don\'t try to combine the streams. Keep them separate in your mind and respond to each independently.',
  },

  'level-dual-3': {
    icon: '🧠',
    title: 'Dual 3-Back',
    description:
      'Elite cognitive training. Track both modalities matching to 3 steps ago.',
    whyItMatters:
      'Mastering 3-back demonstrates exceptional working memory capacity and sustained attention abilities.',
    proTip:
      'Accept that this is extremely difficult. Focus on maintaining calm focus rather than perfect accuracy.',
  },

  // ==========================================================================
  // UI Elements
  // ==========================================================================

  grid: {
    icon: '🎯',
    title: 'Memory Grid',
    description:
      'A 3x3 grid where positions are highlighted. Remember where each highlight appears.',
    whyItMatters:
      'The grid engages your visuospatial sketchpad - the part of working memory that handles visual and spatial information.',
    proTip:
      'Keep your eyes relaxed and centered. Peripheral vision is often better at catching position changes.',
  },

  'position-button': {
    icon: '📍',
    title: 'Position Match Button',
    description:
      'Press when the current grid position matches the position from N steps ago.',
    whyItMatters:
      'Quick, accurate responses strengthen the connection between recognition and action.',
    proTip: 'Use the keyboard shortcut [A] for faster responses. Speed matters!',
  },

  'audio-button': {
    icon: '🔊',
    title: 'Audio Match Button',
    description:
      'Press when the current letter matches the letter from N steps ago.',
    whyItMatters:
      'Training auditory matching improves phonological processing and verbal working memory.',
    proTip: 'Use the keyboard shortcut [L] for faster responses.',
  },

  'progress-bar': {
    icon: '📊',
    title: 'Session Progress',
    description: 'Shows how many trials you\'ve completed in the current session.',
    whyItMatters:
      'Knowing your progress helps maintain focus and motivation throughout the session.',
    proTip:
      'Try not to watch the progress bar constantly. Check it only between trials.',
  },

  // ==========================================================================
  // Settings
  // ==========================================================================

  'setting-trial-duration': {
    icon: '⏱️',
    title: 'Trial Duration',
    description:
      'How long each stimulus is presented before the next one appears.',
    whyItMatters:
      'Shorter durations increase difficulty by reducing encoding time. Longer durations allow deeper processing.',
    proTip:
      'Start with 3 seconds and decrease as you improve. Going too fast too soon can hurt learning.',
  },

  'setting-session-length': {
    icon: '📝',
    title: 'Session Length',
    description: 'The total number of trials in each training session.',
    whyItMatters:
      'Longer sessions provide more practice but can lead to fatigue. Find your sweet spot.',
    proTip:
      '20-25 trials is optimal for most people. Quality of focus beats quantity.',
  },

  'setting-adaptive-mode': {
    icon: '🎚️',
    title: 'Adaptive Mode',
    description:
      'Automatically adjusts difficulty based on your performance. Increases N-level when you perform well, decreases when struggling.',
    whyItMatters:
      'Keeping training at the edge of your ability maximizes learning efficiency and prevents boredom or frustration.',
    proTip:
      'Great for sustained training sessions. Disable if you want to focus on mastering a specific level.',
  },

  'setting-history-helper': {
    icon: '📜',
    title: 'History Helper',
    description:
      'Shows the recent sequence of stimuli during training to help you track the pattern.',
    whyItMatters:
      'Useful when learning. As you improve, disabling it forces deeper memory engagement.',
    proTip:
      'Start with it on, then challenge yourself by turning it off once you reach 70%+ accuracy.',
  },

  'setting-show-briefing': {
    icon: '📋',
    title: 'Show Briefing',
    description:
      'Display level instructions and tips before each training session.',
    whyItMatters:
      'Briefings help reinforce the rules and provide context-specific tips.',
    proTip:
      'Keep it on while learning new levels. Turn off once you\'re comfortable for faster session starts.',
  },

  'setting-sound-enabled': {
    icon: '🔊',
    title: 'Sound Effects',
    description: 'Enable or disable audio feedback and letter sounds.',
    whyItMatters:
      'Audio stimuli are essential for audio n-back training. Sound effects provide helpful feedback.',
    proTip:
      'Use headphones for the best audio clarity, especially in noisy environments.',
  },

  'setting-volume': {
    icon: '🔈',
    title: 'Volume',
    description: 'Adjust the volume of audio stimuli and sound effects.',
    whyItMatters:
      'Clear audio is crucial for accurate auditory memory training.',
    proTip:
      'Set volume loud enough to hear clearly but not so loud it becomes startling.',
  },

  // ==========================================================================
  // Results Metrics
  // ==========================================================================

  'result-accuracy': {
    icon: '🎯',
    title: 'Accuracy',
    description:
      'The percentage of correct responses (both hits and correct rejections).',
    whyItMatters:
      'Accuracy is your primary measure of performance. Higher accuracy means better working memory engagement.',
    proTip: 'Aim for 80%+ before moving to harder levels. Consistency beats occasional perfection.',
  },

  'result-hit-rate': {
    icon: '✅',
    title: 'Hit Rate',
    description:
      'The percentage of actual matches that you correctly identified.',
    whyItMatters:
      'A high hit rate means you\'re successfully recognizing matches when they occur.',
    proTip:
      'If your hit rate is low, you might be too conservative. Trust your instincts more.',
  },

  'result-false-alarm': {
    icon: '⚠️',
    title: 'False Alarm Rate',
    description:
      'The percentage of non-matches that you incorrectly identified as matches.',
    whyItMatters:
      'High false alarms indicate impulsive responding or memory confusion.',
    proTip:
      'If false alarms are high, slow down and be more certain before responding.',
  },

  'result-dprime': {
    icon: '📈',
    title: "D-Prime (d')",
    description:
      'A signal detection measure that accounts for both hits and false alarms. Higher is better.',
    whyItMatters:
      "D-prime separates true memory ability from response bias. It's the most reliable measure of performance.",
    proTip:
      "A d' above 2.0 indicates excellent discrimination ability. Above 3.0 is exceptional.",
  },

  // ==========================================================================
  // Journey & Engagement
  // ==========================================================================

  'journey-foundations': {
    icon: '🌱',
    title: 'Foundations Phase',
    description:
      'Single-modality training (position or audio only) to build core skills.',
    whyItMatters:
      'Strong foundations make advanced dual training much more effective.',
    proTip:
      'Master both position and audio 1-back before attempting dual n-back.',
  },

  'journey-integration': {
    icon: '🔗',
    title: 'Integration Phase',
    description:
      'Begin combining position and audio in dual n-back training.',
    whyItMatters:
      'This is where the magic happens - dual training creates the greatest cognitive benefits.',
    proTip:
      'The transition to dual feels hard at first. Stick with it for at least 2 weeks.',
  },

  'journey-mastery': {
    icon: '⭐',
    title: 'Mastery Phase',
    description: 'Advanced dual n-back at 3-back and beyond.',
    whyItMatters:
      'Continued challenge prevents plateaus and maintains cognitive gains.',
    proTip: 'Even experts have bad days. Focus on long-term trends, not single sessions.',
  },

  streak: {
    icon: '🔥',
    title: 'Training Streak',
    description: 'The number of consecutive days you\'ve completed at least one session.',
    whyItMatters:
      'Consistency is the #1 predictor of cognitive improvement. Daily practice compounds.',
    proTip:
      'Even a 5-minute session keeps your streak alive. Something is always better than nothing.',
  },
};

export function getPopoverContent(key: string): PopoverContent | undefined {
  return popoverContent[key];
}

export function getAllPopoverKeys(): string[] {
  return Object.keys(popoverContent);
}
