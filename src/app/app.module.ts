import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HomePage } from './pages/home/home';
import { MovieCardComponent } from './components/movie-card/movie-card';
import { Api } from './providers/api';
import { Http2Factory } from './providers/http2-factory';
import { MovieInfoClickDirective } from './directives/movie-info-click';
import { MovieInfoPage } from './pages/movie-info/movie-info';
import { MovieMetadataPage } from './pages/movie-metadata/movie-metadata';
import { MovieMetadataClickDirective } from './directives/movie-metadata-click';
import { MetadataCompareRowComponent } from './components/metadata-compare-row/metadata-compare-row';
import { ImageListComponent } from './components/image-list/image-list';
import { ProperCaseSpacePipe } from './pipes/proper-case-space-pipe';
import { StringListComponent } from './components/string-list/string-list';
import { AdminPage } from './pages/admin/admin';
import { MoviePlayPage } from './pages/movie-play/movie-play';
import { MoviePlayClickDirective } from './directives/movie-play-click';
import { VideojsVideoComponent } from './components/videojs-video/videojs-video';
import { ImageSwapperDirective } from './directives/image-swapper';
import { GoToPageClickDirective } from './directives/go-to-page-click';
import { SourcesPage } from './pages/sources/sources';
import { SaveIconComponent } from './components/save-icon/save-icon';
import { Alerter } from './providers/alerter';
import { Loader } from './providers/loader';
import { Toaster } from './providers/toaster';
import { InstallDatabasePage } from './pages/install-database/install-database';
import { InitializePage } from './pages/initialize/initialize';
import { Util } from './providers/util';
import { ProgressBarComponent } from './components/progress-bar/progress-bar';
import { FormsModule } from '@angular/forms';
import { MediaItemProcessClickDirective } from './directives/media-item-process-click';
import { AccountPage } from './pages/account/account';
import { HistoryPage } from './pages/history/history';
import { ProgressSparseComponent } from './components/progress-sparse/progress-sparse';
import { DeviceSizeIfDirective } from './directives/device-size-if';
import { MediaInfoClickDirective } from './directives/media-info-click';
import { SearchResultsPage } from './pages/search-results/search-results';
import { SearchInputComponent } from './components/search-input/search-input';
import { AppSettings } from './providers/app-settings';


@NgModule({
    declarations: [
        AppComponent,
        //pages
        AdminPage,
        AccountPage,
        HomePage,
        HistoryPage,
        MovieInfoPage,
        MovieMetadataPage,
        MoviePlayPage,
        SearchResultsPage,
        SourcesPage,
        InstallDatabasePage,
        InitializePage,

        //components
        MovieCardComponent,
        MetadataCompareRowComponent,
        ImageListComponent,
        ProgressSparseComponent,
        StringListComponent,
        VideojsVideoComponent,
        SaveIconComponent,
        SearchInputComponent,
        ProgressBarComponent,

        //directives
        DeviceSizeIfDirective,
        MovieInfoClickDirective,
        MediaInfoClickDirective,
        MovieMetadataClickDirective,
        MoviePlayClickDirective,
        ImageSwapperDirective,
        GoToPageClickDirective,
        MediaItemProcessClickDirective,

        //pipes
        ProperCaseSpacePipe
    ],
    entryComponents: [
        AppComponent,
        HomePage,
        AdminPage,
        AccountPage,
        HistoryPage,
        MovieInfoPage,
        MovieMetadataPage,
        MoviePlayPage,
        SearchResultsPage,
        SourcesPage,
        InstallDatabasePage,
        InitializePage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        Api,
        Alerter,
        AppSettings,
        Http2Factory,
        Loader,
        Toaster,
        Util
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
