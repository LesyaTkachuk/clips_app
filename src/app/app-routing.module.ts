import { NgModule } from '@angular/core';
// Router Module will import services, components and directives for adding routing capabilities to an app
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ClipComponent } from './clip/clip.component';
import { NotFoundComponent } from './not-found/not-found.component';

// this array will contain a list of objects with configurations setting for each route
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'clip/:id',
    component: ClipComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
// be aware of right routing modules order, AppRoutingModule should be the last one in the imports array

// we registering our routes by passing them into forRoot() method of RouterModule
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  // the RouterModule is being exported by our module and it acts as configuration file for our Router
  // So we export the configuration file by exporting the router module
  exports: [RouterModule],
})
export class AppRoutingModule {}
