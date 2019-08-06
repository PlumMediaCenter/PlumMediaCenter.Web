import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule, EnableMenuGuard, DisableMenuGuard } from './app-routing.module';

import { HomePage } from './pages/home/home';
import { MovieCardComponent } from './components/movie-card/movie-card';
import { Api } from './providers/api';
import { Http2Factory } from './providers/http2-factory';
import { MovieInfoClickDirective } from './directives/movie-info-click';
import { MovieInfoPage } from './pages/movie-info/movie-info';
import { MovieMetadataPage } from './pages/movie-metadata/movie-metadata';
import { ImageListComponent } from './components/image-list/image-list';
import { ProperCaseSpacePipe } from './pipes/proper-case-space-pipe';
import { StringListComponent } from './components/string-list/string-list';
import { AdminPage } from './pages/admin/admin';
import { MoviePlayPage } from './pages/movie-play/movie-play';
import { MoviePlayClickDirective } from './directives/movie-play-click';
import { VideojsVideoComponent } from './components/videojs-video/videojs-video';
import { ImageSwapperDirective } from './directives/image-swapper';
import { SourcesPage } from './pages/sources/sources';
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
import { MetadataCompareRowComponent } from './pages/movie-metadata/metadata-compare-row/metadata-compare-row';
import { BackClickDirective } from './directives/back-click';
import { PlayButtonComponent } from './components/play-button/play-button';
import { SeekBarComponent } from './components/seek-bar/seek-bar';

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
        ImageListComponent,
        MovieCardComponent,
        MetadataCompareRowComponent,
        PlayButtonComponent,
        ProgressBarComponent,
        ProgressSparseComponent,
        SearchInputComponent,
        SeekBarComponent,
        StringListComponent,
        VideojsVideoComponent,

        //directives
        DeviceSizeIfDirective,
        MovieInfoClickDirective,
        MediaInfoClickDirective,
        MoviePlayClickDirective,
        ImageSwapperDirective,
        MediaItemProcessClickDirective,
        BackClickDirective,

        //pipes
        ProperCaseSpacePipe,
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
        EnableMenuGuard,
        DisableMenuGuard,
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
