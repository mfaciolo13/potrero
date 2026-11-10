export type LegalBlock = string | readonly string[];

export type LegalSection = {
  heading: string;
  blocks: readonly LegalBlock[];
};

export type LegalDocument = {
  title: string;
  intro: string;
  sections: readonly LegalSection[];
};
