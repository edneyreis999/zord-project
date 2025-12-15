# Skill: Update E2E Troubleshooting

**Purpose**: Standardized process for adding new troubleshooting items to the e2e-playwright-diagnosis skill based on lessons learned from debugging E2E tests.

## When to Use This Skill

Use this skill when you've successfully resolved an E2E test failure and need to document the troubleshooting pattern for future reference. This ensures:

- Consistent documentation format
- Reusable troubleshooting patterns
- Knowledge sharing across the team
- Faster resolution of similar issues

## Prerequisites

Before adding a new troubleshooting item, ensure you have:

1. **Root cause identified** - You understand WHY the test failed (not just the symptom)
2. **Solution validated** - The fix is confirmed working (tests passing)
3. **Discovery method documented** - You can explain HOW you found the root cause
4. **Generic pattern extracted** - The solution applies beyond the specific test case

## Troubleshooting Item Format

Each troubleshooting item in the Quick Troubleshooting Checklist must follow this structure:

```markdown
N. **[Symptom description]** → [Root cause]. [Solution]. [Discovery method if relevant]
```

**Components:**

- **Symptom**: User-visible problem (e.g., "Timeout on element interaction")
- **Root cause**: Technical explanation (e.g., "Selector uses dynamic text")
- **Solution**: Concrete fix (e.g., "Use getByRole with accessible name")
- **Discovery method**: How the issue was diagnosed (optional, but valuable for complex cases)

## Quality Guidelines

### ✅ Good Example
```markdown
11. **Timeout on element interaction (manual test works, logs show success)** → Selector uses `.filter({ hasText: /pattern/ })` but element text is dynamic (e.g., "Loading...", "Select option"). Use `getByRole('role', { name: 'Label' })` to match accessible name from label, not visible text
```

**Why it's good:**
- Concise (under 20 lines)
- Generic (applies to any dynamic text component)
- Explains discovery method (manual test works + logs clean = selector issue)
- Provides clear solution

### ❌ Bad Example
```markdown
11. **SubCliente field timeout** → The SubCliente selector was wrong. Change to getByRole('combobox', { name: 'SubCliente' })
```

**Why it's bad:**
- Too specific (only applies to SubCliente)
- Doesn't explain root cause (WHY was selector wrong?)
- No discovery method
- No generic pattern

## Step-by-Step Process

### Step 1: Identify the Troubleshooting Pattern

Ask yourself:
- What was the SYMPTOM? (timeout, wrong element, etc.)
- What was the ROOT CAUSE? (selector issue, timing, data isolation, etc.)
- What was the SOLUTION? (code change, pattern to use)
- HOW did I discover it? (logs, manual testing, MCP tools, etc.)

### Step 2: Make It Generic

Transform specific details into reusable patterns:

**Specific:**
```
SubCliente field times out when using .filter({ hasText: /SubCliente/ })
```

**Generic:**
```
Element times out when using .filter({ hasText }) on dynamic text
```

### Step 3: Write the Troubleshooting Item

Follow the format:

```markdown
N. **[Symptom]** → [Root cause]. [Solution]. [Discovery method]
```

**Keep it concise:**
- Maximum 3-4 lines
- Focus on actionable information
- Avoid code examples (reference files if needed)

### Step 4: Determine Placement

**Quick Troubleshooting Checklist** (items 1-15):
- Common, frequent issues
- Quick to diagnose and fix
- Pattern-based solutions

**Detailed Troubleshooting Workflows** (sections below):
- Complex, multi-step issues
- Require investigation
- Tool-specific workflows

### Step 5: Update the Skill File

1. Read the current e2e-playwright-diagnosis skill
2. Find the appropriate section
3. Add the new item with the next sequential number
4. Ensure formatting is consistent

## Common Troubleshooting Categories

Use these categories to classify your troubleshooting item:

### 1. Selector Issues
- Dynamic text content
- Stale element references
- Ambiguous selectors
- Accessibility name vs visible text

### 2. Timing Issues
- Race conditions
- Async data loading
- Form validation delays
- Network requests

### 3. Data Isolation Issues
- Shared test data
- Database conflicts
- Duplicate key violations
- Test cleanup failures

### 4. State Management Issues
- Component re-renders
- Cache invalidation
- Cookie/session problems
- Global state pollution

### 5. Integration Issues
- API errors (4xx, 5xx)
- CORS problems
- Authentication failures
- Network timeouts

## Examples

### Example 1: Data Isolation Issue

**Situation**: Tests pass individually but fail in suite with 409 Conflict errors. Logs show "Já existe uma conta a receber com este documento".

**Analysis:**
- **Symptom**: 409 Conflict in suite, passes when isolated
- **Root cause**: Shared `uniqueId` across tests creating duplicate documents
- **Solution**: Generate unique ID per test, not per describe block
- **Discovery**: Backend logs showed duplicate key error

**Troubleshooting Item:**
```markdown
12. **409 Conflict when creating records (passes isolated, fails in suite)** → Unique identifier generated once at describe level, causing duplicate keys when multiple tests create records. Generate unique ID inside each test function that creates data. Discovery: Backend logs show "already exists" error
```

### Example 2: Form Submission Timing

**Situation**: Form filled correctly but submit doesn't redirect. Screenshot shows filled form, no errors in console.

**Analysis:**
- **Symptom**: Submit button clicked but no navigation
- **Root cause**: Submit clicked before form validation completes
- **Solution**: Wait for form validation + verify button enabled
- **Discovery**: Adding timeout before submit fixed it

**Troubleshooting Item:**
```markdown
13. **Submit button clicked but form not submitted (no navigation)** → Form validation not complete before submit. Add `waitForTimeout(500)` after filling last field, verify button not disabled before clicking. Discovery: Manual testing showed brief validation delay
```

## Anti-Patterns to Avoid

### ❌ Don't: Add Test-Specific Details
```markdown
Fix Teste 6 by changing line 373 to use nth(2)
```

### ✅ Do: Extract Generic Pattern
```markdown
Use nth() selectors for DOM order-based targeting when filter() is unreliable
```

---

### ❌ Don't: List Multiple Unrelated Fixes
```markdown
Fixed SubCliente, Plano de Contas, and Banco selectors plus timing issue
```

### ✅ Do: One Issue Per Item
```markdown
11. Selector issue → Solution
12. Timing issue → Solution
```

---

### ❌ Don't: Skip Discovery Method for Complex Issues
```markdown
Selector was wrong → Use getByRole instead
```

### ✅ Do: Explain How You Found It
```markdown
... Discovery: Manual test worked + logs clean + MCP Playwright showed element exists = selector mismatch
```

## Validation Checklist

Before finalizing your troubleshooting item:

- [ ] **Concise**: Under 4 lines
- [ ] **Generic**: Applies beyond specific test
- [ ] **Actionable**: Clear solution provided
- [ ] **Root cause explained**: Not just symptoms
- [ ] **Discovery method included**: For complex issues
- [ ] **Properly categorized**: In right section of skill
- [ ] **Formatted consistently**: Follows existing pattern
- [ ] **No code snippets**: Unless absolutely necessary

## Usage

When you have a troubleshooting item ready:

```
Use the update-e2e-troubleshooting skill to add the following pattern to e2e-playwright-diagnosis:

[Your troubleshooting item here]
```

This skill will then:
1. Validate the item format
2. Determine proper placement
3. Update the e2e-playwright-diagnosis skill
4. Ensure consistent formatting

## Output

After using this skill, you should have:

1. **Updated skill file** - e2e-playwright-diagnosis with new item
2. **Sequential numbering** - Items properly numbered
3. **Consistent formatting** - Matches existing style
4. **Categorization** - Item in correct section
