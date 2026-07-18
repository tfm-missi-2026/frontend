import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ProjectsListComponent } from "./pages/projects-list/projects-list.component";
import { ProjectsSubprojectsListComponent } from "./pages/projects-subprojects-list/projects-subprojects-list.component";
import { ProjectsTasksListComponent } from "./pages/projects-tasks-list/projects-tasks-list.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: ProjectsListComponent,
    title: "SPSRT — Proyectos",
  },
  {
    path: ":projectId/subproyectos",
    loadComponent: () =>
      import(
        "./pages/projects-subprojects-list/projects-subprojects-list.component"
      ).then((m) => m.ProjectsSubprojectsListComponent),
    title: "SPSRT — Subproyectos",
  },
  {
    path: ":projectId/subproyectos/:subId/tareas",
    loadComponent: () =>
      import(
        "./pages/projects-tasks-list/projects-tasks-list.component"
      ).then((m) => m.ProjectsTasksListComponent),
    title: "SPSRT — Tareas",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {}