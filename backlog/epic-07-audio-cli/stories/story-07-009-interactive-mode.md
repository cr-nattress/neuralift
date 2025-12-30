# Story 07-009: Interactive Mode

## Story

**As a** developer
**I want** an interactive CLI mode
**So that** I can easily explore and manage audio generation without memorizing commands

## Points: 3

## Priority: Low

## Status: DONE

## Description

Implement an interactive mode that provides a menu-driven interface for all CLI operations. This makes the tool more accessible and allows for exploration of features.

## Acceptance Criteria

- [ ] Interactive menu system
- [ ] Navigate between different operations
- [ ] Preview audio before generating
- [ ] Test playback of generated files
- [ ] Quick access to common workflows
- [ ] Configuration wizard for first-time setup

## Technical Details

### Dependencies

```bash
npm install inquirer @types/inquirer
```

### Main Menu

```
┌─────────────────────────────────────┐
│     Neuralift Audio CLI v1.0.0      │
└─────────────────────────────────────┘

? What would you like to do? (Use arrow keys)
❯ Generate Audio Files
  Manage Storage
  Analyze Audio
  Configure Settings
  View Help
  Exit
```

### Generate Submenu

```
? Generate Audio Files:
❯ Generate Single Letter
  Generate All Letters
  Generate Feedback Sounds
  Generate Everything
  Back to Main Menu
```

### Implementation

```typescript
import inquirer from 'inquirer';

async function interactiveMode(): Promise<void> {
  console.clear();
  displayBanner();

  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: 'Generate Audio Files', value: 'generate' },
          { name: 'Manage Storage', value: 'storage' },
          { name: 'Analyze Audio', value: 'analyze' },
          { name: 'Configure Settings', value: 'config' },
          { name: 'View Help', value: 'help' },
          new inquirer.Separator(),
          { name: 'Exit', value: 'exit' },
        ],
      },
    ]);

    if (action === 'exit') break;
    await handleAction(action);
  }
}

async function handleGenerate(): Promise<void> {
  const { type } = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'What would you like to generate?',
      choices: [
        { name: 'Single Letter', value: 'letter' },
        { name: 'All Letters (C, H, K, L, Q, R, S, T)', value: 'letters' },
        { name: 'Feedback Sounds', value: 'feedback' },
        { name: 'Everything', value: 'all' },
      ],
    },
  ]);

  if (type === 'letter') {
    const { letter } = await inquirer.prompt([
      {
        type: 'list',
        name: 'letter',
        message: 'Which letter?',
        choices: ['C', 'H', 'K', 'L', 'Q', 'R', 'S', 'T'],
      },
    ]);
    await generateLetter(letter);
  }
  // ...
}
```

### Configuration Wizard

```
┌─────────────────────────────────────┐
│      First-Time Configuration       │
└─────────────────────────────────────┘

? Select your preferred LLM provider:
❯ OpenAI
  Anthropic
  Google Gemini

? Select your preferred TTS provider:
❯ OpenAI TTS
  Google Cloud TTS

? Enter your OpenAI API key: ********

? Enter your GCP project ID: neuralift

✓ Configuration saved to ~/.neuralift-audio/config.json
```

## Tasks

- [ ] Install Inquirer.js
- [ ] Create main menu structure
- [ ] Implement generate submenu
- [ ] Implement storage submenu
- [ ] Implement analyze submenu
- [ ] Create configuration wizard
- [ ] Add audio preview/playback
- [ ] Implement settings management
- [ ] Add keyboard shortcuts
- [ ] Create help screens

## Notes

- Store configuration in ~/.neuralift-audio/config.json
- Consider using blessed for more advanced TUI
- Support keyboard navigation
