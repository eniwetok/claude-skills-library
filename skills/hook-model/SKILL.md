---
name: hook-model
description: >
  Use when designing for retention and habit — turning a product people try into one they return
  to without being reminded. Trigger for engagement/retention work, onboarding-to-habit design,
  notification/re-engagement strategy, or "how do we get users to come back?" Applies Nir Eyal's
  Hook Model (Trigger → Action → Variable Reward → Investment) with a built-in ethics check. Skip
  for one-off/transactional products where a habit isn't the goal, or when the underlying job is
  still unclear (use jobs-to-be-done first).
license: MIT
metadata:
  author: eniwetok (original, MIT)
  category: product-management
---

# The Hook Model (habit-forming design)

Habits form when a product runs a user through four phases enough times that an **internal**
trigger takes over. Design the loop, then make it tighter each cycle.

## The four phases

### 1. Trigger
- **External** triggers prompt from outside: notification, email, an icon, a friend's share.
- **Internal** triggers are emotions/situations the user already has: boredom, loneliness,
  anxiety, "I wonder if…". The goal is to move users **from external to internal** — when the
  emotion itself makes them open your product, the habit is real.
- **Design move:** name the specific internal trigger. "When a user feels **[emotion]** in
  **[situation]**, we want them to reach for us." Vague trigger → no habit.

### 2. Action
The simplest behavior done in anticipation of a reward. Per Fogg: behavior happens when
**Motivation + Ability + Trigger** align at the same moment.
- **Design move:** reduce the effort to near-zero. Every extra step, field, or second of load
  bleeds users between the trigger and the reward. Make the core action easier before making it
  more rewarding.

### 3. Variable Reward
Rewards that **vary** hold attention far better than predictable ones. Three types:
- **Rewards of the Tribe** — social validation (likes, replies, belonging).
- **Rewards of the Hunt** — resources/information (a feed, a deal, a search result).
- **Rewards of the Self** — mastery, completion, progress (streaks, levels, a cleared inbox).
- **Design move:** identify which reward type fits the job, and introduce *variability* — but keep
  it satisfying, not slot-machine manipulative (see ethics).

### 4. Investment
A small bit of user effort that (a) loads the **next** trigger and (b) makes the product better
with use. Stored value compounds and creates switching cost:
- **Content** (playlists, notes), **data** (history, preferences), **followers**, **reputation**,
  **skill** learned in the product.
- **Design move:** end each cycle with a tiny investment that improves the next one — "add one
  more," "invite a teammate," "save this."

## The ethics gate (do this before shipping a hook)

Run the **Manipulation Matrix**: *Would I use it myself?* and *Does it materially improve the
user's life?*
- Improves life + maker uses it → **Facilitator** (build it).
- Improves life + maker won't use it → **Peddler** (usually fails; check your assumptions).
- Doesn't improve life + maker uses it → **Entertainer** (fine, but fragile).
- Doesn't improve life + maker won't use it → **Dealer** (don't build it).
Habit-forming power is real leverage. Aim it at progress the user actually wants, not at time-on-app.

## How to use this skill

1. Confirm the **job** first (what progress does returning give them?).
2. Write the loop explicitly: internal Trigger → minimal Action → Variable Reward (which type?) →
   Investment (that loads the next trigger).
3. Find the weakest link — usually a vague internal trigger or too much Action friction.
4. Run the ethics gate before shipping.

Pairs with `jobs-to-be-done` (find the emotion behind the trigger) and `cro-objections`
(get them through the first action).
