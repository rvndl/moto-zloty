import { formatStateName, months, states } from "@features/event/utils";

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const autoLinkHtml = (
  html: string,
  regex: RegExp,
  getHref: (label: string) => string | undefined,
) => {
  let isInsideAnchor = false;

  return html
    .split(/(<[^>]+>)/g)
    .map((fragment) => {
      if (!fragment) {
        return fragment;
      }

      if (fragment.startsWith("<")) {
        if (/^<a\b/i.test(fragment)) {
          isInsideAnchor = true;
        } else if (/^<\/a>/i.test(fragment)) {
          isInsideAnchor = false;
        }

        return fragment;
      }

      if (isInsideAnchor) {
        return fragment;
      }

      return fragment.replace(regex, (match, prefix, label) => {
        const href = getHref(label);

        if (!href) {
          return match;
        }

        return `${prefix}<a href="${href}" class="text-primary underline underline-offset-2">${label}</a>`;
      });
    })
    .join("");
};

const stateLinkEntries = states
  .flatMap((state) => [
    {
      label: state,
      href: `/lista-wydarzen/${encodeURIComponent(state)}`,
    },
    {
      label: formatStateName(state),
      href: `/lista-wydarzen/${encodeURIComponent(state)}`,
    },
  ])
  .sort((entryA, entryB) => entryB.label.length - entryA.label.length);

const stateLinkMap = new Map(
  stateLinkEntries.map((entry) => [entry.label.toLowerCase(), entry.href]),
);

const stateLinkRegex = new RegExp(
  `(^|[^\\p{L}])(${stateLinkEntries
    .map((entry) => escapeRegExp(entry.label))
    .join("|")})(?=[^\\p{L}]|$)`,
  "giu",
);

const monthLinkMap = new Map(
  months.map((month) => [
    month.toLowerCase(),
    `/lista-wydarzen/miesiac/${encodeURIComponent(month)}`,
  ]),
);

const monthLinkRegex = new RegExp(
  `(^|[^\\p{L}])(${months.map((month) => escapeRegExp(month)).join("|")})(?=[^\\p{L}]|$)`,
  "giu",
);

const yearLinkRegex = /(^|[^\p{L}\p{N}])((?:19|20)\d{2})(?=[^\p{L}\p{N}]|$)/giu;

export const autoLinkStates = (html?: string) => {
  if (!html) {
    return "";
  }

  return autoLinkHtml(html, stateLinkRegex, (label) =>
    stateLinkMap.get(label.toLowerCase()),
  );
};

export const autoLinkMonths = (html?: string) => {
  if (!html) {
    return "";
  }

  return autoLinkHtml(html, monthLinkRegex, (label) =>
    monthLinkMap.get(label.toLowerCase()),
  );
};

export const autoLinkYears = (html?: string) => {
  if (!html) {
    return "";
  }

  return autoLinkHtml(
    html,
    yearLinkRegex,
    (label) => `/lista-wydarzen/${label}`,
  );
};

export const autoLinkTextEditorContent = (html?: string) => {
  if (!html) {
    return "";
  }

  return [autoLinkStates, autoLinkMonths, autoLinkYears].reduce(
    (content, autoLink) => autoLink(content),
    html,
  );
};
