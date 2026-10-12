import coursesData from "../content/courses.json";

export type Course = (typeof coursesData.items)[number];

export function getCourses(): Course[] {
  return coursesData.items;
}
