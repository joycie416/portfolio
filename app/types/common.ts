export type Align = "left" | "center" | "right";
export interface Skill {
  name: string;
  color: string;
}
export interface SkillGroup {
  title: string;
  icon: Component;
  color: string;
  skills: Skill[];
}
export interface ProjectLink {
  type: "github" | "demo" | "doc" | "link";
  url: string;
  text: string;
}
export interface Project {
  title: string;
  description: string;
  contributions: string[];
  skills: Skill[];
  links?: ProjectLink[];
}
export interface InputOption<TValue extends string | number> {
  label: string;
  value: TValue;
}
