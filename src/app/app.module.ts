import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ShowPeoplePopoverComponent } from './popovers/show-people.popover';

import { MoreOptionsPopoverComponent } from './popovers/more-options/more-options.popover';

import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [AppComponent, ShowPeoplePopoverComponent, MoreOptionsPopoverComponent],
  entryComponents: [ShowPeoplePopoverComponent, MoreOptionsPopoverComponent],
  imports: [BrowserModule, BrowserAnimationsModule, IonicModule.forRoot(), AppRoutingModule, IonicStorageModule.forRoot()],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
