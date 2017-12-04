import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { SelectButtonModule, ButtonModule, ChartModule, SidebarModule } from 'primeng/primeng';
import { TiltscoreService } from './tiltscore.service';
import { TiltscoreCalculationsService } from './tiltscore-calculations.service';
import { GraphComponent } from './home/graph.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    GraphComponent,
  ],
  imports: [
    SidebarModule,
    ChartModule,
    ButtonModule,
    FormsModule,
    SelectButtonModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [TiltscoreService, TiltscoreCalculationsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
