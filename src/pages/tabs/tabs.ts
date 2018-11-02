import { Component } from '@angular/core';
import {HomePage } from '../../pages/home/home';
import {CategoryPage } from '../../pages/category/category';
import {CartPage } from '../../pages/cart/cart';
import {UserPage } from '../../pages/user/user';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = HomePage;
  tab2Root = CategoryPage;
  tab3Root = CartPage;
  tab4Root=  UserPage;  

  constructor() {

  }
  ionViewDidLoad() {
    
  }
}
