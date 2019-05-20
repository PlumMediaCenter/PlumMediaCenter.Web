import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './pages/home/home';
import { SourcesPage } from './pages/sources/sources';
import { MovieInfoPage } from './pages/movie-info/movie-info';
import { MovieMetadataPage } from './pages/movie-metadata/movie-metadata';
import { AccountPage } from './pages/account/account';
import { HistoryPage } from './pages/history/history';
import { AdminPage } from './pages/admin/admin';
import { MoviePlayPage } from './pages/movie-play/movie-play';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePage },
  { path: 'account', component: AccountPage },
  { path: 'admin', component: AdminPage },
  { path: 'sources', component: SourcesPage },
  { path: 'history', component: HistoryPage },
  { path: 'movies/:id', component: MovieInfoPage },
  { path: 'movies/:id/metadata', component: MovieMetadataPage },
  { path: 'movies/:id/play', component: MoviePlayPage },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
