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

export function respondToMessage(
  input: string,
  brief: ProjectBrief = {},
): { message: ArkMessage; brief: ProjectBrief; ready: boolean } {
  const text = input.trim();
  const lower = text.toLowerCase();
  const nextBrief = { ...brief };

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

  if (lower.includes("service") || lower.includes("build")) {
    return {
      message: {
        role: "ark",
        content: `We currently work across ${SERVICES.join(", ")}. Tell me what you need built and I'll help shape the brief.`,
      },
      brief: nextBrief,
      ready: false,
    };
  }

  if (lower.includes("start") || lower.includes("idea")) {
    return {
      message: {
        role: "ark",
        content:
          "Good. Let's turn the idea into a project brief. What are you trying to build?",
      },
      brief: nextBrief,
      ready: false,
    };
  }

  if (!nextBrief.project) {
    nextBrief.project = text;
    return {
      message: {
        role: "ark",
        content:
          "Got it. What problem should this project solve, or what outcome do you want?",
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
        content: "Understood. What would success look like for you?",
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
        content:
          "What timeline are you working with? If you don't have one yet, say 'not decided'.",
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
        content:
          "Last step for now: what's the best email for the project discussion?",
      },
      brief: nextBrief,
      ready: false,
    };
  }

  if (!nextBrief.email) {
    nextBrief.email = text;
  }

  return {
    message: {
      role: "ark",
      content:
        "PROJECT BRIEF READY. I have enough to prepare the project for review.",
    },
    brief: nextBrief,
    ready: true,
  };
}
