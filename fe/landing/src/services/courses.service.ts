import { getCourses, type Course } from "../repositories/courses.repository";

export function listActiveCourses(): Course[] {
  return getCourses()
    .filter((course) => course.status === "active")
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
