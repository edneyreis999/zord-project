---
name: zord:implement-nsd-scene
description: Implementa cenas NSD no RPG Maker MZ com tratamento obsessivo de edge cases e garantias de experiencia do jogador
tools: Task, AskUserQuestion, Read, Write, Edit, Glob, Grep, Bash
model: sonnet
---

# Implement NSD Scene

Implementa cenas de NSD (Narrative Structure Document) no RPG Maker MZ com foco obsessivo em edge cases e experiencia do jogador.

## Philosophy

**"Obsessive About Player Experience"**

Every implementation must handle edge cases gracefully. The player should NEVER encounter:
- Broken states
- Soft-locks
- Inconsistent behavior
- Save/load corruption
- Unintended interactions

## Phase 0: Pre-Flight Checklist

### Document Verification

Verify input documents exist and are valid:

```bash
# NSD document exists
ls -la docs/Quests/[QUEST_NAME]/[QUEST].NSD.fluxo-cenas.md

# Technical analysis exists (required!)
ls -la docs/Quests/[QUEST_NAME]/[QUEST].technical-analysis.xml

# Technical analysis is complete
grep -c "<nsd:implementationPlan>" docs/Quests/[QUEST_NAME]/[QUEST].technical-analysis.xml
```

**FAIL if technical analysis missing or incomplete.**

Ask user: "Technical analysis not found. Generate from NSD first? (Y/N)"

If N: Abort with instructions to create technical analysis.

If Y: Delegate to `zord:generate-technical-analysis` command.

### Git Safety Check

```bash
# Check for uncommitted changes
git status --porcelain

# If changes detected:
echo "⚠️  You have uncommitted changes."
echo "Commit or stash before implementing NSD scenes."
echo "This ensures clean rollback if something goes wrong."
```

Ask user: "Continue with uncommitted changes? (NOT RECOMMENDED) (Y/N)"

If N: Abort.

If Y: Continue but warn again.

## Phase 1: Information Gathering

### Q1: Quest Information

```
Quest name: [string]
Quest directory: [autocomplete from docs/Quests/]
Checkpoint to implement: [number from NSD]
```

### Q2: Implementation Mode

| Mode | Description | When to Use |
|------|-------------|-------------|
| **Fresh** | New map, no existing events | First implementation |
| **Update** | Existing events, update to NSD | Revising existing scene |
| **Merge** | Merge new NSD beats into existing | Adding content to existing quest |

### Q3: Scope Selection

```
Implement: [ ]
  [ ] All scenes in checkpoint
  [ ] Specific scenes only: [scene IDs, comma-separated]
  [ ] Specific beats only: [beat IDs, comma-separated]
```

## Phase 2: Document Analysis

### Load and Parse Documents

```javascript
// Load NSD
const nsdPath = `docs/Quests/${questDir}/${questName}.NSD.fluxo-cenas.md`;
const nsdContent = fs.readFileSync(nsdPath, 'utf8');

// Load Technical Analysis
const techPath = `docs/Quests/${questDir}/${questName}.technical-analysis.xml`;
const techContent = fs.readFileSync(techPath, 'utf8');

// Parse NSD scenes and beats
const scenes = parseNSDScenes(nsdContent);
const beats = parseNSDBeats(nsdContent);

// Parse Technical Analysis
const techAnalysis = parseTechnicalAnalysis(techContent);
```

### Extract Implementation Data

```javascript
const implementationData = {
  // From NSD
  scenes: scenes,
  beats: beats,
  characters: parseCharacters(nsdContent),
  locations: parseLocations(nsdContent),
  mechanics: parseMechanics(nsdContent),

  // From Technical Analysis
  variables: techAnalysis.variables,
  switches: techAnalysis.switches,
  events: techAnalysis.events,
  stateSetup: techAnalysis.stateSetup,
  stateTeardown: techAnalysis.stateTeardown,
  affectedMaps: techAnalysis.affectedMaps,
  existingState: techAnalysis.existingState,
  risks: techAnalysis.risks
};
```

### Conflict Detection Matrix

```javascript
// Check for conflicts with existing implementation
const conflicts = detectConflicts(implementationData);

conflicts.forEach(conflict => {
  console.warn(`⚠️  CONFLICT DETECTED:`);
  console.warn(`   Type: ${conflict.type}`);
  console.warn(`   Location: ${conflict.location}`);
  console.warn(`   Severity: ${conflict.severity}`);
  console.warn(`   Description: ${conflict.description}`);
  console.warn(`   Resolution: ${conflict.resolution}`);
});
```

**Ask user**: "Conflicts detected. Review resolution strategies? (Y/N)"

If Y: Display detailed conflict report with resolution options.

## Phase 3: Implementation Strategy

### Scenario Decision Tree

```
┌─────────────────────────────────────────────────────────────┐
│                    SCENARIO DETERMINATION                    │
└─────────────────────────────────────────────────────────────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
            Map exists?              Map does NOT exist
                 │                         │
          ┌──────┴──────┐                 │
          │             │                 │
    Has events?    No events          CREATE FRESH
          │             │                 │
          │             │            (go to Phase 4A)
          │             │
    ┌─────┴─────┐       │
    │           │       │
Compatible?  Incompatible
    │           │       │
    │           │   DELETE + RECREATE
    │           │       │
UPDATE      UPDATE      │
(go to 4B)  (go to 4C)  │
                          │
                    (go to Phase 4A)
```

### Strategy Table

| Scenario | Action | Risk Level | Rollback Strategy |
|----------|--------|------------|-------------------|
| **Fresh Map** | Create all events from scratch | Low | Delete map file |
| **Empty Map** | Add events to empty map | Low | Delete events |
| **Compatible Events** | Update existing events | Medium | Git revert |
| **Incompatible Events** | Delete + recreate | High | Full git revert |
| **Mixed** | Case-by-case analysis | Medium | Selective revert |

## Phase 4: Implementation

### 4A: Fresh Implementation

#### Step 1: Allocate Resources

```javascript
// Find free variable IDs
const { variablesUsed, switchesUsed } = await analyzeAllMaps();

// Allocate new variables
const allocatedVariables = allocateVariables(
  implementationData.variables,
  variablesUsed
);

// Allocate new switches
const allocatedSwitches = allocateSwitches(
  implementationData.switches,
  switchesUsed
);

// Find free event IDs in target map
const freeEventIds = findFreeEventIds(mapId);
```

**Output**: Resource allocation report

```
📊 RESOURCE ALLOCATION REPORT
═══════════════════════════════════════════════

VARIABLES:
  Requested: 5
  Allocated: 5
  Range: 1234-1238
  Details:
    [1234] v_qSemifinal_progress (quest progress)
    [1235] v_qSemifinal_estado (scene state)
    [1236] v_qSemifinal_dialog (dialog tracker)
    [1237] v_qSemifinal_timer (cutscene timer)
    [1238] v_qSemifinal_checkpoint (save point)

SWITCHES:
  Requested: 3
  Allocated: 3
  Range: 456-458
  Details:
    [456] s_qSemifinal_active (scene active)
    [457] s_qSemifinal_complete (scene complete)
    [458] s_qSemifinal_aborted (scene aborted)

EVENTS:
  Map ID: 5
  Free IDs: 18-999
  Allocated: 12 events
  Details:
    [18] Rheed (Narrator)
    [19] Player Trigger
    [20] Blue Glow Effect
    [21] Camera Controller
    [22] Sound Manager
    [23] State Manager
    [24] Teardown Handler
    [25] Dialogue Manager
    [26] Save Point
    [27] Abort Handler
    [28] Backup Event
    [29] Debug Event
```

#### Step 2: Create Event Structure

For each scene in NSD:

```javascript
scenes.forEach(scene => {
  const sceneEvents = [];

  // Create main scene controller
  const controllerEvent = createControllerEvent(scene);
  sceneEvents.push(controllerEvent);

  // Create beat events
  scene.beats.forEach(beat => {
    const beatEvent = createBeatEvent(beat);
    sceneEvents.push(beatEvent);
  });

  // Create state management events
  const stateEvents = createStateManagementEvents(scene);
  sceneEvents.push(...stateEvents);

  // Create edge case handlers
  const edgeCaseEvents = createEdgeCaseHandlers(scene);
  sceneEvents.push(...edgeCaseEvents);
});
```

#### Step 3: Implement Edge Case Handlers

**CRITICAL**: Every scene MUST include these handlers:

##### Edge Case 1: Multiple Interactions

```javascript
// Event: "NPC Dialogue State Manager"
// Purpose: Track conversation state to prevent loops

// Page 1: First interaction
Conditions: SelfSwitch A OFF
Trigger: Action Button
List:
  @> Text: "Hello there!"
  @> Choices: "Goodbye", "Tell me more"
  : Branch
  : When "Goodbye"
    @> Text: "See you later!"
    @> Control Self Switch: A = ON
  : When "Tell me more"
    @> Text: "I have nothing more to say."
  : End Branch
  @>

// Page 2: Subsequent interactions
Conditions: SelfSwitch A ON
Trigger: Action Button
List:
  @> Text: "We already spoke."
  @>
```

##### Edge Case 2: Premature Map Exit

```javascript
// Event: "Map Exit Guard"
// Purpose: Prevent leaving during critical scenes

// Page 1: Scene active, exit blocked
Conditions: Switch[sceneActive] = ON
Trigger: Player Touch (on exit tiles)
List:
  @> Text: "I can't leave now."
  @> Set Movement Route: Player (turn away from exit)
  @> Wait: 10 frames
  @>

// Page 2: Scene complete, exit allowed
Conditions: Switch[sceneComplete] = ON
Trigger: Player Touch (on exit tiles)
List:
  @> Transfer Player: [target map]
  @>
```

##### Edge Case 3: Interrupting Cutscenes

```javascript
// Event: "Cutscene Interrupt Handler"
// Purpose: Resume or rollback if player interferes

// Parallel Process event
Conditions: Switch[cutsceneActive] = ON
Trigger: Parallel
List:
  @> Loop
    :   @> Conditional Branch: Script: ($gamePlayer.isMoving())
    :   @> If YES
    :     @> Control Variables: interruptCount += 1
    :     @> Conditional Branch: Variable[interruptCount] > 10
    :     @> If YES
    :       @> Text: "Please wait..."
    :       @> Set Movement Route: Player (stop)
    :       @> Control Variables: interruptCount = 0
    :     @> End
    :   @> End
    :   @> Wait: 1 frame
    : @> Repeat Above
  @>
```

##### Edge Case 4: Save During Critical Moments

```javascript
// Event: "Save Block Handler"
// Purpose: Prevent saving during unstable states

// Parallel Process event
Conditions: Switch[saveBlocked] = ON
Trigger: Parallel
List:
  @> Loop
    :   @> Conditional Branch: Script: ($gameSystem.isSaveEnabled())
    :   @> If YES
    :     @> Script: $gameSystem.disableSave()
    :   @> End
    :   @> Wait: 1 frame
    : @> Repeat Above
  @>

// On scene completion:
@> Script: $gameSystem.enableSave()
@>
```

##### Edge Case 5: Party Changes During Scene

```javascript
// Event: "Party State Backup"
// Purpose: Save and restore party state

// On scene start:
@> Control Variables: backupPartySize = Party Members
@> Control Variables: backupLeader = Actor ID
@> Loop (backup party members)
  :   @> Control Variables: backupActor[index] = Current Actor
  :   @> Repeat Above
  @>
@> Add Actor: [temporary actor]  // Add required NPC
@> Change Party Leader: [temporary actor]

// On scene completion:
@> Remove Actor: [temporary actor]
@> Change Party Leader: Variable[backupLeader]
@> Loop (restore party)
  :   @> Conditional Branch: Variable[backupActor[index]] exists
  :   @> If YES
  :     @> Add Actor: Variable[backupActor[index]]
  :   @> End
  :   @> Repeat Above
  @>
```

##### Edge Case 6: Dying During Scenes

```javascript
// Event: "Death Handler"
// Purpose: Handle game over during quest scenes

// Parallel Process event
Trigger: Parallel
List:
  @> Loop
    :   @> Conditional Branch: Script: ($gameParty.isEmpty())
    :   @> If YES  // All actors dead
    :     @> Control Switches: sceneFailed = ON
    :     @> Control Switches: sceneActive = OFF
    :     @> Transfer Player: [last checkpoint]
    :     @> Text: "You fell unconscious..."
    :     @> Show Choices: "Try Again", "Return to Title"
    :     : Branch
    :     : When "Try Again"
    :       @> Control Variables: questProgress = lastCheckpoint
    :       @> Transfer Player: [scene map]
    :     : When "Return to Title"
    :       @> Fadeout Screen
    :       @> Game Over
    :     : End Branch
    :   @> End
    :   @> Wait: 1 frame
    : @> Repeat Above
  @>
```

##### Edge Case 7: State Persistence Issues

```javascript
// Event: "State Persistence Checker"
// Purpose: Verify state on map load

// Autorun event (first event on map)
Trigger: Autorun
List:
  @> Conditional Branch: Variable[questProgress] >= 1
  @> If YES
  :   @> Conditional Branch: Switch[sceneComplete] = OFF
  :   @> If YES  // Inconsistent state!
  :     @> Text: "[DEBUG] State inconsistency detected!"
  :     @> Control Variables: questProgress = 0
  :     @> Control Switches: sceneActive = OFF
  :     @> Control Switches: sceneComplete = OFF
  :     @> Text: "Quest state reset due to error."
  :   @> End
  : @> End
  @> Erase Event
  @>
```

##### Edge Case 8: Loading Save During Scene

```javascript
// Event: "Load State Handler"
// Purpose: Properly resume or abort on load

// Common Event: OnSceneLoad
Trigger: Parallel
List:
  @> Conditional Branch: Variable[questProgress] > 0
  @> If YES
  :   @> Conditional Branch: Variable[sceneCheckpoint] < Variable[questProgress]
  :   @> If YES  // Save was made during scene
  :     @> Text: "Resuming from checkpoint..."
  :     @> Control Variables: questProgress = Variable[sceneCheckpoint]
  :     @> Transfer Player: [checkpoint location]
  :   @> End
  : @> End
  @>
```

#### Step 4: Create State Management System

```javascript
// Event: "Scene State Manager"
// Purpose: Centralized state control

// Page 1: Scene Initialization
Conditions: Switch[sceneActive] = OFF
Trigger: Autorun (priority 1)
List:
  @> Control Switches: sceneActive = ON
  @> Control Switches: sceneComplete = OFF
  @> Control Switches: sceneAborted = OFF
  @> Control Variables: questProgress = 1
  @> Control Variables: sceneCheckpoint = 0
  @> Control Variables: sceneStep = 0
  @> Backup Player State:
    @> Control Variables: playerX = Map X
    @> Control Variables: playerY = Map Y
    @> Control Variables: playerDir = Player Direction
  @> Backup Environment:
    @> Control Variables: bgmBackup = Current BGM
    @> Control Variables: bgsBackup = Current BGS
  @> Set Move Route: Player (ignore input)
  @> Wait: 1 frame
  @> Erase Event
  @>

// Page 2: Scene Teardown
Conditions: Switch[sceneComplete] = ON
Trigger: Parallel
List:
  @> Control Switches: sceneActive = OFF
  @> Restore Player State:
    @> Set Movement Route: Player (restore direction)
    @> Set Movement Route: Player (enable input)
  @> Restore Environment:
    @> Play BGM: Variable[bgmBackup]
    @> Play BGS: Variable[bgsBackup]
  @> Clear Temporary Variables:
    @> Control Variables: sceneStep = 0
    @> Control Variables: interruptCount = 0
  @> Reset Self Switches (all events in scene)
  @> Erase Event
  @>
```

#### Step 5: Create Verification Events

```javascript
// Event: "Scene Verification"
// Purpose: Verify implementation matches NSD

// Page 1: Run after implementation
Trigger: Action Button (debug only)
List:
  @> Comment: NSD Verification Checklist
  @> Control Variables: verifyCount = 0

  @> Comment: Check 1: All events exist
  @> Loop (through NSD events)
    :   @> Conditional Branch: Event[ID] exists
    :   @> If YES
    :     @> Control Variables: verifyCount += 1
    :   @> End
    :   @> Repeat Above
  @>
  @> Conditional Branch: Variable[verifyCount] = expectedCount
  @> If YES
    @> Text: "✓ All events present"
  @> Else
    @> Text: "✗ Missing events!"
  @> End
  @>
```

### 4B: Update Existing Events

#### Step 1: Analyze Existing Events

```javascript
const existingEvents = analyzeMapEvents(mapId);
const compatibility = checkCompatibility(existingEvents, nsdEvents);
```

#### Step 2: Update Strategy Table

| Event Type | Compatible? | Action |
|------------|-------------|--------|
| **NPC Dialogue** | Yes | Update dialogue only |
| **Trigger Event** | Yes | Update trigger conditions |
| **Cutscene Event** | No | Recreate entirely |
| **State Manager** | Partial | Merge with new requirements |

#### Step 3: Apply Updates

```javascript
existingEvents.forEach(event => {
  const nsdEvent = findNSDEvent(event.id);

  if (nsdEvent) {
    if (isCompatible(event, nsdEvent)) {
      updateEvent(event, nsdEvent);
    } else {
      recreateEvent(event, nsdEvent);
    }
  }
});
```

### 4C: Delete and Recreate

```javascript
// When existing events are incompatible
incompatibleEvents.forEach(event => {
  console.warn(`Deleting incompatible event: ${event.name} (ID: ${event.id})`);
  deleteEvent(mapId, event.id);

  const nsdEvent = findNSDEvent(event.id);
  createEvent(mapId, nsdEvent);
});
```

## Phase 5: State Teardown Implementation

### Critical Teardown Checklist

Every scene MUST implement teardown for:

```javascript
const teardownChecklist = {
  // Player state
  playerControl: "Restore player control",
  playerTransparency: "Restore transparency state",
  playerDirection: "Restore facing direction",

  // Party state
  partyMembers: "Restore original party",
  partyLeader: "Restore original leader",

  // Environment
  bgm: "Restore background music",
  bgs: "Restore background sounds",
  parallax: "Reset parallax settings",
  tone: "Reset screen tone",

  // Game state
  switches: "Turn off scene switches",
  variables: "Clear temporary variables",
  selfSwitches: "Reset all self-switches",

  // Events
  eventPositions: "Return events to original positions",
  eventGraphics: "Restore event graphics",
  eventMovement: "Reset movement routes",

  // System
  saveEnabled: "Re-enable saving if blocked",
  menuEnabled: "Re-enable menu if disabled",
  encounters: "Restore encounter rate"
};
```

### Teardown Implementation Pattern

```javascript
// Event: "Scene Teardown Manager"
// Trigger: On scene completion OR abort

// Page 1: Normal Completion
Conditions: Switch[sceneComplete] = ON
Trigger: Autorun (priority 0)
List:
  @> Comment: === NORMAL TEARDOWN ===

  @> Comment: 1. Restore Player
  @> Set Movement Route: Player (Wait for Completion)
    :   :$> Change Transparency: OFF
    :   :$> Change Speed: Normal
    :   :$> Change Frequency: Normal
    @>

  @> Comment: 2. Restore Party
  @> Remove Actor: [temporaryActors...]
  @> Change Party Leader: [originalLeader]

  @> Comment: 3. Restore Environment
  @> Play BGM: Variable[originalBGM]
  @> Play BGS: Variable[originalBGS]
  @> Change Screen Color Tone: (0,0,0,0) 10 frames

  @> Comment: 4. Clear Scene State
  @> Control Switches: sceneActive = OFF
  @> Control Switches: saveBlocked = OFF
  @> Control Variables: sceneStep = 0

  @> Comment: 5. Reset Self Switches
  @> Loop (through all scene events)
    :   @> Control Self Switch: Event[ID] A = OFF
    :   @> Control Self Switch: Event[ID] B = OFF
    :   @> Control Self Switch: Event[ID] C = OFF
    :   @> Control Self Switch: Event[ID] D = OFF
    :   @> Repeat Above
  @>

  @> Comment: 6. Finalize
  @> Control Variables: questProgress += 1
  @> Wait: 30 frames
  @> Erase Event
  @>

// Page 2: Aborted Scene
Conditions: Switch[sceneAborted] = ON
Trigger: Autorun (priority 0)
List:
  @> Comment: === ABORT TEARDOWN ===

  @> Comment: Player left scene early - restore safely
  @> Text: "You left the area."

  @> Comment: 1. Restore Player (minimal)
  @> Set Movement Route: Player (Wait for Completion)
    :   :$> Change Transparency: OFF
    @>

  @> Comment: 2. Restore Party (minimal)
  @> Remove Actor: [temporaryActors...]

  @> Comment: 3. Clear Scene State
  @> Control Switches: sceneActive = OFF
  @> Control Switches: sceneAborted = OFF
  @> Control Switches: saveBlocked = OFF

  @> Comment: 4. Reset Progress (partial)
  @> Control Variables: questProgress = lastStableState

  @> Comment: 5. Reset Self Switches
  @> [Same as Page 1]

  @> Comment: 6. Teleport to safety
  @> Transfer Player: [safeLocation]

  @> Wait: 30 frames
  @> Erase Event
  @>
```

## Phase 6: Verification

### Automated Verification

```javascript
// Run verification checks
const verificationResults = await verifyImplementation(implementationData);

verificationResults.forEach(result => {
  console.log(`${result.passed ? '✓' : '✗'} ${result.check}`);
  if (!result.passed) {
    console.log(`   Expected: ${result.expected}`);
    console.log(`   Actual: ${result.actual}`);
  }
});
```

### Verification Checklist

```markdown
## Implementation Verification Checklist

### Scene Structure
- [ ] All NSD scenes implemented
- [ ] All NSD beats implemented
- [ ] Event IDs allocated correctly
- [ ] Event positions match NSD
- [ ] Event graphics correct

### State Management
- [ ] Variables allocated and named correctly
- [ ] Switches allocated and named correctly
- [ ] State setup implemented
- [ ] State teardown implemented
- [ ] Checkpoints created

### Edge Cases
- [ ] Multiple interactions handled
- [ ] Premature exit blocked
- [ ] Cutscene interrupt handled
- [ ] Save blocking implemented
- [ ] Party changes handled
- [ ] Death during scene handled
- [ ] State persistence handled
- [ ] Load state handled

### Player Experience
- [ ] No soft-locks possible
- [ ] No broken states reachable
- [ ] Clear direction to player
- [ ] Appropriate feedback
- [ ] Smooth transitions

### Performance
- [ ] No parallel process conflicts
- [ ] No excessive wait commands
- [ ] No memory leaks
- [ ] Frame rate stable

### Documentation
- [ ] Events named clearly
- [ ] Comments added
- [ ] Technical analysis updated
- [ ] NSD reference maintained
```

### Manual Testing Guide

Generate step-by-step test instructions:

```markdown
## Manual Testing Guide

### Test Case 1: Normal Flow
1. Load game before quest start
2. Enter quest area
3. Play through all beats
4. Verify completion triggers
5. Verify state cleaned up

### Test Case 2: Multiple Interactions
1. Start quest
2. Interact with NPC twice
3. Verify different dialogue
4. Verify no loops

### Test Case 3: Premature Exit
1. Start quest
2. Try to exit map
3. Verify blocked with message
4. Complete quest
5. Verify exit allowed

### Test Case 4: Save/Load During Quest
1. Start quest
2. Save game
3. Close and reload
4. Verify state restored
5. Complete quest

### Test Case 5: Party Changes
1. Start quest
2. Add temporary member
3. Verify party changed
4. Complete quest
5. Verify party restored

### Test Case 6: Cutscene Interrupt
1. Start cutscene
2. Try to move player
3. Verify blocked or handled
4. Complete cutscene

### Test Case 7: Death During Quest
1. Start quest
2. Get all party members killed
3. Verify handler triggered
4. Verify proper respawn

### Test Case 8: State Corruption
1. Start quest
2. Use debug to corrupt state
3. Verify recovery or reset
```

## Phase 7: Output Generation

### Generate Implementation Report

```markdown
# NSD Implementation Report

## Quest Information
- **Name**: [QUEST_NAME]
- **Checkpoint**: [CHECKPOINT_ID]
- **Implementation Mode**: [Fresh/Update/Merge]
- **Date**: [TIMESTAMP]

## Implementation Summary

### Scenes Implemented: X
### Beats Implemented: Y
### Events Created: Z
### Variables Allocated: N
### Switches Allocated: M

### Resource Usage
- Map IDs: [list]
- Event ID Range: [range]
- Variable ID Range: [range]
- Switch ID Range: [range]

### Edge Cases Handled: 8/8
✓ Multiple interactions
✓ Premature exit
✓ Cutscene interrupt
✓ Save blocking
✓ Party changes
✓ Death during scene
✓ State persistence
✓ Load state

### Verification Results
- Automated Tests: X/Y passed
- Manual Tests: Pending
- Performance: OK
- Memory: OK

### Known Issues
- [List any issues found]

### Recommendations
- [List any recommendations]
```

### Update Technical Analysis

```xml
<!-- Update implementation status -->
<nsd:metadata>
  <nsd:documentInfo>
    <nsd:status>implemented</nsd:status>
    <nsd:lastUpdated>{{ISO_DATE}}</nsd:lastUpdated>
  </nsd:documentInfo>
</nsd:metadata>

<!-- Add implementation details -->
<nsd:implementationLog>
  <nsd:entry date="{{ISO_DATE}}">
    <nsd:implementer>{{AUTHOR}}</nsd:implementer>
    <nsd:scenesImplemented>{{COUNT}}</nsd:scenesImplemented>
    <nsd:eventsCreated>{{COUNT}}</nsd:eventsCreated>
    <nsd:verificationStatus>{{STATUS}}</nsd:verificationStatus>
  </nsd:entry>
</nsd:implementationLog>
```

## Phase 8: Commit and Documentation

### Git Commit Guidelines

```bash
# Format: feat: [quest] implement checkpoint [N]

git add frontend/data/Map*.json
git add docs/Quests/[QUEST]/[QUEST].technical-analysis.xml
git commit -m "feat: [quest-name] implement checkpoint [N]

- Implemented X scenes, Y beats
- Created Z events
- Allocated N variables, M switches
- Handled 8 edge cases
- Verified implementation

Refs: #[ISSUE]"
```

### Update Documentation

1. Update NSD with implementation status
2. Update technical analysis with results
3. Document any deviations from NSD
4. Add lessons learned to project docs

## Error Handling and Recovery

### If Implementation Fails

```javascript
// Rollback strategy
const rollback = {
  partial: {
    description: "Some events created, rollback to safe state",
    action: "Delete created events, restore from git"
  },
  complete: {
    description: "Complete failure",
    action: "Full git revert, document failure"
  }
};

// Recovery steps
const recoverySteps = [
  "1. Document what failed",
  "2. Save current state for analysis",
  "3. Git revert to last commit",
  "4. Analyze failure cause",
  "5. Adjust approach",
  "6. Retry implementation"
];
```

### If Conflicts Detected

```
⚠️  CONFLICT DETECTED
═══════════════════════════════════════════════

Type: Variable Collision
Location: Map 5, Event 18
Severity: HIGH

Description:
  Variable 45 already in use by "v_qSemifinal_progress"
  New request: "v_qNoite_progress"

Resolution Options:
  A. Reuse existing variable (recommended)
  B. Allocate new variable
  C. Defer to manual resolution

Ask user for choice and implement accordingly.
```

## Best Practices

### DO:
- Always generate technical analysis first
- Always implement edge case handlers
- Always test manually after implementation
- Always commit with descriptive messages
- Always document deviations from NSD
- Always verify no broken states possible
- Always test save/load functionality
- Always test party changes
- Always test death/restart

### DON'T:
- Don't skip edge case handling
- Don't use hardcoded IDs when possible
- Don't create events without names
- Don't forget state teardown
- Don't commit without testing
- Don't ignore warnings
- Don't skip verification
- Don't assume player behavior

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Event not triggering | Wrong trigger type | Check trigger conditions |
| Variable not working | Wrong ID allocation | Reallocate variable |
| Soft-lock | Missing teardown | Implement proper cleanup |
| Save corruption | State not persisted | Add state verification |
| Performance lag | Too many parallel processes | Optimize event structure |

### Debug Mode

Enable debug mode for troubleshooting:

```javascript
// Event: "Debug Controller"
// Page 1: Debug mode active
Conditions: Switch[debugMode] = ON
Trigger: Parallel
List:
  @> Show Text: \\C[1]DEBUG MODE\\C[0]
  @> Show Text: Progress: \\V[questProgress]
  @> Show Text: Step: \\V[sceneStep]
  @> Show Text: Active: \\S[sceneActive]
  @>
```

## References

- NSD Template: `.claude/templates/nsd-template.xml`
- Technical Analysis Template: `.claude/templates/nsd-technical-analysis-template.xml`
- Command Reference: `.claude/commands/zord:generate-action-plan.md`
- Script Analysis: `scripts/analyze_map.js`
- Project Structure: `CLAUDE.md`
