export type ArkRole = "visitor" | "ark";

export type ArkMessage = {
  role: ArkRole;
  content: string;
};

export type ProjectBrief = {
  name?: string;
  email?: string;
  project?: string;
  problem?: string;
  goals?: string;
  timeline?: string;
  budget?: string;
};

const PROJECTS = [
  "ARKIINZTRIBE Logistics",
  "Business Website",
  "Creative Brand Identity",
];

const SERVICES = [
  "Web Development",
  "Software Systems",
  "UI / UX Design",
  "Brand Systems",
];

export function createInitialMessage(): ArkMessage {
  return {
    role: "ark",
    content:
      "I'm ARK. Tell me what you're building, what problem you're solving, or ask about our work and capabilities.",
  };
}

function questionFor(field: keyof ProjectBrief): string {
  switch (field) {
    case "project":
      return "Good. Let's turn the idea into a project brief. What are you trying to build?";

    case "problem":
      return "Got it. What problem should this project solve, or what outcome do you want?";

    case "goals":
      return "Understood. What would success look like for you?";

    case "timeline":
      return "What timeline are you working with? If you don't have one yet, say 'not decided'.";

    case "budget":
      return "What's your expected budget? If you're not sure yet, say 'not decided' and I'll help scope a practical budget.";

    case "email":
      return "Last step for now: what's the best email for the project discussion?";

    default:
      return "Tell me a little more about the project.";
  }
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function respondToMessage(
  input: string,
  brief: ProjectBrief = {},
): { message: ArkMessage; brief: ProjectBrief; ready: boolean } {
  const text = input.trim();
  const lower = text.toLowerCase();
  const nextBrief: ProjectBrief = { ...brief };

  if (!text) {
    return {
      message: {
        role: "ark",
        content: "Send me a little more detail and I'll take it from there.",
      },
      brief: nextBrief,
      ready: false,
    };
  }

  if (lower.includes("work")) {
    return {
      message: {
        role: "ark",
        content: `Our current project database includes ${PROJECTS.join(", ")}. I can also help you start a new project.`,
      },
      brief: nextBrief,
      ready: false,
    };
  }

  if (
    lower.includes("service") ||
    lower.includes("what do you build") ||
    lower.includes("what can you build")
  ) {
    return {
      message: {
        role: "ark",
        content: `We currently work across ${SERVICES.join(", ")}. Tell me what you need built and I'll help shape the brief.`,
      },
      brief: nextBrief,
      ready: false,
    };
  }

  /*
   * If the user starts a project from an otherwise empty brief,
   * treat that first message as the project description.
   */
  if (!nextBrief.project) {
    nextBrief.project = text;

    return {
      message: {
        role: "ark",
        content: questionFor("problem"),
      },
      brief: nextBrief,
      ready: false,
    };
  }

  if (!nextBrief.problem) {
    nextBrief.problem = text;

    return {
      message: {
        role: "ark",
        content: questionFor("goals"),
      },
      brief: nextBrief,
      ready: false,
    };
  }

  if (!nextBrief.goals) {
    nextBrief.goals = text;

    return {
      message: {
        role: "ark",
        content: questionFor("timeline"),
      },
      brief: nextBrief,
      ready: false,
    };
  }

  if (!nextBrief.timeline) {
    nextBrief.timeline = text;

    return {
      message: {
        role: "ark",
        content: questionFor("budget"),
      },
      brief: nextBrief,
      ready: false,
    };
  }

  if (!nextBrief.budget) {
    nextBrief.budget = text;

    return {
      message: {
        role: "ark",
        content: questionFor("email"),
      },
      brief: nextBrief,
      ready: false,
    };
  }

  if (!nextBrief.email) {
    if (!isEmail(text)) {
      return {
        message: {
          role: "ark",
          content: "Please send a valid email address so we can discuss the project.",
        },
        brief: nextBrief,
        ready: false,
      };
    }

    nextBrief.email = text;
  }

  return {
    message: {
      role: "ark",
      content:
        "PROJECT BRIEF READY. I’ve captured the core project details and contact email. The brief is ready for review. You can keep talking to me about the project, or use START A PROJECT below to continue.",
    },
    brief: nextBrief,
    ready: true,
  };
}
