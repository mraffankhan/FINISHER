# FINISHER
# BUILTLY

A solo-focused project and task tracking application designed for execution, not just planning. Built to help individuals finish projects by focusing on cadence, efficiency, and shipping.

## Philosophy

Most project management tools are designed for teams, cluttered with collaboration features, or focused purely on planning. BUILTLY is different. It is designed for the solo builder who needs to move from idea to "shipped" efficiently.

The application distinguishes strictly between **Strategy** (Projects) and **Execution** (Tasks), ensuring you always answer two different questions:
1. "Where do my projects stand?"
2. "What do I need to do right now?"

## Key Concepts

*   **Execution First**: The UI prioritizes shipping. Drop rates and completion rates are prominent to keep you honest.
*   **Strategy vs. Execution**: distinct views for high-level project tracking and low-level daily task execution.
*   **Manual Time Tracking**: Deliberately manual tracking of "Estimated" vs "Actual" hours to improve personal estimation accuracy over time.
*   **Meaningful Analytics**: No vanity metrics. Analytics focus on your efficiency (days to ship) and consistency (shipping cadence).

## Features

### Dashboard
*   **Performance Snapshot**: Instant view of total completions, active builds, and overall "Ship Rate".
*   **Activity Heatmap**: Visualizes shipping consistency over time.
*   **Status Distribution**: Breakdown of projects by difficulty (Easy, Medium, Hard).

### Projects (Strategy View)
*   **High-Level Tracking**: Large, card-based interface focused on outcomes.
*   **Progress Visualization**: Real-time progress bars calculated from underlying task completion.
*   **Metadata**: Track Difficulty, Priority, and Status (Not Started, In Progress, Completed, Dropped).
*   **Legacy Tracking**: "Dropped" status allows you to acknowledge abandoned projects without deleting the data, maintaining accurate historical metrics.

### Tasks (Execution View)
*   **Kanban Workflow**: Visual board for defining, doing, and reviewing work.
*   **Dense UI**: Designed for high-volume daily usage with immediate access to actions.
*   **Time & Effort**: Support for manual hour logging (Estimated vs. Actual).
*   **Completion Nuance**: Distinguish between "Fully Completed" (done perfectly) and "Partially Completed" (shipped with scope cuts).

### Analytics
*   **Project Efficiency**: Bar chart correlating difficulty with days-to-ship.
*   **Shipping Cadence**: Monthly breakdown of completed projects.
*   **Estimation Accuracy**: Tracking the gap between estimated hours and actual execution time.

## Mobile Experience

The application is fully responsive and optimized for usage inside a mobile WebView (iOS/Android) or as a PWA.
*   **Native Feel**: Bottom navigation bar, fixed headers, and safe-area adherence.
*   **Touch Optimization**: Swipeable columns, large touch targets, and momentum scrolling.
*   **Adaptive Layouts**: Grids transform into stacked lists and cards on smaller screens.

## Technical Stack

*   **Frontend**: React (Vite)
*   **Backend**: Supabase (PostgreSQL)
*   **Database**: Supabase with Row Level Security (RLS)
*   **Deploy**: Vercel

## Access Control

The application is publicly viewable by default (read-only), allowing for "Building in Public". 
*   **Owner Mode**: A hidden administrative mode exists (activated via triple-tap on the logo + password). 
*   **Permissions**: Only the authenticated owner can add, edit, or delete projects and tasks.

## What This Project Is NOT

*   **Not a Team Collaboration Tool**: No comments, @mentions, or team permissions.
*   **Not a Generic Todo List**: It forces a project-based structure.
*   **Not a Complexity Monster**: No Gantt charts, dependencies, or sub-sub-tasks.

---
*Built for execution.*
