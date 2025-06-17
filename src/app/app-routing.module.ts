import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent }      from './home/home.component';
import { ReviewComponent }      from './review/review.component';
import { ThankyouComponent }      from './thankyou/thankyou.component';
import { NotfoundComponent }      from './notfound/notfound.component';

const routes: Routes = [
  { path: ':location_id/:request_id', component: HomeComponent },
  { path: '', component: HomeComponent },
  { path: 'review/:group_id/:location_id', component: ReviewComponent },
  { path: '404', component: NotfoundComponent },
  { path: 'thank-you/:group_id/:location_id', component: ThankyouComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}