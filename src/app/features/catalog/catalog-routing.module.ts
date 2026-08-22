import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CatalogListComponent } from "./pages/catalog-list/catalog-list.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: CatalogListComponent,
    title: "SPSRT — Catálogo",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule {}