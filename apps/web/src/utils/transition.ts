export const transitionSpring = {
  type: "spring",
  stiffness: 350,
  damping: 30,
  mass: 0.8,
} as const;

export const transitionInstant = { duration: 0 } as const;
